<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterKategoriBarang extends Model
{
    protected $table = 'master_kategori_barang';
    
    protected $fillable = ['nama', 'keterangan'];

    public function masterBarangs()
    {
        return $this->hasMany(MasterBarang::class);
    }
}