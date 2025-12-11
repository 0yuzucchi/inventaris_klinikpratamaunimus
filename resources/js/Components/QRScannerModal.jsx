import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { XMarkIcon } from '@heroicons/react/24/solid';

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    useEffect(() => {
    if (isOpen && scannerRef.current) {
        if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);
        }
        const html5QrCode = html5QrCodeRef.current;

        // --- TAMBAHKAN LOG DI SINI ---
        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
            console.log('✅ [SCANNER] QR Code berhasil dipindai!');
            console.log('✅ [SCANNER] Data mentah:', decodedText);
            onScanSuccess(decodedText);
            handleClose();
        };

        const qrCodeErrorCallback = (errorMessage) => {
            // Error ini bisa diabaikan karena sering muncul saat kamera mencari QR code
            // console.warn(`[SCANNER] Pesan error (biasanya aman): ${errorMessage}`);
        };

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback)
            .catch(err => {
                // --- TAMBAHKAN LOG ERROR INI ---
                console.error("❌ [SCANNER] Gagal memulai scanner. Cek izin kamera.", err);
                alert("Gagal memulai kamera. Pastikan Anda memberikan izin akses kamera untuk situs ini.");
            });
    }

    return () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().catch(err => {
                console.error("❌ [SCANNER] Gagal menghentikan scanner.", err);
            });
        }
    };
}, [isOpen, onScanSuccess]);

    const handleClose = () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().catch(err => {
                console.error("Gagal menghentikan scanner saat menutup:", err);
            });
        }
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4" onClick={handleClose}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md transform transition-all p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white text-center mb-4">Arahkan Kamera ke Kode QR</h3>
                <div id="qr-reader" ref={scannerRef} className="w-full rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600"></div>
                <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-4">
                    Pemindaian akan otomatis mengarahkan Anda ke halaman detail barang.
                </p>
            </div>
        </div>
    );
};

export default QRScannerModal;