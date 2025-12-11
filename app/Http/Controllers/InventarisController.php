<?php

namespace App\Http\Controllers;

use App\Exports\InventarisExport;
use App\Models\Inventaris;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Http;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Codedge\Fpdf\Fpdf\Fpdf; // Pustaka FPDF inti
use Symfony\Component\HttpFoundation\StreamedResponse;

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;    

class InventarisController extends Controller
{

    public function index(): InertiaResponse
    {
        $inventaris = Inventaris::latest()->get();

        $grouped = $inventaris->groupBy('nama_barang');

        $inventarisGrouped = $grouped->map(function ($items, $nama_barang) {
            return [
                'nama_barang' => $nama_barang,
                'total_keseluruhan' => $items->sum('jumlah'),
                'items' => $items->values(),
            ];
        })->values();

        return Inertia::render('Inventaris/Index', [
            'inventarisGrouped' => $inventarisGrouped,
            'appUrl' => config('app.url'),

        ]);
    }

    public function show(Inventaris $inventari)
    {
        // Memuat relasi user untuk mendapatkan nama pengunggah
        // Pastikan model Inventaris memiliki relasi 'user'
        $inventari->load('user');

        // Inertia akan merender komponen 'Inventaris/DetailBarang'
        // dan mengirimkan data item inventaris sebagai prop 'inventari'
        return Inertia::render('Inventaris/DetailBarang', [
            'inventari' => $inventari
        ]);
    }

    public function create(): InertiaResponse
    {
        $ruangList = Inventaris::select('tempat_pemakaian', 'nomor_ruang')
            ->where(function ($query) {
                $query->whereNotNull('tempat_pemakaian')
                    ->orWhereNotNull('nomor_ruang');
            })
            ->distinct()
            ->get();

        $namaBarangList = Inventaris::query()
            ->select('nama_barang')
            ->distinct()
            ->pluck('nama_barang')
            ->toArray();

        return Inertia::render('Inventaris/Form', [
            'ruangList' => $ruangList,
            'namaBarangList' => $namaBarangList,
        ]);
    }

    private function findNextAvailableId(string $idColumn): int
    {
        $allIds = Inventaris::query()->whereNotNull($idColumn)->distinct()->pluck($idColumn)->sort();
        $expectedId = 1;
        foreach ($allIds as $id) {
            if ($expectedId < $id) {
                break;
            }
            $expectedId++;
        }
        return $expectedId;
    }

    private function determineAndValidateId(string $nameValue, string $idColumn, string $nameColumn, ?int $ignoreRecordId = null): int
    {
        $existingGroup = Inventaris::where($nameColumn, $nameValue)->whereNotNull($idColumn)->first();
        if ($existingGroup) {
            $finalId = $existingGroup->$idColumn;
        } else {
            $finalId = $this->findNextAvailableId($idColumn);
        }

        $query = Inventaris::where($idColumn, $finalId)->where($nameColumn, '!=', $nameValue);

        if ($ignoreRecordId) {
            $query->where('id', '!=', $ignoreRecordId);
        }

        $isTaken = $query->exists();

        if ($isTaken) {
            $conflictingGroup = Inventaris::where($idColumn, $finalId)->first();
            $conflictingName = $conflictingGroup ? $conflictingGroup->$nameColumn : 'tidak diketahui';
            throw new \Exception("Gagal! Nomor {$finalId} sudah digunakan untuk '{$conflictingName}'.");
        }

        return $finalId;
    }

    public function store(Request $request)
    {
        $request->merge([
            'jumlah_dipakai' => $request->input('jumlah_dipakai') ?: 0,
            'jumlah_rusak' => $request->input('jumlah_rusak') ?: 0,
        ]);

        $validated = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'tempat_pemakaian' => 'required|string|max:255',
            'nomor_ruang' => 'required|integer',
            'tanggal_masuk' => 'required|date',
            'asal_perolehan' => 'required|string|max:255',
            'kode_barang' => 'nullable|string|max:255',
            'spesifikasi' => 'nullable|string',
            'jumlah_dipakai' => 'nullable|integer|min:0',
            'jumlah_rusak' => 'nullable|integer|min:0',
            'harga' => 'nullable|numeric|min:0',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'jenis_perawatan' => 'nullable|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($request, &$validated) {
                $finalNomor = $this->determineAndValidateId($validated['nama_barang'], 'nomor', 'nama_barang');
                $finalNomorRuang = $this->determineAndValidateId($validated['tempat_pemakaian'], 'nomor_ruang', 'tempat_pemakaian');

                $validated['nomor'] = $finalNomor;
                $validated['nomor_ruang'] = $finalNomorRuang;

                if (empty($validated['kode_barang'])) {
                    $validated['kode_barang'] = 'BRG-' . strtoupper(Str::random(6));
                }

                Inventaris::where('nama_barang', $validated['nama_barang'])
                    ->update(['kode_barang' => $validated['kode_barang']]);

                $validated['nama_pengunggah'] = Auth::user()->name;

                if ($request->hasFile('foto')) {
                    $file = $request->file('foto');
                    $fileName = time() . '_' . $file->getClientOriginalName();

                    // Upload langsung ke Supabase bucket
                    $response = Http::withHeaders([
                        'apikey' => env('SUPABASE_KEY'),
                        'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                    ])->attach(
                        'file',
                        file_get_contents($file),
                        $fileName
                    )->post(env('SUPABASE_URL') . '/storage/v1/object/inventaris-fotos/' . $fileName);

                    if ($response->failed()) {
                        throw new \Exception('Upload ke Supabase gagal: ' . $response->body());
                    }

                    // simpan URL publik
                    $validated['foto'] = env('SUPABASE_URL') . '/storage/v1/object/public/inventaris-fotos/' . $fileName;
                }

                Inventaris::create($validated);
            });

            return redirect()->route('inventaris.index')->with('success', 'Data berhasil ditambahkan.');
        } catch (\Exception $e) {
            Log::error('Gagal menyimpan data inventaris baru: ' . $e->getMessage()); // Catat error teknis
            // Tampilkan pesan ramah ke pengguna
            //                        return redirect()->back()->with('error', 'Terjadi kesalahan. Data gagal diduplikasi.');


            return redirect()->back()->with('error', 'Terjadi kesalahan pada server. Silakan coba lagi.');
        }
    }

    public function duplicate(Inventaris $inventari)
    {
        try {
            $newItem = $inventari->replicate();
            $newItem->nama_barang = $inventari->nama_barang . ' (copy)';
            $newItem->tanggal_masuk = now();
            $newItem->nama_pengunggah = Auth::user()->name;

            $newItem->save();

            return redirect()->route('inventaris.index')->with('success', 'Data berhasil diduplikasi.');
        } catch (\Exception $e) {
            // Catat error teknis untuk developer
            Log::error('Gagal menduplikasi data inventaris: ' . $e->getMessage());

            // Tampilkan pesan ramah untuk pengguna
            return redirect()->back()->with('error', 'Terjadi kesalahan. Data gagal diduplikasi.');
        }
    }

    public function edit(Inventaris $inventari): InertiaResponse
    {
        $ruangList = Inventaris::select('tempat_pemakaian', 'nomor_ruang')
            ->where(function ($query) {
                $query->whereNotNull('tempat_pemakaian')
                    ->orWhereNotNull('nomor_ruang');
            })
            ->distinct()
            ->get();

        $namaBarangList = Inventaris::query()
            ->select('nama_barang')
            ->distinct()
            ->pluck('nama_barang')
            ->toArray();

        return Inertia::render('Inventaris/Form', [
            'inventari' => $inventari,
            'ruangList' => $ruangList,
            'namaBarangList' => $namaBarangList,

        ]);
    }

    public function update(Request $request, $id) // <-- PERUBAHAN 1: Terima $id, bukan objek Inventaris
    {
        $request->merge([
            'jumlah_dipakai' => $request->input('jumlah_dipakai') ?: 0,
            'jumlah_rusak' => $request->input('jumlah_rusak') ?: 0,
        ]);

        $validated = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'tempat_pemakaian' => 'required|string|max:255',
            'nomor_ruang' => 'required|integer',
            'tanggal_masuk' => 'required|date',
            'asal_perolehan' => 'required|string|max:255',
            'kode_barang' => 'nullable|string|max:255',
            'spesifikasi' => 'nullable|string',
            'jumlah_dipakai' => 'nullable|integer|min:0',
            'jumlah_rusak' => 'nullable|integer|min:0',
            'harga' => 'nullable|numeric|min:0',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_foto' => 'nullable|boolean',
            'jenis_perawatan' => 'nullable|string|max:255',
        ]);

        try {
            // --- PERUBAHAN 2: Lakukan pencarian data DI DALAM blok try ---
            $inventari = Inventaris::findOrFail($id);

            $newFotoUrl = null;
            $oldFotoPath = null;

            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $response = Http::withHeaders([
                    'apikey' => env('SUPABASE_KEY'),
                    'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                ])->attach('file', file_get_contents($file), $fileName)
                    ->post(env('SUPABASE_URL') . '/storage/v1/object/inventaris-fotos/' . $fileName);

                if ($response->failed()) {
                    throw new \Exception('Upload foto baru ke Supabase gagal: ' . $response->body());
                }
                $newFotoUrl = env('SUPABASE_URL') . '/storage/v1/object/public/inventaris-fotos/' . $fileName;
                $validated['foto'] = $newFotoUrl;
            }

            if (($newFotoUrl || $request->boolean('remove_foto')) && $inventari->foto) {
                $oldFotoPath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $inventari->foto);
            }

            DB::transaction(function () use ($request, &$validated, $inventari) {
                if ($request->boolean('remove_foto')) {
                    $validated['foto'] = null;
                }

                $finalNomor = $this->determineAndValidateId($validated['nama_barang'], 'nomor', 'nama_barang', $inventari->id);
                $finalNomorRuang = $this->determineAndValidateId($validated['tempat_pemakaian'], 'nomor_ruang', 'tempat_pemakaian', $inventari->id);
                $validated['nomor'] = $finalNomor;
                $validated['nomor_ruang'] = $finalNomorRuang;

                if (empty($validated['kode_barang'])) {
                    $validated['kode_barang'] = $inventari->kode_barang ?: 'BRG-' . strtoupper(Str::random(6));
                }
                $validated['nama_pengunggah'] = Auth::user()->name;

                if (!$request->hasFile('foto') && !$request->boolean('remove_foto')) {
                    unset($validated['foto']);
                }

                $inventari->update($validated);
            });

            if ($oldFotoPath) {
                Http::withHeaders([
                    'apikey' => env('SUPABASE_KEY'),
                    'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $oldFotoPath);
            }

            return redirect()->route('inventaris.index')->with('success', 'Data berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error('Update data inventaris gagal: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan pada server. Silakan coba lagi.');
        }
    }


    public function bulkEdit(Request $request)
    {
        $ids = $request->query('ids');
        if (!$ids) {
            return redirect()->route('inventaris.index')->with('error', 'Tidak ada item yang dipilih.');
        }

        $inventaris = Inventaris::whereIn('id', explode(',', $ids))->get();
        $ruangList = Inventaris::select('tempat_pemakaian', 'nomor_ruang')
            ->where(function ($query) {
                $query->whereNotNull('tempat_pemakaian')
                    ->orWhereNotNull('nomor_ruang');
            })
            ->distinct()
            ->get();

        return Inertia::render('Inventaris/BulkEditForm', [
            'inventaris' => $inventaris,
            'ruangList' => $ruangList
        ]);
    }

    public function bulkDestroy(Request $request)
    {
        $validatedData = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'required|integer|exists:inventaris,id',
        ]);

        try {
            $inventarisToDelete = Inventaris::whereIn('id', $validatedData['ids'])->get();

            foreach ($inventarisToDelete as $item) {
                if ($item->foto) {
                    // konversi URL publik ke path file di Supabase
                    $oldPath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $item->foto);

                    // request hapus ke Supabase API
                    Http::withHeaders([
                        'apikey' => env('SUPABASE_KEY'),
                        'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                    ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $oldPath);
                }
            }

            Inventaris::whereIn('id', $validatedData['ids'])->delete();

            return Redirect::route('inventaris.index')
                ->with('success', 'Data inventaris yang dipilih berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('Bulk destroy gagal: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan pada server. Silakan coba lagi.');
        }
    }


    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:inventaris,id',
            'items.*.nama_barang' => 'required|string|max:255',
            'items.*.jumlah' => 'required|integer|min:1',
            'items.*.tempat_pemakaian' => 'required|string|max:255',
            'items.*.tanggal_masuk' => 'required|date',
            'items.*.asal_perolehan' => 'required|string|max:255',
            'items.*.kode_barang' => 'nullable|string|max:255',
            'items.*.spesifikasi' => 'nullable|string',
            'items.*.jumlah_dipakai' => 'nullable|integer|min:0',
            'items.*.jumlah_rusak' => 'nullable|integer|min:0',
            'items.*.harga' => 'nullable|numeric|min:0',
            'items.*.nomor_ruang' => 'required|integer',
            'items.*.foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'items.*.remove_foto' => 'nullable|boolean',
            'items.*.jenis_perawatan' => 'nullable|string|max:255',
        ]);

        Log::info('Memproses bulk update untuk ' . count($validated['items']) . ' item.');

        try {
            DB::transaction(function () use ($validated, $request) {
                foreach ($validated['items'] as $index => $itemData) {
                    $inventari = Inventaris::find($itemData['id']);
                    if (!$inventari) continue;

                    // --- FOTO ---
                    if ($request->hasFile("items.{$index}.foto")) {
                        // hapus foto lama di Supabase
                        if ($inventari->foto) {
                            $oldPath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $inventari->foto);
                            Http::withHeaders([
                                'apikey' => env('SUPABASE_KEY'),
                                'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                            ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $oldPath);
                        }

                        $file = $request->file("items.{$index}.foto");
                        $fileName = time() . '_' . $file->getClientOriginalName();

                        $response = Http::withHeaders([
                            'apikey' => env('SUPABASE_KEY'),
                            'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                        ])->attach(
                            'file',
                            file_get_contents($file),
                            $fileName
                        )->post(env('SUPABASE_URL') . '/storage/v1/object/inventaris-fotos/' . $fileName);

                        if ($response->failed()) {
                            throw new \Exception("Upload foto gagal untuk item {$inventari->id}: " . $response->body());
                        }

                        $itemData['foto'] = env('SUPABASE_URL') . '/storage/v1/object/public/inventaris-fotos/' . $fileName;
                    } elseif (!empty($itemData['remove_foto']) && $itemData['remove_foto']) {
                        if ($inventari->foto) {
                            $oldPath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $inventari->foto);
                            Http::withHeaders([
                                'apikey' => env('SUPABASE_KEY'),
                                'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                            ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $oldPath);
                        }
                        $itemData['foto'] = null;
                    } else {
                        unset($itemData['foto']);
                    }

                    // --- UPDATE ITEM ---
                    $inventari->update($itemData);
                }
            });

            return redirect()->route('inventaris.index')->with('success', 'Data berhasil diperbarui secara massal.');
        } catch (\Exception $e) {
            Log::error('Bulk update gagal: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan pada server. Silakan coba lagi.');
        }
    }

    public function destroy(Inventaris $inventari)
    {
        try {
            if ($inventari->foto) {
                $oldPath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $inventari->foto);

                Http::withHeaders([
                    'apikey' => env('SUPABASE_KEY'),
                    'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $oldPath);
            }

            $inventari->delete();

            return redirect()->route('inventaris.index')->with('success', 'Data berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('Hapus data gagal: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan pada server. Silakan coba lagi.');
        }
    }

    protected function calculateFontSize($text, $defaultSize, $thresholds)
    {
        $length = mb_strlen((string)$text, 'UTF-8');
        krsort($thresholds);

        foreach ($thresholds as $charCount => $fontSize) {
            if ($length > $charCount) {
                return $fontSize;
            }
        }

        return $defaultSize;
    }

        /**
     * Menghasilkan dan menampilkan PDF label untuk satu item inventaris.
     * Jumlah label yang dicetak sesuai dengan kuantitas item.
     *
     * @param \App\Models\Inventaris $inventari
     * @return void
     */
    public function generateLabel(Inventaris $inventari)
    {
        // 1. Inisialisasi FPDF
        $fpdf = new Fpdf('L', 'mm', [330, 215]); // Ukuran kertas yang sama dengan bulk print
        $fpdf->SetMargins(5, 5, 5);
        $fpdf->SetAutoPageBreak(false);
        $fpdf->AddPage();

        // 2. Pengaturan Grid (sama seperti bulk print untuk konsistensi)
        $labelWidth = 80;
        $labelHeight = 40;
        $pageMargin = 5;
        $horizontalGap = 1;
        $verticalGap = 1;
        $maxCols = 4;
        $pageHeight = 215;
        $maxRows = floor(($pageHeight - ($pageMargin * 2) + $verticalGap) / ($labelHeight + $verticalGap));

        $col = 0;
        $row = 0;

        // 3. Tentukan berapa banyak label yang akan dicetak berdasarkan jumlah item
        $quantity = $inventari->jumlah > 0 ? $inventari->jumlah : 1;

        // 4. Loop untuk menggambar label sebanyak kuantitasnya
        for ($i = 0; $i < $quantity; $i++) {
            // Hitung posisi x dan y untuk label saat ini
            $x = $pageMargin + ($col * ($labelWidth + $horizontalGap));
            $y = $pageMargin + ($row * ($labelHeight + $verticalGap));

            // Panggil fungsi yang sudah ada untuk menggambar satu label
            $this->drawLabel($fpdf, $inventari, $x, $y);

            // Pindah ke kolom berikutnya
            $col++;
            // Jika kolom sudah maksimal, reset dan pindah ke baris berikutnya
            if ($col >= $maxCols) {
                $col = 0;
                $row++;
                // Jika baris sudah maksimal, buat halaman baru
                if ($row >= $maxRows) {
                    $row = 0;
                    $fpdf->AddPage();
                }
            }
        }

        // 5. Output PDF untuk ditampilkan di browser
        $safeNamaBarang = preg_replace('/[^A-Za-z0-9\-]/', '', $inventari->nama_barang);
        $fileName = 'label-' . $safeNamaBarang . '-' . $inventari->id . '.pdf';
        
        // 'I' artinya Inline (stream/preview) ke browser. 
        // 'D' artinya Download. 'I' lebih cocok untuk kasus ini.
        $fpdf->Output('I', $fileName);
        exit;
    }

    protected function drawLabel(Fpdf $fpdf, Inventaris $item, float $x, float $y)
{
    // --- PENGATURAN AWAL & DIMENSI (Tidak ada perubahan) ---
    $fpdf->SetFont('Arial', '', 10);
    $fpdf->SetTextColor(0, 0, 0);
    $fpdf->SetDrawColor(0, 0, 0);
    $fpdf->SetLineWidth(0.2);

    $labelW = 80;
    $labelH = 40;
    $headerH = 16;
    $logoCellW = 20;
    $infoCellX = $x + $logoCellW;
    $infoCellW = $labelW - $logoCellW;

    // --- 1. GAMBAR SEMUA GARIS DAN KOTAK UTAMA (Tidak ada perubahan) ---
    $fpdf->Rect($x, $y, $labelW, $labelH);
    $fpdf->Line($x + $logoCellW, $y, $x + $logoCellW, $y + $headerH);
    $fpdf->SetLineWidth(0.4);
    $fpdf->Line($x, $y + $headerH, $x + $labelW, $y + $headerH);
    $fpdf->SetLineWidth(0.2);
    $fpdf->Rect($infoCellX, $y, $infoCellW, $headerH);
    $titleBoxH = 6;
    $fpdf->Line($infoCellX, $y + $titleBoxH, $x + $labelW, $y + $titleBoxH);

    // --- 2. ISI SEL LOGO (KIRI) (Tidak ada perubahan) ---
    $logoDispHeight = 9;
    $logoTextHeight = 5.5;
    $totalLogoBlockHeight = $logoDispHeight + $logoTextHeight;
    $logoStartY = $y + ($headerH - $totalLogoBlockHeight) / 2;

    try {
        $logoPath = public_path('images/logoklinik.png');
        if (file_exists($logoPath)) {
            $fpdf->Image($logoPath, $x + 6, $logoStartY, 8);
        }
    } catch (\Exception $e) {
    }

    $fpdf->SetFont('Arial', 'B', 5);
    $fpdf->SetXY($x, $logoStartY + $logoDispHeight);
    $fpdf->MultiCell($logoCellW, 1.8, "INVENTARIS\nKLINIK PRATAMA\nUNIMUS", 0, 'C');

    // --- 3. ISI SEL INFO (KANAN) (Tidak ada perubahan) ---
    $fpdf->SetFont('Arial', 'B', 10);
    $fpdf->SetXY($infoCellX, $y);
    $fpdf->Cell($infoCellW, $titleBoxH, 'PENGADAAN BARANG', 0, 0, 'C');
    $nomorPengadaan = $item->nomor_pengadaan_lengkap ?? ($item->kode_barang ?? 'N/A');
    $unitPengguna = $item->tempat_pemakaian ?: '...';
    $yPos1 = $y + $titleBoxH + 1.5;
    $yPos2 = $y + $titleBoxH + 5.5;
    $fpdf->SetFont('Arial', '', 7);
    $fpdf->SetXY($infoCellX + 1, $yPos1);
    $fpdf->Cell(22, 4, 'NO. PENGADAAN:');
    $fpdf->SetFont('Arial', 'B', 11);
    $fpdf->SetXY($fpdf->GetX(), $yPos1);
    $fpdf->Cell(28, 4, $nomorPengadaan);
    $fpdf->SetFont('Arial', '', 7);
    $fpdf->SetXY($infoCellX + 1, $yPos2);
    $fpdf->Cell(22, 4, 'UNIT PENGGUNA:');
    $fpdf->SetFont('Arial', 'B', 11);
    $fpdf->SetXY($fpdf->GetX(), $yPos2);
    $fpdf->Cell(28, 4, $unitPengguna);

    // --- 4. ISI BAGIAN BODY (LOGIKA DIPERBARUI DENGAN QR CODE) ---
    $bodyY = $y + $headerH;
    $bodyH = $labelH - $headerH;
    $margin = 1.5;
    $qrCodeSize = $bodyH - ($margin * 2) - 2;
    $qrCodeX = $x + $labelW - $qrCodeSize - $margin;
    $qrCodeY = $bodyY + ($bodyH - $qrCodeSize) / 2;
    $textBlockW = $labelW - $qrCodeSize - ($margin * 3);
    $textBlockX = $x + $margin;

    // ==========================================================
    // == PERUBAHAN UTAMA UNTUK KOMPATIBILITAS LOKAL & VERCEL ==
    // ==========================================================
    $qrCodePath = null;
    try {
        $urlUntukQr = route('inventaris.show', ['inventari' => $item->id], true);

        $result = Builder::create()
            ->writer(new PngWriter())
            ->data($urlUntukQr)
            ->encoding(new Encoding('UTF-8'))
            ->errorCorrectionLevel(ErrorCorrectionLevel::Medium)
            ->size(200)
            ->margin(1)
            ->build();

        // 1. Gunakan fungsi PHP untuk mendapatkan direktori temporary yang sesuai dengan OS
        $tempDir = sys_get_temp_dir();

        // 2. Buat path file yang unik di direktori temporary tersebut
        // DIRECTORY_SEPARATOR akan otomatis menjadi '\' di Windows dan '/' di Linux
        $qrCodePath = $tempDir . DIRECTORY_SEPARATOR . 'qr_' . uniqid() . '.png';

        // 3. Simpan QR code sebagai file gambar sementara
        $result->saveToFile($qrCodePath);

        // 4. Sisipkan gambar dari file yang sudah disimpan ke PDF
        $fpdf->Image($qrCodePath, $qrCodeX, $qrCodeY, $qrCodeSize, $qrCodeSize, 'PNG');

    } catch (\Exception $e) {
        $fpdf->SetFillColor(230, 230, 230);
        $fpdf->Rect($qrCodeX, $qrCodeY, $qrCodeSize, $qrCodeSize, 'F');
        Log::error('Gagal membuat QR Code Endroid: ' . $e->getMessage());
    } finally {
        // 5. (Penting!) Hapus file sementara setelah digunakan
        if ($qrCodePath && file_exists($qrCodePath)) {
            unlink($qrCodePath);
        }
    }
    // ==========================================================
    // == AKHIR PERUBAHAN ==
    // ==========================================================


    // --- PROSES DATA & PENEMPATAN TEKS (Tidak ada perubahan) ---
    $fpdf->Rect($x + $margin, $bodyY + $margin, $labelW - ($margin * 2), $bodyH - ($margin * 2));
    $kelompokTextY = $bodyY + $margin + 1;
    $fpdf->SetFont('Arial', '', 7);
    $fpdf->SetXY($textBlockX + 1, $kelompokTextY);
    $fpdf->Cell(40, 3, 'Kelompok Barang / Alat');
    $kelompokTextHeight = 4;
    $namaBarang = $item->nama_barang ?? '-';
    $rawSpek = $item->spesifikasi ?: '...';
    $parts = explode(',', $rawSpek);
    if (count($parts) > 3) $rawSpek = implode(',', array_slice($parts, 0, 3));
    if (strlen($rawSpek) > 80) $rawSpek = substr($rawSpek, 0, 80);
    $spesifikasi = $rawSpek;
    $fontSizeNama = $this->calculateFontSize($namaBarang, 12, [45 => 8, 30 => 10]);
    $fontSizeSpek = $this->calculateFontSize($spesifikasi, 10, [50 => 7, 35 => 8]);
    $fpdf->SetFont('Arial', 'B', $fontSizeNama);
    $namaBarangHeight = $fpdf->GetStringWidth($namaBarang) > $textBlockW - 4 ? 8 : 4.5;
    $fpdf->SetFont('Arial', 'B', $fontSizeSpek);
    $spesifikasiHeight = $fpdf->GetStringWidth($spesifikasi) > $textBlockW - 4 ? 7 : 4;
    $totalTextHeight = $namaBarangHeight + $spesifikasiHeight;
    $availableSpaceForCentering = $bodyH - ($margin * 2) - $kelompokTextHeight;
    $centeredTextStartY = ($bodyY + $margin + $kelompokTextHeight) + ($availableSpaceForCentering - $totalTextHeight) / 2;
    $fpdf->SetFont('Arial', 'B', $fontSizeNama);
    $fpdf->SetXY($textBlockX, $centeredTextStartY);
    $fpdf->MultiCell($textBlockW, 4.5, $namaBarang, 0, 'C');
    $fpdf->SetFont('Arial', 'B', $fontSizeSpek);
    $fpdf->SetX($textBlockX);
    $fpdf->MultiCell($textBlockW, 4, $spesifikasi, 0, 'C');
}

    public function downloadBulkLabels(Request $request)
    {
        // 1. Validasi
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:inventaris,id',
        ]);

        $selectedItems = Inventaris::whereIn('id', $validated['ids'])->get();

        if ($selectedItems->isEmpty()) {
            return redirect()->back()->with('error', 'Terjadi kesalahan. Data gagal diduplikasi.');
        }

        // 2. Duplikasi data
        $labelsToPrint = new Collection();
        foreach ($selectedItems as $item) {
            $quantity = $item->jumlah ?? 1;
            for ($i = 0; $i < $quantity; $i++) {
                $labelsToPrint->push($item);
            }
        }

        if ($labelsToPrint->isEmpty()) {
            return redirect()->back()->with('error', 'Terjadi kesalahan pada server. Silakan coba lagi.');
        }

        // 3. Inisialisasi FPDF
        $fpdf = new Fpdf('L', 'mm', [330, 215]);
        $fpdf->SetMargins(5, 5, 5);
        $fpdf->SetAutoPageBreak(false);
        $fpdf->AddPage();

        // 4. Pengaturan Grid
        $labelWidth = 80;
        $labelHeight = 40;
        $pageMargin = 5;
        $horizontalGap = 1;
        $verticalGap = 1;
        $maxCols = 4;
        $pageHeight = 215;
        $maxRows = floor(($pageHeight - ($pageMargin * 2) + $verticalGap) / ($labelHeight + $verticalGap));

        $col = 0;
        $row = 0;

        // 5. Loop untuk menggambar
        foreach ($labelsToPrint as $item) {
            $x = $pageMargin + ($col * ($labelWidth + $horizontalGap));
            $y = $pageMargin + ($row * ($labelHeight + $verticalGap));

            $this->drawLabel($fpdf, $item, $x, $y);

            $col++;
            if ($col >= $maxCols) {
                $col = 0;
                $row++;
                if ($row >= $maxRows) {
                    $row = 0;
                    $fpdf->AddPage();
                }
            }
        }

        // 6. Output PDF (DIUBAH MENJADI PREVIEW/STREAM)
        $fileName = 'cetak-label-pengadaan-' . date('Ymd-His') . '.pdf';
        // 'I' artinya Inline (stream) ke browser. 'D' artinya Download.
        $fpdf->Output('I', $fileName);
        exit;
    }

    public function exportExcel()
    {
        $export = new InventarisExport();
        $data = $export->collection();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // --- Header Utama --- //
        $logoUrl = 'https://tnrkvhyahgvlvepjccvq.supabase.co/storage/v1/object/public/itemImages/logo_klinik.png';
        $tempPath = sys_get_temp_dir() . '/logo_klinik.png';
        file_put_contents($tempPath, file_get_contents($logoUrl));

        $drawing = new Drawing();
        $drawing->setName('Logo Klinik');
        $drawing->setDescription('Logo Klinik');
        $drawing->setPath($tempPath);
        $drawing->setHeight(60);
        $drawing->setCoordinates('A1');
        $drawing->setWorksheet($sheet);

        // Judul & Kop
        $sheet->mergeCells('B1:M2');
        $sheet->setCellValue('B1', 'KLINIK PRATAMA UNIMUS');
        $sheet->getStyle('B1')->getFont()->setBold(true)->setSize(16);
        $sheet->getStyle('B1')->getAlignment()
            ->setHorizontal(Alignment::HORIZONTAL_CENTER)
            ->setVertical(Alignment::VERTICAL_CENTER);

        // Alamat
        $sheet->mergeCells('B3:M3');
        $sheet->setCellValue('B3', 'Jl. Petek Kp. Gayamsari RT. 02 RW. 06, Dadapsari, Semarang Utara, Semarang');
        $sheet->getStyle('B3')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Kontak
        $sheet->mergeCells('B4:M4');
        $sheet->setCellValue('B4', 'Telp. 0895-6168-33383, e-mail: klinikpratamarawatinap@unimus.ac.id');
        $sheet->getStyle('B4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->getRowDimension('5')->setRowHeight(10);

        // --- Header Tabel --- //
        $sheet->mergeCells('A6:A7');
        $sheet->setCellValue('A6', 'No.');
        $sheet->mergeCells('B6:B7');
        $sheet->setCellValue('B6', 'Foto');
        $sheet->mergeCells('C6:C7');
        $sheet->setCellValue('C6', 'Nomor Barang');
        $sheet->mergeCells('D6:D7');
        $sheet->setCellValue('D6', 'Nama Barang');
        $sheet->mergeCells('E6:E7');
        $sheet->setCellValue('E6', 'Kode Barang');
        $sheet->mergeCells('F6:F7');
        $sheet->setCellValue('F6', 'Spesifikasi');
        $sheet->mergeCells('G6:G7');
        $sheet->setCellValue('G6', 'Jenis Perawatan');
        $sheet->mergeCells('H6:J6');
        $sheet->setCellValue('H6', 'Jumlah');
        $sheet->setCellValue('H7', 'Total');
        $sheet->setCellValue('I7', 'Pakai');
        $sheet->setCellValue('J7', 'Rusak');
        $sheet->mergeCells('K6:L6');
        $sheet->setCellValue('K6', 'Tempat');
        $sheet->setCellValue('K7', 'Pemakaian');
        $sheet->setCellValue('L7', 'Nomor Ruang');
        $sheet->mergeCells('M6:M7');
        $sheet->setCellValue('M6', 'Asal Perolehan');
        $sheet->mergeCells('N6:N7');
        $sheet->setCellValue('N6', 'Tanggal Masuk');

        $headerStyle = [
            'font' => ['bold' => true],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
        ];
        $sheet->getStyle('A6:N7')->applyFromArray($headerStyle);

        $dataStyle = [
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ];

        $sortedData = $data->sortBy('nomor');


        // --- Isi Data --- //
        $row = 8;
        $no = 1;
        foreach ($sortedData as $item) {
            $sheet->setCellValue('A' . $row, $no++);
            $sheet->setCellValue('B' . $row, ''); // Foto kosong
            $sheet->setCellValue('C' . $row, $item->nomor ?? 'N/A');
            $sheet->setCellValue('D' . $row, $item->nama_barang);
            $sheet->setCellValue('E' . $row, $item->kode_barang ?? '-');
            $sheet->setCellValue('F' . $row, $item->spesifikasi ?? '-');
            $sheet->setCellValue('G' . $row, $item->jenis_perawatan ?? '');
            $sheet->setCellValue('H' . $row, $item->jumlah);
            $sheet->setCellValue('I' . $row, $item->jumlah_dipakai);
            $sheet->setCellValue('J' . $row, $item->jumlah_rusak ?? '');
            $sheet->setCellValue('K' . $row, $item->tempat_pemakaian);
            $sheet->setCellValue('L' . $row, $item->nomor_ruang ?? '-');
            $sheet->setCellValue('M' . $row, $item->asal_perolehan ?? '-');
            $sheet->setCellValue('N' . $row, Carbon::parse($item->tanggal_masuk)->format('Y-m-d H:i:s'));

            // Border untuk data
            $sheet->getStyle('A' . $row . ':N' . $row)->applyFromArray($dataStyle);


            $row++;
        }

        // --- Auto-fit kolom (kecuali kolom B "Foto") --- //
        foreach (range('A', 'N') as $col) {
            if ($col == 'B') {
                $sheet->getColumnDimension($col)->setWidth(10); // Lebar default header untuk Foto
                continue;
            }
            $maxLength = 0;
            foreach ($sheet->getRowIterator() as $row) {
                $cell = $sheet->getCell($col . $row->getRowIndex());
                $value = $cell->getCalculatedValue();
                if ($value !== null) {
                    $length = mb_strlen((string)$value);
                    if ($length > $maxLength) {
                        $maxLength = $length;
                    }
                }
            }
            $sheet->getColumnDimension($col)->setWidth($maxLength + 2);
        }

        // --- Stream ke browser --- //
        $writer = new Xlsx($spreadsheet);
        $fileName = 'laporan-inventaris-' . date('Ymd') . '-' . Str::random(6) . '.xlsx';

        return new StreamedResponse(function () use ($writer) {
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    protected $fpdf;

    public function __construct()
    {
        // 'L' = Landscape, 'mm' = milimeter, 'A4' = ukuran kertas
        $this->fpdf = new Fpdf('L', 'mm', 'A4');
    }

    /**
     * Menghitung jumlah baris yang dibutuhkan oleh sebuah MultiCell.
     * Versi ini dijamin aman dan tidak mengakses properti terproteksi.
     * @param float $w Lebar sel
     * @param string $txt Teks di dalamnya
     * @return int Jumlah baris
     */
    private function NbLines($w, $txt)
    {
        $wmax = ($w - 4); // Menggunakan nilai margin standar 2mm per sisi.
        $s = str_replace("\r", '', (string)$txt);
        $nb = strlen($s);
        if ($nb > 0 && $s[$nb - 1] == "\n") {
            $nb--;
        }
        $sep = -1;
        $i = 0;
        $j = 0;
        $l = 0;
        $nl = 1;
        while ($i < $nb) {
            $c = $s[$i];
            if ($c == "\n") {
                $i++;
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
                continue;
            }
            if ($c == ' ') {
                $sep = $i;
            }
            $l += $this->fpdf->GetStringWidth($c);
            if ($l > $wmax) {
                if ($sep == -1) {
                    if ($i == $j) {
                        $i++;
                    }
                } else {
                    $i = $sep + 1;
                }
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
            } else {
                $i++;
            }
        }
        return $nl;
    }

    /**
     * Fungsi utama untuk mencetak laporan.
     */
    public function print()
    {
        $inventaris = Inventaris::orderBy('nomor', 'asc')->get();

        // ========================================================================
        // == BARU: HITUNG TOTAL UNTUK BARIS TERAKHIR ==
        // ========================================================================
        $totalJumlah = $inventaris->sum('jumlah');
        $totalDipakai = $inventaris->sum('jumlah_dipakai');
        $totalRusak = $inventaris->sum('jumlah_rusak');


        // Mengatur halaman ke Landscape agar tabel pas
        $this->fpdf->AddPage('L', 'A4');
        $this->fpdf->SetFont('Arial', 'B', 16);

        // --- HEADER DOKUMEN ---
        // ... [ KODE HEADER DOKUMEN ANDA TETAP SAMA ] ...
        try {
            $logoUrl = 'https://tnrkvhyahgvlvepjccvq.supabase.co/storage/v1/object/public/itemImages/logo_klinik.png';
            $imageContents = Http::timeout(10)->get($logoUrl)->body();
            $tempPath = tempnam(sys_get_temp_dir(), 'logo') . '.png';
            file_put_contents($tempPath, $imageContents);
            $this->fpdf->Image($tempPath, 10, 8, 25);
            unlink($tempPath);
        } catch (\Exception $e) { /* Biarkan kosong jika logo gagal */
        }

        $this->fpdf->SetX(40);
        $this->fpdf->Cell(220, 8, 'KLINIK PRATAMA UNIMUS', 0, 1, 'C');
        $this->fpdf->SetFont('Arial', '', 10);
        $this->fpdf->SetX(40);
        $this->fpdf->Cell(220, 6, 'Jl. Petek Kp. Gayamsari RT. 02 RW. 06, Dadapsari, Semarang Utara, Semarang', 0, 1, 'C');
        $this->fpdf->SetX(40);
        $this->fpdf->Cell(220, 6, 'Telp. 0895-6168-33383, e-mail: klinikpratamarawatinap@unimus.ac.id', 0, 1, 'C');
        $this->fpdf->Ln(5);
        $this->fpdf->Line(10, 38, 287, 38);
        $this->fpdf->Ln(5);
        $this->fpdf->SetFont('Arial', 'B', 12);
        $this->fpdf->Cell(0, 10, 'Laporan Inventaris', 0, 1, 'C');
        $this->fpdf->Ln(2);


        // --- HEADER TABEL ---
        $this->fpdf->SetFont('Arial', 'B', 8);
        $this->fpdf->SetFillColor(242, 242, 242);
        // Sesuaikan lebar agar pas di A4 Landscape (total lebar 277mm)
        $widths = [8, 15, 20, 30, 20, 45, 20, 10, 10, 10, 22, 22, 20, 25];
        $headers = ['No.', 'Foto', 'Nomor', 'Nama Barang', 'Kode', 'Spesifikasi', 'Perawatan', 'Total', 'Pakai', 'Rusak', 'Pemakaian', 'No. Ruang', 'Asal', 'Tgl Masuk'];
        for ($i = 0; $i < count($headers); $i++) {
            $this->fpdf->Cell($widths[$i], 7, $headers[$i], 1, 0, 'C', true);
        }
        $this->fpdf->Ln();

        // --- ISI TABEL ---
        $this->fpdf->SetFont('Arial', '', 7);
        $lineHeight = 5;
        $imageCellHeight = 15;
        $bottomMargin = 20;

        foreach ($inventaris as $i => $item) {
            // ... [ KODE LOOPING DATA ANDA TETAP SAMA ] ...
            $data = [
                $i + 1,
                '',
                $item->nomor ?? 'N/A',
                $item->nama_barang ?? '-',
                $item->kode_barang ?? '-',
                $item->spesifikasi ?? '-',
                $item->jenis_perawatan ?? '',
                $item->jumlah ?? 0,
                $item->jumlah_dipakai ?? 0,
                $item->jumlah_rusak ?? '',
                $item->tempat_pemakaian ?? '-',
                $item->nomor_ruang ?? '-',
                $item->asal_perolehan ?? '-',
                $item->tanggal_masuk ? Carbon::parse($item->tanggal_masuk)->format('d-m-Y') : ''
            ];

            $nb = 0;
            for ($col = 2; $col < count($data); $col++) {
                if (isset($data[$col])) {
                    $nb = max($nb, $this->NbLines($widths[$col], (string)$data[$col]));
                }
            }
            $textRowHeight = $nb * $lineHeight;
            $rowHeight = max($textRowHeight, $imageCellHeight);

            if ($this->fpdf->GetY() + $rowHeight > ($this->fpdf->GetPageHeight() - $bottomMargin)) {
                $this->fpdf->AddPage('L', 'A4');
                $this->fpdf->SetFont('Arial', 'B', 8);
                $this->fpdf->SetFillColor(242, 242, 242);
                for ($h = 0; $h < count($headers); $h++) {
                    $this->fpdf->Cell($widths[$h], 7, $headers[$h], 1, 0, 'C', true);
                }
                $this->fpdf->Ln();
                $this->fpdf->SetFont('Arial', '', 7);
            }

            $x_pos = $this->fpdf->GetX();
            $y_pos = $this->fpdf->GetY();
            $aligns = ['C', 'C', 'C', 'L', 'L', 'L', 'L', 'C', 'C', 'C', 'L', 'C', 'L', 'C'];

            for ($col = 0; $col < count($data); $col++) {
                $this->fpdf->Rect($x_pos, $y_pos, $widths[$col], $rowHeight);
                if ($col === 1) {
                    if ($item->foto_url) {
                        try {
                            $imgContents = Http::timeout(5)->get($item->foto_url)->body();
                            $imgPath = tempnam(sys_get_temp_dir(), 'inv') . '.jpg';
                            file_put_contents($imgPath, $imgContents);
                            $this->fpdf->Image($imgPath, $x_pos + 1, $y_pos + 1, $widths[$col] - 2, $rowHeight - 2);
                            unlink($imgPath);
                        } catch (\Exception $e) {
                        }
                    }
                } else {
                    if (isset($data[$col])) {
                        $nbLines = $this->NbLines($widths[$col], (string)$data[$col]);
                        $textHeight = $nbLines * $lineHeight;
                        $yOffset = ($rowHeight - $textHeight) / 2;
                        $this->fpdf->SetXY($x_pos, $y_pos + $yOffset);
                        $this->fpdf->MultiCell($widths[$col], $lineHeight, (string)$data[$col], 0, $aligns[$col]);
                    }
                }
                $x_pos += $widths[$col];
                $this->fpdf->SetXY($x_pos, $y_pos);
            }
            $this->fpdf->Ln($rowHeight);
        }

        // ========================================================================
        // == BARU: BLOK UNTUK MENAMBAHKAN BARIS TOTAL DI PDF ==
        // ========================================================================
        $this->fpdf->SetFont('Arial', 'B', 8); // Set font tebal untuk total
        $this->fpdf->SetFillColor(220, 220, 220); // Warna abu-abu yang sedikit berbeda

        // Gabungkan sel untuk label "Total Keseluruhan" (indeks 0 sampai 6)
        $labelWidth = array_sum(array_slice($widths, 0, 7));
        $this->fpdf->Cell($labelWidth, 7, 'Total Keseluruhan', 1, 0, 'R', true);

        // Sel untuk total 'Jumlah' (indeks 7)
        $this->fpdf->Cell($widths[7], 7, $totalJumlah, 1, 0, 'C', true);

        // Sel untuk total 'Pakai' (indeks 8)
        $this->fpdf->Cell($widths[8], 7, $totalDipakai, 1, 0, 'C', true);

        // Sel untuk total 'Rusak' (indeks 9)
        $this->fpdf->Cell($widths[9], 7, $totalRusak, 1, 0, 'C', true);

        // Gabungkan sel sisa di sebelah kanan agar border tetap utuh
        $remainingWidth = array_sum(array_slice($widths, 10));
        $this->fpdf->Cell($remainingWidth, 7, '', 1, 1, 'C', true);


        $fileName = 'laporan-inventaris-' . date('Ymd') . '.pdf';
        $this->fpdf->Output('I', $fileName);
        exit;
    }


    public function exportPDF(Request $request)
    {
        // 1. Mulai dengan query builder
        $query = Inventaris::query();
        $titleParts = [];

        // ... [ BLOK FILTER ANDA TETAP SAMA, TIDAK ADA PERUBAHAN ] ...
        if ($request->filled('tanggal_mulai') && $request->filled('tanggal_selesai')) {
            $startDate = Carbon::parse($request->input('tanggal_mulai'))->isoFormat('D MMMM Y');
            $endDate = Carbon::parse($request->input('tanggal_selesai'))->isoFormat('D MMMM Y');

            $query->whereBetween('tanggal_masuk', [$request->input('tanggal_mulai'), $request->input('tanggal_selesai')]);
            $titleParts[] = "Periode {$startDate} - {$endDate}";
        } else {
            if ($request->filled('hari')) {
                $query->whereDay('tanggal_masuk', $request->input('hari'));
                $titleParts[] = 'Tanggal ' . $request->input('hari');
            }
            if ($request->filled('bulan')) {
                $query->whereMonth('tanggal_masuk', $request->input('bulan'));
                $titleParts[] = 'Bulan ' . Carbon::create()->month($request->input('bulan'))->isoFormat('MMMM');
            }
            if ($request->filled('tahun')) {
                $query->whereYear('tanggal_masuk', $request->input('tahun'));
                $titleParts[] = 'Tahun ' . $request->input('tahun');
            }
        }

        if (empty($titleParts)) {
            $title = 'Laporan Keseluruhan Inventaris';
        } else {
            $title = 'Laporan Inventaris ' . implode(', ', array_reverse($titleParts));
        }

        // 5. Eksekusi query
        $inventaris = $query->orderBy('nomor', 'asc')->get();

        // ========================================================================
        // == BARU: HITUNG TOTAL UNTUK BARIS TERAKHIR ==
        // ========================================================================
        $totalJumlah = $inventaris->sum('jumlah');
        $totalDipakai = $inventaris->sum('jumlah_dipakai');
        $totalRusak = $inventaris->sum('jumlah_rusak');


        // --- Dari sini ke bawah, kode rendering FPDF tetap sama ---
        $this->fpdf->AddPage('L', 'A4'); // Set ke Landscape dan A4
        $this->fpdf->SetFont('Arial', 'B', 16);

        // Header Dokumen
        // ... [ KODE HEADER DOKUMEN ANDA TETAP SAMA ] ...
        try {
            $logoPath = public_path('images/logoklinik.png');
            if (file_exists($logoPath)) {
                $this->fpdf->Image($logoPath, 10, 8, 25);
            }
        } catch (\Exception $e) {
        }

        $this->fpdf->SetX(40);
        $this->fpdf->Cell(220, 8, 'KLINIK PRATAMA UNIMUS', 0, 1, 'C');
        $this->fpdf->SetFont('Arial', '', 10);
        $this->fpdf->SetX(40);
        $this->fpdf->Cell(220, 6, 'Jl. Petek Kp. Gayamsari RT. 02 RW. 06, Dadapsari, Semarang Utara, Semarang', 0, 1, 'C');
        $this->fpdf->SetX(40);
        $this->fpdf->Cell(220, 6, 'Telp. 0895-6168-33383, e-mail: klinikpratamarawatinap@unimus.ac.id', 0, 1, 'C');
        $this->fpdf->Ln(5);
        $this->fpdf->Line(10, 38, 287, 38);
        $this->fpdf->Ln(5);

        $this->fpdf->SetFont('Arial', 'B', 12);
        $this->fpdf->Cell(0, 10, $title, 0, 1, 'C');
        $this->fpdf->Ln(2);

        // Header Tabel
        $this->fpdf->SetFont('Arial', 'B', 8);
        $this->fpdf->SetFillColor(242, 242, 242);
        $widths = [8, 15, 20, 30, 20, 45, 20, 10, 10, 10, 22, 22, 20, 25]; // Sesuaikan lebar agar pas di A4 Landscape
        $headers = ['No.', 'Foto', 'Nomor', 'Nama Barang', 'Kode', 'Spesifikasi', 'Perawatan', 'Total', 'Pakai', 'Rusak', 'Pemakaian', 'No. Ruang', 'Asal', 'Tgl Masuk'];
        for ($i = 0; $i < count($headers); $i++) {
            $this->fpdf->Cell($widths[$i], 7, $headers[$i], 1, 0, 'C', true);
        }
        $this->fpdf->Ln();

        // Isi Tabel (tidak ada perubahan di sini)
        $this->fpdf->SetFont('Arial', '', 7);
        $lineHeight = 5;
        $imageCellHeight = 15;
        $bottomMargin = 20;

        foreach ($inventaris as $i => $item) {
            // ... [ KODE LOOPING DATA ANDA TETAP SAMA ] ...
            $data = [
                $i + 1,
                '',
                $item->nomor ?? 'N/A',
                $item->nama_barang ?? '-',
                $item->kode_barang ?? '-',
                $item->spesifikasi ?? '-',
                $item->jenis_perawatan ?? '',
                $item->jumlah ?? 0,
                $item->jumlah_dipakai ?? 0,
                $item->jumlah_rusak ?? '',
                $item->tempat_pemakaian ?? '-',
                $item->nomor_ruang ?? '-',
                $item->asal_perolehan ?? '-',
                $item->tanggal_masuk ? Carbon::parse($item->tanggal_masuk)->format('d-m-Y') : ''
            ];

            $nb = 0;
            for ($col = 2; $col < count($data); $col++) {
                if (isset($data[$col])) {
                    $nb = max($nb, $this->NbLines($widths[$col], (string)$data[$col]));
                }
            }
            $textRowHeight = $nb * $lineHeight;
            $rowHeight = max($textRowHeight, $imageCellHeight);

            if ($this->fpdf->GetY() + $rowHeight > ($this->fpdf->GetPageHeight() - $bottomMargin)) {
                $this->fpdf->AddPage('L', 'A4'); // Pastikan halaman baru juga landscape
                $this->fpdf->SetFont('Arial', 'B', 8);
                $this->fpdf->SetFillColor(242, 242, 242);
                for ($h = 0; $h < count($headers); $h++) {
                    $this->fpdf->Cell($widths[$h], 7, $headers[$h], 1, 0, 'C', true);
                }
                $this->fpdf->Ln();
                $this->fpdf->SetFont('Arial', '', 7);
            }

            $x_pos = $this->fpdf->GetX();
            $y_pos = $this->fpdf->GetY();
            $aligns = ['C', 'C', 'C', 'L', 'L', 'L', 'L', 'C', 'C', 'C', 'L', 'C', 'L', 'C'];

            for ($col = 0; $col < count($data); $col++) {
                $this->fpdf->Rect($x_pos, $y_pos, $widths[$col], $rowHeight);
                if ($col === 1) {
                    if (isset($item->foto_url) && $item->foto_url) {
                        try {
                            $imgContents = Http::timeout(5)->get($item->foto_url)->body();
                            $imgPath = tempnam(sys_get_temp_dir(), 'inv') . '.jpg';
                            file_put_contents($imgPath, $imgContents);
                            $this->fpdf->Image($imgPath, $x_pos + 1, $y_pos + 1, $widths[$col] - 2, $rowHeight - 2);
                            unlink($imgPath);
                        } catch (\Exception $e) {
                        }
                    }
                } else {
                    if (isset($data[$col])) {
                        $nbLines = $this->NbLines($widths[$col], (string)$data[$col]);
                        $textHeight = $nbLines * $lineHeight;
                        $yOffset = ($rowHeight - $textHeight) / 2;
                        $this->fpdf->SetXY($x_pos, $y_pos + $yOffset);
                        $this->fpdf->MultiCell($widths[$col], $lineHeight, (string)$data[$col], 0, $aligns[$col]);
                    }
                }
                $x_pos += $widths[$col];
                $this->fpdf->SetXY($x_pos, $y_pos);
            }
            $this->fpdf->Ln($rowHeight);
        }

        // ========================================================================
        // == BARU: BLOK UNTUK MENAMBAHKAN BARIS TOTAL DI PDF ==
        // ========================================================================
        $this->fpdf->SetFont('Arial', 'B', 8); // Set font tebal untuk total
        $this->fpdf->SetFillColor(220, 220, 220); // Warna abu-abu yang sedikit berbeda

        // Gabungkan sel untuk label "Total Keseluruhan" (dari No. sampai Perawatan)
        // Indeks 0 sampai 6 di array $widths
        $labelWidth = 0;
        for ($i = 0; $i <= 6; $i++) {
            $labelWidth += $widths[$i];
        }
        $this->fpdf->Cell($labelWidth, 7, 'Total Keseluruhan', 1, 0, 'R', true);

        // Sel untuk total 'Jumlah' (indeks 7)
        $this->fpdf->Cell($widths[7], 7, $totalJumlah, 1, 0, 'C', true);

        // Sel untuk total 'Pakai' (indeks 8)
        $this->fpdf->Cell($widths[8], 7, $totalDipakai, 1, 0, 'C', true);

        // Sel untuk total 'Rusak' (indeks 9)
        $this->fpdf->Cell($widths[9], 7, $totalRusak, 1, 0, 'C', true);

        // Gabungkan sel sisa di sebelah kanan agar border tetap utuh dan rapi
        $remainingWidth = 0;
        for ($i = 10; $i < count($widths); $i++) {
            $remainingWidth += $widths[$i];
        }
        // Parameter terakhir '1' untuk pindah baris setelah cell ini digambar
        $this->fpdf->Cell($remainingWidth, 7, '', 1, 1, 'C', true);

        $fileName = 'laporan-inventaris-' . date('Ymd') . '.pdf';
        $this->fpdf->Output('D', $fileName);
        exit;
    }
}
