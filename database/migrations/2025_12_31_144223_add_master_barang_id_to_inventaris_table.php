<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah relasi master_barang ke inventaris (NULLABLE dulu).
     */
    public function up(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            $table->foreignId('master_barang_id')
                ->nullable()
                ->after('id');
        });

        // Tambahkan constraint FK (dipisah agar aman di PostgreSQL)
        Schema::table('inventaris', function (Blueprint $table) {
            $table->foreign('master_barang_id')
                ->references('id')
                ->on('master_barang')
                ->restrictOnDelete();
        });
    }

    /**
     * Rollback hanya membatalkan perubahan di atas
     */
    public function down(): void
    {
        Schema::table('inventaris', function (Blueprint $table) {
            $table->dropForeign(['master_barang_id']);
            $table->dropColumn('master_barang_id');
        });
    }
};
