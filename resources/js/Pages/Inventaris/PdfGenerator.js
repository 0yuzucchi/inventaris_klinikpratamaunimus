import jsPDF from "jspdf";

export async function PdfGenerator(inventaris = []) {
  // 1. Buat PDF
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 40;

  // 2. Header PDF (Klinik)
  doc.setFontSize(18);
  doc.text("KLINIK PRATAMA UNIMUS", pageWidth / 2, y, { align: "center" });
  y += 20;
  doc.setFontSize(12);
  doc.text("Jl. Petek Kp. Gayam RT. 02 RW.06, Semarang Utara, Semarang", pageWidth / 2, y, { align: "center" });
  y += 15;
  doc.text("Telp. 0895-6168-33383, Email: klinikpratamarawatinap@unimus.ac.id", pageWidth / 2, y, { align: "center" });
  y += 20;
  doc.setLineWidth(1);
  doc.line(40, y, pageWidth - 40, y);
  y += 30;

  doc.setFontSize(14);
  doc.text("Laporan Data Inventaris", pageWidth / 2, y, { align: "center" });
  y += 30;

  // 3. Tabel header
  const headers = [
    "No",
    "Nomor Barang",
    "Nama Barang (Kode)",
    "Spesifikasi",
    "Jenis Perawatan",
    "Jumlah (Total/Pakai/Rusak)",
    "Tempat (Ruang)",
    "Asal & Tgl Masuk",
  ];

  const colWidths = [30, 60, 120, 100, 80, 80, 80, 100];
  let x = 40;

  doc.setFontSize(10);
  headers.forEach((h, i) => {
    doc.rect(x, y, colWidths[i], 20);
    doc.text(h, x + 2, y + 14);
    x += colWidths[i];
  });

  y += 20;

  // 4. Tabel data
  inventaris.forEach((item, index) => {
    x = 40;
    const jumlahText = `Total: ${item.jumlah}\nDipakai: ${item.jumlah_dipakai}\nRusak: ${item.jumlah_rusak}`;
    const tgl = new Date(item.tanggal_masuk).toLocaleDateString("id-ID");

    const values = [
      index + 1,
      item.nomor || "N/A",
      `${item.nama_barang} (Kode: ${item.kode_barang || "N/A"})`,
      item.spesifikasi || "-",
      item.jenis_perawatan || "-",
      jumlahText,
      `${item.tempat_pemakaian} (Ruang: ${item.nomor_ruang || "N/A"})`,
      `${item.asal_perolehan} / ${tgl}`,
    ];

    values.forEach((v, i) => {
      doc.rect(x, y, colWidths[i], 40);
      doc.text(String(v), x + 2, y + 14);
      x += colWidths[i];
    });

    y += 40;

    // Tambahkan halaman baru jika lebih dari satu halaman
    if (y > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      y = 40;
    }
  });

  // 5. Convert PDF ke base64
  const pdfBase64 = doc.output("datauristring").split(",")[1]; // Hanya ambil base64

  return pdfBase64;
}
w