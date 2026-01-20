<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Casts\Attribute;


class Inventaris extends Model
{
    use HasFactory;

    protected $fillable = [
        // desain baru (utama)
        'nomor',
        'master_barang_id',
        'master_kategori_barang_id', // Pastikan ini ada di fillable
        'master_ruangan_id',
        'master_asal_perolehan_id',
        'master_jenis_perawatan_id',
        'uploaded_by',

        // data unit
        'jumlah',
        'jumlah_dipakai',
        'jumlah_rusak',
        'harga',
        'foto',
        'tanggal_masuk',
        'spesifikasi',
    ];

    protected $casts = [
        'tanggal_masuk' => 'date:Y-m-d',
    ];

    protected $appends = [
        'foto_url',
    'display_nama_barang',
    'display_nomor_barang',
    'display_kode_barang',
    'display_ruangan',
    'display_nomor_ruang',
    'display_asal',
    'display_jenis_perawatan',
    ];

    public function getFotoUrlAttribute()
    {
        return $this->foto ?: null;
    }

    // ================= RELASI BARU =================

    public function masterBarang()
    {
        return $this->belongsTo(MasterBarang::class, 'master_barang_id');
    }

    // Tambahkan relasi ke MasterKategoriBarang jika belum ada
    public function kategoriBarang()
    {
        return $this->belongsTo(MasterKategoriBarang::class, 'master_kategori_barang_id');
    }

    public function ruangan()
    {
        return $this->belongsTo(MasterRuangan::class, 'master_ruangan_id');
    }

    public function asalPerolehan()
    {
        return $this->belongsTo(MasterAsalPerolehan::class, 'master_asal_perolehan_id');
    }

    public function jenisPerawatan()
    {
        return $this->belongsTo(MasterJenisPerawatan::class, 'master_jenis_perawatan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // Accessors untuk Fallback Logic
    public function getDisplayNamaBarangAttribute()
    {
        // Akan selalu mengambil dari masterBarang jika ada
        return $this->masterBarang->nama_barang ?? ('N/A'); // Fallback ke nama_barang lama jika ada (untuk data lama)
    }

    public function getDisplayNomorBarangAttribute()
    {
        return $this->masterBarang?->nomor_barang ?? $this->nomor;
    }

    public function getDisplayRuanganAttribute()
    {
        return $this->ruangan?->nama_ruangan ?? $this->tempat_pemakaian;
    }

    public function getDisplayNomorRuangAttribute()
    {
        return $this->ruangan?->nomor_ruang ?? $this->nomor_ruang;
    }

    public function getDisplayAsalAttribute()
    {
        return $this->asalPerolehan?->nama;
    }

    public function getDisplayJenisPerawatanAttribute()
    {
        return $this->jenisPerawatan?->nama ?? $this->jenis_perawatan;
    }

    // Aksesor untuk mendapatkan nama kategori barang
    public function getDisplayKategoriBarangAttribute()
{
    if ($this->relationLoaded('kategoriBarang') && $this->kategoriBarang) {
        return $this->kategoriBarang->nama;
    }

    if (
        $this->relationLoaded('masterBarang') &&
        $this->masterBarang &&
        $this->masterBarang->relationLoaded('kategori') &&
        $this->masterBarang->kategori
    ) {
        return $this->masterBarang->kategori->nama;
    }

    return 'N/A';
}


    public function getDisplayKodeBarangAttribute()
{
    if ($this->masterBarang?->kategori?->nama) {
        return $this->masterBarang->kategori->nama;
    }

    if ($this->kategoriBarang?->nama) {
        return $this->kategoriBarang->nama;
    }

    return 'N/A';
}

    protected function nomorPengadaanLengkap(): Attribute
{
    return Attribute::make(
        get: function () {
            $parts = [];

            // 1. Nomor urut (leading zero)
            // if ($this->nomor !== null) {
            //     $parts[] = str_pad($this->nomor, 2, '0', STR_PAD_LEFT);
            // }
            // 1. Nomor barang (prioritas master_barang, fallback inventaris)
            $nomorBarang = $this->masterBarang?->nomor_barang;
            if ($nomorBarang !== null) {
                $parts[] = str_pad($nomorBarang, 2, '0', STR_PAD_LEFT);
            }

            // 2. Nama kategori dari relasi master_barang -> kategori
            $kategori = $this->masterBarang?->kategori?->nama;
            if ($kategori) {
                $parts[] = strtoupper($kategori);
            }

            // 3. Tanggal masuk
            if ($this->tanggal_masuk) {
                $parts[] = $this->tanggal_masuk->format('m.Y');
            }

            return $parts ? implode('.', $parts) : 'N/A';
        }
    );
}

}