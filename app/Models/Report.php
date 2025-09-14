<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Report extends Model

{
        use HasFactory;

     protected $fillable = [
        'title',
        'file_name',
        'file_path',
        'status',
        'error_message',
        'filters',
        // 'user_id', // Tambahkan ini jika Anda menggunakan relasi user
    ];
}
