<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterBarang extends Model
{
    use HasFactory;

    protected $table = 'master_barang';

    protected $fillable = [
        'nama_barang',
        'master_kategori_barang_id',
        'nomor_barang',
    ];

    /**
     * Relasi ke kategori barang
     */
    public function kategori()
    {
        return $this->belongsTo(
            MasterKategoriBarang::class,
            'master_kategori_barang_id'
        );
    }

    /**
     * Relasi ke inventaris (unit barang)
     * Contoh: APAR nomor 1, APAR nomor 2
     */
    public function inventaris()
    {
        return $this->hasMany(Inventaris::class);
    }
}
