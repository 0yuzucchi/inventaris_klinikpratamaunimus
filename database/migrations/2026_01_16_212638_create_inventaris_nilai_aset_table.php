<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilai_aset', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventaris_id')->constrained('inventaris')->onDelete('cascade');
            
            // Data Input Manual
            $table->date('tanggal_perolehan');
            $table->text('keterangan')->nullable(); // Request: Keterangan Nullable
            
            // Nilai Rupiah (Boleh 0/null sesuai request)
            $table->decimal('harga_perolehan_awal', 15, 2)->default(0); 
            $table->decimal('penambahan', 15, 2)->default(0);
            $table->decimal('pengurangan', 15, 2)->default(0);
            
            // Hasil Kalkulasi Basis
            $table->decimal('total_harga_perolehan', 15, 2)->default(0); // Basis Hitung
            $table->decimal('tarif_penyusutan', 5, 2)->default(0); // Persen
            
            // PENYIMPANAN DATA TAHUNAN (JSON)
            // Struktur: [{tahun: 2022, beban: 5000, akm: 5000, sisa: 10000}, ...]
            $table->json('rincian_tahunan')->nullable(); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai_aset');
    }
};