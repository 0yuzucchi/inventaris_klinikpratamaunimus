<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'title',
        'file_name',
        'filters',
        'status',
        'file_path',
        'error_message',
        // 'user_id', // aktifkan kalau pakai relasi user
    ];
}
