<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            // Hapus kolom legacy (lama)
            if (Schema::hasColumn('inventaris', 'nama_barang')) {
                $table->dropColumn('nama_barang');
            }
            if (Schema::hasColumn('inventaris', 'nama_pengunggah')) {
                $table->dropColumn('nama_pengunggah');
            }
            if (Schema::hasColumn('inventaris', 'tempat_pemakaian')) {
                $table->dropColumn('tempat_pemakaian');
            }
            if (Schema::hasColumn('inventaris', 'asal_perolehan')) {
                $table->dropColumn('asal_perolehan');
            }
            if (Schema::hasColumn('inventaris', 'kode_barang')) {
                $table->dropColumn('kode_barang');
            }
            if (Schema::hasColumn('inventaris', 'nomor_ruang')) {
                $table->dropColumn('nomor_ruang');
            }
            if (Schema::hasColumn('inventaris', 'nomor')) {
                $table->dropColumn('nomor');
            }
            if (Schema::hasColumn('inventaris', 'jenis_perawatan')) {
                $table->dropColumn('jenis_perawatan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
    
            if (!Schema::hasColumn('inventaris', 'nama_barang')) {
                $table->string('nama_barang', 255)->nullable();
            }
    
            if (!Schema::hasColumn('inventaris', 'nama_pengunggah')) {
                $table->string('nama_pengunggah', 255)->nullable();
            }
    
            if (!Schema::hasColumn('inventaris', 'tempat_pemakaian')) {
                $table->string('tempat_pemakaian', 255)->nullable();
            }
    
            if (!Schema::hasColumn('inventaris', 'asal_perolehan')) {
                $table->string('asal_perolehan', 255)->nullable();
            }
    
            if (!Schema::hasColumn('inventaris', 'kode_barang')) {
                $table->string('kode_barang', 255)->nullable();
            }
    
            if (!Schema::hasColumn('inventaris', 'nomor_ruang')) {
                $table->integer('nomor_ruang')->nullable();
            }
    
            if (!Schema::hasColumn('inventaris', 'nomor')) {
                $table->integer('nomor')->nullable();
            }
    
            if (!Schema::hasColumn('inventaris', 'jenis_perawatan')) {
                $table->string('jenis_perawatan', 255)->nullable();
            }
        });
    }
    
};
