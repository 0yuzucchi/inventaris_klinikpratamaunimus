<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_barang', function (Blueprint $table) {
            $table->id();

            // Nama jenis barang (APAR, Kursi Roda, dll)
            $table->string('nama_barang')->unique();

            // Relasi ke kategori barang
            $table->foreignId('master_kategori_barang_id')
                ->constrained('master_kategori_barang')
                ->restrictOnDelete();

            // Keterangan tambahan (opsional)
            $table->integer('nomor_barang')->nullable()->unique();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_barang');
    }
};
