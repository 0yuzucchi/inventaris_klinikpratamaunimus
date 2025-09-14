<?php

namespace App\Http\Controllers;

use App\Exports\InventarisExport;
use App\Models\Inventaris;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelFormat;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Http;
use App\Jobs\ExportInventarisJob;

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
            return back()->with('error', $e->getMessage())->withInput();
        }
    }



    public function duplicate(Inventaris $inventari)
    {
        $newItem = $inventari->replicate();

        $newItem->nama_barang = $inventari->nama_barang . ' (copy)';

        $newItem->tanggal_masuk = now();
        $newItem->nama_pengunggah = Auth::user()->name;

        $newItem->save();

        return redirect()->route('inventaris.index')->with('success', 'Data berhasil diduplikasi.');
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

    public function update(Request $request, Inventaris $inventari)
    {
        // 1. Tambahkan default merge untuk field tertentu
        $request->merge([
            'jumlah_dipakai' => $request->input('jumlah_dipakai') ?: 0,
            'jumlah_rusak' => $request->input('jumlah_rusak') ?: 0,
        ]);

        // 2. Validasi input
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
            DB::transaction(function () use ($request, &$validated, $inventari) {
                // 3. Tentukan nomor unik
                $finalNomor = $this->determineAndValidateId($validated['nama_barang'], 'nomor', 'nama_barang', $inventari->id);
                $finalNomorRuang = $this->determineAndValidateId($validated['tempat_pemakaian'], 'nomor_ruang', 'tempat_pemakaian', $inventari->id);

                $validated['nomor'] = $finalNomor;
                $validated['nomor_ruang'] = $finalNomorRuang;

                // 4. Generate kode_barang kalau kosong
                if (empty($validated['kode_barang'])) {
                    $validated['kode_barang'] = $inventari->kode_barang ?: 'BRG-' . strtoupper(Str::random(6));
                }

                // 5. Nama pengunggah
                $validated['nama_pengunggah'] = Auth::user()->name;

                // 6. Logika Foto
                if ($request->hasFile('foto')) {
                    // Hapus foto lama jika ada
                    if ($inventari->foto) {
                        $oldPath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $inventari->foto);
                        Http::withHeaders([
                            'apikey' => env('SUPABASE_KEY'),
                            'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                        ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $oldPath);
                    }

                    $file = $request->file('foto');
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
                        throw new \Exception('Upload ke Supabase gagal: ' . $response->body());
                    }

                    $validated['foto'] = env('SUPABASE_URL') . '/storage/v1/object/public/inventaris-fotos/' . $fileName;
                } elseif ($request->boolean('remove_foto')) {
                    if ($inventari->foto) {
                        $oldPath = str_replace(env('SUPABASE_URL') . '/storage/v1/object/public/', '', $inventari->foto);
                        Http::withHeaders([
                            'apikey' => env('SUPABASE_KEY'),
                            'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
                        ])->delete(env('SUPABASE_URL') . '/storage/v1/object/' . $oldPath);
                    }
                    $validated['foto'] = null;
                } else {
                    unset($validated['foto']);
                }

                // 7. Update record
                $inventari->update($validated);
            });

            return redirect()->route('inventaris.index')->with('success', 'Data berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error('Update data inventaris gagal: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage());
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
            return back()->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
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
            return back()->with('error', 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage());
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
            return back()->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }



    public function generateLabel(Inventaris $inventari)
    {
        $data = ['inventari' => $inventari];
        $pdf = PDF::loadView('inventaris.label', $data);
        $customPaper = array(0, 0, 226.80, 113.40);
        $pdf->setPaper($customPaper);
        return $pdf->stream('label-' . $inventari->kode_barang . '.pdf');
    }

    // public function downloadBulkLabels(Request $request)
    // {
    //     $validated = $request->validate([
    //         'ids' => 'required|array',
    //         'ids.*' => 'exists:inventaris,id'
    //     ]);

    //     $selectedItems = Inventaris::whereIn('id', $validated['ids'])->get();

    //     if ($selectedItems->isEmpty()) {
    //         return back()->with('error', 'Tidak ada data untuk dicetak.');
    //     }

    //     $labelsToPrint = new Collection();
    //     foreach ($selectedItems as $item) {
    //         $quantity = $item->jumlah_dipakai ?? 0;
    //         for ($i = 0; $i < $quantity; $i++) {
    //             $labelsToPrint->push($item);
    //         }
    //     }

    //     if ($labelsToPrint->isEmpty()) {
    //         return back()->with('error', 'Tidak ada item untuk dicetak labelnya (jumlah item nol).');
    //     }

    //     $data = ['inventaris_list' => $labelsToPrint];
    //     $pdf = Pdf::loadView('inventaris.bulk_label_pdf', $data)
    //         ->setPaper([0, 0, 612, 936])
    //         ->setOption('margin-top', 0)
    //         ->setOption('margin-right', 0)
    //         ->setOption('margin-bottom', 0)
    //         ->setOption('margin-left', 0);
    //     $filename = 'sheet-labels-inventaris-' . now()->format('Y-m-d') . '.pdf';
    //     return $pdf->stream($filename);
    // }
    public function downloadBulkLabels(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:inventaris,id',
        ]);

        $selectedItems = Inventaris::whereIn('id', $validated['ids'])->get();

        if ($selectedItems->isEmpty()) {
            return back()->with('error', 'Tidak ada data untuk dicetak.');
        }

        $labelsToPrint = new \Illuminate\Support\Collection();

        foreach ($selectedItems as $item) {
            $quantity = $item->jumlah_dipakai ?? 0;

            // Konversi foto ke URL publik Supabase
            if ($item->foto) {
                $item->foto_url = "https://vvpicnwjplzltrvqidxk.supabase.co/storage/v1/object/public/inventaris-fotos/{$item->foto}";
            } else {
                $item->foto_url = null;
            }

            // duplikasi sesuai jumlah_dipakai
            for ($i = 0; $i < $quantity; $i++) {
                $labelsToPrint->push($item);
            }
        }

        if ($labelsToPrint->isEmpty()) {
            return back()->with('error', 'Tidak ada item untuk dicetak labelnya (jumlah item nol).');
        }

        $data = [
            'inventaris_list' => $labelsToPrint,
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('inventaris.bulk_label_pdf', $data)
            ->setPaper([0, 0, 612, 936])
            ->setOption('isRemoteEnabled', true) // penting supaya bisa load gambar dari URL
            ->setOption('margin-top', 0)
            ->setOption('margin-right', 0)
            ->setOption('margin-bottom', 0)
            ->setOption('margin-left', 0);

        $filename = 'sheet-labels-inventaris-' . now()->format('Y-m-d') . '.pdf';

        return $pdf->stream($filename);
    }
    
    // public function exportPDF(Request $request)
    // {
    //     $request->validate([
    //         'tahun'    => 'nullable|date_format:Y',
    //         'bulan'    => 'nullable|date_format:m',
    //         'hari'     => 'nullable|date_format:d',
    //         'tanggal_mulai'  => 'nullable|date',
    //         'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
    //     ]);

    //     $query = Inventaris::query();
    //     $titleParts = [];

    //     if ($request->filled('tanggal_mulai') && $request->filled('tanggal_selesai')) {
    //         $startDate = Carbon::parse($request->input('tanggal_mulai'))->format('d F Y');
    //         $endDate = Carbon::parse($request->input('tanggal_selesai'))->format('d F Y');

    //         $query->whereBetween('tanggal_masuk', [
    //             $request->input('tanggal_mulai'),
    //             $request->input('tanggal_selesai')
    //         ]);
    //         $titleParts[] = "dari {$startDate} sampai {$endDate}";
    //     } else {
    //         if ($request->filled('hari')) {
    //             $query->whereDay('tanggal_masuk', $request->input('hari'));
    //             $titleParts[] = 'Tanggal ' . $request->input('hari');
    //         }
    //         if ($request->filled('bulan')) {
    //             $query->whereMonth('tanggal_masuk', $request->input('bulan'));
    //             $titleParts[] = 'Bulan ' . Carbon::create()->month($request->input('bulan'))->format('F');
    //         }
    //         if ($request->filled('tahun')) {
    //             $query->whereYear('tanggal_masuk', $request->input('tahun'));
    //             $titleParts[] = 'Tahun ' . $request->input('tahun');
    //         }
    //     }

    //     $title = empty($titleParts)
    //         ? 'Laporan Keseluruhan Inventaris'
    //         : 'Laporan Inventaris ' . implode(', ', $titleParts);

    //     $inventaris = $query->latest('tanggal_masuk')->get();

    //     $data = [
    //         'inventaris' => $inventaris,
    //         'title'      => $title,
    //         'date'       => date('d F Y')
    //     ];

    //     // 🔹 Generate PDF langsung di memory
    //     $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('inventaris.pdf', $data)
    //         ->setPaper('a4', 'landscape');

    //     $pdf->setOption('isRemoteEnabled', true);


    //     $fileName = 'laporan-inventaris-' .
    //         str_replace(' ', '-', strtolower(implode('-', $titleParts) ?: 'semua')) .
    //         '-' . date('Ymd') . '.pdf';

    //     // 🔹 Serverless-friendly: langsung return stream (nggak simpan ke local)
    //     return response($pdf->output(), 200)
    //         ->header('Content-Type', 'application/pdf')
    //         ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');
    // }

    public function exportPDF(Request $request)
{
    $request->validate([
        'tahun'    => 'nullable|date_format:Y',
        'bulan'    => 'nullable|date_format:m',
        'hari'     => 'nullable|date_format:d',
        'tanggal_mulai'  => 'nullable|date',
        'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
    ]);

    $query = Inventaris::query();
    $titleParts = [];

    if ($request->filled('tanggal_mulai') && $request->filled('tanggal_selesai')) {
        $startDate = Carbon::parse($request->input('tanggal_mulai'))->format('d F Y');
        $endDate = Carbon::parse($request->input('tanggal_selesai'))->format('d F Y');

        $query->whereBetween('tanggal_masuk', [
            $request->input('tanggal_mulai'),
            $request->input('tanggal_selesai')
        ]);
        $titleParts[] = "dari {$startDate} sampai {$endDate}";
    } else {
        if ($request->filled('hari')) {
            $query->whereDay('tanggal_masuk', $request->input('hari'));
            $titleParts[] = 'Tanggal ' . $request->input('hari');
        }
        if ($request->filled('bulan')) {
            $query->whereMonth('tanggal_masuk', $request->input('bulan'));
            $titleParts[] = 'Bulan ' . Carbon::create()->month($request->input('bulan'))->format('F');
        }
        if ($request->filled('tahun')) {
            $query->whereYear('tanggal_masuk', $request->input('tahun'));
            $titleParts[] = 'Tahun ' . $request->input('tahun');
        }
    }

    $title = empty($titleParts)
        ? 'Laporan Keseluruhan Inventaris'
        : 'Laporan Inventaris ' . implode(', ', $titleParts);

    $inventaris = $query->latest('tanggal_masuk')->get();

    $data = [
        'inventaris' => $inventaris,
        'title'      => $title,
        'date'       => date('d F Y')
    ];

    // 🔹 Generate PDF di memory
    $pdf = Pdf::loadView('inventaris.pdf', $data)->setPaper('a4', 'landscape');
    $pdf->setOption('isRemoteEnabled', true);
    $pdfContent = $pdf->output();

    // 🔹 Nama file unik
    $fileName = 'laporan-inventaris-' .
        str_replace(' ', '-', strtolower(implode('-', $titleParts) ?: 'semua')) .
        '-' . date('Ymd') . '-' . Str::random(6) . '.pdf';

    // 🔹 Upload ke Supabase (bucket: exports)
    $response = Http::withHeaders([
        'apikey'        => env('SUPABASE_KEY'),
        'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
    ])->attach(
        'file',
        $pdfContent,
        $fileName
    )->post(env('SUPABASE_URL') . '/storage/v1/object/exports/' . $fileName);

    if ($response->failed()) {
    return response()->json(['error' => 'Gagal upload file ke Supabase', 'detail' => $response->body()], 500);
}

// 🔹 Public URL (kalau bucket public)
$downloadUrl = env('SUPABASE_URL') . '/storage/v1/object/public/exports/' . $fileName;

// 🔹 Redirect langsung ke PDF
return $pdf->download($fileName);
}







    // public function exportExcel()
    // {
    //     $export = new InventarisExport();

    //     // gunakan Excel::raw agar tidak menulis ke disk (sesuai serverless)
    //     $content = Excel::raw($export, \Maatwebsite\Excel\Excel::XLSX);

    //     return new StreamedResponse(function () use ($content) {
    //         echo $content;
    //     }, 200, [
    //         'Content-Type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //         'Content-Disposition' => 'attachment; filename="inventaris.xlsx"',
    //     ]);
    // }
    public function exportExcel()
{
    $fileName = 'inventaris-' . date('Ymd') . '-' . Str::random(6) . '.xlsx';

    // 🔹 Generate Excel ke binary string
    $excelContent = Excel::raw(new InventarisExport, \Maatwebsite\Excel\Excel::XLSX);

    // 🔹 Upload ke Supabase bucket "exports"
    $response = Http::withHeaders([
        'apikey'        => env('SUPABASE_KEY'),
        'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
        'Content-Type'  => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ])->withBody(
        $excelContent,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )->post(env('SUPABASE_URL') . '/storage/v1/object/exports/' . $fileName);

    if ($response->failed()) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal upload file ke Supabase',
            'error'   => $response->body(),
        ], 500);
    }

    // 🔹 Link public
    $publicUrl = rtrim(env('SUPABASE_URL'), '/') . '/storage/v1/object/public/exports/' . $fileName;

    return response()->json([
        'success' => true,
        'url'     => $publicUrl,
    ]);
}

    public function print()
    {
        $inventaris = Inventaris::latest()->get();

        return view('inventaris.pdf', [
            'inventaris' => $inventaris,
        ]);
    }
}
