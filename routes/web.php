<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventarisController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PanduanController;
use App\Http\Controllers\InventoryAIController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\NilaiAsetController;

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
Route::middleware(['role:super_admin,kepala_rt,staff_rt,direktur,keuangan'])->group(function () {
});

Route::redirect('/', '/login');
Route::post('/scan-barang-ai', [InventoryAIController::class, 'identifyItem'])->name('scan.ai');

Route::get('/inventaris/{inventari}', [InventarisController::class, 'show'])
    ->name('inventaris.show')
    ->whereNumber('inventari'); 

// --- GRUP RUTE YANG MEMERLUKAN OTENTIKASI ---
Route::middleware(['auth', 'verified'])->group(function () {
    // Rute Manajemen Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        
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

    Route::middleware(['auth', 'verified', 'role:super_admin,direktur,keuangan'])
    ->group(function () {

        Route::get('/nilai-aset', [NilaiAsetController::class, 'index'])
            ->name('nilai-aset.index');

        Route::get('/nilai-aset/{id}', [NilaiAsetController::class, 'show'])
            ->name('nilai-aset.show')
            ->whereNumber('id');

        Route::get('/nilai-aset/print', [NilaiAsetController::class, 'print'])
            ->name('nilai-aset.print');
    });

    Route::middleware(['auth', 'verified', 'role:super_admin,keuangan'])
    ->group(function () {

        Route::get('/nilai-aset/create', [NilaiAsetController::class, 'create'])
            ->name('nilai-aset.create');

        Route::post('/nilai-aset', [NilaiAsetController::class, 'store'])
            ->name('nilai-aset.store');

        Route::get('/nilai-aset/{id}/edit', [NilaiAsetController::class, 'edit'])
            ->name('nilai-aset.edit')
            ->whereNumber('id');

        Route::put('/nilai-aset/{id}', [NilaiAsetController::class, 'update'])
            ->name('nilai-aset.update')
            ->whereNumber('id');

        Route::delete('/nilai-aset/{id}', [NilaiAsetController::class, 'destroy'])
            ->name('nilai-aset.destroy')
            ->whereNumber('id');

        Route::post('/nilai-aset/bulk-delete', [NilaiAsetController::class, 'bulkDestroy'])
            ->name('nilai-aset.bulk-delete');
    });

    Route::middleware(['auth', 'verified', 'role:super_admin,kepala_rt,staff_rt,direktur,keuangan'])
    ->group(function () {

        Route::get('/inventaris', [InventarisController::class, 'index'])
            ->name('inventaris.index');

        Route::get('/inventaris/{inventari}', [InventarisController::class, 'show'])
            ->name('inventaris.show')
            ->whereNumber('inventari');

        Route::prefix('inventaris')->name('inventaris.')->group(function () {
            Route::get('/print', [InventarisController::class, 'print'])->name('print');
            Route::get('/export/pdf', [InventarisController::class, 'exportPDF'])->name('exportPDF');
            Route::get('/export/excel', [InventarisController::class, 'exportExcel'])->name('exportExcel');
        });
    });
    
    Route::middleware(['auth', 'verified', 'role:super_admin,kepala_rt,staff_rt'])
    ->group(function () {

        Route::get('/inventaris/create', [InventarisController::class, 'create'])
            ->name('inventaris.create');

        Route::post('/inventaris', [InventarisController::class, 'store'])
            ->name('inventaris.store');

        Route::get('/inventaris/{inventari}/edit', [InventarisController::class, 'edit'])
            ->name('inventaris.edit')
            ->whereNumber('inventari');

        Route::put('/inventaris/{inventari}', [InventarisController::class, 'update'])
            ->name('inventaris.update')
            ->whereNumber('inventari');

        Route::delete('/inventaris/{inventari}', [InventarisController::class, 'destroy'])
            ->name('inventaris.destroy')
            ->whereNumber('inventari');
    });

    Route::middleware(['auth', 'verified', 'role:super_admin,kepala_rt,staff_rt'])
    ->prefix('inventaris')
    ->name('inventaris.')
    ->group(function () {

        Route::get('/bulk-edit', [InventarisController::class, 'bulkEdit'])->name('bulkEdit');
        Route::post('/bulk-update', [InventarisController::class, 'bulkUpdate'])->name('bulkUpdate');
        Route::delete('/bulk-destroy', [InventarisController::class, 'bulkDestroy'])->name('bulkDestroy');

        Route::post('/download-bulk-labels', [InventarisController::class, 'downloadBulkLabels'])
            ->name('downloadBulkLabels');

        Route::post('/{inventari}/duplicate', [InventarisController::class, 'duplicate'])
            ->name('duplicate')
            ->whereNumber('inventari');

        Route::get('/{inventari}/generate-label', [InventarisController::class, 'generateLabel'])
            ->name('generateLabel')
            ->whereNumber('inventari');
    });

});

// Rute Otentikasi
require __DIR__.'/auth.php';