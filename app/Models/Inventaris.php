<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Casts\Attribute; // <-- PASTIKAN BARIS INI ADA

class Inventaris extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nomor',
        'nama_barang',
        'nama_pengunggah',
        'jumlah',
        'tempat_pemakaian',
        'nomor_ruang',
        'tanggal_masuk',
        'asal_perolehan',
        'kode_barang',
        'spesifikasi',
        'jumlah_dipakai',
        'jumlah_rusak',
        'harga',
        'foto',
        'jenis_perawatan',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_masuk' => 'date:Y-m-d',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
   
    public function getFotoUrlAttribute()
    {
        return $this->foto ?: null;
    }
    protected $appends = [
        'foto_url',
    ];


    protected function nomorPengadaanLengkap(): Attribute
    {
        return Attribute::make(
            get: function () {
                $parts = [];

                // 1. Ambil 'nomor' dan format dengan leading zero jika perlu
                if ($this->nomor) {
                    // ================================================================
                    //  PERUBAHAN UTAMA DI BARIS INI
                    // ================================================================
                    // Format 'nomor' agar memiliki minimal 2 digit.
                    // str_pad(nilai, panjang_target, karakter_padding, posisi_padding)
                    // Contoh: 1 -> "01", 9 -> "09", 10 -> "10", 123 -> "123"
                    $parts[] = str_pad($this->nomor, 2, '0', STR_PAD_LEFT);
                }

                // 2. Ambil 'kode_barang' dan ubah ke huruf besar
                if ($this->kode_barang) {
                    $parts[] = strtoupper($this->kode_barang);
                }

                // 3. Ambil dan format 'tanggal_masuk'
                if ($this->tanggal_masuk) {
                    $parts[] = $this->tanggal_masuk->format('m.Y');
                }

                $result = implode('.', $parts);

                return $result ?: 'N/A';
            }
        );
    }
}
