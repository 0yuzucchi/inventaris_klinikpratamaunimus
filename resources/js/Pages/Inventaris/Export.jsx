import React, { useState } from 'react';
import axios from 'axios';

const Export = () => {
    const [loading, setLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);

    const exportPdf = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/inventaris/get-pdf-upload-url', {
                tahun: '', // isi sesuai filter
                bulan: '',
                hari: '',
                tanggal_mulai: '',
                tanggal_selesai: ''
            });

            setFileUrl(response.data.fileUrl);
            alert('PDF berhasil dibuat dan di-upload ke Supabase!');
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat generate PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Export Laporan Inventaris</h1>
            <button
                onClick={exportPdf}
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? 'Membuat PDF...' : 'Buat PDF & Upload'}
            </button>

            {fileUrl && (
                <div className="mt-4">
                    <p>Link PDF: <a href={fileUrl} target="_blank" className="text-blue-700 underline">{fileUrl}</a></p>
                </div>
            )}
        </div>
    );
};

export default Export;
