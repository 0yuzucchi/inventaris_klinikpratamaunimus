<!DOCTYPE html>
<html lang="id">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Label - {{ $inventari->nama_barang }}</title>
    <style>
        @font-face {
            font-family: 'Montserrat';
            src: url("{{ storage_path('fonts/Montserrat-Regular.ttf') }}") format("truetype");
            font-weight: normal;
        }
        @font-face {
            font-family: 'Montserrat';
            src: url("{{ storage_path('fonts/Montserrat-Bold.ttf') }}") format("truetype");
            font-weight: bold;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; font-family: 'Montserrat', sans-serif; }
        
        .label-table { 
            width: 100%; 
            border-collapse: collapse; 
            page-break-inside: avoid !important; 
        }
        .label-table td { vertical-align: top; }

        /* --- BAGIAN HEADER --- */
        .logo-cell { 
            width: 25%; 
            border-right: 1px solid black; 
            border-bottom: 1.5px double black;
            text-align: center; 
            vertical-align: middle; 
            padding-bottom: 2;
        }
        .logo-cell img { 
            width: 25pt;
            height: auto;
            margin-top: 2pt; 
            margin-bottom: 2pt; 
        }
        .logo-cell p { 
            font-size: 5pt;
            font-weight: bold; 
            line-height: 1.2;
        }

        .info-cell { 
            width: 75%; 
            border-bottom: 1.5px double black;
            /* padding-top: 2pt; */
        }
        .info-cell .title { 
            font-size: 10pt;
            font-weight: bold; 
            text-align: center; 
            border-bottom: 1px solid black; 
            /* padding-bottom: 2pt;  */
            /* margin-bottom: 2pt;  */
        }
        
        .details-table { width: 100%; }
        .details-table td {
            padding-top: 2pt;
            /* padding-bottom: 3pt;
            padding-left: 2pt;  */
            font-size: 6pt;
            /* font-weight: bold; <-- Dihapus dari sini */
        }

        /* STYLING BARU UNTUK LABEL DAN DATA */
        .info-label {
            font-weight: bold; /* Membuat label menjadi tebal */
            vertical-align: middle; /* <-- INI PENAMBAHANNYA */
        }

        .info-data {
            font-weight: bold; /* <-- INI DIPERBAIKI (sebelumnya bold) */
            padding-left: 3pt;   /* Memberi sedikit spasi antara label dan data */
            font-size: 14px;
            vertical-align: middle; /* <-- INI PENAMBAHANNYA */
        }

        /* --- BAGIAN BODY --- */
        .body-cell { 
            padding: 3pt;
        }
        .body-content { 
            border: 1px solid black; 
            padding-bottom: 9pt; 
            padding-top: 1pt;
            padding-right:3pt ;
            padding-left:3pt ; 
            text-align: center; 
        }
        .body-content .kelompok { 
            font-size: 6pt;
            text-align: left; 
            margin-bottom: 4pt;
        }
        .body-content .nama-barang { 
            font-size: 12pt;
            font-weight: bold; 
            margin-bottom: 3pt; 
        }
        .body-content .spesifikasi { 
            font-size: 10pt;
            font-weight: bold; 
            padding-bottom: 4pt;
        }
    </style>
</head>
<body>

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
                                    <span class="info-label">NO. PENGADAAN :</span>
                                    <span class="info-data">{{ $inventari->nomor_pengadaan_lengkap }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="info-label">UNIT PENGGUNA :</span>
                                    <span class="info-data">{{ $inventari->tempat_pemakaian ?: '...' }}</span>
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
                        <p class="nama-barang">{{ $inventari->nama_barang }}</p>
                        <p class="spesifikasi">{{ $inventari->spesifikasi ?: '...' }}</p>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

</body>
</html>