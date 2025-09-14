<!DOCTYPE html>
<html lang="id">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>LAPORAN DATA INVENTARIS</title>
    <style>
        /* Styling dasar untuk PDF */
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 9px;
            /* Ukuran font diperkecil agar semua kolom muat */
            color: #333;
        }

        /* --- STYLING UNTUK KOP SURAT --- */
        .header-table {
            width: 100%;
            border: none;
            /* Menghapus border untuk tabel header */
        }

        .header-table td {
            border: none;
            padding: 0;
            vertical-align: middle;
        }

        .logo-cell {
            width: 15%;
            text-align: center;
        }

        .logo-cell img {
            width: 75px;
            /* Sesuaikan ukuran logo jika perlu */
            height: auto;
        }

        .text-cell {
            width: 85%;
            text-align: center;
        }

        .clinic-name {
            font-size: 20px;
            font-weight: bold;
            margin: 0;
        }

        .clinic-address {
            font-size: 11px;
            margin: 4px 0 0 0;
        }

        .header-line {
            border-top: 3px solid #000;
            border-bottom: 1px solid #000;
            height: 2px;
            margin-top: 8px;
            margin-bottom: 30px;
            /* Jarak antara kop dan judul laporan */
        }

        /* --- AKHIR STYLING KOP SURAT --- */

        .report-title {
            text-align: center;
            margin-bottom: 20px;
            font-size: 16px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #777;
            padding: 5px;
            text-align: left;
            vertical-align: top;
            /* Jaga perataan atas untuk sel dengan banyak baris */
        }

        th,
        tfoot td {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        th {
            text-align: center;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .foto-container {
            width: 60px;
            height: 60px;
            text-align: center;
        }

        /* Ukuran untuk foto */
        .foto-container img {
            max-width: 100%;
            max-height: 100%;
        }
    </style>

    {{-- Script ini hanya akan ditambahkan ke HTML jika rute yang diakses adalah 'inventaris.print' --}}
    @if (request()->routeIs('inventaris.print'))
        <script>
            window.onload = function() {
                window.print();
            }
        </script>
    @endif
</head>

<body>

    {{-- ========== KOP SURAT KLINIK ========== --}}
    <table class="header-table">
        <tr>
            <td class="logo-cell">
                @php
                    $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
                    $bucket = 'inventaris-fotos';
                    $logoPath = 'logo_klinik.png'; // nama file logo di bucket Supabase
                @endphp

                <img src="{{ $logoBase64 }}" alt="Logo Klinik" style="width:75px; height:auto;">

            </td>

            <td class="text-cell">
                <h2 class="clinic-name">KLINIK PRATAMA UNIMUS</h2>
                <p class="clinic-address">Jl. Petek Kp. Gayam RT. 02 RW.06, Dadapsari, Semarang Utara, Semarang</p>
                <p class="clinic-address">Telp. 0895-6168-33383, e-mail: klinikpratamarawatinap@unimus.ac.id</p>
            </td>
        </tr>
    </table>
    <div class="header-line"></div>
    {{-- ========== AKHIR KOP SURAT ========== --}}


    <h1 class="report-title">Laporan Data Inventaris</h1>

    {{-- Inisialisasi variabel untuk menghitung total --}}
    @php
        $totalBarang = 0;
        // $grandTotalHarga = 0; // DI-COMMENT: Total harga tidak lagi dihitung
    @endphp

    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Foto</th>
                <th>Nomor Barang</th>
                <th>Nama Barang (Kode)</th>
                <th>Spesifikasi</th>
                <th>Jenis Perawatan</th>
                <th>Jumlah (Total/Pakai/Rusak)</th>
                <th>Tempat (Ruang)</th>
                <th>Asal & Tgl Masuk</th>
                {{-- DI-COMMENT: Menghilangkan kolom harga dari header --}}
                {{-- <th>Harga Satuan</th> --}}
                {{-- <th>Total Harga</th> --}}
            </tr>
        </thead>
        <tbody>
            @forelse ($inventaris->sortBy('nomor') as $item)
                <tr>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td class="text-center foto-container">
                        @if ($item->foto_url)
                            @if (request()->routeIs('inventaris.exportPDF'))
                                <img src="{{ $item->foto_url }}" alt="{{ $item->nama_barang }}">
                            @else
                                <img src="{{ $item->foto_url }}" alt="{{ $item->nama_barang }}">
                            @endif
                        @else
                            <span>Tidak Ada Gambar</span>
                        @endif
                    </td>

                    <td class="text-center">{{ $item->nomor ?: 'N/A' }}</td>
                    <td>
                        <b>{{ $item->nama_barang }}</b><br>
                        <small>Kode: {{ $item->kode_barang ?: 'N/A' }}</small>
                    </td>
                    <td>{{ $item->spesifikasi ?: '-' }}</td>
                    <td>{{ $item->jenis_perawatan ?: '-' }}</td>
                    <td>
                        Total: {{ $item->jumlah }}<br>
                        Dipakai: {{ $item->jumlah_dipakai }}<br>
                        Rusak: {{ $item->jumlah_rusak }}
                    </td>
                    <td>
                        {{ $item->tempat_pemakaian }}<br>
                        <small>Ruang: {{ $item->nomor_ruang ?: 'N/A' }}</small>
                    </td>
                    <td>
                        {{ $item->asal_perolehan }}<br>
                        <small>{{ \Carbon\Carbon::parse($item->tanggal_masuk)->isoFormat('D MMMM YYYY') }}</small>
                    </td>
                    {{-- DI-COMMENT: Menghilangkan kolom harga dari baris data --}}
                    {{-- <td class="text-right">Rp {{ number_format($item->harga ?: 0, 0, ',', '.') }}</td> --}}
                    {{-- <td class="text-right">Rp {{ number_format(($item->harga ?: 0) * ($item->jumlah ?: 0), 0, ',', '.') }}</td> --}}
                </tr>

                {{-- Akumulasi nilai untuk total di setiap perulangan --}}
                @php
                    $totalBarang += $item->jumlah ?: 0;
                    // $grandTotalHarga += ($item->harga ?: 0) * ($item->jumlah ?: 0); // DI-COMMENT: Akumulasi harga tidak lagi dilakukan
                @endphp
            @empty
                <tr>
                    {{-- PENYESUAIAN: Colspan diubah dari 11 menjadi 9 --}}
                    <td colspan="9" class="text-center">Tidak ada data yang tersedia.</td>
                </tr>
            @endforelse
        </tbody>
        {{-- Menambahkan footer tabel untuk menampilkan total keseluruhan --}}
        <tfoot>
            <tr>
                {{-- PENYESUAIAN: Colspan disesuaikan dengan jumlah kolom yang baru --}}
                <td colspan="6" class="text-right"><strong>TOTAL KESELURUHAN</strong></td>
                <td class="text-center"><strong>{{ $totalBarang }} Unit</strong></td>
                {{-- Kolom sisa dikosongkan --}}
                <td colspan="2"></td>
            </tr>
        </tfoot>
    </table>

</body>

</html>
