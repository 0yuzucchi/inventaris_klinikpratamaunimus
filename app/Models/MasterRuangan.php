<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterRuangan extends Model
{
    protected $table = 'master_ruangan';
    protected $fillable = ['nama_ruangan', 'nomor_ruang'];

    public function inventaris()
    {
        return $this->hasMany(Inventaris::class);
    }
}
