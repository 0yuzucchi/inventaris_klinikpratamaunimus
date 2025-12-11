<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventarisController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PanduanController;
use App\Http\Controllers\InventoryAIController;
use App\Http\Controllers\ChatbotController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Di sini Anda dapat mendaftarkan rute web untuk aplikasi Anda. Rute-rute
| ini dimuat oleh RouteServiceProvider dan semuanya akan
| ditugaskan ke grup middleware "web". Buat sesuatu yang hebat!
|
*/

// Rute default & Rute yang tidak memerlukan otentikasi
Route::redirect('/', '/login');
Route::post('/scan-barang-ai', [InventoryAIController::class, 'identifyItem'])->name('scan.ai');


// --- GRUP RUTE YANG MEMERLUKAN OTENTIKASI ---
Route::middleware(['auth', 'verified'])->group(function () {

    // Rute Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rute Chatbot
    Route::get('/chatbot', [ChatbotController::class, 'index'])->name('chatbot.index');
    Route::post('/chatbot/ask', [ChatbotController::class, 'chat'])->name('chatbot.ask');

    // Rute Panduan
    Route::prefix('panduan')->name('panduan.')->group(function () {
        Route::get('/', fn() => redirect()->route('panduan.tambah'))->name('index');
        Route::get('/tambah', [PanduanController::class, 'showTambah'])->name('tambah');
        Route::get('/edit', [PanduanController::class, 'showEdit'])->name('edit');
        Route::get('/hapus', [PanduanController::class, 'showHapus'])->name('hapus');
        Route::get('/cetak-label', [PanduanController::class, 'showCetak'])->name('cetak');
        Route::get('/aksi-massal', [PanduanController::class, 'showBulk'])->name('bulk');
        Route::get('/export-sort', [PanduanController::class, 'showExport'])->name('export');
        Route::get('/cetak-keseluruhan', [PanduanController::class, 'showCetakKeseluruhan'])->name('cetak.keseluruhan');
        Route::get('/export-laporan', [PanduanController::class, 'showExportPdf'])->name('export.pdf');
    });

    // --- GRUP RUTE INVENTARIS ---
    // Rute-rute spesifik harus didefinisikan SEBELUM rute resource.
    Route::prefix('inventaris')->name('inventaris.')->group(function () {
        // --- Rute Spesifik (yang tidak mengandung parameter dinamis di awal) ---
        Route::get('/print', [InventarisController::class, 'print'])->name('print');
        Route::get('/export/pdf', [InventarisController::class, 'exportPDF'])->name('exportPDF');
        Route::get('/export/excel', [InventarisController::class, 'exportExcel'])->name('exportExcel');
        Route::get('/bulk-edit', [InventarisController::class, 'bulkEdit'])->name('bulkEdit');
        Route::post('/bulk-update', [InventarisController::class, 'bulkUpdate'])->name('bulkUpdate');
        Route::delete('/bulk-destroy', [InventarisController::class, 'bulkDestroy'])->name('bulkDestroy');
        Route::post('/download-bulk-labels', [InventarisController::class, 'downloadBulkLabels'])->name('downloadBulkLabels');

        // --- Rute dengan parameter dinamis ---
        // Rute-rute ini harus berada setelah rute yang lebih spesifik di atas.
        Route::post('/{inventari}/duplicate', [InventarisController::class, 'duplicate'])->name('duplicate');
        Route::get('/{inventari}/generate-label', [InventarisController::class, 'generateLabel'])->name('generateLabel');
    });

    // --- RUTE RESOURCE INVENTARIS ---
    // Ini akan menangani index, create, store, show, edit, update, destroy secara otomatis.
    // Karena rute-rute di atas sudah didefinisikan, Laravel tidak akan salah mencocokkan lagi.
    Route::resource('inventaris', InventarisController::class);


    // Rute Manajemen Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rute Otentikasi
require __DIR__.'/auth.php';