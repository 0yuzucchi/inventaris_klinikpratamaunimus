<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventaris', function (Blueprint $table) {
            // Kolom Wajib
            $table->id();
            $table->string('nama_barang');
            $table->string('nama_pengunggah');
            $table->integer('jumlah');
            $table->string('tempat_pemakaian');
            $table->date('tanggal_masuk');
            $table->string('asal_perolehan');

            // Kolom Opsional
            $table->string('kode_barang')->nullable();
            $table->text('spesifikasi')->nullable();
            $table->integer('jumlah_dipakai')->default(0);
            $table->integer('jumlah_rusak')->default(0);
            $table->decimal('harga', 15, 2)->nullable();
            $table->string('foto')->nullable(); // Perubahan: Tambahkan kolom untuk foto

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventaris');
    }
};