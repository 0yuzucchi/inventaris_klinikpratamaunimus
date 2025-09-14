<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            // Tambahkan kolom nomor_ruang setelah kode_barang, bisa null untuk data lama
            $table->integer('nomor_ruang')->nullable()->after('kode_barang');
        });
    }

    public function down(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            $table->dropColumn('nomor_ruang');
        });
    }
};