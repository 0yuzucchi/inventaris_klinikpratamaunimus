import React from "react";
import jsPDF from "jspdf";

export default function Export({ inventaris }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Inventaris", 10, 10);
    doc.save("laporan-inventaris.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Export Laporan Inventaris</h1>
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Download PDF
      </button>
    </div>
  );
}
