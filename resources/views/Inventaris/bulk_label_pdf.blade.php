    {{-- resources/views/inventaris/bulk_label_pdf.blade.php --}}
    <!DOCTYPE html>
    <html lang="id">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Cetak Massal Label Barang</title>
        <style>
            /* --- FONT DEFINITION --- */
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

            @page {
                size: 8.5in 13in landscape;
                /* F4 ukuran inch */
                /* F4 portrait */
                margin: 0;
                /* biar layout nggak kegeser */
            }

            /* --- GLOBAL & GRID STYLES --- */
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            html,
            body {
                width: 100%;
                height: 100%;
                font-family: 'Montserrat', sans-serif;
                /* Margin halaman untuk area cetak */
            }

            .grid-container {
                width: 100%;
                /* border-collapse: collapse; */
                table-layout: fixed;
                /* Memastikan lebar kolom sama */
                padding: 6pt;
                margin-left: auto;
                margin-right: auto;
                /* center table di halaman */

            }

            .grid-cell {
                padding: 0pt;
                vertical-align: top;
                width: 8cm;
                height: 4cm;
                margin-top: 2pt;
            }

            /*
            * ===================================================================
            *  STYLES FOR A SINGLE LABEL (DIIMPOR DARI CONTOH LABEL TUNGGAL ANDA)
            * ===================================================================
            */
            .label-table {
                width: 8cm;
                /* pas 8 cm */
                height: 4cm;
                /* pas 4 cm */
                border-collapse: collapse;
                border: 1px solid black;
                /* Beri border luar pada setiap label */
                page-break-inside: avoid !important;
            }

            .label-table td {
                vertical-align: top;
            }

            /* --- BAGIAN HEADER --- */
            .logo-cell {
                width: 25%;
                border-right: 1px solid black;
                border-bottom: 1.5px double black;
                text-align: center;
                vertical-align: middle;
                padding-bottom: 2pt;
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
            }

            .info-cell .title {
                font-size: 10pt;
                font-weight: bold;
                text-align: center;
                border-bottom: 1px solid black;
                padding: 1pt 0;
            }

            .details-table {
                width: 100%;
            }

            .details-table td {
                font-size: 6pt;
                vertical-align: middle;
            }

            /* STYLING UNTUK LABEL DAN DATA */
            .info-label {
                font-weight: bold;
                /* Label tebal */
                vertical-align: middle;
            }

            .info-data {
                font-weight: bold;
                padding-left: 3pt;
                /* Ukuran font diperbesar agar lebih jelas */
                font-size: 12pt;
                vertical-align: middle;

            }

            /* --- BAGIAN BODY --- */
            .body-cell {
                padding: 3pt;
            }

            .body-content {
                border: 1px solid black;
                padding: 1pt 3pt 9pt 3pt;
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

        <table class="grid-container">
            {{-- Loop dan pecah data menjadi beberapa baris, masing-masing berisi 4 item (label) --}}
            @foreach ($inventaris_list->chunk(4) as $row)
                <tr>
                    @foreach ($row as $inventari)
                        <td class="grid-cell">
                            {{-- Panggil partial view untuk setiap label --}}
                            @include('inventaris.partials._label', ['inventari' => $inventari])
                        </td>
                    @endforeach

                    {{-- Jika baris terakhir tidak penuh (kurang dari 4 item), tambahkan sel kosong --}}
                    @if ($row->count() < 4)
                        @for ($i = 0; $i < 4 - $row->count(); $i++)
                            <td class="grid-cell" style="border: none;"></td>
                        @endfor
                    @endif
                </tr>
            @endforeach
        </table>

    </body>

    </html>