<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('inventaris2s', function (Blueprint $table) {
            $table->id('id_inventaris');
            $table->bigInteger('nomor_urut')->unique();
            $table->string('nomor_barang', 50)->unique();
            $table->string('kode_barang', 20);
            $table->string('kode_ruangan', 20);
            $table->date('tanggal_masuk');
            $table->decimal('harga_satuan', 15, 2)->default(0);
            $table->string('kondisi_barang', 50);
            $table->string('tempat_asal');
            $table->string('nama_pengunggah', 100);
            $table->string('tempat_pemakaian')->nullable();
            $table->timestamps();
            
            // Foreign key constraints
            $table->foreign('kode_barang')->references('kode_barang')->on('barangs')->onDelete('restrict');
            $table->foreign('kode_ruangan')->references('kode_ruangan')->on('ruangans')->onDelete('restrict');
        });
    }
    public function down(): void { Schema::dropIfExists('inventaris2s'); }
};