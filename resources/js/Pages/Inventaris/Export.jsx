import React, { useState } from 'react';
import axios from 'axios';

export default function InventarisExport() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    tahun: '',
    bulan: '',
    hari: '',
    tanggal_mulai: '',
    tanggal_selesai: ''
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const uploadPdf = async () => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // 1. Request pre-signed URL & PDF base64 dari backend
      const response = await axios.post('/inventaris/get-pdf-upload-url', filters);
      const { signedUrl, pdfBase64, fileName } = response.data;

      // 2. Convert base64 ke blob
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // 3. Upload langsung ke Supabase
      await fetch(signedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'application/pdf'
        }
      });

      setSuccessMsg(`PDF berhasil diupload: ${fileName}`);
    } catch (error) {
      console.error(error);
      setErrorMsg('Gagal generate/upload PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Export Laporan Inventaris</h2>

      {/* Filter Form */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          type="text"
          name="tahun"
          placeholder="Tahun (YYYY)"
          value={filters.tahun}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="bulan"
          placeholder="Bulan (MM)"
          value={filters.bulan}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="hari"
          placeholder="Hari (DD)"
          value={filters.hari}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="tanggal_mulai"
          placeholder="Tanggal Mulai"
          value={filters.tanggal_mulai}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="tanggal_selesai"
          placeholder="Tanggal Selesai"
          value={filters.tanggal_selesai}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />
      </div>

      {/* Buttons */}
      <button
        onClick={uploadPdf}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Mengunggah...' : 'Generate & Upload PDF'}
      </button>

      {/* Messages */}
      {successMsg && <p className="mt-4 text-green-600">{successMsg}</p>}
      {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
    </div>
  );
}
