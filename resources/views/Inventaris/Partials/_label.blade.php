{{-- FILE INI DIMODIFIKASI --}}

@once
@php
    /**
     * Fungsi untuk menghitung ukuran font berdasarkan panjang teks.
     * Dideklarasikan hanya sekali untuk menghindari error.
     */
    function calculateFontSize($text, $defaultSize, $thresholds) {
        $length = mb_strlen($text, 'UTF-8');
        krsort($thresholds);

        foreach ($thresholds as $charCount => $fontSize) {
            if ($length > $charCount) {
                return $fontSize;
            }
        }
        
        return $defaultSize;
    }
@endphp
@endonce

@php
    // --- Logika untuk menghitung ukuran font untuk setiap label tetap di sini ---

    $nomorPengadaan = $inventari->nomor_pengadaan_lengkap;
    $fontSizeNomor = calculateFontSize($nomorPengadaan, 12, [35 => 8, 25 => 10]);

    $unitPengguna = $inventari->tempat_pemakaian ?: '...';
    $fontSizeUnit = calculateFontSize($unitPengguna, 12, [20 => 9, 15 => 10]);

    $namaBarang = $inventari->nama_barang;
    $fontSizeNama = calculateFontSize($namaBarang, 12, [45 => 8, 30 => 10]);

    $spesifikasi = $inventari->spesifikasi ?: '...';
    $fontSizeSpek = calculateFontSize($spesifikasi, 10, [50 => 7, 35 => 8]);
@endphp

<table class="label-table">
    <tbody>
        <!-- BARIS HEADER UTAMA -->
        <tr>
            <td class="logo-cell">
                <img src="{{ public_path('images/logoklinik.png') }}" alt="Logo">
                <p>INVENTARIS</p>
                <p>KLINIK PRATAMA</p>
                <p>UNIMUS</p>
            </td>
            <td class="info-cell">
                <div class="title">PENGADAAN BARANG</div>
                <table class="details-table">
                    <tbody>
                        <tr>
                            <td>
                                <span class="info-label">NO. PENGADAAN:</span>
                                <span class="info-data" style="font-size: {{ $fontSizeNomor }}pt;">{{ $nomorPengadaan }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="info-label">UNIT PENGGUNA:</span>
                                <span class="info-data" style="font-size: {{ $fontSizeUnit }}pt;">{{ $unitPengguna }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>

        <!-- BARIS BODY UTAMA -->
        <tr>
            <td class="body-cell" colspan="2">
                <div class="body-content">
                    <p class="kelompok">Kelompok Barang / Alat</p>
                    <p class="nama-barang" style="font-size: {{ $fontSizeNama }}pt;">{{ $namaBarang }}</p>
                    <p class="spesifikasi" style="font-size: {{ $fontSizeSpek }}pt;">{{ $spesifikasi }}</p>
                </div>
            </td>
        </tr>
    </tbody>
</table>