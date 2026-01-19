<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterJenisPerawatan extends Model
{
    protected $table = 'master_jenis_perawatan';
    protected $fillable = ['nama', 'keterangan'];

    public function inventaris()
    {
        return $this->hasMany(Inventaris::class);
    }
}
