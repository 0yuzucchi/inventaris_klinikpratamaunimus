// resources/js/Pages/Inventaris/Export.jsx
import React, { useState } from "react";
import jsPDF from "jspdf";

export default function Export() {
  // Contoh data inventaris (bisa nanti diganti dari props/inertia)
  const [inventaris] = useState([
    { nama_barang: "Laptop", kode: "LP001", kategori: "Elektronik", jumlah: 5 },
    { nama_barang: "Meja", kode: "MJ002", kategori: "Furniture", jumlah: 10 },
    { nama_barang: "Kursi", kode: "KS003", kategori: "Furniture", jumlah: 15 },
  ]);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Judul
    doc.setFontSize(16);
    doc.text("Laporan Inventaris", 10, 10);

    // Header tabel
    doc.setFontSize(12);
    let y = 20;
    doc.text("No", 10, y);
    doc.text("Nama Barang", 25, y);
    doc.text("Kode", 90, y);
    doc.text("Kategori", 120, y);
    doc.text("Jumlah", 160, y);

    y += 8;

    // Isi tabel
    inventaris.forEach((item, index) => {
      doc.text(String(index + 1), 10, y);
      doc.text(item.nama_barang || "-", 25, y);
      doc.text(item.kode || "-", 90, y);
      doc.text(item.kategori || "-", 120, y);
      doc.text(String(item.jumlah ?? 0), 160, y);

      y += 8;

      // Tambah halaman kalau penuh
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    // Simpan PDF
    doc.save("laporan-inventaris.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Export Laporan Inventaris</h1>
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download PDF
      </button>

      {/* Tabel preview sederhana */}
      <table className="mt-4 w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">No</th>
            <th className="border px-2 py-1">Nama Barang</th>
            <th className="border px-2 py-1">Kode</th>
            <th className="border px-2 py-1">Kategori</th>
            <th className="border px-2 py-1">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {inventaris.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{idx + 1}</td>
              <td className="border px-2 py-1">{item.nama_barang}</td>
              <td className="border px-2 py-1">{item.kode}</td>
              <td className="border px-2 py-1">{item.kategori}</td>
              <td className="border px-2 py-1">{item.jumlah}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
