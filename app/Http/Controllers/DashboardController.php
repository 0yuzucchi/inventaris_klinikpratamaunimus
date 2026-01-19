<?php

// namespace App\Http\Controllers;

// use App\Models\Inventaris;
// use Inertia\Inertia;

// class DashboardController extends Controller
// {
//     public function index()
//     {
//         // Ambil inventaris + relasi penting
//         $inventaris = Inventaris::with([
//             'masterBarang',
//             'ruangan',
//         ])->get();

//         // ===============================
//         // STATISTIK UTAMA
//         // ===============================

//         // Total jenis barang (berdasarkan master_barang_id)
//         $totalJenisBarang = $inventaris
//             ->pluck('master_barang_id')
//             ->unique()
//             ->count();

//         // Total kuantitas barang
//         $totalKuantitas = $inventaris->sum('jumlah');

//         // Estimasi total nilai inventaris
//         $totalNilaiInventaris = $inventaris->sum(function ($item) {
//             return ($item->harga ?? 0) * ($item->jumlah ?? 0);
//         });

//         // Total barang rusak
//         $totalBarangRusak = $inventaris->sum('jumlah_rusak');

//         // ===============================
//         // DATA GRAFIK: BARANG PER RUANGAN
//         // ===============================
//         $barangBerdasarkanLokasi = $inventaris
//             ->groupBy(fn ($item) => $item->ruangan?->nama_ruangan ?? 'Tidak Diketahui')
//             ->map(fn ($group) => $group->sum('jumlah'))
//             ->sortDesc();

//         // ===============================
//         // AKTIVITAS TERBARU
//         // ===============================
//         $aktivitasTerbaru = Inventaris::with('masterBarang')
//     ->orderByDesc('updated_at')
//     ->take(5)
//     ->get()
//     ->map(function ($item) {
//         return [
//             'id' => $item->id,
//             'nama_barang' => $item->display_nama_barang,
//             'jumlah' => $item->jumlah,
//             'tanggal' => optional($item->updated_at)->format('d-m-Y'),
//         ];
//     });


//         // ===============================
//         // KIRIM KE FRONTEND
//         // ===============================
//         return Inertia::render('Dashboard', [
//             'stats' => [
//                 'total_jenis_barang' => $totalJenisBarang,
//                 'total_kuantitas' => $totalKuantitas,
//                 'estimasi_nilai' => $totalNilaiInventaris,
//                 'total_barang_rusak' => $totalBarangRusak,
//                 'barang_berdasarkan_lokasi' => $barangBerdasarkanLokasi,
//                 'aktivitas_terbaru' => $aktivitasTerbaru,
//             ],
//         ]);
//     }
// }



namespace App\Http\Controllers;

use App\Models\Inventaris;
use App\Models\NilaiAset;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ===============================
        // BAGIAN 1: STATISTIK OPERASIONAL (Tidak Berubah)
        // ===============================
        $inventaris = Inventaris::with(['masterBarang', 'ruangan'])->get();
        $totalJenisBarang = $inventaris->pluck('master_barang_id')->unique()->count();
        $totalKuantitas = $inventaris->sum('jumlah');
        $totalNilaiInventaris = $inventaris->sum(fn ($item) => ($item->harga ?? 0) * ($item->jumlah ?? 0));
        $totalBarangRusak = $inventaris->sum('jumlah_rusak');
        $barangBerdasarkanLokasi = $inventaris
            ->groupBy(fn ($item) => $item->ruangan?->nama_ruangan ?? 'Tidak Diketahui')
            ->map(fn ($group) => $group->sum('jumlah'))
            ->sortDesc();
        $aktivitasTerbaru = Inventaris::with('masterBarang')
            ->orderByDesc('updated_at')
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id, 'nama_barang' => $item->display_nama_barang,
                'jumlah' => $item->jumlah, 'tanggal' => optional($item->updated_at)->format('d-m-Y'),
            ]);

        // ===============================
        // BAGIAN 2: STATISTIK FINANSIAL ASET
        // ===============================
        $aset = NilaiAset::all();
        $tahunSekarang = Carbon::now()->year;

        // --- Kalkulasi Statistik Kartu ---
        $totalNilaiPerolehan = $aset->sum('total_harga_perolehan');
        $totalAkumulasiPenyusutan = 0;
        foreach ($aset as $item) {
            if (is_array($item->rincian_tahunan)) {
                foreach ($item->rincian_tahunan as $rincian) {
                    if (isset($rincian['tahun']) && $rincian['tahun'] <= $tahunSekarang) {
                        // [DIUBAH] Menggunakan key 'beban' sesuai data JSON Anda
                        $totalAkumulasiPenyusutan += ($rincian['beban'] ?? 0);
                    }
                }
            }
        }
        $totalNilaiBuku = $totalNilaiPerolehan - $totalAkumulasiPenyusutan;

        // --- Persiapan Data Grafik Garis (Line Chart) ---
        $dataChartAset = [];
        foreach ($aset as $item) {
            $tahunPerolehan = Carbon::parse($item->tanggal_perolehan)->year;
            if (!isset($dataChartAset[$tahunPerolehan])) {
                $dataChartAset[$tahunPerolehan] = ['perolehan' => 0, 'penyusutan' => 0];
            }
            $dataChartAset[$tahunPerolehan]['perolehan'] += $item->total_harga_perolehan;

            if (is_array($item->rincian_tahunan)) {
                foreach ($item->rincian_tahunan as $rincian) {
                    if (isset($rincian['tahun'])) {
                        $tahunRincian = $rincian['tahun'];
                        if (!isset($dataChartAset[$tahunRincian])) {
                            $dataChartAset[$tahunRincian] = ['perolehan' => 0, 'penyusutan' => 0];
                        }
                        // [DIUBAH] Menggunakan key 'beban' sesuai data JSON Anda
                        $dataChartAset[$tahunRincian]['penyusutan'] += ($rincian['beban'] ?? 0);
                    }
                }
            }
        }
        ksort($dataChartAset);

        // --- Buat data kumulatif (Tidak ada perubahan di sini) ---
        $chartLabels = [];
        $chartPerolehanKumulatif = [];
        $chartPenyusutanKumulatif = [];
        $chartNilaiBukuKumulatif = [];
        $lastPerolehan = 0;
        $lastPenyusutan = 0;

        if (!empty($dataChartAset)) {
            $tahunMulai = array_key_first($dataChartAset);
            $tahunAkhir = max(array_key_last($dataChartAset), $tahunSekarang);

            for ($tahun = $tahunMulai; $tahun <= $tahunAkhir; $tahun++) {
                $lastPerolehan += ($dataChartAset[$tahun]['perolehan'] ?? 0);
                $lastPenyusutan += ($dataChartAset[$tahun]['penyusutan'] ?? 0);

                $chartLabels[] = $tahun;
                $chartPerolehanKumulatif[] = $lastPerolehan;
                $chartPenyusutanKumulatif[] = $lastPenyusutan;
                $chartNilaiBukuKumulatif[] = $lastPerolehan - $lastPenyusutan;
            }
        }

        // ===============================
        // BAGIAN 3: KIRIM SEMUA DATA KE FRONTEND (Tidak Berubah)
        // ===============================
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_jenis_barang' => $totalJenisBarang,
                'total_kuantitas' => $totalKuantitas,
                'estimasi_nilai' => $totalNilaiInventaris,
                'total_barang_rusak' => $totalBarangRusak,
                'barang_berdasarkan_lokasi' => $barangBerdasarkanLokasi,
                'aktivitas_terbaru' => $aktivitasTerbaru,
                'total_nilai_perolehan' => $totalNilaiPerolehan,
                'total_akumulasi_penyusutan' => $totalAkumulasiPenyusutan,
                'total_nilai_buku' => $totalNilaiBuku,
                'chart_nilai_aset' => [
                    'labels' => $chartLabels,
                    'datasets' => [
                        ['label' => 'Nilai Perolehan', 'data' => $chartPerolehanKumulatif],
                        ['label' => 'Akumulasi Penyusutan', 'data' => $chartPenyusutanKumulatif],
                        ['label' => 'Nilai Buku Aset', 'data' => $chartNilaiBukuKumulatif],
                    ],
                ]
            ],
        ]);
    }
}