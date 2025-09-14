<?php

namespace App\Http\Controllers;

use App\Models\Inventaris;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Mengambil semua data sekali untuk efisiensi (tetap diperlukan untuk statistik lain)
        $inventaris = Inventaris::all();

        // 1. Statistik Utama
        // --- PERUBAHAN UTAMA: Menghitung jenis barang berdasarkan 'nomor' unik ---
        // Kode lama: $totalJenisBarang = $inventaris->count();
        $totalJenisBarang = Inventaris::distinct('nomor')->count();
        // ----------------------------------------------------------------------

        $totalKuantitas = $inventaris->sum('jumlah');
        $totalNilaiInventaris = $inventaris->sum(function($item) {
            return $item->harga * $item->jumlah;
        });
        $totalBarangRusak = $inventaris->sum('jumlah_rusak');

        // 2. Data untuk Grafik Sebaran Barang (Tidak ada perubahan)
        $barangBerdasarkanLokasi = $inventaris->groupBy('tempat_pemakaian')
            ->map(function ($group) {
                return $group->sum('jumlah'); // Menjumlahkan total kuantitas per lokasi
            })->sortDesc();

        // 3. Aktivitas Terbaru (5 item terakhir) (Tidak ada perubahan)
        $aktivitasTerbaru = Inventaris::latest()->take(5)->get();

        // Mengemas semua data untuk dikirim ke frontend
        $stats = [
            'total_jenis_barang' => $totalJenisBarang,
            'total_kuantitas' => $totalKuantitas,
            'estimasi_nilai' => $totalNilaiInventaris,
            'total_barang_rusak' => $totalBarangRusak,
            'barang_berdasarkan_lokasi' => $barangBerdasarkanLokasi,
            'aktivitas_terbaru' => $aktivitasTerbaru,
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
        ]);
    }
}