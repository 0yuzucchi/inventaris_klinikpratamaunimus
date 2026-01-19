<?php

namespace App\Http\Controllers;

use App\Models\NilaiAset;
use App\Models\Inventaris;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Codedge\Fpdf\Fpdf\Fpdf; // <-- Import FPDF
use Illuminate\Support\Facades\Http; // <-- Import Http Facade


class NilaiAsetController extends Controller
{
        // LANGKAH 1: Deklarasikan properti untuk menyimpan objek FPDF
    protected $fpdf;

    // LANGKAH 2: Tambahkan constructor ini
    // Constructor akan otomatis dijalankan saat controller dibuat
    public function __construct()
    {
        // Membuat instance baru dari FPDF dan menyimpannya ke properti $fpdf
        $this->fpdf = new Fpdf;
    }

    public function index(Request $request)
    {
        // 1. Query Semua Data dengan Relasi (Tanpa Filter Search)
        // Note: Jika data sangat banyak (ribuan), sebaiknya tetap pakai server-side pagination. 
        // Tapi untuk client-side search, kita ambil get().
        $query = NilaiAset::with([
            'inventaris.masterBarang.kategori', 
            'inventaris.ruangan'
        ])->latest();

        // 2. Mapping Data
        $data = $query->get()->map(function ($asset) {
            $inv = $asset->inventaris;
            
            // Fix URL Gambar
            $imageUrl = null;
            if ($inv) {
                $rawFoto = $inv->foto ?? ($inv->masterBarang->foto ?? null);
                if ($rawFoto) {
                    $imageUrl = Str::startsWith($rawFoto, ['http://', 'https://']) 
                        ? $rawFoto 
                        : asset('storage/' . $rawFoto);
                }
            }

            return [
                'id' => $asset->id,
                'inventaris_id' => $asset->inventaris_id,
                'tanggal_perolehan' => $asset->tanggal_perolehan,
                'total_harga_perolehan' => $asset->total_harga_perolehan,
                'tarif_penyusutan' => $asset->tarif_penyusutan,
                'rincian_tahunan' => $asset->rincian_tahunan,
                
                // DATA TAMPILAN
                'display_image' => $imageUrl,
                'display_nama' => $inv ? $inv->display_nama_barang : ($asset->keterangan ?? '-'),
                'display_kode' => $inv ? $inv->nomor_pengadaan_lengkap : '-',
                'display_lokasi' => $inv ? $inv->display_ruangan : '-',
                'jumlah_rusak' => $inv->jumlah_rusak ?? 0,
            ];
        });

        // 3. Kirim ke Frontend
        // Kita tidak perlu kirim balik filter search/year karena frontend yang akan handle defaultnya
        return Inertia::render('NilaiAset/Index', [
            'nilaiAset' => $data,
        ]);
    }

    public function show($id)
    {
        // 1. Ambil data dengan relasi lengkap
        $nilaiAset = NilaiAset::with([
            'inventaris.masterBarang.kategori', 
            'inventaris.ruangan'
        ])->findOrFail($id);

        $inv = $nilaiAset->inventaris;

        // 2. Hitung / Cari Data Detail Tahun Ini
        $currentYear = date('Y');
        $rincian = collect($nilaiAset->rincian_tahunan);
        
        $currDetail = $rincian->firstWhere('tahun', $currentYear);

        if (!$currDetail) {
            $lastData = $rincian->last();
            if ($lastData && $currentYear > $lastData['tahun']) {
                $currDetail = $lastData;
            } else {
                $currDetail = [
                    'beban' => 0, 'akumulasi' => 0, 'nilai_sisa' => $nilaiAset->total_harga_perolehan
                ];
            }
        }

        // 3. Format Data Sesuai Permintaan Frontend
        $dataFormatted = [
            'id' => $nilaiAset->id,
            'nama_barang' => $inv ? $inv->display_nama_barang : ($nilaiAset->keterangan ?? 'Aset Tak Dikenal'),
            'kode_inventaris' => $inv ? $inv->nomor_pengadaan_lengkap : '-',
            'ruangan' => $inv ? $inv->display_ruangan : '-',
            
            'raw' => [
                'harga_perolehan_awal' => $nilaiAset->harga_perolehan_awal,
                'penambahan' => $nilaiAset->penambahan,
                'pengurangan' => $nilaiAset->pengurangan,
                'harga_perolehan_akhir' => $nilaiAset->total_harga_perolehan,
                'tarif_penyusutan' => $nilaiAset->tarif_penyusutan,
                'umur_manfaat' => $nilaiAset->tarif_penyusutan > 0 ? ceil(100 / $nilaiAset->tarif_penyusutan) : '-',
                'keterangan' => $nilaiAset->keterangan,
                'penyusutan_tahun_ini' => $currDetail['beban'] ?? 0,
                'akumulasi_penyusutan' => $currDetail['akumulasi'] ?? 0,
                'nilai_sisa' => $currDetail['nilai_sisa'] ?? 0,
            ],

            'formatted' => [
                'metode' => 'Garis Lurus (Straight Line)',
                'tgl_perolehan' => $nilaiAset->tanggal_perolehan 
                    ? Carbon::parse($nilaiAset->tanggal_perolehan)->translatedFormat('d F Y') 
                    : '-',
            ],

            // TAMBAHAN: Data Rincian Lengkap untuk Tabel
            'rincian_tahunan' => $nilaiAset->rincian_tahunan
        ];

        return Inertia::render('NilaiAset/Show', [
            'nilaiAset' => $dataFormatted
        ]);
    }

    public function create()
    {
        // Ambil data inventaris untuk dropdown
        $inventaris = Inventaris::with(['masterBarang', 'ruangan'])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'label' => $item->display_nama_barang, // Label simpel
                    // Data Lengkap untuk Dropdown Style Baru
                    'nama_barang' => $item->display_nama_barang,
                    'kode_barang' => $item->nomor_pengadaan_lengkap ?? '-',
                    'lokasi' => $item->display_ruangan ?? 'Tanpa Ruangan',
                    'image' => $item->foto ?? null,
                    'kondisi' => "Baik: {$item->jumlah_dipakai} | Rusak: {$item->jumlah_rusak}",
                    
                    // Helper autofill form
                    'harga_referensi' => $item->harga,
                    'tanggal_referensi' => $item->tanggal_masuk,
                ];
            });

        return Inertia::render('NilaiAset/Create', [
            'inventarisList' => $inventaris
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'inventaris_id' => 'required|exists:inventaris,id',
            'tanggal_perolehan' => 'required|date',
            'keterangan' => 'nullable|string',
            'harga_perolehan_awal' => 'nullable|numeric|min:0',
            'penambahan' => 'nullable|numeric|min:0',
            'pengurangan' => 'nullable|numeric|min:0',
            'tarif_penyusutan' => 'required|numeric|min:0|max:100',
        ]);

        // 1. Hitung Basis (Total Harga Akhir Tahun Ini)
        $awal = $validated['harga_perolehan_awal'] ?? 0;
        $tambah = $validated['penambahan'] ?? 0;
        $kurang = $validated['pengurangan'] ?? 0;
        $totalBasis = $awal + $tambah - $kurang;

        // 2. Generate JSON Perhitungan (Prorata)
        $rincianJson = $this->hitungJadwalPenyusutan(
            $totalBasis,
            $validated['tarif_penyusutan'],
            $validated['tanggal_perolehan']
        );

        // 3. Simpan
        NilaiAset::create([
            'inventaris_id' => $validated['inventaris_id'],
            'tanggal_perolehan' => $validated['tanggal_perolehan'],
            'keterangan' => $validated['keterangan'],
            'harga_perolehan_awal' => $awal,
            'penambahan' => $tambah,
            'pengurangan' => $kurang,
            'total_harga_perolehan' => $totalBasis,
            'tarif_penyusutan' => $validated['tarif_penyusutan'],
            'rincian_tahunan' => $rincianJson,
        ]);

        return redirect()->route('nilai-aset.index')->with('success', 'Data aset berhasil disimpan.');
    }

    // --- FITUR EDIT ---
    public function edit($id)
    {
        $nilaiAset = NilaiAset::findOrFail($id);

        // Ambil list inventaris (sama persis dengan logic create)
        // Agar dropdown bisa dirender
        $inventaris = Inventaris::with(['masterBarang', 'ruangan'])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'label' => $item->display_nama_barang,
                    'nama_barang' => $item->display_nama_barang,
                    'kode_barang' => $item->nomor_pengadaan_lengkap ?? '-',
                    'lokasi' => $item->display_ruangan ?? 'Tanpa Ruangan',
                    // Kirim Asset URL agar gambar muncul di Dropdown
                    'image' => $item->foto ?? null,
                    'kondisi' => "Baik: {$item->jumlah_dipakai} | Rusak: {$item->jumlah_rusak}",
                    'harga_referensi' => $item->harga,
                    'tanggal_referensi' => $item->tanggal_masuk,
                ];
            });

        return Inertia::render('NilaiAset/Edit', [
            'nilaiAset' => $nilaiAset,
            'inventarisList' => $inventaris
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'inventaris_id' => 'required|exists:inventaris,id',
            'tanggal_perolehan' => 'required|date',
            'keterangan' => 'nullable|string',
            'harga_perolehan_awal' => 'nullable|numeric|min:0',
            'penambahan' => 'nullable|numeric|min:0',
            'pengurangan' => 'nullable|numeric|min:0',
            'tarif_penyusutan' => 'required|numeric|min:0|max:100',
        ]);

        // 1. Hitung Ulang Basis
        $awal = $validated['harga_perolehan_awal'] ?? 0;
        $tambah = $validated['penambahan'] ?? 0;
        $kurang = $validated['pengurangan'] ?? 0;
        $totalBasis = $awal + $tambah - $kurang;

        // 2. Hitung Ulang Jadwal
        $rincianJson = $this->hitungJadwalPenyusutan(
            $totalBasis,
            $validated['tarif_penyusutan'],
            $validated['tanggal_perolehan']
        );

        // 3. Update DB
        $nilaiAset = NilaiAset::findOrFail($id);
        $nilaiAset->update([
            'inventaris_id' => $validated['inventaris_id'],
            'tanggal_perolehan' => $validated['tanggal_perolehan'],
            'keterangan' => $validated['keterangan'],
            'harga_perolehan_awal' => $awal,
            'penambahan' => $tambah,
            'pengurangan' => $kurang,
            'total_harga_perolehan' => $totalBasis,
            'tarif_penyusutan' => $validated['tarif_penyusutan'],
            'rincian_tahunan' => $rincianJson,
        ]);

        return redirect()->route('nilai-aset.index')->with('success', 'Data aset berhasil diperbarui.');
    }


    // --- LOGIC HITUNG EXCEL (GARIS LURUS PRORATA) ---
    private function hitungJadwalPenyusutan($harga, $tarif, $tgl)
    {
        if ($harga <= 0 || $tarif <= 0) return [];

        $hasil = [];
        $date = Carbon::parse($tgl);
        $startYear = $date->year;
        $startMonth = $date->month;
        
        // Beban Full Setahun
        $bebanPerTahun = $harga * ($tarif / 100);
        
        // Estimasi masa manfaat (misal 25% = 4 tahun)
        // Kita tambah 1 tahun buffer karena tahun pertama prorata
        $estimasiTahun = ceil(100 / $tarif) + ($startMonth > 1 ? 1 : 0);
        $endYear = $startYear + $estimasiTahun;

        $akumulasi = 0;

        for ($tahun = $startYear; $tahun <= $endYear; $tahun++) {
            $beban = 0;

            // Jika nilai buku sudah habis (toleransi pembulatan 100 perak)
            if ($harga - $akumulasi <= 100) break;

            if ($tahun == $startYear) {
                // TAHUN PERTAMA: PRORATA
                // Rumus Excel: (13 - Bulan Beli) / 12 * Beban
                $bulanPakai = 13 - $startMonth;
                $beban = $bebanPerTahun * ($bulanPakai / 12);
            } else {
                // TAHUN BERIKUTNYA: FULL
                $beban = $bebanPerTahun;
            }

            // Capping: Jangan sampai akumulasi melebihi harga (Nilai sisa minus)
            if (($akumulasi + $beban) > $harga) {
                $beban = $harga - $akumulasi;
            }

            $akumulasi += $beban;
            $nilaiSisa = $harga - $akumulasi;

            $hasil[] = [
                'tahun' => $tahun,
                'beban' => round($beban), // Bulatkan seperti Excel (tanpa desimal)
                'akumulasi' => round($akumulasi),
                'nilai_sisa' => round($nilaiSisa)
            ];
        }

        return $hasil;
    }

    // --- HAPUS SINGLE ---
    public function destroy($id)
    {
        $nilaiAset = NilaiAset::findOrFail($id);
        $nilaiAset->delete();

        return redirect()->route('nilai-aset.index')->with('success', 'Data aset berhasil dihapus.');
    }

    // --- HAPUS MASSAL (BULK DELETE) ---
    public function bulkDestroy(Request $request)
    {
        // Validasi input harus berupa array ID
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:nilai_aset,id', // Pastikan ID valid
        ]);

        $ids = $request->input('ids');

        // Hapus data berdasarkan array ID
        NilaiAset::whereIn('id', $ids)->delete();

        return redirect()->route('nilai-aset.index')->with('success', count($ids) . ' data aset berhasil dihapus.');
    }

    public function print(Request $request)
{
    // 1. Ambil semua data aset dengan relasi
    $asetList = NilaiAset::with(['inventaris.masterBarang', 'inventaris.ruangan'])
        ->get();

    // 2. Hitung total untuk footer tabel (Tidak ada perubahan)
    $totalHargaPerolehan = 0;
    $totalAkumulasi = 0;
    $totalNilaiBuku = 0;
    $currentYear = date('Y');

    foreach ($asetList as $aset) {
        $rincian = collect($aset->rincian_tahunan);
        $detailTahunIni = $rincian->firstWhere('tahun', $currentYear) ?? $rincian->last();
        $totalHargaPerolehan += $aset->total_harga_perolehan;
        $totalAkumulasi += $detailTahunIni['akumulasi'] ?? 0;
        $totalNilaiBuku += $detailTahunIni['nilai_sisa'] ?? $aset->total_harga_perolehan;
    }

    // 3. Pengaturan Dokumen PDF
    $this->fpdf->AddPage('L', 'A4');
    $this->fpdf->SetFont('Arial', 'B', 16);

    // --- HEADER DOKUMEN (Mirip referensi Anda) ---
        try {
            // Definisikan URL gambar
            $logoUrl = 'https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/logo_klinik.png';
            
            // Gunakan HTTP Client Laravel untuk mengambil gambar, beri timeout 10 detik
            $response = Http::timeout(10)->get($logoUrl);

            // Cek jika request berhasil (kode status 2xx)
            if ($response->successful()) {
                // Ambil konten gambar
                $imageContents = $response->body();
                
                // Buat file sementara di server dengan ekstensi .png
                // FPDF perlu ekstensi untuk mengenali tipe gambar
                $tempPath = tempnam(sys_get_temp_dir(), 'logo') . '.png';
                
                // Tulis konten gambar ke file sementara
                file_put_contents($tempPath, $imageContents);
                
                // Gunakan path file sementara di FPDF
                $this->fpdf->Image($tempPath, 10, 8, 25);
                
                // Hapus file sementara setelah digunakan
                unlink($tempPath);
            }

        } catch (\Exception $e) { 
            // Biarkan kosong jika logo gagal di-download atau diproses
            // Anda bisa menambahkan Log::error($e->getMessage()); di sini untuk debugging
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
    $this->fpdf->Cell(0, 10, 'Laporan Nilai Aset dan Penyusutan per ' . date('d F Y'), 0, 1, 'C');
    $this->fpdf->Ln(2);


    // --- HEADER TABEL ---
    $this->fpdf->SetFont('Arial', 'B', 8);
    $this->fpdf->SetFillColor(242, 242, 242);
    $widths = [8, 40, 25, 25, 30, 20, 15, 28, 28, 28, 30];
    $headers = ['No.', 'Nama Barang', 'Kode Aset', 'Lokasi', 'Keterangan', 'Tgl. Perolehan', 'Tarif (%)', 'Harga Perolehan', 'Akumulasi Peny.', 'Beban Peny. ' . $currentYear, 'Nilai Buku Sisa'];
    for ($i = 0; $i < count($headers); $i++) {
        $this->fpdf->Cell($widths[$i], 10, $headers[$i], 1, 0, 'C', true);
    }
    $this->fpdf->Ln();

    // --- ISI TABEL (LOGIKA UTAMA DIRUBAH) ---
    $this->fpdf->SetFont('Arial', '', 7.5);
    // BARU: Tentukan tinggi per baris teks dan margin bawah
    $lineHeight = 5; // Tinggi untuk satu baris teks
    $bottomMargin = 20; // Margin bawah halaman

    foreach ($asetList as $i => $aset) {
        $inv = $aset->inventaris;
        $rincian = collect($aset->rincian_tahunan);
        $detailTahunIni = $rincian->firstWhere('tahun', $currentYear) ?? $rincian->last();
        $data = [
            $i + 1,
            $inv->display_nama_barang ?? 'Aset (Tanpa Inventaris)',
            $inv->nomor_pengadaan_lengkap ?? '-',
            $inv->display_ruangan ?? '-',
            $aset->keterangan ?? '-',
            Carbon::parse($aset->tanggal_perolehan)->format('d-m-Y'),
            number_format($aset->tarif_penyusutan, 2) . '%',
            'Rp ' . number_format($aset->total_harga_perolehan, 0, ',', '.'),
            'Rp ' . number_format($detailTahunIni['akumulasi'] ?? 0, 0, ',', '.'),
            'Rp ' . number_format($detailTahunIni['beban'] ?? 0, 0, ',', '.'),
            'Rp ' . number_format($detailTahunIni['nilai_sisa'] ?? $aset->total_harga_perolehan, 0, ',', '.'),
        ];

        // BARU: Hitung tinggi baris yang dibutuhkan
        $nb = 0;
        for ($j = 0; $j < count($data); $j++) {
            // Gunakan NbLines untuk menghitung jumlah baris untuk setiap sel
            $nb = max($nb, $this->NbLines($widths[$j], (string)$data[$j]));
        }
        $rowHeight = $nb * $lineHeight;

        // BARU: Cek apakah baris muat, jika tidak, pindah halaman dan gambar header lagi
        if ($this->fpdf->GetY() + $rowHeight > ($this->fpdf->GetPageHeight() - $bottomMargin)) {
            $this->fpdf->AddPage('L', 'A4');
            $this->fpdf->SetFont('Arial', 'B', 8);
            $this->fpdf->SetFillColor(242, 242, 242);
            for ($h = 0; $h < count($headers); $h++) {
                $this->fpdf->Cell($widths[$h], 10, $headers[$h], 1, 0, 'C', true);
            }
            $this->fpdf->Ln();
            $this->fpdf->SetFont('Arial', '', 7.5);
        }
        
        // BARU: Gambar baris menggunakan MultiCell
        $x_pos = $this->fpdf->GetX();
        $y_pos = $this->fpdf->GetY();
        $aligns = ['C', 'L', 'L', 'L', 'L', 'C', 'C', 'R', 'R', 'R', 'R'];

        for ($j = 0; $j < count($data); $j++) {
            // Gambar border terlebih dahulu
            $this->fpdf->Rect($x_pos, $y_pos, $widths[$j], $rowHeight);
            
            // Atur posisi cursor untuk MultiCell
            $this->fpdf->SetXY($x_pos, $y_pos);
            
            // Tulis teks dengan MultiCell, border di set ke 0 karena sudah digambar dengan Rect
            $this->fpdf->MultiCell($widths[$j], $lineHeight, (string)$data[$j], 0, $aligns[$j]);
            
            // Pindahkan posisi X untuk sel berikutnya
            $x_pos += $widths[$j];
            
            // Set ulang posisi Y ke atas untuk kolom berikutnya di baris yang sama
            $this->fpdf->SetY($y_pos); 
        }
        
        // Pindahkan cursor ke bawah setinggi baris yang baru saja digambar
        $this->fpdf->Ln($rowHeight);
    }

    // --- BARIS TOTAL (Tidak ada perubahan) ---
    $this->fpdf->SetFont('Arial', 'B', 8);
    $this->fpdf->SetFillColor(220, 220, 220);
    $labelWidth = array_sum(array_slice($widths, 0, 7));
    $this->fpdf->Cell($labelWidth, 7, 'Total Keseluruhan', 1, 0, 'R', true);
    $this->fpdf->Cell($widths[7], 7, 'Rp ' . number_format($totalHargaPerolehan, 0, ',', '.'), 1, 0, 'R', true);
    $this->fpdf->Cell($widths[8], 7, 'Rp ' . number_format($totalAkumulasi, 0, ',', '.'), 1, 0, 'R', true);
    $this->fpdf->Cell($widths[9], 7, '', 1, 0, 'R', true);
    $this->fpdf->Cell($widths[10], 7, 'Rp ' . number_format($totalNilaiBuku, 0, ',', '.'), 1, 1, 'R', true);


    // --- OUTPUT PDF ---
    $fileName = 'laporan-nilai-aset-' . date('Y-m-d') . '.pdf';
    $this->fpdf->Output('I', $fileName);
    exit;
}

    /**
     * Menghitung jumlah baris yang akan digunakan oleh MultiCell.
     * Versi ini TIDAK mengakses properti protected dan lebih aman.
     * @param float $w Lebar sel
     * @param string $txt Teks
     * @return int Jumlah baris
     */
    protected function NbLines($w, $txt)
    {
        if (is_null($txt) || $txt === '') {
            return 1;
        }

        // BARU: Alih-alih mencoba membaca cMargin, kita kurangi sedikit saja lebar
        // efektif untuk memberikan ruang napas, ini jauh lebih aman.
        // Angka 2 adalah asumsi padding 1mm di setiap sisi, yang sangat wajar.
        $cellWidth = $w - 2;

        if ($cellWidth <= 0) {
            return 1;
        }

        $lineCount = 0;
        $text = (string) $txt;
        $paragraphs = explode("\n", $text);

        foreach ($paragraphs as $paragraph) {
            if ($paragraph === '') {
                $lineCount++;
                continue;
            }

            $words = explode(' ', $paragraph);
            $currentLine = '';
            
            foreach ($words as $word) {
                if ($currentLine === '') {
                    $currentLine = $word;
                    continue;
                }

                $testLine = $currentLine . ' ' . $word;

                if ($this->fpdf->GetStringWidth($testLine) > $cellWidth) {
                    $lineCount++;
                    $currentLine = $word;
                } else {
                    $currentLine = $testLine;
                }
            }
            
            $lineCount++;
        }

        return $lineCount > 0 ? $lineCount : 1;
    }
}   