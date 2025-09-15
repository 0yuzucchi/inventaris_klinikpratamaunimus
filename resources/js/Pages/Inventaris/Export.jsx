import React from "react";
import jsPDF from "jspdf";

export default function Export({ inventaris }) {
    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("Laporan Inventaris", 10, 10);

        let y = 20;
        doc.setFontSize(10);
        doc.text("No", 10, y);
        doc.text("Nama Barang", 25, y);
        doc.text("Kode", 90, y);
        doc.text("Kategori", 120, y);
        doc.text("Jumlah", 160, y);

        y += 10;

        inventaris.forEach((item, index) => {
            doc.text(String(index + 1), 10, y);
            doc.text(item.nama_barang || "-", 25, y);
            doc.text(item.kode || "-", 90, y);
            doc.text(item.kategori || "-", 120, y);
            doc.text(String(item.jumlah ?? 0), 160, y);
            y += 10;

            if (y > 270) { // kalau halaman penuh
                doc.addPage();
                y = 20;
            }
        });

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
        </div>
    );
}
