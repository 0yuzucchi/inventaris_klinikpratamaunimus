<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventarisController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PanduanController;
use App\Http\Controllers\ReportController;

// Route untuk menampilkan halaman form filter
// 1. Tampilkan form export (opsional)


use App\Http\Controllers\InventarisExportController;
Route::get('/debug-phpinfo', function () {
    // Periksa apakah ekstensi GD dimuat, dan tampilkan semua info PHP
    if (extension_loaded('gd')) {
        echo '<h1>Ekstensi GD SUDAH AKTIF.</h1>';
    } else {
        echo '<h1>Ekstensi GD TIDAK AKTIF.</h1>';
    }
    phpinfo();
});
Route::get('/inventaris/export', [InventarisExportController::class, 'index'])
    ->name('inventaris.export.index');

Route::prefix('panduan')->name('panduan.')->middleware(['auth', 'verified'])->group(function () {
    // Route default akan redirect ke panduan 'tambah'
    Route::get('/', function () {
        return redirect()->route('panduan.tambah');
    })->name('index');

    Route::get('/tambah', [PanduanController::class, 'showTambah'])->name('tambah');
    Route::get('/edit', [PanduanController::class, 'showEdit'])->name('edit');
    Route::get('/hapus', [PanduanController::class, 'showHapus'])->name('hapus');
    Route::get('/cetak-label', [PanduanController::class, 'showCetak'])->name('cetak');
    Route::get('/aksi-massal', [PanduanController::class, 'showBulk'])->name('bulk');
    Route::get('/export-sort', [PanduanController::class, 'showExport'])->name('export');
});

Route::delete('/inventaris/bulk-destroy', [InventarisController::class, 'bulkDestroy'])->name('inventaris.bulkDestroy');
Route::post('/inventaris/{inventari}/duplicate', [App\Http\Controllers\InventarisController::class, 'duplicate'])->name('inventaris.duplicate');
// Halaman utama publik


// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
Route::redirect('/', '/login');


// --- GRUP RUTE YANG MEMERLUKAN OTENTIKASI ---
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Rute Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // --- Grup Khusus untuk Fitur Inventaris ---

    // 1. Route Resource untuk operasi CRUD standar (index, create, store, edit, update, destroy)
    Route::resource('inventaris', InventarisController::class)->except(['show']);

    // 2. Route untuk fitur Bulk (Massal)
    Route::get('/inventaris/bulk-edit', [InventarisController::class, 'bulkEdit'])
         ->name('inventaris.bulkEdit');

    // PERUBAHAN DI SINI: Mengubah 'post' menjadi 'put' agar sesuai dengan request dari form
    Route::post('/inventaris/bulk-update', [InventarisController::class, 'bulkUpdate'])
          ->name('inventaris.bulkUpdate');
    
    // 3. Route untuk membuat dan mengunduh Label
    // Route ini untuk mencetak label SATUAN. Menggunakan GET dan route model binding.
    Route::get('/inventaris/{inventari}/generate-label', [InventarisController::class, 'generateLabel'])
         ->name('inventaris.generateLabel');

    // Route ini untuk mengunduh label secara MASSAL (BULK). Menggunakan POST.
    Route::post('/inventaris/download-bulk-labels', [InventarisController::class, 'downloadBulkLabels'])
         ->name('inventaris.downloadBulkLabels');

    // 4. Route untuk Ekspor Data
    Route::get('/inventaris/export/pdf', [InventarisController::class, 'exportPDF'])
         ->name('inventaris.exportPDF');
         
    Route::get('/inventaris/export/excel', [InventarisController::class, 'exportExcel'])
         ->name('inventaris.exportExcel');
    Route::get('/inventaris/print', [InventarisController::class, 'print'])
         ->name('inventaris.print');

    // Rute untuk manajemen profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rute otentikasi
require __DIR__.'/auth.php';  