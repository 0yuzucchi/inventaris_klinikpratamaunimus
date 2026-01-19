<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterAsalPerolehan extends Model
{
    protected $table = 'master_asal_perolehan';
    protected $fillable = ['nama'];

    public function inventaris()
    {
        return $this->hasMany(Inventaris::class);
    }
}
