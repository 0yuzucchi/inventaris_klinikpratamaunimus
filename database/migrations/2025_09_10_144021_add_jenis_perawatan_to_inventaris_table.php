<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('inventaris', function (Blueprint $table) {
            // Menambahkan kolom 'jenis_perawatan' sebagai string, bisa null,
            // dan ditempatkan setelah kolom 'harga'.
            $table->string('jenis_perawatan')->nullable()->after('harga');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('inventaris', function (Blueprint $table) {
            // Baris ini akan menghapus kolom jika migrasi di-rollback.
            $table->dropColumn('jenis_perawatan');
        });
    }
};