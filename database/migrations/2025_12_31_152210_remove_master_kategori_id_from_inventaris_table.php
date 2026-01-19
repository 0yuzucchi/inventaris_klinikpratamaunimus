<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Hapus relasi master_kategori dari inventaris
     * karena kategori sekarang lewat master_barang
     */
    public function up(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            // drop FK dulu
            $table->dropForeign(['master_kategori_id']);

            // drop kolom
            $table->dropColumn('master_kategori_id');
        });
    }

    /**
     * Rollback: kembalikan kolom & FK
     */
    public function down(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            $table->foreignId('master_kategori_id')
                ->nullable()
                ->after('nomor');

            $table->foreign('master_kategori_id')
                ->references('id')
                ->on('master_kategori_barang')
                ->restrictOnDelete();
        });
    }
};
