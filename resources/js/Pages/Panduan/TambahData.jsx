import React from 'react';
import { LightBulbIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import PanduanLayout from './PanduanLayout';

// PERUBAHAN: Menggunakan komponen Step bernomor yang sama persis dengan HapusData.jsx
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

const TambahDataContent = () => (
    <div className="bg-white dark:bg-slate-800 sm:rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                Panduan Penggunaan Form Tambah Data
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
                Panduan ini menjelaskan langkah-langkah mengisi form tambah data inventaris secara mudah, sistematis, dan jelas.
            </p>
            {/* Menggunakan pemisah awal yang konsisten */}
            <hr className="my-6 border-slate-200 dark:border-slate-700" />

            {/* Bagian 1: Informasi Utama */}
            <section>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                    Bagian 1: Informasi Utama 
                    <span className="text-red-500 dark:text-red-400 text-base"> (Wajib Di isi)</span>
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Bagian ini berisi data inti yang harus diisi sebelum data bisa disimpan.
                </p>
                {/* PERUBAHAN UTAMA: Mengganti layout 'grid' dengan 'divide-y' vertikal */}
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    <div className="pb-6">
                        <Step number="1" title="Nama Barang">
                            <p>Ketik nama barang lengkap. Contoh: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">LAPTOP</code>.</p>
                            <p><strong>Fitur:</strong> Teks otomatis menjadi huruf kapital.</p>
                        </Step>
                    </div>
                    <div className="py-6">
                        <Step number="2" title="Kode Barang (Opsional)">
                            <p>Pilih dari daftar yang muncul atau ketik kode baru. (Sangat disarankan memilih dari daftar)</p>
                            <p><strong>Fitur:</strong> Teks otomatis menjadi huruf kapital.</p>
                        </Step>
                    </div>
                    <div className="py-6">
                        <Step number="3" title="Tempat Pemakaian & Nomor Ruang (Terhubung Otomatis)">
                            <p>Kedua kolom ini saling terkait untuk menjaga data tetap konsisten. Isi salah satu, maka yang lain akan terisi otomatis jika datanya sudah ada.</p>
                            <div className="mt-2 bg-green-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <ul className="list-disc list-inside mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                                    <li><b>Opsi A:</b> Pilih <b>Tempat Pemakaian</b>, maka <b>Nomor Ruang</b> akan terisi.</li>
                                    <li><b>Opsi B:</b> Pilih <b>Nomor Ruang</b>, maka <b>Tempat Pemakaian</b> akan terisi.</li>
                                    <li><b>Opsi C:</b> Untuk lokasi baru, ketik nama tempat, dan sistem akan menyarankan nomor ruang berikutnya.</li>
                                </ul>
                                <div className="mt-3 flex items-start gap-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                                    <ExclamationTriangleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold">Validasi Cerdas</h4>
                                        <p className="text-sm">Sistem akan mencegah Anda menyimpan data jika ada konflik.</p>
                                    </div>
                                </div>
                            </div>
                        </Step>
                    </div>
                    <div className="py-6">
                        <Step number="4" title="Asal Perolehan">
                            <p>Tulis sumber perolehan barang. Contoh: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">KLINIK</code>.</p>
                            <p><strong>Fitur:</strong> Teks otomatis menjadi huruf kapital.</p>
                        </Step>
                    </div>
                    <div className="py-6">
                        <Step number="5" title="Tanggal Masuk">
                            <p>Klik ikon kalender untuk memilih tanggal.</p>
                            <p><strong>Fitur:</strong> Otomatis terisi tanggal hari ini.</p>
                        </Step>
                    </div>
                    <div className="pt-6">
                        <Step number="6" title="Jumlah Total">
                            <p>Masukkan jumlah total unit barang. Angka ini akan menjadi batas untuk jumlah dipakai dan rusak.</p>
                        </Step>
                    </div>
                </div>
            </section>

            {/* Menggunakan pemisah bagian yang tebal */}
            <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />

            {/* Bagian 2: Informasi Tambahan */}
            <section>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                    Bagian 2: Informasi Tambahan <span className="text-slate-500 dark:text-slate-400 text-base">(Opsional)</span>
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Tidak wajib, tapi sangat disarankan untuk melengkapi data.
                </p>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    <div className="pb-6">
                        <Step number="1" title="Foto Barang">
                            <p>Klik tombol <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">Pilih File</code> untuk mengunggah gambar. Pratinjau akan langsung muncul.</p>
                        </Step>
                    </div>
                    <div className="py-6">
                        <Step number="2" title="Spesifikasi">
                            <p>Tulis detail teknis barang. Contoh: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">HITAM/LENOVO</code>.</p>
                            <p><strong>Fitur:</strong> Teks otomatis menjadi huruf kapital.</p>
                        </Step>
                    </div>
                    <div className="py-6">
                        <Step number="3" title="Jumlah Dipakai & Rusak">
                            <p>Masukkan jumlah barang sesuai kondisinya.</p>
                            <p><strong>Fitur:</strong> Total (dipakai + rusak) tidak akan bisa melebihi <strong>Jumlah Total</strong>.</p>
                        </Step>
                    </div>
                    <div className="pt-6">
                        <Step number="4" title="Harga Satuan">
                            <p>Masukkan harga dalam angka (misal: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">1500000</code>).</p>
                            <p><strong>Fitur:</strong> Angka akan otomatis diformat menjadi <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">1.500.000</code>.</p>
                        </Step>
                    </div>
                </div>
            </section>

            {/* Menggunakan pemisah bagian yang tebal */}
            <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />

            {/* Bagian 3: Menyimpan Data */}
            <section>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Bagian 3: Menyimpan Data</h2>
                <ol className="list-decimal list-inside mt-4 space-y-2 text-slate-600 dark:text-slate-400">
                    <li><b>Periksa Kembali:</b> Pastikan semua kolom wajib terisi dan tidak ada pesan error berwarna merah.</li>
                    <li><b>Klik "Simpan Data":</b> Tombol akan berubah menjadi "Menyimpan..." dan tidak bisa diklik selama proses.</li>
                    <li><b>Gunakan "Batal":</b> Untuk kembali ke halaman daftar tanpa menyimpan perubahan.</li>
                </ol>
            </section>

            <div className="mt-10 bg-green-50 dark:bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                    <LightBulbIcon className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-green-800 dark:text-green-300">Tips & Trik</h3>
                        <ul className="list-disc list-inside mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>Isi formulir dari atas ke bawah agar lebih cepat dan terstruktur.</li>
                            <li>Manfaatkan fitur dropdown dan pilihan otomatis untuk konsistensi data.</li>
                            <li>Selalu perhatikan pesan error, karena data tidak bisa disimpan jika masih ada kesalahan.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function TambahData() {
    return (
        <PanduanLayout title="Panduan: Tambah Data">
            <TambahDataContent />
        </PanduanLayout>
    );
}