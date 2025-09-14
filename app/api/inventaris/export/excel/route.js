// app/api/inventaris/export/excel/route.js (Next.js 13+ / App Router)
import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch'; // perlu jika ingin ambil image dari URL

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET() {
  try {
    // 1️⃣ Ambil data inventaris dari Supabase
    const { data, error } = await supabase.from('inventaris').select('*');
    if (error) throw error;

    // 2️⃣ Buat workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Inventaris');

    // 3️⃣ Tambahkan kop surat
    // Merge untuk teks header
    sheet.mergeCells('C1:H2');
    sheet.getCell('C1').value = 'KLINIK PRATAMA UNIMUS';
    sheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell('C1').font = { size: 16, bold: true };

    sheet.mergeCells('C3:H3');
    sheet.getCell('C3').value = 'Jl. Petek Kp. Gayam RT. 02 RW.06, Dadapsari, Semarang Utara, Semarang';
    sheet.getCell('C3').alignment = { horizontal: 'center' };
    sheet.getCell('C3').font = { size: 11 };

    sheet.mergeCells('C4:H4');
    sheet.getCell('C4').value = 'Telp. 0895-6168-33383, Email: klinikpratamarawatinap@unimus.ac.id';
    sheet.getCell('C4').alignment = { horizontal: 'center' };
    sheet.getCell('C4').font = { size: 11 };

    // 4️⃣ Tambahkan logo dari Supabase (jika ada)
    const logoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/inventaris-fotos/logo_klinik.png`;
    const logoRes = await fetch(logoUrl);
    if (logoRes.ok) {
      const logoBuffer = await logoRes.arrayBuffer();
      const imageId = workbook.addImage({
        buffer: Buffer.from(logoBuffer),
        extension: 'png',
      });
      sheet.addImage(imageId, 'A1:B4'); // menempelkan di cell A1-B4
    }

    // 5️⃣ Tambahkan header tabel inventaris
    const headerRow = [
      'No.',
      'Foto',
      'Nomor Barang',
      'Nama Barang (Kode)',
      'Spesifikasi',
      'Jenis Perawatan',
      'Jumlah (Total/Pakai/Rusak)',
      'Tempat (Ruang)',
      'Asal & Tgl Masuk'
    ];
    sheet.addRow([]);
    sheet.addRow(headerRow);
    const header = sheet.getRow(6);
    header.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCDCDC' } };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // 6️⃣ Tambahkan data inventaris
    data.forEach((item, index) => {
      sheet.addRow([
        index + 1,
        item.foto_url || 'Tidak Ada Gambar',
        item.nomor || 'N/A',
        item.nama_barang || '-',
        item.spesifikasi || '-',
        item.jenis_perawatan || '-',
        `Total: ${item.jumlah} / Dipakai: ${item.jumlah_dipakai} / Rusak: ${item.jumlah_rusak}`,
        `${item.tempat_pemakaian} (Ruang: ${item.nomor_ruang || 'N/A'})`,
        `${item.asal_perolehan} (${new Date(item.tanggal_masuk).toLocaleDateString('id-ID')})`
      ]);
    });

    // 7️⃣ Auto width
    sheet.columns.forEach((col) => {
      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) maxLength = cellLength;
      });
      col.width = maxLength + 5;
    });

    // 8️⃣ Generate buffer Excel
    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = `laporan-inventaris-${Date.now()}.xlsx`;

    // 9️⃣ Kirim langsung ke browser
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${fileName}`,
      },
    });

  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
