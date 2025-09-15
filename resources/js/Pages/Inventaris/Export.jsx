// resources/js/Pages/Inventaris/Export.jsx
import React from "react";
import jsPDF from "jspdf";

export default function Export() {
  // contoh data inventaris (dummy)
  const inventaris = [
    { nama_barang: "Meja", kode: "BRG001", kategori: "Furnitur", jumlah: 5 },
    { nama_barang: "Kursi", kode: "BRG002", kategori: "Furnitur", jumlah: 10 },
    { nama_barang: "Laptop", kode: "BRG003", kategori: "Elektronik", jumlah: 3 },
  ];

  const generatePDF = () => {
    const doc = new jsPDF();

    // Judul
    doc.setFontSize(14);
    doc.text("Laporan Inventaris", 10, 10);

    // Header kolom
    let y = 20;
    doc.setFontSize(10);
    doc.text("No", 10, y);
    doc.text("Nama Barang", 25, y);
    doc.text("Kode", 90, y);
    doc.text("Kategori", 120, y);
    doc.text("Jumlah", 160, y);

    // Isi tabel
    y += 10;
    inventaris.forEach((item, index) => {
      doc.text(String(index + 1), 10, y);
      doc.text(item.nama_barang || "-", 25, y);
      doc.text(item.kode || "-", 90, y);
      doc.text(item.kategori || "-", 120, y);
      doc.text(String(item.jumlah ?? 0), 160, y);

      y += 10;

      // Kalau halaman penuh, bikin halaman baru
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Simpan ke file PDF
    doc.save("laporan-inventaris.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Halaman Export Inventaris</h1>
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  );
}
