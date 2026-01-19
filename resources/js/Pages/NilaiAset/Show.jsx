// import React from 'react';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head, Link, router } from '@inertiajs/react';
// import {
//     PencilSquareIcon,
//     TrashIcon,
//     ArrowLeftIcon,
//     CalendarDaysIcon,
//     CalculatorIcon,
//     CurrencyDollarIcon,
//     ChartBarIcon,
//     BuildingOfficeIcon,
//     DocumentTextIcon,
//     InformationCircleIcon
// } from '@heroicons/react/24/outline';

// export default function Show({ auth, nilaiAset }) {
//     const { raw, formatted, rincian_tahunan } = nilaiAset;

//     const formatRupiah = (number) => {
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency',
//             currency: 'IDR',
//             minimumFractionDigits: 0
//         }).format(number);
//     };

//     const handleDelete = () => {
//         if (confirm('Apakah Anda yakin ingin menghapus data nilai aset ini? Tindakan ini tidak dapat dibatalkan.')) {
//             router.delete(route('nilai-aset.destroy', nilaiAset.id));
//         }
//     };

//     // Warna untuk status nilai
//     const getStatusColor = (nilai) => {
//         if (nilai > 1000000000) return 'text-red-600 bg-red-50 border-red-200';
//         if (nilai > 500000000) return 'text-orange-600 bg-orange-50 border-orange-200';
//         return 'text-green-600 bg-green-50 border-green-200';
//     };

//     return (
//         <AuthenticatedLayout
//             user={auth.user}
//             header={
//                 <div className="flex justify-between items-center">
//                     <div>
//                         <h2 className="font-semibold text-xl text-gray-800 leading-tight">
//                             Detail Nilai Aset
//                         </h2>
//                         <p className="text-sm text-gray-600 mt-1">
//                             {nilaiAset.kode_inventaris || 'Tidak ada kode inventaris'}
//                         </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${raw.nilai_sisa > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                             {raw.nilai_sisa > 0 ? 'Aktif' : 'Tersusutkan'}
//                         </span>
//                     </div>
//                 </div>
//             }
//         >
//             <Head title={`Detail - ${nilaiAset.nama_barang}`} />

//             <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

//                 {/* Breadcrumb & Actions */}
//                 <div className="mb-8">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                             <Link
//                                 href={route('nilai-aset.index')}
//                                 className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-600"
//                             >
//                                 <ArrowLeftIcon className="h-4 w-4 mr-2" />
//                                 Kembali
//                             </Link>
//                         </div>

//                         <div className="flex gap-3">
//                             <Link
//                                 href={route('nilai-aset.edit', nilaiAset.id)}
//                                 className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 text-sm font-medium shadow-sm"
//                             >
//                                 <PencilSquareIcon className="h-4 w-4" />
//                                 Edit Data
//                             </Link>
//                             <button
//                                 onClick={handleDelete}
//                                 className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 text-sm font-medium shadow-sm"
//                             >
//                                 <TrashIcon className="h-4 w-4" />
//                                 Hapus
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content Card */}
//                 <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

//                     {/* Header dengan Background Gradient */}
//                     <div className="bg-green-600 px-8 py-6">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <h1 className="text-2xl font-bold text-white mb-3">
//                                     {nilaiAset.nama_barang}
//                                 </h1>

//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-green-100">
//                                     <div className="flex items-center gap-1">
//                                         <BuildingOfficeIcon className="h-4 w-4 shrink-0" />
//                                         <span className="text-sm">{nilaiAset.ruangan}</span>
//                                     </div>

//                                     <div className="flex items-center gap-1 sm:justify-start">
//                                         <CalendarDaysIcon className="h-4 w-4 shrink-0" />
//                                         <span className="text-sm">
//                                             Perolehan: {formatted.tgl_perolehan}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>


//                             <div className="relative rounded-xl bg-white/90 px-6 py-4 shadow-md border border-emerald-200">
//                                 {/* Status accent */}

//                                 <div className="flex items-start gap-4">

//                                     <div>
//                                         <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
//                                             Nilai Buku Saat Ini
//                                         </div>

//                                         <div className="mt-1 text-2xl font-bold text-gray-900">
//                                             {formatRupiah(raw.nilai_sisa)}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                     {/* Informasi Utama Grid */}
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">

//                         {/* Kolom 1: Informasi Dasar */}
//                         <div className="space-y-6">
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-blue-100 rounded-lg">
//                                     <InformationCircleIcon className="h-6 w-6 text-blue-600" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-gray-800">Informasi Dasar</h3>
//                             </div>

//                             <div className="space-y-4">
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <div className="text-sm text-gray-500 mb-1">Metode Penyusutan</div>
//                                         <div className="font-medium text-gray-900">{formatted.metode}</div>
//                                     </div>
//                                     <div>
//                                         <div className="text-sm text-gray-500 mb-1">Umur Manfaat</div>
//                                         <div className="font-medium text-gray-900">{raw.umur_manfaat} Tahun</div>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <div className="text-sm text-gray-500 mb-1">Tarif Penyusutan</div>
//                                         <div className="font-medium text-gray-900">{raw.tarif_penyusutan}%</div>
//                                     </div>
//                                     <div>
//                                         <div className="text-sm text-gray-500 mb-1">Sisa Umur</div>
//                                         <div className="font-medium text-gray-900">
//                                             {Math.max(0, raw.umur_manfaat - rincian_tahunan?.length || 0)} Tahun
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Kolom 2: Mutasi Nilai */}
//                         <div className="space-y-6">
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-purple-100 rounded-lg">
//                                     <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-gray-800">Mutasi Nilai</h3>
//                             </div>

//                             <div className="space-y-3">
//                                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                                     <div>
//                                         <div className="text-sm text-gray-500">Harga Perolehan Awal</div>
//                                         <div className="font-medium text-gray-900">{formatRupiah(raw.harga_perolehan_awal)}</div>
//                                     </div>
//                                     <div className="text-green-600 text-sm">Awal</div>
//                                 </div>

//                                 <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-lg">
//                                     <div>
//                                         <div className="text-sm text-gray-500">Penambahan</div>
//                                         <div className="font-medium text-blue-600">+ {formatRupiah(raw.penambahan)}</div>
//                                     </div>
//                                     <div className="text-blue-600 text-sm">Tambah</div>
//                                 </div>

//                                 <div className="flex justify-between items-center p-3 bg-red-50/50 rounded-lg">
//                                     <div>
//                                         <div className="text-sm text-gray-500">Pengurangan</div>
//                                         <div className="font-medium text-red-600">- {formatRupiah(raw.pengurangan)}</div>
//                                     </div>
//                                     <div className="text-red-600 text-sm">Kurangi</div>
//                                 </div>

//                                 <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
//                                     <div>
//                                         <div className="text-sm font-medium text-blue-700">Harga Perolehan Akhir</div>
//                                         <div className="text-xl font-bold text-blue-900">{formatRupiah(raw.harga_perolehan_akhir)}</div>
//                                     </div>
//                                     <div className="text-blue-700">
//                                         <CalculatorIcon className="h-6 w-6" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Kolom 3: Status Penyusutan */}
//                         <div className="space-y-6">
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-green-100 rounded-lg">
//                                     <ChartBarIcon className="h-6 w-6 text-green-600" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-gray-800">Status Penyusutan</h3>
//                             </div>

//                             <div className="space-y-4">
//                                 <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
//                                     <div className="text-sm text-green-600 mb-1">Beban Tahun Ini</div>
//                                     <div className="text-2xl font-bold text-green-700">{formatRupiah(raw.penyusutan_tahun_ini)}</div>
//                                 </div>

//                                 <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
//                                     <div className="text-sm text-orange-600 mb-1">Akumulasi Penyusutan</div>
//                                     <div className="text-2xl font-bold text-orange-700">{formatRupiah(raw.akumulasi_penyusutan)}</div>
//                                 </div>

//                                 <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
//                                     <div className="text-sm text-emerald-600 mb-1">Tersusutkan</div>
//                                     <div className="text-lg font-bold text-emerald-700">
//                                         {((raw.akumulasi_penyusutan / raw.harga_perolehan_akhir) * 100).toFixed(1)}%
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Jadwal Penyusutan */}
//                     <div className="border-t border-gray-200">
//                         <div className="px-8 py-6">
//                             <div className="flex items-center justify-between mb-6">
//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2 bg-indigo-100 rounded-lg">
//                                         <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
//                                     </div>
//                                     <div>
//                                         <h3 className="text-lg font-semibold text-gray-800">Jadwal Penyusutan</h3>
//                                         <p className="text-sm text-gray-500">Perhitungan metode garis lurus prorata</p>
//                                     </div>
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                     Total {rincian_tahunan?.length || 0} periode
//                                 </div>
//                             </div>

//                             <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
//                                 <div className="overflow-x-auto">
//                                     <table className="min-w-full divide-y divide-gray-200">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                                                     Tahun
//                                                 </th>
//                                                 <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                                                     Beban Penyusutan
//                                                 </th>
//                                                 <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                                                     Akumulasi
//                                                 </th>
//                                                 <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider bg-emerald-50">
//                                                     Nilai Buku
//                                                 </th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-200">
//                                             {rincian_tahunan && rincian_tahunan.length > 0 ? (
//                                                 rincian_tahunan.map((row, index) => (
//                                                     <tr
//                                                         key={index}
//                                                         className={`hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
//                                                             }`}
//                                                     >
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="text-sm font-medium text-gray-900">{row.tahun}</div>
//                                                             <div className="text-xs text-gray-500">Periode ke-{index + 1}</div>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                                                             <div className="text-sm text-gray-900">{formatRupiah(row.beban)}</div>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                                                             <div className="text-sm text-gray-700">{formatRupiah(row.akumulasi)}</div>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-right bg-emerald-50/50">
//                                                             <div className="text-sm font-semibold text-emerald-700">
//                                                                 {formatRupiah(row.nilai_sisa)}
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             ) : (
//                                                 <tr>
//                                                     <td colSpan="4" className="px-6 py-12 text-center">
//                                                         <div className="text-gray-400">
//                                                             <CalculatorIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                                                             <p className="text-sm">Belum ada data penyusutan</p>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>

//                             <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
//                                 <div className="flex items-center gap-4">
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded"></div>
//                                         <span>Nilai Buku</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
//                                         <span>Baris aktif</span>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     * Metode: {formatted.metode}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Keterangan */}
//                     {raw.keterangan && (
//                         <div className="border-t border-gray-200 px-8 py-6 bg-gradient-to-r from-amber-50/50 to-yellow-50/50">
//                             <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                                 <InformationCircleIcon className="h-5 w-5 text-amber-500" />
//                                 Catatan / Keterangan
//                             </h4>
//                             <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
//                                 <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
//                                     {raw.keterangan}
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }

import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    PencilSquareIcon,
    TrashIcon,
    ArrowLeftIcon,
    CalendarDaysIcon,
    CalculatorIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    BuildingOfficeIcon,
    DocumentTextIcon,
    InformationCircleIcon,
    ClockIcon,
    QrCodeIcon
} from '@heroicons/react/24/outline';

export default function Show({ auth, nilaiAset }) {
    const { raw, formatted, rincian_tahunan } = nilaiAset;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus data nilai aset ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(route('nilai-aset.destroy', nilaiAset.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-bold text-xl text-gray-800 leading-tight">
                            Detail Aset
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <QrCodeIcon className="w-4 h-4" />
                            <span className="font-mono">{nilaiAset.kode_inventaris || '-'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            raw.nilai_sisa > 0 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                            {raw.nilai_sisa > 0 ? 'Status: AKTIF' : 'Status: HABIS SUSUT'}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`Detail - ${nilaiAset.nama_barang}`} />

            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

                {/* --- NAVIGATION & ACTIONS --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <Link
                        href={route('nilai-aset.index')}
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Daftar
                    </Link>

                    <div className="flex w-full sm:w-auto gap-3">
                        <Link
                            href={route('nilai-aset.edit', nilaiAset.id)}
                            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-all text-sm font-bold shadow-sm"
                        >
                            <PencilSquareIcon className="h-4 w-4" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all text-sm font-bold shadow-sm"
                        >
                            <TrashIcon className="h-4 w-4" />
                            Hapus
                        </button>
                    </div>
                </div>

                {/* --- MAIN HERO CARD --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    {/* Header Gradient */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-6 sm:px-8 text-white">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                            <div className="space-y-2">
                                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                                    {nilaiAset.nama_barang}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-slate-300 text-sm">
                                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                        <BuildingOfficeIcon className="h-4 w-4 text-blue-300" />
                                        <span>{nilaiAset.ruangan}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                        <CalendarDaysIcon className="h-4 w-4 text-blue-300" />
                                        <span>Perolehan: {formatted.tgl_perolehan}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Nilai Buku Highlight */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 min-w-[200px]">
                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                                    Nilai Buku Saat Ini
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
                                    {formatRupiah(raw.nilai_sisa)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 3 COLUMN GRID INFO --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-white">
                        
                        {/* 1. Detail Metode */}
                        <div className="p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <CalculatorIcon className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-800">Metode & Tarif</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-sm text-gray-500">Metode</span>
                                    <span className="text-sm font-semibold text-gray-900">{formatted.metode}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-sm text-gray-500">Umur Manfaat</span>
                                    <span className="text-sm font-semibold text-gray-900">{raw.umur_manfaat} Tahun</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-sm text-gray-500">Tarif / Tahun</span>
                                    <span className="text-sm font-semibold text-gray-900 bg-blue-50 px-2 py-0.5 rounded text-blue-700">{raw.tarif_penyusutan}%</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-sm text-gray-500">Sisa Umur</span>
                                    <span className="text-sm font-bold text-orange-600">
                                        {Math.max(0, raw.umur_manfaat - (rincian_tahunan?.length || 0))} Tahun
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Mutasi Harga */}
                        <div className="p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                    <CurrencyDollarIcon className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-800">Mutasi Harga</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Harga Awal</span>
                                    <span className="text-sm font-mono font-medium">{formatRupiah(raw.harga_perolehan_awal)}</span>
                                </div>
                                {raw.penambahan > 0 && (
                                    <div className="flex justify-between items-center text-emerald-600">
                                        <span className="text-xs flex items-center gap-1"><span className="text-lg">+</span> Penambahan</span>
                                        <span className="text-sm font-mono font-medium">{formatRupiah(raw.penambahan)}</span>
                                    </div>
                                )}
                                {raw.pengurangan > 0 && (
                                    <div className="flex justify-between items-center text-red-600">
                                        <span className="text-xs flex items-center gap-1"><span className="text-lg">-</span> Pengurangan</span>
                                        <span className="text-sm font-mono font-medium">{formatRupiah(raw.pengurangan)}</span>
                                    </div>
                                )}
                                <div className="pt-3 mt-1 border-t border-gray-100">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-gray-700">Harga Akhir</span>
                                        <span className="text-base font-bold text-purple-700 font-mono">{formatRupiah(raw.harga_perolehan_akhir)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Ringkasan Penyusutan */}
                        <div className="p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <ChartBarIcon className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-800">Ringkasan</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1">Beban Tahun Ini</div>
                                    <div className="font-bold text-gray-800">{formatRupiah(raw.penyusutan_tahun_ini)}</div>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                    <div className="text-xs text-orange-700 mb-1">Total Akumulasi</div>
                                    <div className="font-bold text-orange-800">{formatRupiah(raw.akumulasi_penyusutan)}</div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div 
                                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000" 
                                        style={{ width: `${Math.min(((raw.akumulasi_penyusutan / raw.harga_perolehan_akhir) * 100), 100)}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-right text-gray-500">
                                    Tersusutkan {((raw.akumulasi_penyusutan / raw.harga_perolehan_akhir) * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- KETERANGAN (Conditional) --- */}
                {raw.keterangan && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6 flex gap-4 items-start">
                        <InformationCircleIcon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-amber-800 text-sm uppercase mb-1">Keterangan</h4>
                            <p className="text-amber-900 text-sm whitespace-pre-line leading-relaxed">
                                {raw.keterangan}
                            </p>
                        </div>
                    </div>
                )}

                {/* --- JADWAL PENYUSUTAN --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                            <h3 className="font-bold text-gray-800">Jadwal Penyusutan</h3>
                        </div>
                        <div className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                            Metode Garis Lurus Prorata
                        </div>
                    </div>
                    
                    {/* CONTAINER TABEL / LIST */}
                    <div className="p-0">
                        {rincian_tahunan && rincian_tahunan.length > 0 ? (
                            <>
                                {/* --- 1. DESKTOP VIEW (Table) --- */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-3 text-left w-24">Tahun</th>
                                                <th className="px-6 py-3 text-right">Beban</th>
                                                <th className="px-6 py-3 text-right">Akumulasi</th>
                                                <th className="px-6 py-3 text-right text-emerald-700 bg-emerald-50/50">Nilai Buku</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {rincian_tahunan.map((row, index) => (
                                                <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900">{row.tahun}</div>
                                                        <div className="text-[10px] text-gray-400">Periode {index + 1}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 font-mono">
                                                        {formatRupiah(row.beban)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 font-mono">
                                                        {formatRupiah(row.akumulasi)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right bg-emerald-50/30">
                                                        <span className="text-sm font-bold text-emerald-700 font-mono">
                                                            {formatRupiah(row.nilai_sisa)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* --- 2. MOBILE VIEW (Card List) --- */}
                                <div className="md:hidden space-y-4 p-4 bg-gray-50/50">
                                    {rincian_tahunan.map((row, index) => (
                                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded text-xs">
                                                        {row.tahun}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Periode {index + 1}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <div className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Beban</div>
                                                    <div className="text-sm text-gray-700 font-mono">{formatRupiah(row.beban)}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Akumulasi</div>
                                                    <div className="text-sm text-orange-600 font-mono">{formatRupiah(row.akumulasi)}</div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center bg-emerald-50/30 -mx-4 -mb-4 px-4 py-3">
                                                <span className="text-xs font-bold text-emerald-700 uppercase">Nilai Buku</span>
                                                <span className="text-lg font-bold text-emerald-700 font-mono">{formatRupiah(row.nilai_sisa)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <ClockIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Belum ada penyusutan</h3>
                                <p className="mt-1 text-sm text-gray-500">Data penyusutan akan muncul setelah periode berjalan.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}