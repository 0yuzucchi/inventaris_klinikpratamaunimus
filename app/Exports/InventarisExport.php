<?php

namespace App\Exports;

use App\Models\Inventaris;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class InventarisExport implements FromCollection, WithHeadings, ShouldAutoSize, WithMapping, WithStyles, WithEvents, WithCustomStartCell
{
    private $no = 0;
    private $rows;

    public function collection()
    {
        if (is_null($this->rows)) {
            $this->rows = Inventaris::all();
        }
        return $this->rows;
    }

    public function headings(): array
    {
        return [
            'No.',
            'Foto',
            'Nomor Barang',
            'Nama Barang',
            'Kode Barang',
            'Spesifikasi',
            'Jenis Perawatan',
            'Jumlah Total',
            'Jumlah Pakai',
            'Jumlah Rusak',
            'Tempat Pemakaian',
            'Nomor Ruang',
            'Asal Perolehan',
            'Tanggal Masuk',
        ];
    }

    public function map($row): array
    {
        $this->no++;
        return [
            $this->no,
            '',
            $row->nomor,
            $row->nama_barang,
            $row->kode_barang,
            $row->spesifikasi,
            $row->jenis_perawatan,
            $row->jumlah,
            $row->jumlah_dipakai,
            $row->jumlah_rusak,
            $row->tempat_pemakaian,
            $row->nomor_ruang,
            $row->asal_perolehan,
            $row->tanggal_masuk,
        ];
    }

    public function startCell(): string
    {
        return 'A5';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();


                // 1. Menyisipkan Logo
                $drawing = new Drawing();
                $drawing->setName('Logo Klinik');
                $drawing->setDescription('Logo Klinik Pratama UNIMUS');

                // Ambil logo dari Supabase
                $logoUrl = env('SUPABASE_URL') . '/storage/v1/object/public/inventaris-fotos/logo_klinik.png';
                $tempLogoPath = sys_get_temp_dir() . '/logo_klinik.png';

                // Download ke file sementara
                file_put_contents($tempLogoPath, file_get_contents($logoUrl));

                // Gunakan path file sementara
                $drawing->setPath($tempLogoPath);
                $drawing->setHeight(75);       // Ukuran tetap sama
                $drawing->setCoordinates('A1'); // Posisi tetap sama
                $drawing->setWorksheet($sheet);


                // 2. Menggabungkan sel dan menambahkan teks kop surat
                $sheet->mergeCells('B1:N1');
                $sheet->setCellValue('B1', 'KLINIK PRATAMA UNIMUS');
                $sheet->getStyle('B1')->getFont()->setBold(true)->setSize(20);
                $sheet->getStyle('B1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('B1')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

                $sheet->mergeCells('B2:N2');
                $sheet->setCellValue('B2', 'Jl. Petek Kp. Gayam RT. 02 RW.06, Dadapsari, Semarang Utara, Semarang');
                $sheet->getStyle('B2')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('B2')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

                $sheet->mergeCells('B3:N3');
                $sheet->setCellValue('B3', 'Telp. 0895-6168-33383, e-mail: klinikpratamarawatinap@unimus.ac.id');
                $sheet->getStyle('B3')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('B3')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

                // 3. Menambahkan garis tebal di bawah kop surat
                $sheet->getStyle('A4:N4')->getBorders()->getBottom()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THICK);

                // 4. Mengatur tinggi baris untuk kop surat
                $sheet->getRowDimension('1')->setRowHeight(30);
                $sheet->getRowDimension('2')->setRowHeight(15);
                $sheet->getRowDimension('3')->setRowHeight(15);
            },
        ];
    }

    /**
     * @param Worksheet $sheet
     */
    public function styles(Worksheet $sheet)
    {
        // 1. Mendefinisikan baris awal dan range header tabel data
        $startRow = $this->startCell()[1];
        $headerRowRange = $startRow . ':' . $startRow;
        $headerCellsRange = 'A' . $startRow . ':N' . $startRow;

        // 2. Menghitung total baris dan menentukan range keseluruhan tabel data
        //    ==== PERBAIKAN DI BARIS INI ====
        //    Rumus diubah untuk memastikan baris terakhir selalu terhitung
        $totalRows = $this->collection()->count() + $startRow;
        $fullTableRange = 'A' . $startRow . ':N' . $totalRows;

        // 3. Memberi style BOLD ke seluruh baris header data
        $sheet->getStyle($headerRowRange)->getFont()->setBold(true);

        // 4. Memberi warna latar ke header data
        $sheet->getStyle($headerCellsRange)->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()->setARGB('DDEBF7');

        // 5. Menambahkan border ke seluruh tabel data
        $sheet->getStyle($fullTableRange)->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

        // 6. Mengatur alignment (rata tengah) untuk seluruh tabel data
        $sheet->getStyle($fullTableRange)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($fullTableRange)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
    }
}
