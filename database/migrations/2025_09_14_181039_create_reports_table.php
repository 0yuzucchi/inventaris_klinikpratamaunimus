<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('reports', function (Blueprint $table) {
        $table->id();
        // $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Jika ada relasi user
        $table->string('title');
        $table->string('file_name')->nullable();
        $table->string('file_path')->nullable(); // Untuk menyimpan URL dari Supabase
        $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
        $table->text('error_message')->nullable();
        $table->json('filters'); // Menyimpan filter yang digunakan dalam format JSON
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
