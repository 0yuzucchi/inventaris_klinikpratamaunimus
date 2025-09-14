<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
}