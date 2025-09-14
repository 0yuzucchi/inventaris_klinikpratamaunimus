<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            // Menambahkan kolom 'nomor' dengan tipe integer, bisa null,
            // dan ditempatkan setelah kolom 'id'
            $table->integer('nomor')->nullable()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            // Menghapus kolom 'nomor' jika migrasi di-rollback
            $table->dropColumn('nomor');
        });
    }
};