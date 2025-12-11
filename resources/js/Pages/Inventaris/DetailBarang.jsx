import React, { useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { QRCodeSVG } from 'qrcode.react';
import {
    ArrowLeftIcon, PencilSquareIcon, PhotoIcon, CalendarDaysIcon, CurrencyDollarIcon,
    ArchiveBoxIcon, MapPinIcon, UserCircleIcon, QrCodeIcon, TagIcon,
    ClipboardDocumentIcon, ArrowDownTrayIcon
} from '@heroicons/react/24/solid';

// Helper (tidak ada perubahan)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);
};

// Komponen DetailItem dimodifikasi untuk readability yang lebih baik
const DetailItem = ({ icon, label, children, className = '' }) => (
    <div className={`py-4 flex items-start gap-4 ${className}`}>
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400">
            {React.createElement(icon, { className: "w-5 h-5" })}
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <div className="text-base font-semibold text-slate-800 dark:text-white mt-1">{children}</div>
        </div>
    </div>
);


export default function DetailBarang({ auth, inventari }) {
    const item = inventari;
    const qrCodeRef = useRef(null);

    // URL untuk QR Code (tidak ada perubahan fungsi)
    const qrCodeUrl = route('inventaris.show', item.id, { absolute: true });

    // Fungsi untuk mengunduh QR Code (tidak ada perubahan fungsi)
    const handleDownloadQR = () => {
        if (!qrCodeRef.current) return;
        const svgElement = qrCodeRef.current.querySelector('svg');
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `QR-${(item.kode_barang || 'KODE').toUpperCase()}-${item.nomor || 'NOMOR'}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={`Detail Inventaris`}
        >
            <Head title={`Detail - ${item.nama_barang}`} />

            {/* Konten utama dengan layout halaman penuh */}
            <div className="flex-1 w-full bg-white dark:bg-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    {/* Grid Utama (Desktop: 2 kolom, Mobile: 1 kolom) */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 min-h-full">

                        {/* === KOLOM KIRI: VISUAL (FOTO & QR) === */}
                        <aside className="lg:col-span-2 lg:border-r border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col items-center justify-center">
                            <div className="w-full max-w-sm mx-auto text-center space-y-8">
                                {/* Foto Barang */}
                                {item.foto ? (
                                    <img
                                        src={`/storage/${item.foto}`}
                                        alt={item.nama_barang}
                                        className="w-full h-64 object-cover rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500">
                                        <PhotoIcon className="w-24 h-24" />
                                    </div>
                                )}

                                {/* QR Code */}
                                <div className="w-full p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">Kode QR Aset</h3>
                                    <div ref={qrCodeRef} className="p-3 bg-white inline-block rounded-lg shadow-inner">
                                        <QRCodeSVG
                                            value={qrCodeUrl}
                                            size={160}
                                            bgColor={"#ffffff"}
                                            fgColor={"#000000"}
                                            level={"L"}
                                            includeMargin={false}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Pindai untuk melihat detail aset</p>
                                    <button onClick={handleDownloadQR} className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                        <ArrowDownTrayIcon className="w-4 h-4" />
                                        Unduh QR
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* === KOLOM KANAN: INFORMASI DETAIL === */}
                        <main className="lg:col-span-3 p-6 sm:p-8">
                            {/* Tombol Navigasi Atas */}
                            <div className="mb-6 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700">
                                <Link href={route('inventaris.index')} className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                                    <ArrowLeftIcon className="w-4 h-4" />
                                    Kembali ke Daftar
                                </Link>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <a href={route('inventaris.generateLabel', { inventari: item.id })} target="_blank" className="flex-1 sm:flex-initial justify-center inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 rounded-lg text-sm font-semibold text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                                        <QrCodeIcon className="w-4 h-4" />
                                        Cetak Label
                                    </a>
                                    <Link href={route('inventaris.edit', item.id)} className="flex-1 sm:flex-initial justify-center inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-transform hover:scale-105">
                                        <PencilSquareIcon className="w-4 h-4" />
                                        Edit Data
                                    </Link>
                                </div>
                            </div>

                            {/* Header Informasi */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {item.nama_barang.toUpperCase()}
                                </h1>
                                <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
                                    Nomor Inventaris: <span className="font-semibold text-slate-600 dark:text-slate-300">{item.nomor}</span>
                                </p>
                            </div>

                            {/* Daftar Detail Item yang Sudah Dipisah */}
                            <div className="flow-root">
                                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                    <DetailItem icon={CurrencyDollarIcon} label="Harga Perolehan">
                                        {formatCurrency(item.harga)}
                                    </DetailItem>

                                    <DetailItem icon={TagIcon} label="Kode Barang">
                                        {(item.kode_barang || 'N/A').toUpperCase()}
                                    </DetailItem>

                                    <DetailItem icon={ArchiveBoxIcon} label="Jumlah">
                                        <div className="flex flex-col sm:flex-row sm:gap-6">
                                            <span>Total: <span className="font-bold">{item.jumlah}</span></span>
                                            <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Dipakai: <span className='font-semibold'>{item.jumlah_dipakai}</span></span>
                                            <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Rusak: <span className='font-semibold'>{item.jumlah_rusak}</span></span>
                                        </div>
                                    </DetailItem>

                                    <DetailItem icon={MapPinIcon} label="Lokasi Penyimpanan">
                                        <p>{(item.tempat_pemakaian || 'N/A').toUpperCase()}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No. Ruang: {item.nomor_ruang || 'N/A'}</p>
                                    </DetailItem>

                                    <DetailItem icon={CalendarDaysIcon} label="Tanggal & Asal Perolehan">
                                        <p>{formatDate(item.tanggal_masuk)}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Asal: {(item.asal_perolehan || 'N/A').toUpperCase()}</p>
                                    </DetailItem>

                                    <DetailItem icon={UserCircleIcon} label="Diunggah Oleh">
                                        {item.nama_pengunggah || 'N/A'}
                                    </DetailItem>

                                    <DetailItem icon={ClipboardDocumentIcon} label="Spesifikasi">
                                        <p className="whitespace-pre-wrap leading-relaxed">{(item.spesifikasi || 'N/A')}</p>
                                    </DetailItem>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}