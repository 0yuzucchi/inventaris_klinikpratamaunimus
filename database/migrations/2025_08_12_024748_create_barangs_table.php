<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('barangs', function (Blueprint $table) {
            $table->string('kode_barang', 20)->primary();
            $table->string('nama_barang');
            $table->text('spesifikasi')->nullable();
            $table->string('kode_kriteria', 10);
            $table->string('foto_barang')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('barangs'); }
};