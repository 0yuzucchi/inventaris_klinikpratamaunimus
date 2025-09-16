import React, { useState } from 'react';
import { 
    CheckBadgeIcon, // BARU: Ikon untuk fitur utama
    DocumentTextIcon, 
    ArrowDownTrayIcon 
} from '@heroicons/react/24/solid';
import PanduanLayout from './PanduanLayout';

// Komponen Step generik dengan warna hijau konsisten
const Step = ({ number, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white font-bold">
            {number}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
            <div className="mt-1 text-slate-600 dark:text-slate-400">
                {children}
            </div>
        </div>
    </div>
);


// --- KONTEN PANDUAN EKSPOR PDF (TERFILTER) ---

const PdfExportContent = () => (
    <>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Panduan Ekspor Laporan ke PDF (Terfilter)
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
            Gunakan fitur ini untuk membuat laporan inventaris yang spesifik dalam format PDF berdasarkan rentang tanggal, bulan, atau tahun tertentu.
        </p>
        <hr className="my-6 border-slate-200 dark:border-slate-700" />

        <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
                Langkah-langkah Ekspor PDF
            </h2>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <div className="pb-6"><Step number="1" title="Buka Halaman Daftar Inventaris"><p>Navigasi ke halaman utama yang menampilkan tabel inventaris.</p></Step></div>
                <div className="py-6"><Step number="2" title="Pilih Kriteria Filter Anda"><p>Gunakan opsi filter yang tersedia untuk menentukan data yang ingin Anda sertakan dalam laporan.</p><ul className="list-disc list-inside mt-2 pl-4 text-slate-600 dark:text-slate-400 space-y-1"><li><strong>Berdasarkan Rentang Tanggal:</strong> Pilih tanggal mulai dan tanggal selesai.</li><li><strong>Berdasarkan Waktu Spesifik:</strong> Pilih hanya hari, bulan, atau tahun.</li></ul></Step></div>
                <div className="py-6"><Step number="3" title="Klik Tombol 'Ekspor PDF'"><p>Setelah filter diatur, klik tombol <strong>"Ekspor PDF"</strong>. Proses pembuatan dan pengunduhan file akan dimulai.</p></Step></div>
                <div className="pt-6"><Step number="4" title="Simpan File PDF"><p>Browser Anda akan secara otomatis mengunduh file PDF. Periksa folder unduhan Anda untuk menemukan file laporan.</p></Step></div>
            </div>
        </section>

        <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />

        {/* --- PERUBAHAN UTAMA DI SINI --- */}
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Fitur Utama dalam Dokumen PDF</h2>
            <div className="mt-6 bg-green-50 dark:bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                    <CheckBadgeIcon className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-green-800 dark:text-green-300">Keunggulan Laporan PDF</h3>
                        <ul className="list-disc list-inside mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li><strong>Judul Dinamis:</strong> Judul pada dokumen akan otomatis menyesuaikan dengan filter yang Anda terapkan.</li>
                            <li><strong>Data Terfilter:</strong> Isi tabel hanya akan menampilkan data yang sesuai dengan kriteria filter Anda.</li>
                            <li><strong>Rekapitulasi Total:</strong> Di bagian bawah tabel, terdapat baris "Total Keseluruhan" yang menjumlahkan data secara otomatis.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </>
);

// --- KONTEN PANDUAN EKSPOR EXCEL (KESELURUHAN) ---

const ExcelExportContent = () => (
    <>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Panduan Ekspor Laporan ke Excel (Keseluruhan)
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
            Fitur ini digunakan untuk mengunduh <strong>seluruh data inventaris</strong> ke dalam satu file Excel, cocok untuk analisis data lebih lanjut atau keperluan arsip.
        </p>
        <hr className="my-6 border-slate-200 dark:border-slate-700" />
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
                Langkah-langkah Ekspor Excel
            </h2>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                 <div className="pb-6"><Step number="1" title="Buka Halaman Daftar Inventaris"><p>Navigasi ke halaman utama yang menampilkan tabel inventaris.</p></Step></div>
                <div className="py-6"><Step number="2" title="Abaikan Filter Tanggal"><p>Anda mungkin akan melihat beberapa pilihan filter tanggal di halaman. Untuk ekspor ke Excel, semua filter ini <strong>akan diabaikan</strong>.</p></Step></div>
                <div className="pt-6"><Step number="3" title="Klik Tombol 'Ekspor Excel'"><p>Klik tombol <strong>"Ekspor Excel"</strong>. Sistem akan langsung memproses dan mengunduh file berisi seluruh data.</p></Step></div>
            </div>
        </section>

        <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />
        
        {/* --- PERUBAHAN UTAMA DI SINI --- */}
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Fitur Utama dalam Dokumen Excel</h2>
             <div className="mt-6 bg-green-50 dark:bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                    <CheckBadgeIcon className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-green-800 dark:text-green-300">Keunggulan Laporan Excel</h3>
                        <ul className="list-disc list-inside mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li><strong>Data Lengkap (100%):</strong> File Excel akan selalu berisi semua data inventaris yang ada di database tanpa terkecuali.</li>
                            <li><strong>Data Terurut:</strong> Data di dalam file sudah diurutkan berdasarkan Nomor Barang secara ascending.</li>
                            <li><strong>Format Siap Olah:</strong> Disajikan dalam format tabel murni yang mudah untuk disortir, difilter, atau dianalisis lebih lanjut.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </>
);


// --- KOMPONEN UTAMA DENGAN TAB ---

const PanduanGabunganContent = () => {
    const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' atau 'excel'

    const tabStyles = {
        base: "flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-offset-0 rounded-t-lg",
        inactive: "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
        active: "border-green-500 text-green-600 dark:text-green-400 focus:ring-green-500", // Warna hijau konsisten
    };

    return (
        <div className="bg-white dark:bg-slate-800 sm:rounded-xl shadow-lg overflow-hidden">
            {/* Navigasi Tab */}
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-2 px-4" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('pdf')}
                        className={`${tabStyles.base} ${activeTab === 'pdf' ? tabStyles.active : tabStyles.inactive}`}
                    >
                        <DocumentTextIcon className="w-5 h-5" />
                        Panduan Ekspor PDF
                    </button>
                    <button
                        onClick={() => setActiveTab('excel')}
                        className={`${tabStyles.base} ${activeTab === 'excel' ? tabStyles.active : tabStyles.inactive}`}
                    >
                        <DocumentTextIcon className="w-5 h-5" />
                        Panduan Ekspor Excel
                    </button>
                </nav>
            </div>

            {/* Konten Tab */}
            <div className="p-6 sm:p-8">
                {activeTab === 'pdf' && <PdfExportContent />}
                {activeTab === 'excel' && <ExcelExportContent />}
            </div>
        </div>
    );
};

export default function PanduanEksporGabungan() {
    return (
        <PanduanLayout title="Panduan: Ekspor Laporan">
            <PanduanGabunganContent />
        </PanduanLayout>
    );
}