import React from 'react';
import PanduanLayout from './PanduanLayout';
import { LightBulbIcon } from '@heroicons/react/24/solid';

// Komponen Step bernomor, sama persis dengan panduan lainnya
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

// Konten utama panduan yang sudah disesuaikan
function CetakLabelContent() {
    return (
        <div className="bg-white dark:bg-slate-800 sm:rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Panduan Mencetak Label Inventaris
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Fitur ini memungkinkan Anda untuk mencetak label untuk satu atau beberapa barang sekaligus ke dalam satu file PDF yang rapi dan siap cetak.
                </p>
                <hr className="my-6 border-slate-200 dark:border-slate-700" />

                {/* Bagian 1: Langkah-langkah Mencetak */}
                <section>
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
                        Bagian 1: Langkah-langkah Mencetak Label
                    </h2>
                    {/* PERUBAHAN: Menggunakan layout vertikal dengan pemisah antar langkah */}
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        <div className="pb-6">
                            <Step number="1" title="Buka Halaman Daftar Inventaris">
                                <p>Navigasi ke menu utama inventaris di mana seluruh daftar barang ditampilkan dalam tabel.</p>
                            </Step>
                        </div>
                        <div className="py-6">
                            <Step number="2" title="Pilih Barang yang Akan Dicetak">
                                <p>Gunakan kotak centang (checkbox) di kolom paling kiri pada tabel untuk memilih satu atau lebih barang yang labelnya ingin Anda cetak.</p>
                            </Step>
                        </div>
                        <div className="py-6">
                            <Step number="3" title="Perhatikan Tombol Cetak">
                                <p>Di bagian atas tabel, Anda akan melihat sebuah tombol biru berlabel <strong>"Cetak (x)"</strong>. Angka <strong>(x)</strong> akan otomatis bertambah sesuai jumlah barang yang Anda pilih.</p>
                                <div className="mt-2 p-3 bg-green-50 dark:bg-green-700/50 rounded-md text-sm text-green-700 dark:text-green-300">
                                    <strong>Contoh:</strong> Jika Anda memilih 5 barang, tombol akan menampilkan <code className="font-mono text-green-700 dark:text-green-300 bg-slate-200 dark:bg-slate-700 px-1 rounded">Cetak (5)</code>. Jika belum ada barang yang dipilih, tombol tidak bisa diklik.
                                </div>
                            </Step>
                        </div>
                        <div className="py-6">
                            <Step number="4" title="Klik Tombol 'Cetak'">
                                <p>Setelah Anda selesai memilih barang, klik tombol tersebut.</p>
                            </Step>
                        </div>
                        <div className="pt-6">
                            <Step number="5" title="Unduh atau Cetak PDF">
                                <p>Sebuah tab baru di browser Anda akan terbuka, menampilkan file PDF yang berisi semua label yang telah Anda pilih. Dari sana, Anda bisa langsung mengunduh atau mencetak file tersebut.</p>
                            </Step>
                        </div>
                    </div>
                </section>

                {/* PERUBAHAN: Menggunakan pemisah bagian yang tebal dan konsisten */}
                <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />

                {/* Bagian 2: Tampilan dan Fitur Label */}
                <section>
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                        Bagian 2: Memahami Tampilan & Fitur Label
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Setiap label dirancang dengan informasi yang padat dan jelas dalam ukuran <strong>8 x 4 cm</strong>.
                    </p>
                    {/* Struktur di bagian ini sudah baik, tidak perlu diubah menjadi 'Step' karena bersifat informatif */}
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-800/50 rounded-lg border border-green-200 dark:border-green-700">
                            <h3 className="font-bold text-green-800 dark:text-green-300">Anatomi Label</h3>
                            <ul className="mlist-disc list-inside mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                                <li><strong>Header Kiri:</strong> Berisi logo dan identitas Klinik Pratama Unimus.</li>
                                <li><strong>Header Kanan:</strong> Menampilkan Nomor Pengadaan dan Unit Pengguna.</li>
                                <li><strong>Badan Label:</strong> Menampilkan Nama Barang dan Spesifikasi utama.</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-600">
                            <h3 className="font-semibold text-amber-800 dark:text-amber-300">Fitur Cerdas: Ukuran Teks Otomatis (Auto Font-Size)</h3>
                            <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                                Teks yang terlalu panjang tidak akan terpotong, melainkan <strong>ukurannya akan dikecilkan secara proporsional</strong> agar tetap muat di dalam area yang tersedia, memastikan semua informasi tetap terbaca.
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
                                <li><strong>Gunakan Kertas F4:</strong> Layout PDF dioptimalkan untuk kertas stiker label ukuran F4 dengan orientasi <strong>Landscape</strong>.</li>
                                <li><strong>Lakukan Uji Coba:</strong> Sebelum mencetak pada kertas stiker, coba cetak satu halaman di kertas biasa untuk memastikan posisi dan ukuran sudah sesuai.</li>
                                <li><strong>Periksa Kembali Data:</strong> Pastikan data sudah benar sebelum mencetak dalam jumlah banyak untuk menghindari pemborosan kertas stiker.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Bungkus konten dengan layout
export default function CetakLabel() {
    return (
        <PanduanLayout title="Panduan: Cetak Label">
            <CetakLabelContent />
        </PanduanLayout>
    );
}