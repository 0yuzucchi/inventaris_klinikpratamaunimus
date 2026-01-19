<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            // Tambah Kolom (Nullable dulu agar data lama tidak error)
            $table->foreignId('master_kategori_id')->nullable();
            $table->foreignId('master_ruangan_id')->nullable();
            $table->foreignId('master_asal_perolehan_id')->nullable();
            $table->foreignId('master_jenis_perawatan_id')->nullable();
            $table->foreignId('uploaded_by')->nullable();
        });

        // Definisi Foreign Key (Dipisah agar lebih stabil di PostgreSQL)
        Schema::table('inventaris', function (Blueprint $table) {
            $table->foreign('master_kategori_id')
                ->references('id')->on('master_kategori_barang')
                ->restrictOnDelete();

            $table->foreign('master_ruangan_id')
                ->references('id')->on('master_ruangan')
                ->restrictOnDelete();

            $table->foreign('master_asal_perolehan_id')
                ->references('id')->on('master_asal_perolehan')
                ->restrictOnDelete();

            $table->foreign('master_jenis_perawatan_id')
                ->references('id')->on('master_jenis_perawatan')
                ->nullOnDelete();

            $table->foreign('uploaded_by')
                ->references('id')->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            // Drop Foreign Key
            $table->dropForeign(['master_kategori_id']);
            $table->dropForeign(['master_ruangan_id']);
            $table->dropForeign(['master_asal_perolehan_id']);
            $table->dropForeign(['master_jenis_perawatan_id']);
            $table->dropForeign(['uploaded_by']);

            // Drop Kolom
            $table->dropColumn([
                'master_kategori_id',
                'master_ruangan_id',
                'master_asal_perolehan_id',
                'master_jenis_perawatan_id',
                'uploaded_by',
            ]);
        });
    }
};