import React from 'react';
import PanduanLayout from './PanduanLayout';
import { LightBulbIcon } from '@heroicons/react/24/solid';

// Komponen Step (dapat di-reuse dari file lain)
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

// Konten utama panduan
function CetakLaporanKeseluruhanContent() {
    return (
        <div className="bg-white dark:bg-slate-800 sm:rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Panduan Mencetak Laporan Keseluruhan
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Fitur ini digunakan untuk membuat dokumen PDF dari <strong>seluruh data inventaris</strong> tanpa filter apa pun. Sangat cocok untuk keperluan arsip atau laporan umum.
                </p>
                <hr className="my-6 border-slate-200 dark:border-slate-700" />

                <section>
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
                        Langkah-langkah Mencetak
                    </h2>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        <div className="pb-6">
                            <Step number="1" title="Buka Halaman Daftar Inventaris">
                                <p>Navigasi ke halaman utama di mana tabel berisi semua data inventaris ditampilkan.</p>
                            </Step>
                        </div>
                        <div className="py-6">
                            <Step number="2" title="Temukan Tombol 'Cetak Semua Laporan'">
                                <p>Cari tombol berwarna hijau (atau warna lain yang menonjol) dengan label seperti <strong>"Cetak Semua Laporan"</strong> atau ikon printer. Tombol ini biasanya berada di bagian atas tabel.</p>
                            </Step>
                        </div>
                        <div className="py-6">
                            <Step number="3" title="Klik Tombol Tersebut">
                                <p>Klik tombol "Cetak Semua Laporan" untuk memulai proses pembuatan PDF.</p>
                            </Step>
                        </div>
                        <div className="pt-6">
                            <Step number="4" title="Lihat dan Cetak PDF">
                                <p>Sebuah tab baru di browser Anda akan terbuka secara otomatis, menampilkan pratinjau dokumen PDF. Dari sini, Anda bisa langsung mencetak atau mengunduh file tersebut.</p>
                            </Step>
                        </div>
                    </div>
                </section>

                <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />

                <section>
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                        Fitur Utama dalam Dokumen PDF
                    </h2>
                    <div className="mt-4 space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-800/50 rounded-lg border border-green-200 dark:border-green-700">
                            <h3 className="font-bold text-green-800 dark:text-green-300">Struktur Profesional</h3>
                            <ul className="list-disc list-inside mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                                <li><strong>Kop Surat Resmi:</strong> Setiap halaman dilengkapi dengan logo, nama, dan alamat klinik.</li>
                                <li><strong>Judul Jelas:</strong> Judul laporan adalah "Laporan Inventaris" yang bersifat umum.</li>
                                <li><strong>Tabel Data Lengkap:</strong> Menampilkan semua kolom informasi, termasuk foto jika tersedia.</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-600">
                            <h3 className="font-semibold text-amber-800 dark:text-amber-300">Fitur Cerdas: Baris Total & Pindah Halaman</h3>
                            <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                                <strong>Baris Total Otomatis:</strong> Di akhir tabel, terdapat baris rekapitulasi yang menjumlahkan kolom 'Total', 'Pakai', dan 'Rusak' dari keseluruhan data.
                                <br />
                                <strong>Header Berulang:</strong> Jika data sangat banyak dan melebihi satu halaman, header tabel akan otomatis muncul kembali di setiap halaman baru untuk memudahkan pembacaan.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mt-10 bg-green-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <LightBulbIcon className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-green-800 dark:text-green-300">Tips & Trik</h3>
                            <ul className="list-disc list-inside mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                                <li><strong>Orientasi Kertas:</strong> Dokumen ini dioptimalkan untuk dicetak pada kertas ukuran <strong>A4</strong> dengan orientasi <strong>Landscape</strong>.</li>
                                <li><strong>Gunakan untuk Arsip:</strong> Fungsi ini adalah cara tercepat untuk mendapatkan salinan fisik atau digital dari seluruh database inventaris pada waktu tertentu.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Bungkus konten dengan layout
export default function PanduanCetakLaporanKeseluruhan() {
    return (
        <PanduanLayout title="Panduan: Cetak Laporan Keseluruhan">
            <CetakLaporanKeseluruhanContent />
        </PanduanLayout>
    );
}