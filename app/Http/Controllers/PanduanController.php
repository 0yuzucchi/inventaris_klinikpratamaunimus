<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PanduanController extends Controller
{
    /**
     * Menampilkan panduan 'Tambah Data'.
     */
    public function showTambah()
    {
        return Inertia::render('Panduan/TambahData');
    }

    /**
     * Menampilkan panduan 'Edit Data'.
     */
    public function showEdit()
    {
        return Inertia::render('Panduan/EditData');
    }
    
    /**
     * Menampilkan panduan 'Hapus Data'.
     */
    public function showHapus()
    {
        // Pastikan Anda membuat file 'Panduan/HapusData.jsx'
        return Inertia::render('Panduan/HapusData');
    }

    public function showCetak()
    {
        return Inertia::render('Panduan/CetakLabel');
    }

    public function showCetakKeseluruhan()
    {
        // Ganti 'Panduan/CetakLaporanKeseluruhan' sesuai struktur folder komponen Anda
        return Inertia::render('Panduan/CetakLaporanKeseluruhan'); 
    }

    // Metode baru untuk menampilkan panduan ekspor PDF dengan filter
    public function showExportPdf()
    {
        // Ganti 'Panduan/EksporPDFFilter' sesuai struktur folder komponen Anda
        return Inertia::render('Panduan/EksporLaporan');
    }
}