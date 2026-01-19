<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NilaiAset extends Model
{
    protected $table = 'nilai_aset';

    protected $fillable = [
        'inventaris_id',
        'tanggal_perolehan',
        'keterangan',
        'harga_perolehan_awal',
        'penambahan',
        'pengurangan',
        'total_harga_perolehan',
        'tarif_penyusutan',
        'rincian_tahunan',
    ];

    protected $casts = [
        'tanggal_perolehan' => 'date',
        'rincian_tahunan' => 'array', // Otomatis decode JSON ke Array
        'harga_perolehan_awal' => 'decimal:2',
        'penambahan' => 'decimal:2',
        'pengurangan' => 'decimal:2',
        'total_harga_perolehan' => 'decimal:2',
        'tarif_penyusutan' => 'decimal:2',
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class);
    }
}