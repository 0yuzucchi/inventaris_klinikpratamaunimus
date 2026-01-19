import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

// --- KOMPONEN UI UTILS ---

const InputGroup = ({ label, children, htmlFor, subtext, required }) => (
    <div className="mb-4 relative">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div>{children}</div>
        {subtext && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtext}</p>}
    </div>
);

const TextInput = ({ name, label, value, onChange, type = 'text', error, prefix, suffix, required, ...props }) => (
    <InputGroup label={label} htmlFor={name} required={required}>
        <div className="relative">
            {prefix && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm font-bold">{prefix}</span>
                </div>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className={`
                    block w-full rounded-md shadow-sm py-2 
                    focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50
                    border-transparent dark:border-slate-600 
                    bg-slate-50 text-slate-900 dark:bg-slate-700 dark:text-white
                    ${prefix ? 'pl-10' : 'px-4'} 
                    ${suffix ? 'pr-10' : 'px-4'}
                    ${error ? 'border-red-500' : ''}
                `}
                {...props}
            />
            {suffix && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm font-bold">{suffix}</span>
                </div>
            )}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </InputGroup>
);

const TextArea = ({ name, label, value, onChange, error, ...props }) => (
    <InputGroup label={label} htmlFor={name}>
        <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="block w-full rounded-md bg-slate-50 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50"
            {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </InputGroup>
);

// --- RELATIONAL DROPDOWN (Style Khusus) ---
const RelationalDropdown = ({ label, value, options = [], onSelect, error, required, placeholder = "Pilih..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const ref = useRef(null);

    const safeOptions = Array.isArray(options) ? options : [];
    const selectedOption = safeOptions.find(opt => opt.id == value);

    const filteredOptions = safeOptions.filter(opt => {
        const teksLabel = opt?.label ? String(opt.label).toLowerCase() : "";
        const search = searchTerm.toLowerCase();
        return teksLabel.includes(search);
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isComplexItem = (item) => item && (item.nama_barang || item.image || item.kode_barang);

    return (
        <InputGroup label={label} required={required}>
            <div className="relative" ref={ref}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        relative w-full text-left rounded-xl shadow-sm border
                        bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600
                        focus:border-green-500 focus:ring-2 focus:ring-green-500/20 
                        transition-all duration-200 ease-in-out
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                        ${selectedOption && isComplexItem(selectedOption) ? 'py-3 pl-3 pr-10' : 'py-2.5 pl-4 pr-10'}
                    `}
                >
                    <div className="flex items-center gap-4 overflow-hidden">
                        {selectedOption && isComplexItem(selectedOption) ? (
                            <>
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-50 flex items-center justify-center">
                                    {selectedOption.image ? (
                                        <img src={selectedOption.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="block truncate text-sm font-bold text-slate-800 dark:text-white">
                                        {selectedOption.nama_barang}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-2">
                                        <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
                                            {selectedOption.kode_barang}
                                        </span>
                                        <span>• {selectedOption.lokasi}</span>
                                    </span>
                                </div>
                            </>
                        ) : (
                            <span className={`block truncate text-sm ${selectedOption ? "text-slate-800 dark:text-white font-medium" : "text-slate-400"}`}>
                                {selectedOption ? selectedOption.label : placeholder}
                            </span>
                        )}
                    </div>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-[100] mt-2 min-w-full w-auto max-w-[90vw] sm:max-w-md overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100 origin-top">
                        <div className="sticky top-0 z-10 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-3">
                            <input
                                type="text"
                                className="block w-full rounded-lg border-none bg-slate-100 dark:bg-slate-900 py-2 pl-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all placeholder:text-slate-400"
                                placeholder="Cari..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <ul className="max-h-72 overflow-y-auto scroll-py-2 p-2 space-y-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => {
                                    const isComplex = isComplexItem(opt);
                                    const isSelected = value == opt.id;
                                    return (
                                        <li key={opt.id}>
                                            <button
                                                type="button"
                                                onClick={() => { onSelect(opt.id); setIsOpen(false); setSearchTerm(""); }}
                                                className={`group flex w-full items-center gap-3 rounded-lg text-left transition-all duration-200 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 ${isSelected ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800 ring-1 ring-green-500/20' : ''} ${isComplex ? 'p-3 items-start' : 'px-4 py-2.5'}`}
                                            >
                                                {isComplex ? (
                                                    <>
                                                        <div className="flex-shrink-0 pt-1">
                                                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-white shadow-sm border border-slate-100">
                                                                {opt.image ? <img src={opt.image} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <span className={`text-sm font-bold pr-2 whitespace-normal break-words leading-tight ${isSelected ? 'text-green-800 dark:text-green-400' : 'text-slate-800 dark:text-white'}`}>{opt.nama_barang}</span>
                                                                {isSelected && <svg className="h-5 w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                                            </div>
                                                            <div className="flex flex-wrap gap-1.5 mt-2 mb-1.5">
                                                                <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10 font-mono">{opt.kode_barang}</span>
                                                                <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10">{opt.lokasi}</span>
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">{opt.kondisi}</div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex-1 flex justify-between items-center">
                                                        <span className={`text-sm font-medium ${isSelected ? 'text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-slate-200'}`}>{opt.label}</span>
                                                        {isSelected && <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                                    </div>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })
                            ) : (<li className="p-8 text-center text-slate-400 text-sm">Data tidak ditemukan.</li>)}
                        </ul>
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
        </InputGroup>
    );
};

// --- UTILS FORMAT ---
const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

export default function Create({ auth, inventarisList }) {
    const { data, setData, post, processing, errors } = useForm({
        inventaris_id: '',
        tanggal_perolehan: new Date().toISOString().split('T')[0],
        keterangan: '',
        
        // Data Angka (String agar bisa kosong)
        harga_perolehan_awal: '',
        penambahan: '',
        pengurangan: '',
        tarif_penyusutan: '25', // Default 25% sesuai excel
    });

    const [simulasi, setSimulasi] = useState([]);
    const [totalBasis, setTotalBasis] = useState(0);

    // --- LOGIC SIMULASI JS (Realtime) ---
    useEffect(() => {
        const awal = parseFloat(data.harga_perolehan_awal) || 0;
        const tambah = parseFloat(data.penambahan) || 0;
        const kurang = parseFloat(data.pengurangan) || 0;
        const tarif = parseFloat(data.tarif_penyusutan) || 0;
        const basis = awal + tambah - kurang;
        
        setTotalBasis(basis);

        if (basis <= 0 || tarif <= 0 || !data.tanggal_perolehan) {
            setSimulasi([]);
            return;
        }

        const date = new Date(data.tanggal_perolehan);
        const startYear = date.getFullYear();
        const startMonth = date.getMonth() + 1; // 1-12
        const bebanPerTahun = basis * (tarif / 100);
        
        // Loop simulasi 5-8 tahun kedepan (cukup untuk preview)
        const hasil = [];
        let akumulasi = 0;
        let tahun = startYear;

        while (true) {
            let beban = 0;
            
            // Break loop jika sisa <= 100 perak (toleransi pembulatan)
            if (basis - akumulasi <= 100) break;
            if (tahun > startYear + 10) break; // Safety break

            if (tahun === startYear) {
                // Prorata Tahun Pertama: (13 - Bulan) / 12
                const bulanPakai = 13 - startMonth;
                beban = bebanPerTahun * (bulanPakai / 12);
            } else {
                beban = bebanPerTahun;
            }

            // Capping
            if (akumulasi + beban > basis) {
                beban = basis - akumulasi;
            }

            akumulasi += beban;
            const sisa = basis - akumulasi;

            hasil.push({
                tahun: tahun,
                beban: Math.round(beban),
                akumulasi: Math.round(akumulasi),
                sisa: Math.round(sisa)
            });

            tahun++;
        }
        setSimulasi(hasil);

    }, [data.harga_perolehan_awal, data.penambahan, data.pengurangan, data.tarif_penyusutan, data.tanggal_perolehan]);

    const handleNumber = (field, val) => {
        setData(field, val.replace(/[^0-9]/g, ''));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('nilai-aset.store'));
    };

    const handleSelectInventaris = (id) => {
        const item = inventarisList.find(i => i.id == id);
        setData(prev => ({
            ...prev,
            inventaris_id: id,
            harga_perolehan_awal: item ? String(parseInt(item.harga_referensi)) : '',
            tanggal_perolehan: item && item.tanggal_referensi ? item.tanggal_referensi.split('T')[0] : prev.tanggal_perolehan,
            keterangan: item ? item.nama_barang : ''
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Input Aset & Penyusutan</h2>}
        >
            <Head title="Input Aset" />

            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg relative p-6 sm:p-8">
                        
                        {/* 
                            LAYOUT BARU:
                            Container GRID untuk 2 Kolom Input (Data Aset & Nilai Perolehan) 
                        */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            
                            {/* --- KOLOM KIRI: DATA ASET --- */}
                            <div className="space-y-5">
                                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2">1. Data Aset</h3>
                                
                                <RelationalDropdown
                                    label="Pilih Inventaris"
                                    value={data.inventaris_id}
                                    options={inventarisList}
                                    onSelect={handleSelectInventaris}
                                    error={errors.inventaris_id}
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <TextInput
                                        label="Tanggal Perolehan"
                                        name="tanggal_perolehan"
                                        type="date"
                                        value={data.tanggal_perolehan}
                                        onChange={e => setData('tanggal_perolehan', e.target.value)}
                                        error={errors.tanggal_perolehan}
                                        required
                                    />
                                    <TextInput
                                        label="Tarif Penyusutan (%)"
                                        name="tarif_penyusutan"
                                        type="number"
                                        value={data.tarif_penyusutan}
                                        onChange={e => setData('tarif_penyusutan', e.target.value)}
                                        error={errors.tarif_penyusutan}
                                        suffix="%"
                                        required
                                    />
                                </div>

                                <TextArea
                                    label="Keterangan (Nama Barang di Laporan)"
                                    name="keterangan"
                                    rows={2}
                                    value={data.keterangan}
                                    onChange={e => setData('keterangan', e.target.value)}
                                    error={errors.keterangan}
                                />
                            </div>

                            {/* --- KOLOM KANAN: NILAI PEROLEHAN --- */}
                            <div className="space-y-5">
                                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 border-b pb-2">2. Nilai Perolehan</h3>
                                
                                <TextInput
                                    label="Harga Perolehan Awal"
                                    name="harga_perolehan_awal"
                                    value={data.harga_perolehan_awal ? formatRupiah(data.harga_perolehan_awal) : ''}
                                    onChange={e => handleNumber('harga_perolehan_awal', e.target.value)}
                                    error={errors.harga_perolehan_awal}
                                    prefix="Rp"
                                    placeholder="0"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <TextInput
                                        label="Penambahan"
                                        name="penambahan"
                                        value={data.penambahan ? formatRupiah(data.penambahan) : ''}
                                        onChange={e => handleNumber('penambahan', e.target.value)}
                                        error={errors.penambahan}
                                        prefix="Rp"
                                        placeholder="0"
                                    />
                                    <TextInput
                                        label="Pengurangan"
                                        name="pengurangan"
                                        value={data.pengurangan ? formatRupiah(data.pengurangan) : ''}
                                        onChange={e => handleNumber('pengurangan', e.target.value)}
                                        error={errors.pengurangan}
                                        prefix="Rp"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="p-3 bg-blue-50 rounded-lg flex justify-between items-center border border-blue-100 mt-auto">
                                    <span className="text-sm font-semibold text-blue-800">Total Basis Penyusutan:</span>
                                    <span className="text-lg font-bold text-blue-900">{formatRupiah(totalBasis)}</span>
                                </div>
                            </div>
                        </div>

                        {/* --- BAGIAN BAWAH: SIMULASI PENYUSUTAN (FULL WIDTH) --- */}
                        <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-700 dark:text-white">Simulasi Penyusutan</h3>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">Otomatis</span>
                            </div>

                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Tahun</th>
                                            <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">Beban</th>
                                            <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">Akumulasi</th>
                                            <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">Nilai Buku</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {simulasi.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-3 py-8 text-center text-sm text-gray-400 italic">
                                                    Lengkapi data harga & tanggal untuk melihat hasil.
                                                </td>
                                            </tr>
                                        ) : (
                                            simulasi.map((row) => (
                                                <tr key={row.tahun} className="hover:bg-blue-50/50 transition">
                                                    <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-900">{row.tahun}</td>
                                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-right text-gray-600">{formatRupiah(row.beban)}</td>
                                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-right text-gray-500">{formatRupiah(row.akumulasi)}</td>
                                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-right font-bold text-blue-600">{formatRupiah(row.sisa)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-400 mt-3 text-center">
                                * Perhitungan menggunakan metode Garis Lurus Prorata (sesuai bulan perolehan).
                            </p>
                        </div>

                        {/* BUTTONS */}
                        <div className="mt-8 flex justify-end gap-3 border-t pt-5">
                            <Link href={route('nilai-aset.index')} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>

                    </form>
                </div>
        </AuthenticatedLayout>
    );
}