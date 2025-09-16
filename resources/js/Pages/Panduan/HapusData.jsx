import React from 'react';
import PanduanLayout from './PanduanLayout';
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/solid';

// Komponen Step tidak perlu diubah sama sekali
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

// Konten utama panduan dengan layout yang sudah ditingkatkan
function HapusDataContent() {
    return (
        <div className="bg-white dark:bg-slate-800 sm:rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Panduan Menghapus Data Inventaris
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Sistem ini menyediakan dua cara untuk menghapus data: satu per satu (biasa) atau beberapa data sekaligus (massal).
                </p>
                <hr className="my-6 border-slate-200 dark:border-slate-700" />

                {/* Bagian 1: Hapus Satu Data */}
                <section>
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
                        Bagian 1: Menghapus Satu Data (Cara Biasa)
                    </h2>
                    {/* --- PERUBAHAN UTAMA: Menambahkan garis pemisah antar step --- */}
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        <div className="pb-6"> {/* Step pertama hanya butuh padding-bottom */}
                            <Step number="1" title="Temukan Data yang Ingin Dihapus">
                                <p>Cari data inventaris pada tampilan tabel (untuk desktop) atau pada tampilan kartu (untuk mobile).</p>
                            </Step>
                        </div>
                        <div className="py-6">
                            <Step number="2" title="Klik Ikon Hapus">
                                <ul>
                                    <li><strong>Tampilan Tabel (Desktop):</strong> Klik ikon tong sampah <TrashIcon className="inline h-4 w-4 text-red-500 dark:text-red-400 text-base" /> di kolom <code className="font-mono text-green-500 dark:text-green-400 bg-slate-200 dark:bg-slate-700 px-1 rounded">Aksi</code>.</li>
                                    <li><strong>Tampilan Kartu (Mobile):</strong> Klik tombol teks <code className="font-mono  bg-slate-200 dark:bg-slate-700  text-red-500 dark:text-red-400 dark:bg-slreate-700 px-1 rounded">Hapus</code> di bagian bawah kartu.</li>
                                </ul>
                            </Step>
                        </div>
                        <div className="py-6">
                            <Step number="3" title="Lakukan Konfirmasi">
                                <p>Sebuah jendela konfirmasi akan muncul untuk mencegah kesalahan. Jendela ini akan menampilkan <strong>nama barang</strong> yang akan dihapus.</p>
                                <div className="mt-2 p-3 bg-green-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                    <strong>Penting:</strong> Selalu periksa nama barang di jendela ini untuk memastikan Anda menghapus data yang benar.
                                </div>
                            </Step>
                        </div>
                        <div className="pt-6"> {/* Step terakhir hanya butuh padding-top */}
                            <Step number="4" title="Selesaikan Penghapusan">
                                <p>Klik tombol <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded text-red-500 dark:text-red-400 text-base">Ya, Hapus</code> untuk menghapus data secara permanen. Jika Anda ragu, klik <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded text-red-500 dark:text-red-400 text-base">Batal</code>.</p>
                            </Step>
                        </div>
                    </div>
                </section>

                <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />

                {/* Bagian 2: Hapus Massal */}
                <section>
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
                        Bagian 2: Menghapus Banyak Data Sekaligus (Bulk Delete)
                    </h2>
                    {/* --- PERUBAHAN UTAMA: Menambahkan garis pemisah antar step --- */}
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        <div className="pb-6">
                            <Step number="1" title="Pilih Beberapa Data">
                                <p>Gunakan kotak centang (checkbox) di sebelah kiri setiap baris data untuk memilih semua barang yang ingin Anda hapus.</p>
                            </Step>
                        </div>
                        <div className="py-6">
                            <Step number="2" title="Gunakan Tombol Hapus Massal">
                                <p>Di bagian atas (di barisan tombol aksi), carilah tombol merah berlabel <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded text-red-500 dark:text-red-400 text-base">Hapus (x)</code>. Angka <strong>(x)</strong> akan menunjukkan jumlah data yang Anda pilih.</p>
                            </Step>
                        </div>
                        <div className="py-6">
                            <Step number="3" title="Lakukan Konfirmasi">
                                <p>Sebuah jendela konfirmasi akan muncul. Kali ini jendela akan menampilkan <strong>jumlah total data</strong> yang akan dihapus (contoh: "Apakah Anda yakin akan menghapus <strong>15 data</strong> yang dipilih?").</p>
                            </Step>
                        </div>
                        <div className="pt-6">
                            <Step number="4" title="Selesaikan Penghapusan Massal">
                                <p>Klik tombol <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded text-red-500 dark:text-red-400 text-base">Ya, Hapus</code> untuk menghapus semua data yang telah Anda pilih secara permanen.</p>
                            </Step>
                        </div>
                    </div>
                </section>

                <div className="mt-10 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-600">
                    <div className="flex items-start gap-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:red-400 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-red-800 dark:text-red-300">Peringatan Penting</h3>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                                Tindakan menghapus data bersifat <strong>PERMANEN</strong> dan <strong>TIDAK DAPAT DIBATALKAN</strong>. Pastikan Anda telah memeriksa kembali data yang akan dihapus sebelum melakukan konfirmasi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Bungkus konten dengan layout
export default function HapusData() {
    return (
        <PanduanLayout title="Panduan: Menghapus Data">
            <HapusDataContent />
        </PanduanLayout>
    );
}