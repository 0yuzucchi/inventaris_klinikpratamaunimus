// import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head, Link, router } from '@inertiajs/react';
// import {
//     MagnifyingGlassIcon,
//     PencilSquareIcon,
//     EyeIcon,
//     PlusIcon,
//     FunnelIcon,
//     XMarkIcon,
//     TrashIcon // Tambah ikon Trash
// } from '@heroicons/react/24/outline';

// // ... (UTIL Functions formatRupiah & formatDateIndo tetap sama) ...
// /* =======================
//    UTIL
// ======================= */
// const formatRupiah = (val) => {
//     if (val === null || val === undefined) return '-';
//     return new Intl.NumberFormat('id-ID', {
//         style: 'currency',
//         currency: 'IDR',
//         minimumFractionDigits: 0,
//     }).format(val);
// };

// const formatDateIndo = (dateStr) => {
//     if (!dateStr) return '-';
//     const d = new Date(dateStr);
//     if (isNaN(d)) return '-';

//     const parts = new Intl.DateTimeFormat('id-ID', {
//         day: '2-digit', month: '2-digit', year: 'numeric',
//     }).formatToParts(d);

//     const day = parts.find(p => p.type === 'day')?.value;
//     const month = parts.find(p => p.type === 'month')?.value;
//     const year = parts.find(p => p.type === 'year')?.value;

//     return `${day}-${month}-${year}`;
// };

// export default function Index({ auth, nilaiAset = [] }) {

//     // --- SETUP STATE ---
//     const currentYear = new Date().getFullYear();
//     const defaultStart = currentYear - 2;
//     const defaultEnd = currentYear + 2;

//     const [startYear, setStartYear] = useState(defaultStart);
//     const [endYear, setEndYear] = useState(defaultEnd);
//     const [keyword, setKeyword] = useState('');
    
//     // --- STATE SELEKSI (BULK DELETE) ---
//     const [selectedIds, setSelectedIds] = useState([]);

//     // --- STATE RESIZE ---
//     const [columnWidth, setColumnWidth] = useState(320);
//     const resizingRef = useRef({ isResizing: false, startX: 0, startWidth: 0 });

//     // --- FILTERING ---
//     const filteredData = useMemo(() => {
//         if (!keyword) return nilaiAset;
//         const lowerKeyword = keyword.toLowerCase();
//         return nilaiAset.filter((item) => {
//             const matchNama = item.display_nama?.toLowerCase().includes(lowerKeyword);
//             const matchKode = item.display_kode?.toLowerCase().includes(lowerKeyword);
//             const matchLokasi = item.display_lokasi?.toLowerCase().includes(lowerKeyword);
//             return matchNama || matchKode || matchLokasi;
//         });
//     }, [nilaiAset, keyword]);

//     // --- KOLOM TAHUN ---
//     const yearsToShow = useMemo(() => {
//         const s = parseInt(startYear) || defaultStart;
//         const e = parseInt(endYear) || defaultEnd;
//         if (s > e) return [];
//         return Array.from({ length: e - s + 1 }, (_, i) => s + i);
//     }, [startYear, endYear]);

//     // --- LOGIC SELEKSI ---
//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             // Pilih semua ID dari data yang sedang TAMPIL (filtered)
//             const allIds = filteredData.map(item => item.id);
//             setSelectedIds(allIds);
//         } else {
//             setSelectedIds([]);
//         }
//     };

//     const handleSelectOne = (id) => {
//         if (selectedIds.includes(id)) {
//             setSelectedIds(selectedIds.filter(itemId => itemId !== id));
//         } else {
//             setSelectedIds([...selectedIds, id]);
//         }
//     };

//     // --- LOGIC HAPUS ---
//     const handleDeleteSingle = (id) => {
//         if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
//             router.delete(route('nilai-aset.destroy', id), {
//                 preserveScroll: true,
//                 onSuccess: () => setSelectedIds(selectedIds.filter(sid => sid !== id)), // Hapus dari seleksi jika ada
//             });
//         }
//     };

//     const handleBulkDelete = () => {
//         if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data terpilih?`)) {
//             router.post(route('nilai-aset.bulk-delete'), { ids: selectedIds }, {
//                 preserveScroll: true,
//                 onSuccess: () => setSelectedIds([]), // Reset seleksi setelah hapus
//             });
//         }
//     };

//     const clearSearch = () => setKeyword('');

//     // --- LOGIC RESIZE (Sama seperti sebelumnya) ---
//     const startResizing = useCallback((mouseDownEvent) => {
//         mouseDownEvent.preventDefault();
//         resizingRef.current = { isResizing: true, startX: mouseDownEvent.clientX, startWidth: columnWidth };
//         document.addEventListener('mousemove', handleMouseMove);
//         document.addEventListener('mouseup', handleMouseUp);
//         document.body.style.cursor = 'col-resize';
//     }, [columnWidth]);

//     const handleMouseMove = useCallback((mouseMoveEvent) => {
//         if (!resizingRef.current.isResizing) return;
//         const deltaX = mouseMoveEvent.clientX - resizingRef.current.startX;
//         setColumnWidth(Math.max(200, resizingRef.current.startWidth + deltaX));
//     }, []);

//     const handleMouseUp = useCallback(() => {
//         resizingRef.current.isResizing = false;
//         document.removeEventListener('mousemove', handleMouseMove);
//         document.removeEventListener('mouseup', handleMouseUp);
//         document.body.style.cursor = 'default';
//     }, [handleMouseMove]);

//     return (
//         <AuthenticatedLayout
//             user={auth.user}
//             header={<h2 className="text-xl font-semibold text-gray-800">Daftar Aset & Penyusutan</h2>}
//         >
//             <Head title="Daftar Aset" />

//             <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

//                     {/* --- TOOLBAR --- */}
//                     <div className="p-4 border-b border-gray-200 bg-gray-50">
//                         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            
//                             {/* Filter Group */}
//                             <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
//                                 {/* Search */}
//                                 <div className="relative group w-full sm:w-72">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
//                                     </div>
//                                     <input
//                                         type="text"
//                                         className="pl-10 pr-10 block w-full rounded-lg border-gray-300 bg-white text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
//                                         placeholder="Cari nama, kode, lokasi..."
//                                         value={keyword}
//                                         onChange={(e) => setKeyword(e.target.value)}
//                                     />
//                                     {keyword && (
//                                         <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
//                                             <XMarkIcon className="h-4 w-4" />
//                                         </button>
//                                     )}
//                                 </div>

//                                 {/* Tahun */}
//                                 <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm">
//                                     <FunnelIcon className="h-4 w-4 text-gray-500" />
//                                     <input
//                                         type="number"
//                                         className="w-16 p-0 text-sm border-none focus:ring-0 text-center text-gray-700 font-medium bg-transparent"
//                                         value={startYear}
//                                         onChange={(e) => setStartYear(e.target.value)}
//                                     />
//                                     <span className="text-gray-400 font-bold">-</span>
//                                     <input
//                                         type="number"
//                                         className="w-16 p-0 text-sm border-none focus:ring-0 text-center text-gray-700 font-medium bg-transparent"
//                                         value={endYear}
//                                         onChange={(e) => setEndYear(e.target.value)}
//                                     />
//                                 </div>

//                                 {/* TOMBOL DELETE MASSAL (Muncul jika ada yang dipilih) */}
//                                 {selectedIds.length > 0 && (
//                                     <button
//                                         onClick={handleBulkDelete}
//                                         className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm animate-in fade-in zoom-in duration-200"
//                                     >
//                                         <TrashIcon className="w-4 h-4" />
//                                         Hapus ({selectedIds.length})
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Tombol Tambah */}
//                             <Link
//                                 href={route('nilai-aset.create')}
//                                 className="flex-grow lg:flex-grow-0 flex items-center justify-center rounded-lg px-4 py-2 font-bold transition-transform disabled:scale-100 disabled:cursor-not-allowed bg-green-600 text-white hover:scale-105"
//                             >
//                                 <PlusIcon className="w-5 h-5" />
//                                 <span className="ml-2">Tambah Data</span>
//                             </Link>
//                         </div>
//                     </div>

//                     {/* --- TABEL SCROLLABLE --- */}
//                     <div className="relative w-full overflow-x-auto">
//                         <table className="min-w-full text-xs text-left border-collapse table-fixed">
//                             <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b border-gray-200">
//                                 <tr>
//                                     {/* KOLOM CHECKBOX + IDENTITAS (RESIZABLE) */}
//                                     <th 
//                                         className="sticky left-0 z-30 bg-gray-100 px-4 py-4 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] relative"
//                                         style={{ width: columnWidth, minWidth: columnWidth, maxWidth: columnWidth }}
//                                     >
//                                         <div className="flex items-center gap-3">
//                                             {/* CHECKBOX SELECT ALL */}
//                                             <input 
//                                                 type="checkbox" 
//                                                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                                                 checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
//                                                 onChange={handleSelectAll}
//                                             />
//                                             <div className="flex justify-between items-center w-full">
//                                                 <span>Identitas Barang</span>
//                                                 {/* RESIZER */}
//                                                 <div
//                                                     onMouseDown={startResizing}
//                                                     className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-blue-400 transition-colors z-50"
//                                                     title="Geser untuk ubah lebar"
//                                                 />
//                                             </div>
//                                         </div>
//                                     </th>

//                                     {/* INFO DASAR */}
//                                     <th className="px-4 py-4 text-center w-[100px] min-w-[100px] border-r border-gray-200">Tgl Perolehan</th>
//                                     <th className="px-4 py-4 text-right w-[120px] min-w-[120px] border-r border-gray-200">Total Harga</th>
//                                     <th className="px-4 py-4 text-center w-[80px] min-w-[80px] border-r border-gray-200">Tarif</th>

//                                     {/* DINAMIS TAHUN */}
//                                     {yearsToShow.map((year) => (
//                                         <th key={year} colSpan={3} className="px-2 py-4 text-center bg-blue-50 border-l border-blue-200 text-blue-800 w-[300px] min-w-[300px]">
//                                             Tahun {year}
//                                         </th>
//                                     ))}

//                                     <th className="px-4 py-4 text-center w-[120px] min-w-[120px] bg-gray-100 border-l border-gray-300">Aksi</th>
//                                 </tr>

//                                 {/* SUB HEADER */}
//                                 <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
//                                     <th 
//                                         className="sticky left-0 z-30 bg-gray-50 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
//                                         style={{ width: columnWidth, minWidth: columnWidth, maxWidth: columnWidth }}
//                                     ></th>
//                                     <th className="border-r border-gray-200"></th>
//                                     <th className="border-r border-gray-200"></th>
//                                     <th className="border-r border-gray-200"></th>

//                                     {yearsToShow.map((year) => (
//                                         <React.Fragment key={`sub-${year}`}>
//                                             <th className="px-3 py-2 text-right border-l border-gray-200 font-medium w-[100px] min-w-[100px]">Beban</th>
//                                             <th className="px-3 py-2 text-right border-l border-gray-200 font-medium w-[100px] min-w-[100px]">Akm</th>
//                                             <th className="px-3 py-2 text-right border-l border-gray-200 font-bold text-emerald-700 bg-emerald-50 w-[100px] min-w-[100px]">Sisa</th>
//                                         </React.Fragment>
//                                     ))}
//                                     <th className="border-l border-gray-300 bg-gray-50"></th>
//                                 </tr>
//                             </thead>

//                             <tbody className="divide-y divide-gray-100 bg-white">
//                                 {filteredData.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={5 + yearsToShow.length * 3} className="py-12 text-center text-gray-400 bg-white">
//                                             <div className="flex flex-col items-center justify-center gap-2">
//                                                 <MagnifyingGlassIcon className="w-8 h-8 text-gray-300" />
//                                                 <span className="italic">
//                                                     {keyword ? `Tidak ada aset dengan kata kunci "${keyword}"` : 'Belum ada data aset.'}
//                                                 </span>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     filteredData.map((item) => (
//                                         <tr key={item.id} className={`group hover:bg-blue-50 transition-colors duration-150 ${selectedIds.includes(item.id) ? 'bg-blue-50/50' : ''}`}>

//                                             {/* --- STICKY COLUMN: CHECKBOX + IDENTITAS --- */}
//                                             <td 
//                                                 className="sticky left-0 z-20 px-4 py-3 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] align-top bg-white group-hover:bg-blue-50 transition-colors duration-150"
//                                                 style={{ width: columnWidth, minWidth: columnWidth, maxWidth: columnWidth }}
//                                             >
//                                                 <div className="flex items-start gap-3">
//                                                     {/* CHECKBOX ITEM */}
//                                                     <div className="pt-3">
//                                                         <input 
//                                                             type="checkbox" 
//                                                             className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                                                             checked={selectedIds.includes(item.id)}
//                                                             onChange={() => handleSelectOne(item.id)}
//                                                         />
//                                                     </div>

//                                                     {/* Foto */}
//                                                     <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
//                                                         {item.display_image ? (
//                                                             <img src={item.display_image} alt="Asset" className="object-cover w-full h-full" />
//                                                         ) : (
//                                                             <div className="flex items-center justify-center h-full text-gray-400">
//                                                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
//                                                             </div>
//                                                         )}
//                                                     </div>
                                                    
//                                                     {/* Teks */}
//                                                     <div className="flex flex-col min-w-0 flex-1">
//                                                         <div className="text-sm font-bold text-gray-800 truncate" title={item.display_nama}>
//                                                             {item.display_nama}
//                                                         </div>
//                                                         <div className="flex items-center gap-2 mt-1">
//                                                             <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 whitespace-nowrap">
//                                                                 {item.display_kode}
//                                                             </span>
//                                                         </div>
//                                                         <div className="mt-1.5 text-[10px]">
//                                                             <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 font-medium whitespace-nowrap">
//                                                                 {item.display_lokasi}
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </td>

//                                             {/* --- INFO DASAR --- */}
//                                             <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-100 font-mono bg-white group-hover:bg-blue-50">
//                                                 {formatDateIndo(item.tanggal_perolehan)}
//                                             </td>
//                                             <td className="px-4 py-3 text-right font-bold text-gray-800 border-r border-gray-100 bg-white group-hover:bg-blue-50">
//                                                 {formatRupiah(item.total_harga_perolehan)}
//                                             </td>
//                                             <td className="px-4 py-3 text-center border-r border-gray-200 bg-white group-hover:bg-blue-50">
//                                                 <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
//                                                     {item.tarif_penyusutan}%
//                                                 </span>
//                                             </td>

//                                             {/* --- DATA TAHUNAN DINAMIS --- */}
//                                             {yearsToShow.map((year) => {
//                                                 const detail = item.rincian_tahunan?.find(d => d.tahun === year);
//                                                 return (
//                                                     <React.Fragment key={year}>
//                                                         <td className="px-3 py-3 text-right border-l border-gray-100 text-gray-500 bg-white group-hover:bg-blue-50">
//                                                             {detail ? formatRupiah(detail.beban) : '-'}
//                                                         </td>
//                                                         <td className="px-3 py-3 text-right text-gray-500 bg-white group-hover:bg-blue-50">
//                                                             {detail ? formatRupiah(detail.akumulasi) : '-'}
//                                                         </td>
//                                                         <td className="px-3 py-3 text-right font-bold text-emerald-700 bg-emerald-50/30 group-hover:bg-emerald-100/50">
//                                                             {detail ? formatRupiah(detail.nilai_sisa) : '-'}
//                                                         </td>
//                                                     </React.Fragment>
//                                                 );
//                                             })}

//                                             {/* --- AKSI --- */}
//                                             <td className="px-3 py-3 text-center border-l border-gray-300 bg-white group-hover:bg-blue-50">
//                                                 <div className="flex items-center justify-center gap-2">
//                                                     <Link href={route('nilai-aset.edit', item.id)} className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors" title="Edit">
//                                                         <PencilSquareIcon className="w-4 h-4" />
//                                                     </Link>
                                                    
//                                                     {/* TOMBOL DELETE SINGLE */}
//                                                     <button 
//                                                         onClick={() => handleDeleteSingle(item.id)}
//                                                         className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
//                                                         title="Hapus"
//                                                     >
//                                                         <TrashIcon className="w-4 h-4" />
//                                                     </button>

//                                                     <Link href={route('nilai-aset.show', item.id)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors" title="Detail">
//                                                         <EyeIcon className="w-4 h-4" />
//                                                     </Link>
//                                                 </div>
//                                             </td>

//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Footer */}
//                     <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
//                         <div className="flex items-center gap-2">
//                             <span>Data tahun <b>{startYear}</b> - <b>{endYear}</b>.</span>
//                             {selectedIds.length > 0 && <span className="font-semibold text-blue-600">({selectedIds.length} item dipilih)</span>}
//                         </div>
//                         <span className="flex items-center gap-1">
//                             Geser tabel ke kanan <span className="text-lg leading-none">&rarr;</span>
//                         </span>
//                     </div>

//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }

import React, { useMemo, useState, useRef, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
    EyeIcon,
    PlusIcon,
    FunnelIcon,
    XMarkIcon,
    TrashIcon,
    PrinterIcon,
    PhotoIcon,
    CalendarDaysIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';

/* =======================
   UTIL
======================= */
const formatRupiah = (val) => {
    if (val === null || val === undefined) return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(val);
};

const formatDateIndo = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return '-';
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
    }).format(d);
};

export default function Index({ auth, nilaiAset = [] }) {

    // --- SETUP STATE ---
    const currentYear = new Date().getFullYear();
    const defaultStart = currentYear - 2;
    const defaultEnd = currentYear + 2;

    const [startYear, setStartYear] = useState(defaultStart);
    const [endYear, setEndYear] = useState(defaultEnd);
    const [keyword, setKeyword] = useState('');
    
    // --- STATE SELEKSI ---
    const [selectedIds, setSelectedIds] = useState([]);

    // --- STATE RESIZE (Desktop Only) ---
    const [columnWidth, setColumnWidth] = useState(350); // Lebar default sedikit diperbesar untuk muat aksi
    const resizingRef = useRef({ isResizing: false, startX: 0, startWidth: 0 });

    // --- FILTERING ---
    const filteredData = useMemo(() => {
        if (!keyword) return nilaiAset;
        const lowerKeyword = keyword.toLowerCase();
        return nilaiAset.filter((item) => {
            const matchNama = item.display_nama?.toLowerCase().includes(lowerKeyword);
            const matchKode = item.display_kode?.toLowerCase().includes(lowerKeyword);
            const matchLokasi = item.display_lokasi?.toLowerCase().includes(lowerKeyword);
            return matchNama || matchKode || matchLokasi;
        });
    }, [nilaiAset, keyword]);

    // --- KOLOM TAHUN ---
    const yearsToShow = useMemo(() => {
        const s = parseInt(startYear) || defaultStart;
        const e = parseInt(endYear) || defaultEnd;
        if (s > e) return [];
        return Array.from({ length: e - s + 1 }, (_, i) => s + i);
    }, [startYear, endYear]);

    // --- LOGIC SELEKSI ---
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredData.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // --- LOGIC HAPUS ---
    const handleDeleteSingle = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('nilai-aset.destroy', id), {
                preserveScroll: true,
                onSuccess: () => setSelectedIds(selectedIds.filter(sid => sid !== id)),
            });
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data terpilih?`)) {
            router.post(route('nilai-aset.bulk-delete'), { ids: selectedIds }, {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            });
        }
    };

    // --- RESIZE LOGIC ---
    const startResizing = useCallback((mouseDownEvent) => {
        mouseDownEvent.preventDefault();
        resizingRef.current = { isResizing: true, startX: mouseDownEvent.clientX, startWidth: columnWidth };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'col-resize';
    }, [columnWidth]);

    const handleMouseMove = useCallback((mouseMoveEvent) => {
        if (!resizingRef.current.isResizing) return;
        const deltaX = mouseMoveEvent.clientX - resizingRef.current.startX;
        setColumnWidth(Math.max(280, resizingRef.current.startWidth + deltaX)); // Min width 280
    }, []);

    const handleMouseUp = useCallback(() => {
        resizingRef.current.isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
    }, [handleMouseMove]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-bold text-gray-800">Daftar Aset & Penyusutan</h2>}
        >
            <Head title="Daftar Aset" />

            <div className="max-w-[98%] xl:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
                
                {/* --- TOOLBAR CARD --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        
                        {/* Kiri: Filter & Search */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            {/* Search */}
                            <div className="relative group w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                                </div>
                                <input
                                    type="text"
                                    className="pl-10 pr-10 block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                    placeholder="Cari aset..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                                {keyword && (
                                    <button onClick={() => setKeyword('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Tahun Range */}
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-300">
                                <FunnelIcon className="h-4 w-4 text-gray-500" />
                                <input
                                    type="number"
                                    className="w-14 p-0 text-sm border-none focus:ring-0 text-center bg-transparent font-medium text-gray-700"
                                    value={startYear}
                                    onChange={(e) => setStartYear(e.target.value)}
                                />
                                <span className="text-gray-400 text-xs">s/d</span>
                                <input
                                    type="number"
                                    className="w-14 p-0 text-sm border-none focus:ring-0 text-center bg-transparent font-medium text-gray-700"
                                    value={endYear}
                                    onChange={(e) => setEndYear(e.target.value)}
                                />
                            </div>
                            
                            {/* Tombol Hapus Massal */}
                            {selectedIds.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold animate-in fade-in zoom-in duration-200"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    <span>Hapus ({selectedIds.length})</span>
                                </button>
                            )}
                        </div>

                        {/* Kanan: Tombol Aksi Utama */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href={route('nilai-aset.print')}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all hover:shadow-sm"
                            >
                                <PrinterIcon className="w-5 h-5 text-gray-500" />
                                Cetak
                            </a>
                            <Link
                                href={route('nilai-aset.create')}
                                className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Tambah Aset
                            </Link>
                        </div>
                    </div>
                </div>


                {/* =========================================
                    MOBILE VIEW: CARD LAYOUT (< md)
                   ========================================= */}
                <div className="block lg:hidden space-y-4">
                    {filteredData.length === 0 ? (
                         <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
                             <p className="text-gray-500 italic">Tidak ada data ditemukan.</p>
                         </div>
                    ) : (
                        filteredData.map((item) => (
                            <div key={item.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden relative transition-all ${selectedIds.includes(item.id) ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-200'}`}>
                                {/* Header Card */}
                                <div className="p-4 border-b border-gray-100 flex gap-4">
                                    <div className="pt-1">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-blue-600 w-5 h-5"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleSelectOne(item.id)}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.display_nama}</h3>
                                            <span className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                                                {item.display_kode}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-blue-600 font-medium">
                                            {item.display_lokasi}
                                        </div>
                                    </div>
                                </div>

                                {/* Body Card: Info Utama */}
                                <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                                            <CalendarDaysIcon className="w-3 h-3" /> Tgl Perolehan
                                        </span>
                                        <span className="font-medium text-gray-800">{formatDateIndo(item.tanggal_perolehan)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                                            <BanknotesIcon className="w-3 h-3" /> Total Harga
                                        </span>
                                        <span className="font-bold text-gray-800">{formatRupiah(item.total_harga_perolehan)}</span>
                                    </div>
                                </div>

                                {/* Footer Card: Actions */}
                                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                                    <Link 
                                        href={route('nilai-aset.show', item.id)}
                                        className="text-xs text-blue-600 font-semibold hover:underline"
                                    >
                                        Lihat Rincian &rarr;
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <Link href={route('nilai-aset.edit', item.id)} className="p-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200">
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDeleteSingle(item.id)} className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>


                {/* =========================================
                    DESKTOP VIEW: TABLE LAYOUT (>= lg)
                   ========================================= */}
                <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="relative w-full overflow-x-auto">
                        <table className="min-w-full text-xs text-left border-collapse table-fixed">
                            <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b border-gray-200">
                                <tr>
                                    {/* --- STICKY HEADER --- */}
                                    <th 
                                        className="sticky left-0 z-30 bg-gray-100 px-4 py-4 border-r border-gray-300 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]"
                                        style={{ width: columnWidth, minWidth: columnWidth, maxWidth: columnWidth }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                                                onChange={handleSelectAll}
                                            />
                                            <div className="flex justify-between items-center w-full select-none">
                                                <span>Identitas Aset</span>
                                                {/* Resizer Handle */}
                                                <div
                                                    onMouseDown={startResizing}
                                                    className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-blue-400 transition-colors z-50 opacity-0 hover:opacity-100"
                                                    title="Geser lebar kolom"
                                                />
                                            </div>
                                        </div>
                                    </th>

                                    {/* INFO UTAMA */}
                                    <th className="px-4 py-4 text-center w-28 border-r border-gray-200">Perolehan</th>
                                    <th className="px-4 py-4 text-right w-36 border-r border-gray-200">Harga Total</th>
                                    <th className="px-4 py-4 text-center w-20 border-r border-gray-200">Tarif</th>

                                    {/* TAHUN DINAMIS */}
                                    {yearsToShow.map((year) => (
                                        <th key={year} colSpan={3} className="px-2 py-4 text-center bg-blue-50/50 border-l border-blue-200 text-blue-900 w-[320px]">
                                            Tahun {year}
                                        </th>
                                    ))}
                                    
                                    {/* Spacer ujung kanan agar tabel tidak putus mendadak */}
                                    <th className="w-10 bg-gray-50 border-l border-gray-200"></th>
                                </tr>

                                {/* SUB-HEADER (Nilai Tahunan) */}
                                <tr className="bg-gray-50/50 text-gray-500 border-b border-gray-200">
                                    <th 
                                        className="sticky left-0 z-30 bg-gray-50 border-r border-gray-300 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]"
                                        style={{ width: columnWidth, minWidth: columnWidth }}
                                    >
                                        {/* Kosong di sticky column row 2 */}
                                        <div className="px-4 py-2 text-[10px] font-normal text-gray-400 italic">
                                            Geser garis kanan untuk melebarkan kolom &rarr;
                                        </div>
                                    </th>
                                    <th className="border-r border-gray-200"></th>
                                    <th className="border-r border-gray-200"></th>
                                    <th className="border-r border-gray-200"></th>

                                    {yearsToShow.map((year) => (
                                        <React.Fragment key={`sub-${year}`}>
                                            <th className="px-3 py-2 text-right border-l border-blue-100 font-medium w-24">Beban</th>
                                            <th className="px-3 py-2 text-right border-l border-gray-100 font-medium w-24">Akm</th>
                                            <th className="px-3 py-2 text-right border-l border-gray-100 font-bold text-emerald-700 bg-emerald-50 w-28">Sisa</th>
                                        </React.Fragment>
                                    ))}
                                    <th className="bg-gray-50 border-l border-gray-200"></th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="py-12 text-center text-gray-400">
                                            Tidak ada data aset yang sesuai filter.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className={`group hover:bg-blue-50/30 transition-colors duration-150 ${selectedIds.includes(item.id) ? 'bg-blue-50/60' : ''}`}>

                                            {/* --- STICKY COLUMN: ISI DATA + AKSI --- */}
                                            <td 
                                                className="sticky left-0 z-20 px-4 py-3 border-r border-gray-300 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)] align-top bg-white group-hover:bg-blue-50/30 transition-colors"
                                                style={{ width: columnWidth, minWidth: columnWidth, maxWidth: columnWidth }}
                                            >
                                                <div className="flex gap-4">
                                                    {/* Checkbox */}
                                                    <div className="pt-1">
                                                        <input 
                                                            type="checkbox" 
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                            checked={selectedIds.includes(item.id)}
                                                            onChange={() => handleSelectOne(item.id)}
                                                        />
                                                    </div>

                                                    {/* Gambar */}
                                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                        {item.display_image ? (
                                                            <img src={item.display_image} alt="" className="object-cover w-full h-full" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-gray-300">
                                                                <PhotoIcon className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Text & Actions */}
                                                    <div className="flex flex-col flex-1 min-w-0 justify-between">
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug" title={item.display_nama}>
                                                                {item.display_nama}
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                                <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                                                    {item.display_kode}
                                                                </span>
                                                                <span className="text-[10px] text-blue-600 font-medium">
                                                                    {item.display_lokasi}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* --- TOMBOL AKSI (PINDAH SINI) --- */}
                                                        <div className="flex items-center gap-2 mt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                                            <Link href={route('nilai-aset.edit', item.id)} className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded hover:bg-amber-100 border border-amber-200 transition-colors">
                                                                <PencilSquareIcon className="w-3 h-3" />
                                                                Edit
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDeleteSingle(item.id)} 
                                                                className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded hover:bg-red-100 border border-red-200 transition-colors"
                                                            >
                                                                <TrashIcon className="w-3 h-3" />
                                                                Hapus
                                                            </button>
                                                            <Link href={route('nilai-aset.show', item.id)} className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 border border-blue-200 transition-colors">
                                                                <EyeIcon className="w-3 h-3" />
                                                                Detail
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* --- DATA STATIC --- */}
                                            <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-100 font-mono bg-white group-hover:bg-blue-50/30">
                                                {formatDateIndo(item.tanggal_perolehan)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-800 border-r border-gray-100 bg-white group-hover:bg-blue-50/30">
                                                {formatRupiah(item.total_harga_perolehan)}
                                            </td>
                                            <td className="px-4 py-3 text-center border-r border-gray-200 bg-white group-hover:bg-blue-50/30">
                                                <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                    {item.tarif_penyusutan}%
                                                </span>
                                            </td>

                                            {/* --- DATA TAHUNAN --- */}
                                            {yearsToShow.map((year) => {
                                                const detail = item.rincian_tahunan?.find(d => d.tahun === year);
                                                return (
                                                    <React.Fragment key={year}>
                                                        <td className="px-3 py-3 text-right border-l border-blue-100 text-gray-500 text-[11px] bg-white group-hover:bg-blue-50/30">
                                                            {detail ? formatRupiah(detail.beban) : '-'}
                                                        </td>
                                                        <td className="px-3 py-3 text-right border-l border-gray-100 text-gray-500 text-[11px] bg-white group-hover:bg-blue-50/30">
                                                            {detail ? formatRupiah(detail.akumulasi) : '-'}
                                                        </td>
                                                        <td className="px-3 py-3 text-right font-bold text-emerald-700 bg-emerald-50/30 group-hover:bg-emerald-100/50 border-l border-gray-100">
                                                            {detail ? formatRupiah(detail.nilai_sisa) : '-'}
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}
                                            <td className="bg-gray-50/50 border-l border-gray-200"></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-4 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2">
                     <span>Menampilkan data tahun <b>{startYear}</b> sampai <b>{endYear}</b>.</span>
                     <span className="hidden lg:inline">Tekan <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono text-[10px]">Shift</kbd> + Scroll Mouse untuk geser tabel.</span>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}