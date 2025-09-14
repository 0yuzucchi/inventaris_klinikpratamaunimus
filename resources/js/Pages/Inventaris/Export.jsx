import React, { useState } from 'react';
import axios from 'axios';

export default function Export() {
    const [loading, setLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState('');

    const uploadPdf = async () => {
        setLoading(true);
        try {
            const fileName = `laporan-inventaris-${new Date().toISOString()}.pdf`;
            const response = await axios.post('/inventaris/get-presigned-url', { fileName });
            setFileUrl(response.data.fileUrl);
        } catch (error) {
            console.error(error);
            alert('Gagal generate/upload PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Export Inventaris ke PDF</h1>
            <button onClick={uploadPdf} disabled={loading}>
                {loading ? 'Proses...' : 'Generate & Upload PDF'}
            </button>

            {fileUrl && (
                <div>
                    <p>File berhasil dibuat:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
                </div>
            )}
        </div>
    );
}
