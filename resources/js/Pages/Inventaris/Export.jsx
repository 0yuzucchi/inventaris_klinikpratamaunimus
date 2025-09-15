import React from "react";
import { jsPDF } from "jspdf";

export default function Export() {
  const handleGeneratePdf = () => {
    const doc = new jsPDF();

    // Judul
    doc.setFontSize(16);
    doc.text("Laporan Inventaris", 10, 10);

    // Contoh data inventaris (bisa diganti fetch dari API lalu map)
    const data = [
      { nama: "Laptop", kategori: "Elektronik", jumlah: 5 },
      { nama: "Meja", kategori: "Furniture", jumlah: 10 },
      { nama: "Kursi", kategori: "Furniture", jumlah: 20 },
    ];

    // Header tabel
    doc.setFontSize(12);
    let y = 20;
    doc.text("Nama", 10, y);
    doc.text("Kategori", 70, y);
    doc.text("Jumlah", 140, y);

    // Data tabel
    y += 10;
    data.forEach((item) => {
      doc.text(item.nama, 10, y);
      doc.text(item.kategori, 70, y);
      doc.text(String(item.jumlah), 140, y);
      y += 10;
    });

    // Simpan ke file PDF
    doc.save("laporan-inventaris.pdf");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Export Inventaris</h1>
      <button
        onClick={handleGeneratePdf}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate PDF
      </button>
    </div>
  );
}
