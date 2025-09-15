import React from "react";
import axios from "axios";

export default function Export() {
  const handleGeneratePdf = async () => {
    try {
      const res = await axios.post("/inventaris/generate-pdf-base64");

      const pdfBase64 = res.data.file;

      // Buat link download otomatis
      const link = document.createElement("a");
      link.href = pdfBase64;
      link.download = "laporan-inventaris.pdf";
      link.click();
    } catch (err) {
      console.error("Gagal generate PDF:", err);
    }
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
