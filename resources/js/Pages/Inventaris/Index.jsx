import React, { useState, useEffect, useRef, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    ChevronDownIcon,
    ChevronRightIcon,
    PlusIcon,
    PrinterIcon,
    ArrowDownTrayIcon,
    PencilSquareIcon,
    TrashIcon,
    PhotoIcon,
    ExclamationTriangleIcon,
    InboxIcon,
    DocumentDuplicateIcon,
    WrenchScrewdriverIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowsUpDownIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/solid';

// ==============================================================================
// 1. KOMPONEN-KOMPONEN REUSABLE (Tidak ada perubahan)
// ==============================================================================

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose} aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white">{title}</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 dark:text-slate-400">{children}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm" onClick={onConfirm}>Ya, Hapus</button>
                    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto sm:text-sm" onClick={onClose}>Batal</button>
                </div>
            </div>
        </div>
    );
};

// --- PENYESUAIAN DI SINI ---
const InventarisCard = ({ item, formatDate, formatCurrency, deleteHandler, isSelected, onCheckboxChange }) => (
    <div className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-md border overflow-hidden transition-all duration-300 ${isSelected ? 'border-green-500 ring-2 ring-green-500' : 'border-slate-200 dark:border-slate-700'}`}>
        <div className="p-4 flex items-start gap-4">
            <input type="checkbox" checked={isSelected} onChange={() => onCheckboxChange(item.id)} className="mt-1 h-5 w-5 flex-shrink-0 rounded border-gray-300 dark:border-slate-600 text-green-600 focus:ring-green-500" />
            {/* PERUBAHAN 1: Menggunakan item.foto_url dari Supabase */}
            {item.foto ? (
                <img
                    src={item.foto}
                    alt={item.nama_barang}
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                />
            ) : (
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center text-slate-400 dark:text-slate-500 flex-shrink-0">
                    <PhotoIcon className="w-10 h-10" />
                </div>
            )}

            <div className="flex-grow">
                <p className="font-bold text-lg text-slate-800 dark:text-white">{(item.nama_barang || '').toUpperCase()}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">No: <span className="font-medium text-slate-600 dark:text-slate-300">{item.nomor || 'N/A'}</span> / Kode: <span className="font-medium text-slate-600 dark:text-slate-300">{(item.kode_barang || 'N/A').toUpperCase()}</span></p>
                <p className="text-base font-semibold text-green-700 dark:text-green-500 mt-1">{formatCurrency(item.harga)}</p>
            </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-4 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Jumlah</p><p className="text-sm font-medium text-slate-800 dark:text-slate-200">Total: {item.jumlah}, Pakai: {item.jumlah_dipakai}, Rusak: {item.jumlah_rusak}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Tempat (Ruang)</p><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{(item.tempat_pemakaian || '').toUpperCase()} ({item.nomor_ruang || 'N/A'})</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Tgl. Masuk</p><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{formatDate(item.tanggal_masuk)}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Asal</p><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{(item.asal_perolehan || '').toUpperCase()}</p></div>
            <div className="col-span-2"><p className="text-xs text-slate-500 dark:text-slate-400">Diunggah Oleh</p><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.nama_pengunggah || 'N/A'}</p></div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 flex justify-around items-center border-t border-slate-200 dark:border-slate-700">
            <Link href={route('inventaris.edit', item.id)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 transition-colors"><PencilSquareIcon className="w-4 h-4" /><span>Edit</span></Link>
            <Link href={route('inventaris.duplicate', item.id)} method="post" as="button" preserveScroll className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-800 dark:text-purple-500 dark:hover:text-purple-400 transition-colors"><DocumentDuplicateIcon className="w-4 h-4" /><span>Duplikat</span></Link>
            <a href={route('inventaris.generateLabel', { inventari: item.id })} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 transition-colors"><PhotoIcon className="w-4 h-4" /><span>Label</span></a>
            <button onClick={deleteHandler} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 transition-colors"><TrashIcon className="w-4 h-4" /><span>Hapus</span></button>
        </div>
    </div>
);

// ==============================================================================
// 2. KOMPONEN UTAMA
// ==============================================================================
export default function Index({ inventarisGrouped, auth }) {
    // --- State, Refs, dan Logika ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const exportMenuRef = useRef(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [openGroups, setOpenGroups] = useState({});
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const sortMenuRef = useRef(null);

    // --- PENYESUAIAN KUNCI: Default sort diubah ke 'nomor' ---
    const [sortConfig, setSortConfig] = useState({ key: 'nomor', direction: 'asc' });

    const [searchQuery, setSearchQuery] = useState('');
    const csrfToken = useMemo(() => document.querySelector('meta[name="csrf-token"]').getAttribute('content'), []);
    const sortOptions = { 'nama_barang': 'Nama Barang', 'nomor': 'Nomor Barang', 'tanggal_masuk': 'Tanggal Masuk', 'tempat_pemakaian': 'Tempat' };

    // --- State untuk filter yang lebih fleksibel ---
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [filterMode, setFilterMode] = useState('range'); // 'range' atau 'specific'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterYear, setFilterYear] = useState('');

    // --- Logika filter data di frontend ---
    const isFilterActive = useMemo(() => {
        return searchQuery || (filterMode === 'range' && (startDate || endDate)) || (filterMode === 'specific' && filterYear);
    }, [searchQuery, filterMode, startDate, endDate, filterYear]);

    const filteredInventarisGrouped = useMemo(() => {
        if (!isFilterActive) {
            return inventarisGrouped;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return inventarisGrouped.map(group => {
            const filteredItems = group.items.filter(item => {
                const itemDate = item.tanggal_masuk ? new Date(item.tanggal_masuk) : null;
                const itemDateString = item.tanggal_masuk ? item.tanggal_masuk.split('T')[0] : null;

                if (filterMode === 'range') {
                    if (startDate && (!itemDateString || itemDateString < startDate)) return false;
                    if (endDate && (!itemDateString || itemDateString > endDate)) return false;
                }
                else if (filterMode === 'specific' && itemDate) {
                    if (filterYear && itemDate.getFullYear() !== parseInt(filterYear)) return false;
                }

                if (searchQuery) {
                    const searchMatch = (
                        (String(item.nomor || '')).toLowerCase().includes(lowercasedQuery) ||
                        (item.nama_barang || '').toLowerCase().includes(lowercasedQuery) ||
                        (item.kode_barang || '').toLowerCase().includes(lowercasedQuery) ||
                        (item.tempat_pemakaian || '').toLowerCase().includes(lowercasedQuery) ||
                        (item.spesifikasi || '').toLowerCase().includes(lowercasedQuery)
                    );
                    if (!searchMatch) return false;
                }
                return true;
            });
            return { ...group, items: filteredItems };
        }).filter(group => group.items.length > 0);
    }, [inventarisGrouped, searchQuery, filterMode, startDate, endDate, filterYear, isFilterActive]);

    const allItems = useMemo(() => filteredInventarisGrouped.flatMap(group => group.items), [filteredInventarisGrouped]);

    // --- Logika Pengurutan Data ---
    const sortedInventarisGrouped = useMemo(() => {
        let sortableItems = [...filteredInventarisGrouped];
        sortableItems.sort((a, b) => {
            const key = sortConfig.key;
            let comparison = 0;
            if (key === 'nomor') {
                const valA = String(a.items[0]?.nomor || '');
                const valB = String(b.items[0]?.nomor || '');
                comparison = valA.localeCompare(valB, undefined, { numeric: true });
            } else {
                let aValue, bValue;
                switch (key) {
                    case 'tanggal_masuk':
                        const getLatestDate = (items) => Math.max(...items.map(item => new Date(item.tanggal_masuk || 0).getTime()));
                        aValue = getLatestDate(a.items);
                        bValue = getLatestDate(b.items);
                        break;
                    case 'tempat_pemakaian':
                        aValue = (a.items[0]?.tempat_pemakaian || '').toLowerCase();
                        bValue = (b.items[0]?.tempat_pemakaian || '').toLowerCase();
                        break;
                    default:
                        aValue = (a.nama_barang || '').toLowerCase();
                        bValue = (b.nama_barang || '').toLowerCase();
                        break;
                }
                if (aValue < bValue) comparison = -1;
                if (aValue > bValue) comparison = 1;
            }
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
        return sortableItems;
    }, [filteredInventarisGrouped, sortConfig]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) setIsExportMenuOpen(false);
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) setIsSortMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setSelectedIds([]);
    }, [searchQuery, inventarisGrouped, startDate, endDate, filterYear]);

    // --- Logika Navigasi 'Sticky' ---
    const [isSticky, setIsSticky] = useState(false);
    const [stickyNavHeight, setStickyNavHeight] = useState(0);
    const actionNavRef = useRef(null);

    useEffect(() => {
        const nav = actionNavRef.current;
        if (!nav) return;
        const resizeObserver = new ResizeObserver(() => {
            if (actionNavRef.current) {
                setStickyNavHeight(actionNavRef.current.offsetHeight);
            }
        });
        resizeObserver.observe(nav);
        const navTop = nav.offsetTop;
        const handleScroll = () => { setIsSticky(window.scrollY > navTop); };
        window.addEventListener('scroll', handleScroll);
        setStickyNavHeight(nav.offsetHeight);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, []);

    // --- Handlers dan Fungsi Utilitas ---
    const openDeleteConfirm = (item) => { setItemToDelete(item); setIsModalOpen(true); };
    const handleConfirmDelete = () => { if (itemToDelete) { router.delete(route('inventaris.destroy', itemToDelete.id), { preserveScroll: true, onFinish: () => { setIsModalOpen(false); setItemToDelete(null); } }); } };
    const handleConfirmBatchDelete = () => { router.delete(route('inventaris.bulkDestroy'), { data: { ids: selectedIds }, preserveScroll: true, onFinish: () => { setIsBatchDeleteModalOpen(false); setSelectedIds([]); } }); };
    const handleCheckboxChange = (id) => { setSelectedIds(prevIds => prevIds.includes(id) ? prevIds.filter(prevId => prevId !== id) : [...prevIds, id]); };
    const handleSelectAll = (e) => { setSelectedIds(e.target.checked ? allItems.map(item => item.id) : []); };
    const toggleGroup = (nama_barang) => { setOpenGroups(prev => ({ ...prev, [nama_barang]: !prev[nama_barang] })); };
    const formatDate = (dateString) => { if (!dateString) return '-'; return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }); };
    const formatCurrency = (value) => { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0); };
    const handleSort = (key) => { let direction = 'asc'; if (sortConfig.key === key && sortConfig.direction === 'asc') { direction = 'desc'; } setSortConfig({ key, direction }); setIsSortMenuOpen(false); };
    const isAllSelected = allItems.length > 0 && selectedIds.length === allItems.length;

    const pdfExportUrl = useMemo(() => {
        const baseUrl = route('inventaris.exportPDF');
        const params = new URLSearchParams();
        if (filterMode === 'range') {
            if (startDate) params.append('tanggal_mulai', startDate);
            if (endDate) params.append('tanggal_selesai', endDate);
        } else {
            if (filterYear) params.append('tahun', filterYear);
        }
        if (Array.from(params.keys()).length > 0) {
            return `${baseUrl}?${params.toString()}`;
        }
        return baseUrl;
    }, [filterMode, startDate, endDate, filterYear]);

    const handleResetFilters = () => {
        setStartDate('');
        setEndDate('');
        setFilterYear('');
    };

    const yearOptions = useMemo(() => {
        const allDates = inventarisGrouped
            .flatMap(group => group.items.map(item => item.tanggal_masuk))
            .filter(date => date);
        const years = allDates.map(dateString => new Date(dateString).getFullYear());
        const uniqueYears = [...new Set(years)];
        uniqueYears.sort((a, b) => b - a);
        return uniqueYears;
    }, [inventarisGrouped]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={"Manajemen Inventaris"}
        >
            <Head title="Daftar Inventaris" />
            <main className="bg-slate-100 dark:bg-slate-900 min-h-screen">
                
                <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">

                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-4">
                            <div className="relative flex-grow">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"><MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /></div>
                                <input type="search" className="block w-full rounded-lg border-0 py-2.5 pl-10 text-gray-900 dark:text-white bg-white dark:bg-slate-900 ring-1 ring-inset ring-gray-300 dark:ring-slate-700 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-green-600 dark:focus:ring-green-500 sm:text-sm" placeholder="Cari barang, nomor, kode..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>

                            <div>
                                <button
                                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                                    className={`flex items-center justify-between w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75 transition-all duration-200 ${isFilterVisible ? 'rounded-t-lg' : 'rounded-lg'}`}
                                >
                                    <span>
                                        Filter Berdasarkan Tanggal
                                        {((filterMode === 'range' && (startDate || endDate)) || (filterMode === 'specific' && filterYear)) && (
                                            <span className="ml-2 text-xs font-bold text-white bg-green-600 px-2 py-0.5 rounded-full">Aktif</span>
                                        )}
                                    </span>
                                    <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${isFilterVisible ? 'transform rotate-180' : ''}`} />
                                </button>

                                {isFilterVisible && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-b-lg border-x border-b border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center gap-6 mb-4">
                                            <label className="flex items-center cursor-pointer">
                                                <input type="radio" name="filterMode" value="range" checked={filterMode === 'range'} onChange={() => setFilterMode('range')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-slate-600" />
                                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-slate-300">Rentang Tanggal</span>
                                            </label>
                                            <label className="flex items-center cursor-pointer">
                                                <input type="radio" name="filterMode" value="specific" checked={filterMode === 'specific'} onChange={() => setFilterMode('specific')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-slate-600" />
                                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-slate-300">Per Tahun</span>
                                            </label>
                                        </div>

                                        {filterMode === 'range' ? (
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <label htmlFor="start_date" className="text-sm font-medium text-gray-700 dark:text-slate-300 flex-shrink-0">Dari:</label>
                                                    <input type="date" id="start_date" value={startDate} onChange={(e) => setStartDate(e.target.value)} max={endDate || ''} className="block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
                                                </div>
                                                <div className="flex items-center gap-2 flex-1">
                                                    <label htmlFor="end_date" className="text-sm font-medium text-gray-700 dark:text-slate-300 flex-shrink-0">Sampai:</label>
                                                    <input type="date" id="end_date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || ''} className="block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <label htmlFor="filter_year" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Tahun</label>
                                                    <select id="filter_year" value={filterYear} onChange={e => setFilterYear(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                                                        <option value="">Semua</option>
                                                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        {(startDate || endDate || filterYear) && (
                                            <button onClick={handleResetFilters} className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 transition-colors">
                                                Reset Filter Tanggal
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {isSticky && <div style={{ height: actionNavRef.current?.offsetHeight }} />}

                        <div ref={actionNavRef} className={`transition-all duration-200 ${isSticky ? 'fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg' : 'relative'}`}>
                            <div className={`${isSticky ? 'container mx-auto' : ''}`}>
                                <div className="p-4">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:flex lg:gap-3 lg:flex-grow-[2]">
                                            <Link href={route('inventaris.create')} className="flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 font-bold text-white transition-transform hover:scale-105 lg:flex-1"><PlusIcon className="h-5 w-5 mr-2" /><span>Tambah</span></Link>
                                            <Link href={selectedIds.length > 0 ? route('inventaris.bulkEdit', { ids: selectedIds.join(',') }) : '#'} as="button" disabled={selectedIds.length === 0} className="flex items-center justify-center rounded-lg bg-yellow-500 px-4 py-2 font-bold text-white transition-transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-yellow-300 dark:disabled:bg-yellow-800 dark:disabled:text-yellow-500 lg:flex-1"><WrenchScrewdriverIcon className="h-5 w-5 mr-2" /><span>Edit ({selectedIds.length})</span></Link>
                                            <form action={route('inventaris.downloadBulkLabels')} method="POST" target="_blank" className="w-full h-full lg:flex-1"><input type="hidden" name="_token" value={csrfToken} />{selectedIds.map(id => (<input type="hidden" name="ids[]" value={id} key={id} />))}<button type="submit" disabled={selectedIds.length === 0} className="flex w-full h-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 font-bold text-white transition-transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-800 dark:disabled:text-blue-500"><DocumentDuplicateIcon className="h-5 w-5 mr-2" /><span>Cetak ({selectedIds.length})</span></button></form>
                                            <button onClick={() => setIsBatchDeleteModalOpen(true)} disabled={selectedIds.length === 0} className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition-transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-red-300 dark:disabled:bg-red-800 dark:disabled:text-red-500 lg:flex-1"><TrashIcon className="h-5 w-5 mr-2" /><span>Hapus ({selectedIds.length})</span></button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 lg:flex lg:gap-3 lg:flex-grow-[1]">
                                            <a href={route('inventaris.print')} target="_blank" className="flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 px-4 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-600 lg:flex-1"><PrinterIcon className="h-5 w-5 lg:mr-2" /><span className="hidden lg:inline">Print</span></a>
                                            <div className="relative lg:flex-1" ref={sortMenuRef}><button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} className="flex w-full h-full items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 px-4 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-600"><ArrowsUpDownIcon className="h-5 w-5 lg:mr-2" /><span className="hidden lg:inline">Urutkan</span><ChevronDownIcon className="ml-1 hidden h-4 w-4 lg:inline" /></button>{isSortMenuOpen && (<div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-700 ring-1 ring-black/5 dark:ring-white/10 z-50"><div className="py-1"><div className="px-4 py-2 text-xs text-gray-500 dark:text-slate-400 uppercase">Urutkan Berdasarkan</div>{Object.entries(sortOptions).map(([key, label]) => (<button key={key} onClick={() => handleSort(key)} className={`w-full text-left flex justify-between items-center px-4 py-2 text-sm ${sortConfig.key === key ? 'font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/50' : 'text-slate-700 dark:text-slate-300'} hover:bg-slate-100 dark:hover:bg-slate-600`}><span>{label}</span>{sortConfig.key === key && (sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />)}</button>))}</div></div>)}</div>
                                            <div className="relative lg:flex-1" ref={exportMenuRef}><button onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} className="flex w-full h-full items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 px-4 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-600"><ArrowDownTrayIcon className="h-5 w-5 lg:mr-2" /><span className="hidden lg:inline">Export</span><ChevronDownIcon className="ml-1 hidden h-4 w-4 lg:inline" /></button>{isExportMenuOpen && (<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-700 ring-1 ring-black/5 dark:ring-white/10 z-50"><div className="py-1"><a href={route('inventaris.exportExcel')} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600">Excel</a><a href={pdfExportUrl} target="_blank" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600">PDF</a></div></div>)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {sortedInventarisGrouped.length > 0 ? (
                                <>
                                    <div className="hidden md:block">
                                        <table className="min-w-full border-separate" style={{ borderSpacing: '0 0.75rem' }}>
                                            <thead>
                                                <tr>
                                                    <th className="sticky px-5 py-3 text-left bg-green-600 rounded-l-lg z-30" style={{ top: isSticky ? stickyNavHeight : 0 }}>
                                                        <input type="checkbox" onChange={handleSelectAll} checked={isAllSelected} className="h-4 w-4 rounded border-gray-300 dark:border-gray-500 text-green-600 focus:ring-green-500" />
                                                    </th>
                                                    {['Foto', 'Barang (Nomor & Kode)', 'Spesifikasi', 'Jumlah', 'Tempat (Ruang)', 'Tgl Masuk & Asal', 'Diunggah Oleh', 'Harga', 'Aksi'].map((header, index, arr) => (
                                                        <th
                                                            key={header}
                                                            className={`sticky bg-green-600 px-5 py-3 text-left text-xs font-bold text-white uppercase tracking-wider z-30 ${index === arr.length - 1 ? 'rounded-r-lg' : ''}`}
                                                            style={{ top: isSticky ? stickyNavHeight : 0 }}
                                                        >
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedInventarisGrouped.map((group) => (
                                                    <React.Fragment key={group.nama_barang}>
                                                        <tr onClick={() => toggleGroup(group.nama_barang)} className="bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer shadow-sm">
                                                            <td colSpan="10" className="px-5 py-3 rounded-lg">
                                                                <div className="flex justify-between items-center w-full">
                                                                    <div className="flex items-center font-bold text-slate-800 dark:text-slate-200">
                                                                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-slate-500 text-green-600 focus:ring-green-500 mr-4" onClick={(e) => e.stopPropagation()} onChange={(e) => { const groupItemIds = group.items.map(item => item.id); if (e.target.checked) { setSelectedIds(prevIds => [...new Set([...prevIds, ...groupItemIds])]); } else { setSelectedIds(prevIds => prevIds.filter(id => !groupItemIds.includes(id))); } }} checked={group.items.length > 0 && group.items.every(item => selectedIds.includes(item.id))} />
                                                                        {openGroups[group.nama_barang] ? <ChevronDownIcon className="w-5 h-5 mr-2" /> : <ChevronRightIcon className="w-5 h-5 mr-2" />}
                                                                        <span>
                                                                            {(group.nama_barang || '').toUpperCase()}
                                                                            {group.items?.[0]?.nomor && (<span className="ml-2 font-normal text-slate-600 dark:text-slate-400 text-sm">/ No. Barang: {group.items[0].nomor}</span>)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total: <span className="text-slate-800 dark:text-slate-200">{group.total_keseluruhan}</span></div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {openGroups[group.nama_barang] && group.items.map((item) => (
                                                            <tr key={item.id} className={`${selectedIds.includes(item.id) ? 'bg-green-50 dark:bg-green-500/10' : 'bg-white dark:bg-slate-800'} transition-colors`}>
                                                                <td className="px-5 py-4 border-b border-slate-200 dark:border-slate-700"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleCheckboxChange(item.id)} className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-green-600 focus:ring-green-500" /></td>
                                                                {/* PERUBAHAN 2: Menggunakan item.foto_url dari Supabase */}
                                                                <td className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 text-sm">{item.foto_url ? <img src={item.foto_url} alt={item.nama_barang} className="w-16 h-16 object-cover rounded-md" /> : <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center text-slate-400 dark:text-slate-500"><PhotoIcon className="w-8 h-8" /></div>}</td>
                                                                <td className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 text-sm"><p className="text-slate-900 dark:text-white font-semibold">{item.nama_barang.toUpperCase()}</p><p className="text-slate-500 dark:text-slate-400">No: {item.nomor}</p><p className="text-slate-500 dark:text-slate-400 text-xs">Kode: {item.kode_barang.toUpperCase()}</p></td>
                                                                <td className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-300">{(item.spesifikasi || '-').toUpperCase()}</td>
                                                                <td className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-300"><p>Total: {item.jumlah}</p><p className="text-xs">Pakai: {item.jumlah_dipakai}</p><p className="text-xs">Rusak: {item.jumlah_rusak}</p></td>
                                                                <td className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-300"><p>{item.tempat_pemakaian.toUpperCase()}</p><p className="text-xs">Ruang: {item.nomor_ruang}</p></td>
                                                                <td className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-300"><p>{formatDate(item.tanggal_masuk)}</p><p className="text-xs text-slate-500 dark:text-slate-400">Asal: {(item.asal_perolehan || '-').toUpperCase()}</p></td>
                                                                <td className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-300">{item.nama_pengunggah || '-'}</td>
                                                                <td className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 text-sm text-right text-slate-800 dark:text-slate-300">{formatCurrency(item.harga)}</td>
                                                                <td className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 text-sm text-center"><div className="flex justify-center items-center gap-2"><Link href={route('inventaris.edit', item.id)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 rounded-full"><PencilSquareIcon className="w-5 h-5" /></Link><Link href={route('inventaris.duplicate', item.id)} method="post" as="button" preserveScroll className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/50 dark:hover:text-purple-400 rounded-full"><DocumentDuplicateIcon className="w-5 h-5" /></Link><a href={route('inventaris.generateLabel', { inventari: item.id })} target="_blank" className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 dark:hover:text-green-400 rounded-full"><PhotoIcon className="w-5 h-5" /></a><button onClick={() => openDeleteConfirm(item)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 dark:hover:text-red-400 rounded-full"><TrashIcon className="w-5 h-5" /></button></div></td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="md:hidden space-y-6">
                                        <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700"><input type="checkbox" id="select-all-mobile" onChange={handleSelectAll} checked={isAllSelected} className="h-5 w-5 rounded border-gray-300 dark:border-slate-600 text-green-600 focus:ring-green-500" /><label htmlFor="select-all-mobile" className="ml-3 block text-sm font-medium text-slate-800 dark:text-slate-200">Pilih semua item</label></div>
                                        {sortedInventarisGrouped.map(group => (<div key={group.nama_barang}><h2 className="text-lg font-bold mb-3 text-slate-800 dark:text-white">{group.nama_barang.toUpperCase()} <span className="font-normal text-base text-slate-600 dark:text-slate-400">({group.items.length} item)</span></h2><div className="space-y-4">{group.items.map(item => (<InventarisCard key={item.id} item={item} formatDate={formatDate} formatCurrency={formatCurrency} deleteHandler={() => openDeleteConfirm(item)} isSelected={selectedIds.includes(item.id)} onCheckboxChange={handleCheckboxChange} />))}</div></div>))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <InboxIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                                    <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-white">{isFilterActive ? 'Data Tidak Ditemukan' : 'Belum Ada Data'}</h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{isFilterActive ? `Tidak ada data yang cocok dengan kriteria filter Anda.` : 'Mulai kelola inventaris Anda.'}</p>
                                    {!isFilterActive && <div className="mt-6"><Link href={route('inventaris.create')} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"><PlusIcon className="-ml-1 mr-2 h-5 w-5" />Tambah Data</Link></div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} title="Hapus Data Inventaris">
                Apakah Anda yakin ingin menghapus data <strong className="font-bold text-slate-800 dark:text-white">{(itemToDelete?.nama_barang || '').toUpperCase()}</strong>? Tindakan ini tidak dapat dibatalkan.
            </ConfirmationModal>

            <ConfirmationModal
                isOpen={isBatchDeleteModalOpen}
                onClose={() => setIsBatchDeleteModalOpen(false)}
                onConfirm={handleConfirmBatchDelete}
                title="Hapus Data Terpilih"
            >
                Apakah Anda yakin akan menghapus <strong className="font-bold text-slate-800 dark:text-white">{selectedIds.length} data</strong> yang dipilih? Tindakan ini tidak dapat dibatalkan.
            </ConfirmationModal>
        </AuthenticatedLayout>
    );
}