import React, { useState } from 'react';
import { 
    LightBulbIcon, 
    ExclamationTriangleIcon, 
    ChevronDoubleDownIcon,
    PencilSquareIcon, // Icon untuk tab Edit Satuan
    QueueListIcon     // Icon untuk tab Edit Massal
} from '@heroicons/react/24/solid';
import PanduanLayout from './PanduanLayout';

// Step untuk Panduan Edit Satuan (warna hijau)
const StepEdit = ({ number, title, children }) => (
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

// Step untuk Panduan Edit Massal (warna biru langit)
const StepBulk = ({ number, title, children }) => (
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


// --- KONTEN PANDUAN EDIT SATUAN (DIPERBARUI SESUAI PERMINTAAN) ---

const EditDataContent = () => (
    <>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Panduan Penggunaan Form Edit Data
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
            Panduan ini menjelaskan langkah-langkah mengubah data inventaris yang sudah ada secara mudah, aman, dan sistematis.
        </p>
        <hr className="my-6 border-slate-200 dark:border-slate-700" />

        {/* Bagian 1: Informasi Utama */}
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                Bagian 1: Mengubah Informasi Utama <span className="text-red-500 dark:text-red-400 text-base">(Wajib Diisi)</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
                Bagian ini berisi data inti yang sudah terisi sebelumnya. Anda dapat mengubahnya sesuai kebutuhan.
            </p>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <div className="pb-6">
                    <StepEdit number="1" title="Nama Barang">
                        <p>Ubah nama barang jika diperlukan. Contoh: dari <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">PRINTER</code> menjadi <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">PRINTER WARNA</code>.</p>
                        <p><strong>Fitur:</strong> Teks otomatis menjadi huruf kapital.</p>
                    </StepEdit>
                </div>
                <div className="py-6">
                    <StepEdit number="2" title="Kode Barang (Opsional)">
                        <p>Anda dapat mengubah kode barang. Sangat disarankan untuk tetap memilih dari daftar yang ada untuk menjaga konsistensi.</p>
                        <p><strong>Fitur:</strong> Teks otomatis menjadi huruf kapital.</p>
                    </StepEdit>
                </div>
                <div className="py-6">
                    <StepEdit number="3" title="Tempat Pemakaian & Nomor Ruang (Terhubung Otomatis)">
                        <p>Sama seperti saat menambah data, kedua kolom ini tetap saling terhubung. Mengubah salah satu akan otomatis menyesuaikan yang lain.</p>
                         <div className="mt-2 bg-green-50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <ul className="list-disc list-inside mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                                <li><b>Mengubah Lokasi:</b> Pilih <b>Tempat Pemakaian</b> baru, maka <b>Nomor Ruang</b> akan ikut berubah (dan sebaliknya).</li>
                                <li><b>Lokasi Baru:</b> Jika lokasi belum ada, ketik nama tempat pemakaian baru.</li>
                            </ul>
                            <div className="mt-3 flex items-start gap-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                                <ExclamationTriangleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold">Validasi Cerdas</h4>
                                    <p className="text-sm">Sistem akan mencegah Anda menyimpan data jika ada konflik lokasi.</p>
                                </div>
                            </div>
                        </div>
                    </StepEdit>
                </div>
                <div className="py-6">
                    <StepEdit number="4" title="Asal Perolehan">
                        <p>Ubah sumber perolehan barang jika ada kesalahan atau perubahan. Contoh: dari <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">UNIVERSITAS MUHAMMADIYAH SEMARANG</code> menjadi <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">KLINIK</code>.</p>
                    </StepEdit>
                </div>
                <div className="py-6">
                    <StepEdit number="5" title="Tanggal Masuk">
                        <p>Data tanggal masuk awal akan ditampilkan. Klik ikon kalender untuk memilih tanggal baru jika diperlukan.</p>
                    </StepEdit>
                </div>
                <div className="pt-6">
                    <StepEdit number="6" title="Jumlah Total">
                        <p>Ubah jumlah total unit. Angka ini harus selalu lebih besar atau sama dengan jumlah dipakai + rusak.</p>
                    </StepEdit>
                </div>
            </div>
        </section>

        <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />

        {/* Bagian 2: Informasi Tambahan */}
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                Bagian 2: Mengubah Informasi Tambahan <span className="text-slate-500 dark:text-slate-400 text-base">(Opsional)</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
                Bagian ini bersifat opsional, namun penting untuk menjaga kelengkapan data.
            </p>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <div className="pb-6">
                    <StepEdit number="1" title="Foto Barang">
                        <p>Ganti foto barang dengan mengklik tombol <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">Pilih File</code>. Foto lama akan digantikan dengan yang baru.</p>
                    </StepEdit>
                </div>
                <div className="py-6">
                    <StepEdit number="2" title="Spesifikasi">
                        <p>Perbarui detail teknis barang jika diperlukan. Contoh: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">PUTIH/EPSON L3110</code>.</p>
                        <p><strong>Fitur:</strong> Teks otomatis menjadi huruf kapital.</p>
                    </StepEdit>
                </div>
                <div className="py-6">
                    <StepEdit number="3" title="Jumlah Dipakai & Rusak">
                        <p>Sesuaikan jumlah barang sesuai kondisi terbarunya.</p>
                        <p><strong>Fitur:</strong> Total dari kedua kolom ini tidak akan bisa melebihi <strong>Jumlah Total</strong>.</p>
                    </StepEdit>
                </div>
                <div className="pt-6">
                    <StepEdit number="4" title="Harga Satuan">
                        <p>Ubah harga satuan jika ada pembaruan atau koreksi.</p>
                        <p><strong>Fitur:</strong> Format pemisah ribuan seperti <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">1.500.000</code>.</p>
                    </StepEdit>
                </div>
            </div>
        </section>

        <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />

        {/* Bagian 3: Menyimpan Perubahan */}
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Bagian 3: Menyimpan Perubahan</h2>
            <ol className="list-decimal list-inside mt-4 space-y-2 text-slate-600 dark:text-slate-400">
                <li><b>Periksa Kembali:</b> Pastikan semua perubahan sudah benar dan tidak ada pesan error berwarna merah.</li>
                <li><b>Klik "Update Data":</b> Tombol akan berubah menjadi "Menyimpan..." dan tidak bisa diklik selama proses.</li>
                <li><b>Gunakan "Batal":</b> Untuk kembali ke halaman inventaris tanpa menyimpan perubahan.</li>
            </ol>
        </section>

        <div className="mt-10 bg-green-50 dark:bg-slate-700/50 p-4 rounded-l">
            <div className="flex items-start gap-3">
                <LightBulbIcon className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-green-800 dark:text-green-300">Tips & Trik</h3>
                    <ul className="list-disc list-inside mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                        <li>Periksa kembali data yang ada sebelum melakukan perubahan untuk menghindari kesalahan.</li>
                        <li>Manfaatkan fitur dropdown untuk menjaga konsistensi data saat mengubah lokasi atau kode.</li>
                        <li>Pastikan jumlah total, dipakai, dan rusak tetap logis setelah Anda melakukan perubahan.</li>
                    </ul>
                </div>
            </div>
        </div>
    </>
);

// --- KONTEN PANDUAN EDIT MASSAL (TETAP SAMA) ---

const BulkEditPanduanContent = () => (
    <>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Panduan Penggunaan Form Edit Massal
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
            Panduan ini menjelaskan cara mengubah banyak data sekaligus secara efisien menggunakan fitur "Seragamkan Data".
        </p>
        <hr className="my-6 border-slate-200 dark:border-slate-700" />
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Bagian 1: Cara Cepat - Seragamkan Data</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">Gunakan bagian ini untuk menerapkan perubahan yang sama ke SEMUA item di bawah.</p>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <div className="pb-6"><StepBulk number="1" title="Isi Kolom Master"><p>Di area <strong>"Seragamkan Data"</strong>, isi satu atau beberapa kolom yang nilainya ingin Anda samakan untuk semua item.</p></StepBulk></div>
                <div className="pt-6"><StepBulk number="2" title="Terapkan ke Semua Item"><p>Klik tombol <code className="font-mono bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded inline-flex items-center gap-1"><ChevronDoubleDownIcon className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0"/> Terapkan Semua Perubahan</code> untuk menyalin data dari kolom master ke semua item di daftar bawah.</p></StepBulk></div>
            </div>
        </section>
        <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Bagian 2: Penyesuaian Detail per Item</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">Setelah menyeragamkan data, Anda bisa mengubah setiap item secara individual.</p>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <div className="pb-6"><StepBulk number="1" title="Buka Detail Item"><p>Klik pada baris item untuk membuka form detailnya dan lakukan perubahan spesifik jika perlu.</p></StepBulk></div>
                <div className="pt-6"><StepBulk number="2" title="Perhatikan Peringatan Error"><p>Jika muncul peringatan berupa tulisan berwarna merah, perbaiki kolom yang ditandai tersebut sebelum menyimpan. Sistem tidak bisa menyimpan jika masih ada error.</p></StepBulk></div>
            </div>
        </section>
        <hr className="my-8 border-t-2 border-slate-200 dark:border-slate-700" />
        <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Bagian 3: Menyimpan Semua Perubahan</h2>
            <ol className="list-decimal list-inside mt-4 space-y-2 text-slate-600 dark:text-slate-400">
                <li><b>Klik "Simpan Semua Perubahan":</b> Tombol di bagian bawah akan menyimpan semua modifikasi yang telah Anda buat.</li>
            </ol>
        </section>
    </>
);


// --- KOMPONEN UTAMA DENGAN TAB ---

const PanduanGabunganContent = () => {
    const [activeTab, setActiveTab] = useState('satuan'); // 'satuan' atau 'massal'

    const tabStyles = {
        base: "flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-offset-0 rounded-t-lg",
        inactive: "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
        active: {
            satuan: "border-green-500 text-green-600 dark:text-green-400 focus:ring-green-500",
            massal: "border-green-500 text-green-600 dark:text-green-400 focus:ring-green-500",
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 sm:rounded-xl shadow-lg overflow-hidden">
            {/* Navigasi Tab */}
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-2 px-4" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('satuan')}
                        className={`${tabStyles.base} ${activeTab === 'satuan' ? tabStyles.active.satuan : tabStyles.inactive}`}
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                        Panduan Edit Satuan
                    </button>
                    <button
                        onClick={() => setActiveTab('massal')}
                        className={`${tabStyles.base} ${activeTab === 'massal' ? tabStyles.active.massal : tabStyles.inactive}`}
                    >
                        <QueueListIcon className="w-5 h-5" />
                        Panduan Edit Massal (Bulk)
                    </button>
                </nav>
            </div>

            {/* Konten Tab */}
            <div className="p-6 sm:p-8">
                {activeTab === 'satuan' && <EditDataContent />}
                {activeTab === 'massal' && <BulkEditPanduanContent />}
            </div>
        </div>
    );
};

export default function PanduanEditGabungan() {
    return (
        <PanduanLayout title="Panduan: Mengubah Data">
            <PanduanGabunganContent />
        </PanduanLayout>
    );
}