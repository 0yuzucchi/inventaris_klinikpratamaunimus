import React, { useState } from 'react';
import axios from 'axios';

export default function Export() {
  const [loading, setLoading] = useState(false);

  const downloadPdf = async () => {
    try {
      setLoading(true);

      const response = await axios.post('/inventaris/get-pdf-upload-url', {
        // kirim filter tanggal kalau ada
        // tahun: '2025',
        // bulan: '09',
        // hari: '14',
        // tanggal_mulai: '2025-09-01',
        // tanggal_selesai: '2025-09-14'
      });

      const { fileName, pdfBase64 } = response.data;

      // Convert base64 ke Blob
      const linkSource = `data:application/pdf;base64,${pdfBase64}`;
      const downloadLink = document.createElement('a');
      const blob = await (await fetch(linkSource)).blob();
      const url = URL.createObjectURL(blob);

      downloadLink.href = url;
      downloadLink.download = fileName;
      downloadLink.click();

      // Bersihkan URL object
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Gagal download PDF:', error);
      alert('Gagal generate PDF. Cek console untuk detail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Export Laporan Inventaris</h1>
      <button
        onClick={downloadPdf}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Membuat PDF...' : 'Download PDF'}
      </button>
    </div>
  );
}
