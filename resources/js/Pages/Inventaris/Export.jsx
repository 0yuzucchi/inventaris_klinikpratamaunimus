import React, { useState } from 'react';
import axios from 'axios';

export default function Export() {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleGeneratePdf = async () => {
    setLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      const fileName = `laporan-inventaris-${new Date()
        .toISOString()
        .replace(/[:.]/g, '-')}.pdf`;

      // Sesuaikan URL endpoint Laravel
      const response = await axios.post(
        'http://localhost:8001/inventaris/get-pdf-upload-url',
        { fileName }
      );

      // Ambil field sesuai return dari controller
      // Misal controller mengembalikan: { signedURL: '...' }
      setPdfUrl(response.data.signedURL || response.data.url);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Export Laporan Inventaris</h1>

      <button
        onClick={handleGeneratePdf}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Memproses...' : 'Generate PDF'}
      </button>

      {error && (
        <div className="mt-4 text-red-600 font-medium">
          Terjadi kesalahan: {error}
        </div>
      )}

      {pdfUrl && (
        <div className="mt-4">
          <p>PDF berhasil dibuat! Klik link di bawah untuk download:</p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
