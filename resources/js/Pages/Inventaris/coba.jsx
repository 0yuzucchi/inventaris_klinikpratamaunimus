// import React, { useState, useMemo, useEffect, useRef } from 'react';
// import { Head, Link, useForm, usePage } from '@inertiajs/react';
// import { route } from 'ziggy-js';
// import axios from 'axios';
// import {
//     ArrowLeftIcon,
//     PhotoIcon,
//     ArrowUpTrayIcon,
//     ChevronDownIcon,
//     CheckIcon,
//     TrashIcon,
//     XCircleIcon,
//     XMarkIcon,
//     SparklesIcon,
//     CameraIcon // Tambah icon kamera
// } from '@heroicons/react/24/solid';
// import { Transition } from '@headlessui/react';

// // --- KOMPONEN BANTU (InputGroup, TextInput, dll - TIDAK BERUBAH) ---

// const InputGroup = ({ label, children, htmlFor, subtext }) => (
//     <div>
//         <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
//             {label}
//         </label>
//         <div className="mt-1">{children}</div>
//         {subtext && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtext}</p>}
//     </div>
// );

// const TextInput = ({ name, label, value, onChange, error, subtext, ...props }) => (
//     <InputGroup label={label} htmlFor={name} subtext={subtext}>
//         <input
//             id={name}
//             name={name}
//             type={props.type || 'text'}
//             value={value || ''}
//             onChange={onChange}
//             onWheel={event => event.currentTarget.blur()}
//             className={`block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50 ${error ? 'border-red-500' : ''}`} {...props}
//         />
//         {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
//     </InputGroup>
// );

// const TextArea = ({ name, label, value, onChange, error, ...props }) => (
//     <InputGroup label={label} htmlFor={name}>
//         <textarea id={name} name={name} value={value || ''} onChange={onChange} className={`block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50 ${error ? 'border-red-500' : ''}`} {...props} />
//         {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
//     </InputGroup>
// );

// const FileInput = ({ name, label, onChange, onRemove, error, previewUrl, subtext }) => (
//     <InputGroup label={label} htmlFor={name} subtext={subtext}>
//         <div className="flex flex-wrap items-start gap-4">
//             {previewUrl ?
//                 <img src={previewUrl} alt="Pratinjau" className="w-40 h-40 object-cover rounded-lg border dark:border-slate-600" /> :
//                 <div className="w-40 h-40 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
//                     <PhotoIcon className="w-16 h-16" />
//                 </div>
//             }
//             <div className="flex flex-col gap-3 pt-1">
//                 <label htmlFor={name} className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-sm font-semibold text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 rounded-md hover:bg-green-50 dark:hover:bg-slate-600 transition">
//                     <ArrowUpTrayIcon className="w-5 h-5" />
//                     <span>{previewUrl ? 'Ganti File' : 'Pilih File'}</span>
//                 </label>
//                 {previewUrl && (
//                     <button type="button" onClick={onRemove} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-slate-700 text-sm font-semibold text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-slate-600 transition">
//                         <TrashIcon className="w-5 h-5" />
//                         <span>Hapus Gambar</span>
//                     </button>
//                 )}
//                 <input id={name} name={name} type="file" onChange={onChange} className="hidden" />
//             </div>
//         </div>
//         {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
//     </InputGroup>
// );

// const AutocompleteInput = ({ name, label, value, onChange, onSelect, error, subtext, options = [], ...props }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const componentRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (componentRef.current && !componentRef.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const filteredOptions = useMemo(() => {
//         if (!value) return [];
//         return options.filter(opt =>
//             opt.toLowerCase().includes(value.toLowerCase()) && opt.toLowerCase() !== value.toLowerCase()
//         );
//     }, [value, options]);

//     const handleSelect = (option) => {
//         onSelect(option);
//         setIsOpen(false);
//     };

//     return (
//         <InputGroup label={label} htmlFor={name} subtext={subtext}>
//             <div className="relative" ref={componentRef}>
//                 <input
//                     id={name}
//                     name={name}
//                     type="text"
//                     value={value || ''}
//                     onChange={onChange}
//                     onFocus={() => setIsOpen(true)}
//                     className={`block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50 ${error ? 'border-red-500' : ''}`}
//                     {...props}
//                     autoComplete="off"
//                 />
//                 {isOpen && filteredOptions.length > 0 && (
//                     <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 shadow-lg rounded-md border border-slate-200 dark:border-slate-600 max-h-64 overflow-auto">
//                         <ul className="py-1">
//                             {filteredOptions.map((option, index) => (
//                                 <li key={index}>
//                                     <button
//                                         type="button"
//                                         onClick={() => handleSelect(option)}
//                                         className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-slate-600"
//                                     >
//                                         {option}
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//             </div>
//             {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
//         </InputGroup>
//     );
// };

// const DropdownInput = ({ name, label, value, onChange, error, customError, subtext, options, onOptionSelect, ...props }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [activeIndex, setActiveIndex] = useState(-1);
//     const dropdownRef = useRef(null);
//     const listRef = useRef(null);
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);
//     const cleanValueForFiltering = useMemo(() => String(value).replace(/^R\./i, '').toLowerCase(), [value]);
//     const filteredOptions = useMemo(() => {
//         if (!cleanValueForFiltering) return options;
//         return options.filter(opt =>
//             `${opt.kode} (${opt.keterangan})`.toLowerCase().includes(cleanValueForFiltering)
//         );
//     }, [cleanValueForFiltering, options]);
//     useEffect(() => {
//         if (isOpen && listRef.current && activeIndex >= 0) {
//             const item = listRef.current.children[activeIndex];
//             if (item) item.scrollIntoView({ block: 'nearest' });
//         }
//     }, [activeIndex, isOpen]);
//     const handleKeyDown = (e) => {
//         if (!isOpen) { if (e.key === 'ArrowDown' || e.key === 'Enter') { e.preventDefault(); setIsOpen(true); } return; }
//         switch (e.key) {
//             case 'ArrowDown': e.preventDefault(); setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev)); break;
//             case 'ArrowUp': e.preventDefault(); setActiveIndex(prev => (prev > 0 ? prev - 1 : 0)); break;
//             case 'Enter':
//                 e.preventDefault();
//                 if (activeIndex >= 0 && filteredOptions[activeIndex]) {
//                     handleOptionClick(filteredOptions[activeIndex]);
//                 }
//                 break;
//             case 'Escape': e.preventDefault(); setIsOpen(false); break;
//         }
//     };
//     const handleOptionClick = (option) => {
//         onOptionSelect(option);
//         setIsOpen(false);
//         setActiveIndex(-1);
//     };
//     const cleanValueForCheck = String(value).replace(/^R\./i, '');
//     return (
//         <InputGroup label={label} htmlFor={name} subtext={subtext}>
//             <div className="relative" ref={dropdownRef}>
//                 <input
//                     id={name} name={name} type="text" value={value || ''} onChange={onChange} onFocus={() => setIsOpen(true)} onKeyDown={handleKeyDown}
//                     className={`block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50 ${error || customError ? 'border-red-500' : ''}`}
//                     {...props}
//                 />
//                 <button type="button" onClick={() => setIsOpen(!isOpen)} className="absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
//                     <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//                 </button>
//                 {isOpen && (
//                     <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 shadow-lg rounded-md border border-slate-200 dark:border-slate-600 max-h-64 overflow-auto">
//                         <ul className="py-1" ref={listRef}>
//                             {filteredOptions.length > 0 ? (
//                                 filteredOptions.map((option, index) => (
//                                     <li key={`${option.kode}-${index}`}>
//                                         <button type="button" onClick={() => handleOptionClick(option)}
//                                             className={`w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 flex justify-between items-center ${activeIndex === index ? 'bg-green-100 dark:bg-green-900/50' : 'hover:bg-green-50 dark:hover:bg-slate-600'}`}
//                                             onMouseEnter={() => setActiveIndex(index)}
//                                         >
//                                             <span><span className="font-bold">{option.kode}</span><span className="text-slate-500 dark:text-slate-400 ml-2">({option.keterangan})</span></span>
//                                             {cleanValueForCheck.toUpperCase() === String(option.kode).toUpperCase() && <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />}
//                                         </button>
//                                     </li>
//                                 ))
//                             ) : (<li className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">Tidak ada hasil ditemukan.</li>)}
//                         </ul>
//                     </div>
//                 )}
//             </div>
//             {(error || customError) && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error || customError}</p>}
//         </InputGroup>
//     );
// };

// const SuccessModal = ({ show, message }) => {
//     return (
//         <Transition
//             show={show}
//             enter="transition-opacity duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="transition-opacity duration-300"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//         >
//             <div className="fixed inset-0 bg-slate-900/75 flex items-center justify-center z-50 p-4">
//                 <div className="bg-slate-800 rounded-xl shadow-2xl p-8 sm:p-12 flex flex-col items-center gap-6 text-center max-w-sm w-full">
//                     <h2 className="text-3xl font-bold text-white leading-tight">
//                         {message.line1} <br /> {message.line2}
//                     </h2>
//                     <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
//                         <CheckIcon className="w-12 h-12 text-white" />
//                     </div>
//                 </div>
//             </div>
//         </Transition>
//     );
// };

// const ErrorNotification = ({ message, onDismiss }) => {
//     if (!message) return null;
//     return (
//         <div className="fixed top-8 right-8 z-50 max-w-sm w-full">
//             <div className="bg-red-500/95 backdrop-blur-sm text-white rounded-lg shadow-2xl p-4 flex items-start gap-4">
//                 <div className="flex-shrink-0">
//                     <XCircleIcon className="w-6 h-6" />
//                 </div>
//                 <div className="flex-grow">
//                     <h3 className="font-bold">Gagal Menyimpan!</h3>
//                     <p className="text-sm mt-1">{message}</p>
//                 </div>
//                 <div className="flex-shrink-0">
//                     <button onClick={onDismiss} className="p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white">
//                         <XMarkIcon className="w-5 h-5" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- KOMPONEN UTAMA FORM ---
// export default function Form({ inventari, auth, ruangList = [], namaBarangList = [] }) {
//     const { flash } = usePage().props;
//     const [flashError, setFlashError] = useState(null);

//     // --- LOGIKA AI SCANNER ---
//     const [scanImage, setScanImage] = useState(null);
//     const [isScanning, setIsScanning] = useState(false);
//     const scanInputRef = useRef(null);

//     const handleAIFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setScanImage(file);
//             // Update juga data form utama
//             setData(prevData => ({
//                 ...prevData,
//                 foto: file,
//                 remove_foto: false
//             }));
//             setPreview(URL.createObjectURL(file));
//         }
//     };

//     const handleAIScan = async () => {
//         if (!scanImage) {
//             alert("Pilih foto dulu untuk discan!");
//             return;
//         }

//         setIsScanning(true);
//         const formData = new FormData();
//         formData.append('image', scanImage);

//         try {
//             const endpoint = route().has('scan.ai') ? route('scan.ai') : '/scan-barang-ai';
//             const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

//             const response = await axios.post(endpoint, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'X-CSRF-TOKEN': csrfToken
//                 }
//             });

//             const result = response.data;

//             if (result.nama_barang) {
//                 setData(prevData => ({
//                     ...prevData,
//                     nama_barang: result.nama_barang.toUpperCase(),
//                     kode_barang: result.kode_barang ? result.kode_barang.toUpperCase() : prevData.kode_barang,
//                     tempat_pemakaian: result.tempat_pemakaian ? result.tempat_pemakaian.toUpperCase() : prevData.tempat_pemakaian,
//                     nomor_ruang: result.nomor_ruang ? String(result.nomor_ruang) : prevData.nomor_ruang,
//                     spesifikasi: result.spesifikasi ? result.spesifikasi.toUpperCase() : prevData.spesifikasi,
//                     foto: scanImage,
//                     remove_foto: false
//                 }));

//                 alert(`Berhasil Teridentifikasi!\nNama: ${result.nama_barang}\nKode: ${result.kode_barang}`);
//             }
//         } catch (error) {
//             console.error("AI Error:", error);
//             const errMsg = error.response?.data?.error || "Gagal identifikasi.";
//             alert(errMsg);
//         } finally {
//             setIsScanning(false);
//         }
//     };
//     // -------------------------

//     const nextAvailableRuang = useMemo(() => {
//         if (inventari) { return null; }
//         const usedNumbers = new Set(ruangList.map(r => parseInt(r.nomor_ruang, 10)).filter(n => !isNaN(n)));
//         let candidate = 1;
//         while (usedNumbers.has(candidate)) { candidate++; }
//         return String(candidate);
//     }, [ruangList, inventari]);

//     const { data, setData, post, errors, processing, recentlySuccessful, reset } = useForm({
//         nama_barang: inventari?.nama_barang || '',
//         kode_barang: inventari?.kode_barang || '',
//         tempat_pemakaian: inventari ? (inventari.tempat_pemakaian || '') : 'R.',
//         nomor_ruang: inventari?.nomor_ruang || nextAvailableRuang || '',
//         jumlah: inventari?.jumlah || '',
//         tanggal_masuk: inventari?.tanggal_masuk ? new Date(inventari.tanggal_masuk).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         asal_perolehan: inventari?.asal_perolehan || '',
//         spesifikasi: inventari?.spesifikasi || '',
//         jenis_perawatan: inventari?.jenis_perawatan || '',
//         jumlah_dipakai: inventari?.jumlah_dipakai ?? 0,
//         jumlah_rusak: inventari?.jumlah_rusak ?? 0,
//         harga: inventari?.harga || '',
//         foto: null,
//         remove_foto: false,
//         ...(inventari && { _method: 'PUT' }),
//     });

//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [preview, setPreview] = useState(inventari?.foto_url || null);
//     const [validationErrors, setValidationErrors] = useState({});

//     useEffect(() => {
//         const currentCleanTempat = (data.tempat_pemakaian || '').replace(/^R\./i, '');
//         const currentRuang = String(data.nomor_ruang || '');
//         if (!currentCleanTempat || !currentRuang) { setValidationErrors({}); return; }

//         const newErrors = {};

//         const conflictingRuang = ruangList.find(r => {
//             const listCleanTempat = (r.tempat_pemakaian || '').replace(/^R\./i, '');
//             return listCleanTempat.toUpperCase() === currentCleanTempat.toUpperCase() && String(r.nomor_ruang) !== currentRuang && (!inventari || inventari.id !== r.inventaris_id);
//         });
//         if (conflictingRuang) {
//             newErrors.tempat_pemakaian = `Tempat ini sudah untuk Ruang ${conflictingRuang.nomor_ruang}.`;
//         }

//         const conflictingTempat = ruangList.find(r => {
//             const listCleanTempat = (r.tempat_pemakaian || '').replace(/^R\./i, '');
//             return String(r.nomor_ruang) === currentRuang && listCleanTempat.toUpperCase() !== currentCleanTempat.toUpperCase() && (!inventari || inventari.id !== r.inventaris_id);
//         });
//         if (conflictingTempat) {
//             newErrors.nomor_ruang = `Ruang ini sudah untuk ${conflictingTempat.tempat_pemakaian}.`;
//         }

//         setValidationErrors(newErrors);
//     }, [data.tempat_pemakaian, data.nomor_ruang, ruangList, inventari]);

//     useEffect(() => {
//         if (recentlySuccessful) {
//             if (flash.success) {
//                 setShowSuccessModal(true);
//                 if (!inventari) { reset(); }
//             } else if (flash.error) {
//                 setFlashError(flash.error);
//                 const timer = setTimeout(() => setFlashError(null), 5000);
//                 return () => clearTimeout(timer);
//             }
//         }
//     }, [recentlySuccessful, flash]);

//     const kodeBarangOptions = useMemo(() => [
//         { kode: '01-EL', keterangan: 'ELEKTRIKAL' }, { kode: '02-UM', keterangan: 'UMUM' },
//         { kode: '03-MB', keterangan: 'MEBELER' }, { kode: '04-MK', keterangan: 'MEKANIKAL' },
//         { kode: '05-AK', keterangan: 'ALAT KESEHATAN' }, { kode: '06-MT', keterangan: 'MOTOR' },
//     ], []);

//     const tempatOptions = useMemo(() => {
//         const uniqueTempat = [...new Map(ruangList.map(item => {
//             const cleanTempat = (item.tempat_pemakaian || '').replace(/^R\./i, '');
//             return [cleanTempat, { ...item, tempat_pemakaian: cleanTempat }];
//         })).values()];
//         return uniqueTempat.map(item => ({
//             kode: item.tempat_pemakaian,
//             keterangan: `RUANG ${item.nomor_ruang || 'N/A'}`
//         }));
//     }, [ruangList]);

//     const nomorRuangOptions = useMemo(() => {
//         const uniqueRuang = [...new Map(ruangList.map(item => [item.nomor_ruang, item])).values()];
//         return uniqueRuang.map(item => ({
//             kode: item.nomor_ruang,
//             keterangan: (item.tempat_pemakaian || 'N/A').replace(/^R\./i, '')
//         }));
//     }, [ruangList]);

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setData(data => ({
//                 ...data,
//                 foto: file,
//                 remove_foto: false
//             }));
//             setPreview(URL.createObjectURL(file));
//         }
//     };

//     const handleRemoveImage = () => {
//         setPreview(null);
//         setData(data => ({
//             ...data,
//             foto: null,
//             remove_foto: true,
//         }));
//     };

//     const handleKodeBarangSelect = (option) => setData('kode_barang', option.kode);

//     const handleTempatSelect = (option) => {
//         const originalRuang = ruangList.find(r => (r.tempat_pemakaian || '').replace(/^R\./i, '') === option.kode);
//         const originalTempatPemakaian = originalRuang ? originalRuang.tempat_pemakaian : option.kode;
//         setData(data => ({
//             ...data,
//             tempat_pemakaian: (originalTempatPemakaian || '').toUpperCase(),
//             nomor_ruang: originalRuang?.nomor_ruang || ''
//         }));
//     };

//     const handleNomorRuangSelect = (option) => {
//         const correspondingTempat = ruangList.find(r => r.nomor_ruang === option.kode);
//         setData(data => ({
//             ...data,
//             nomor_ruang: option.kode,
//             tempat_pemakaian: (correspondingTempat?.tempat_pemakaian || '').toUpperCase()
//         }));
//     };

//     const handleTempatChange = (e) => {
//         setData('tempat_pemakaian', e.target.value.toUpperCase());
//     };

//     const handleJumlahChange = (field, value) => { const total = parseInt(data.jumlah, 10) || 0; const dipakai = parseInt(data.jumlah_dipakai, 10) || 0; const rusak = parseInt(data.jumlah_rusak, 10) || 0; let newValue = parseInt(value, 10) || 0; if (field === 'jumlah_dipakai') { if (newValue + rusak > total) newValue = total - rusak; } else if (field === 'jumlah_rusak') { if (newValue + dipakai > total) newValue = total - dipakai; } setData(field, newValue < 0 ? 0 : newValue); };

//     const submit = (e) => {
//         e.preventDefault();
//         setFlashError(null);

//         if (Object.keys(validationErrors).length > 0) {
//             setFlashError('Harap perbaiki error pada Tempat Pemakaian atau Nomor Ruang sebelum menyimpan.');
//             const timer = setTimeout(() => setFlashError(null), 5000);
//             return () => clearTimeout(timer);
//         }

//         const url = inventari
//             ? route('inventaris.update', { id: inventari.id })
//             : route('inventaris.store');

//         post(url, {
//             forceFormData: true,
//             transform: (data) => {
//                 const transformedData = { ...data };
//                 if (inventari && transformedData.foto === null && !transformedData.remove_foto) {
//                     delete transformedData.foto;
//                 }
//                 return transformedData;
//             },
//         });
//     };

//     const title = inventari ? "Edit Data Inventaris" : "Tambah Data Baru";
//     const successMessage = inventari
//         ? { line1: 'Data Telah', line2: 'Berhasil Diperbarui' }
//         : { line1: 'Data Telah', line2: 'Berhasil Ditambahkan' };
//     const hasErrors = Object.keys(errors).length > 0 || flashError;

//     return (
//         <>
//             <Head title={title} />
//             <ErrorNotification message={flashError} onDismiss={() => setFlashError(null)} />
//             <SuccessModal show={showSuccessModal} message={successMessage} />

//             <main className="bg-slate-100 dark:bg-slate-900 min-h-screen py-8 sm:py-12">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="mb-6">
//                         <Link href={route('inventaris.index')} className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-500 transition">
//                             <ArrowLeftIcon className="h-4 w-4 mr-2" />
//                             Kembali ke Daftar Inventaris
//                         </Link>
//                     </div>

//                     <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg" encType="multipart/form-data">
//                         <div className="p-6 sm:p-8">
//                             <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h1>
//                             {hasErrors && (
//                                 <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg text-sm text-red-700 dark:text-red-300">
//                                     <p className="font-semibold">Terdapat kesalahan pada input Anda.</p>
//                                     <p className="mt-1">Silakan periksa kembali semua kolom yang ditandai merah.</p>
//                                 </div>
//                             )}
//                             <hr className="my-6 border-slate-200 dark:border-slate-700" />

//                             {/* --- AREA SCAN AI (UI DIPERBARUI) --- */}
//                             <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-700/50 rounded-lg border border-blue-100 dark:border-slate-600">
//                                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                                     <div className="flex-grow">
//                                         <h3 className="text-sm font-bold text-blue-800 dark:text-blue-200 flex items-center gap-2">
//                                             <SparklesIcon className="w-4 h-4 text-blue-500" />
//                                             AI Assistant Scanner
//                                         </h3>
//                                         <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
//                                             Ambil foto langsung atau upload gambar agar <b>Data Terisi Otomatis</b>.
//                                         </p>
//                                     </div>
//                                     <div className="flex items-center gap-3 w-full sm:w-auto">
//                                         {/* Input File Tersembunyi */}
//                                         <input
//                                             type="file"
//                                             accept="image/*" // Ini yang memicu Kamera / File di HP
//                                             id="ai-scan-input"
//                                             ref={scanInputRef}
//                                             onChange={handleAIFileChange}
//                                             className="hidden" 
//                                         />

//                                         {/* Tombol Kustom: Pilih / Ambil Foto */}
//                                         <label 
//                                             htmlFor="ai-scan-input" 
//                                             className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 font-bold text-xs border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 transition"
//                                         >
//                                             <CameraIcon className="w-4 h-4" />
//                                             Ambil / Pilih Foto
//                                         </label>

//                                         {/* Tombol Proses Scan */}
//                                         <button
//                                             type="button"
//                                             onClick={handleAIScan}
//                                             disabled={isScanning || !scanImage}
//                                             className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
//                                         >
//                                             {isScanning ? (
//                                                 <>
//                                                     <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
//                                                     Scanning...
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <SparklesIcon className="w-4 h-4" />
//                                                     Proses AI
//                                                 </>
//                                             )}
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* --- END SCAN AI --- */}

//                             <div>
//                                 <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Informasi Utama (Wajib Diisi)</h2>
//                                 <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                                     <AutocompleteInput
//                                         name="nama_barang"
//                                         label="Nama Barang"
//                                         value={data.nama_barang}
//                                         onChange={e => setData('nama_barang', e.target.value.toUpperCase())}
//                                         onSelect={value => setData('nama_barang', value.toUpperCase())}
//                                         options={namaBarangList}
//                                         error={errors.nama_barang}
//                                         required
//                                         subtext="Dapat diisi manual atau otomatis via Scan AI."
//                                     />
//                                     <DropdownInput name="kode_barang" label="Kode Barang (Opsional)" value={data.kode_barang}
//                                         onChange={e => setData('kode_barang', e.target.value.toUpperCase())}
//                                         onOptionSelect={handleKodeBarangSelect}
//                                         options={kodeBarangOptions} error={errors.kode_barang} subtext="Pilih dari daftar atau ketik manual." autoComplete="off"
//                                     />
//                                     <DropdownInput
//                                         name="tempat_pemakaian"
//                                         label="Tempat Pemakaian"
//                                         value={data.tempat_pemakaian}
//                                         onChange={handleTempatChange}
//                                         onOptionSelect={handleTempatSelect}
//                                         options={tempatOptions}
//                                         error={errors.tempat_pemakaian}
//                                         customError={validationErrors.tempat_pemakaian}
//                                         required
//                                         autoComplete="off"
//                                     />
//                                     <DropdownInput name="nomor_ruang" label="Nomor Ruang" value={data.nomor_ruang}
//                                         onChange={e => setData('nomor_ruang', e.target.value.replace(/[^0-9]/g, ''))}
//                                         onOptionSelect={handleNomorRuangSelect}
//                                         options={nomorRuangOptions} error={errors.nomor_ruang} customError={validationErrors.nomor_ruang} required autoComplete="off"
//                                     />
//                                     <TextInput name="asal_perolehan" label="Asal Perolehan" value={data.asal_perolehan} onChange={e => setData('asal_perolehan', e.target.value.toUpperCase())} error={errors.asal_perolehan} required />
//                                     <TextInput name="tanggal_masuk" label="Tanggal Masuk" type="date" value={data.tanggal_masuk} onChange={e => setData('tanggal_masuk', e.target.value)} error={errors.tanggal_masuk} required />
//                                     <TextInput name="jumlah" label="Jumlah Total" type="number" value={data.jumlah} onChange={e => setData('jumlah', e.target.value)} error={errors.jumlah} required />
//                                 </div>
//                             </div>
//                             <hr className="my-8 border-slate-200 dark:border-slate-700" />
//                             <div>
//                                 <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Informasi Tambahan (Opsional)</h2>
//                                 <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
//                                     <div className="md:col-span-2">
//                                         <FileInput
//                                             name="foto"
//                                             label="Foto Barang (Untuk Database)"
//                                             onChange={handleFileChange}
//                                             onRemove={handleRemoveImage}
//                                             error={errors.foto}
//                                             previewUrl={preview}
//                                             subtext="Pilih file untuk disimpan (JPG, PNG, GIF maks. 2MB)."
//                                         />
//                                     </div>
//                                     <div className="md:col-span-2">
//                                         <TextArea name="spesifikasi" label="Spesifikasi" value={data.spesifikasi} onChange={e => setData('spesifikasi', e.target.value.toUpperCase())} error={errors.spesifikasi} rows="4" />
//                                     </div>
//                                     <div className="md:col-span-1">

//                                     </div>
//                                     <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
//                                         <TextInput name="jumlah_dipakai" label="Jumlah Dipakai" type="number" value={data.jumlah_dipakai} onChange={e => handleJumlahChange('jumlah_dipakai', e.target.value)} error={errors.jumlah_dipakai} />
//                                         <TextInput name="jumlah_rusak" label="Jumlah Rusak" type="number" value={data.jumlah_rusak} onChange={e => handleJumlahChange('jumlah_rusak', e.target.value)} error={errors.jumlah_rusak} />
//                                         <TextInput
//                                             name="jenis_perawatan"
//                                             label="Jenis Perawatan"
//                                             value={data.jenis_perawatan}
//                                             onChange={e => setData('jenis_perawatan', e.target.value.toUpperCase())}
//                                             error={errors.jenis_perawatan}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex items-center justify-end gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl border-t border-slate-200 dark:border-slate-700">
//                             <Link href={route('inventaris.index')} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Batal</Link>
//                             <button type="submit" disabled={processing} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
//                                 {processing ? 'Menyimpan...' : 'Simpan Data'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </main>
//         </>
//     );
// }























import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from 'axios';
import {
    ArrowLeftIcon,
    PhotoIcon,
    ArrowUpTrayIcon,
    ChevronDownIcon,
    CheckIcon,
    TrashIcon,
    XCircleIcon,
    XMarkIcon,
    SparklesIcon,
    CameraIcon
} from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';

// --- KOMPONEN INPUT ---

const InputGroup = ({ label, children, htmlFor, subtext, required }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-1">{children}</div>
        {subtext && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtext}</p>}
    </div>
);

const TextInput = ({ name, label, value, onChange, onFocus, error, subtext, required, ...props }) => (
    <InputGroup label={label} htmlFor={name} subtext={subtext} required={required}>
        <input
            id={name}
            name={name}
            type={props.type || 'text'}
            value={value} // Hapus "|| ''" agar angka 0 tetap terbaca, handle di parent
            onChange={onChange}
            onFocus={onFocus}
            className={`block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50 ${error ? 'border-red-500' : ''}`} {...props}
        />
        {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
    </InputGroup>
);

const TextArea = ({ name, label, value, onChange, error, ...props }) => (
    <InputGroup label={label} htmlFor={name}>
        <textarea id={name} name={name} value={value || ''} onChange={onChange} className={`block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50 ${error ? 'border-red-500' : ''}`} {...props} />
        {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
    </InputGroup>
);

const FileInput = ({ name, label, onChange, onRemove, error, previewUrl, subtext }) => (
    <InputGroup label={label} htmlFor={name} subtext={subtext}>
        <div className="flex flex-wrap items-start gap-4">
            {previewUrl ?
                <img src={previewUrl} alt="Pratinjau" className="w-40 h-40 object-cover rounded-lg border dark:border-slate-600" /> :
                <div className="w-40 h-40 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                    <PhotoIcon className="w-16 h-16" />
                </div>
            }
            <div className="flex flex-col gap-3 pt-1">
                <label htmlFor={name} className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-sm font-semibold text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 rounded-md hover:bg-green-50 dark:hover:bg-slate-600 transition">
                    <ArrowUpTrayIcon className="w-5 h-5" />
                    <span>{previewUrl ? 'Ganti File' : 'Pilih File'}</span>
                </label>
                {previewUrl && (
                    <button type="button" onClick={onRemove} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-slate-700 text-sm font-semibold text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-slate-600 transition">
                        <TrashIcon className="w-5 h-5" />
                        <span>Hapus Gambar</span>
                    </button>
                )}
                <input id={name} name={name} type="file" onChange={onChange} className="hidden" />
            </div>
        </div>
        {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
    </InputGroup>
);

const RelationalDropdown = ({ label, value, options = [], onSelect, error, required, placeholder = "Pilih..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const ref = useRef(null);

    const safeOptions = Array.isArray(options) ? options : [];
    const selectedOption = safeOptions.find(opt => opt.id === value);

    const filteredOptions = safeOptions.filter(opt => {
        const teksLabel = opt?.label ? String(opt.label).toLowerCase() : "";
        const search = searchTerm.toLowerCase();
        return teksLabel.includes(search);
    });

    useEffect(() => {
        const out = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener('mousedown', out);
        return () => document.removeEventListener('mousedown', out);
    }, []);

    return (
        <InputGroup label={label} required={required}>
            <div className="relative" ref={ref}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full text-left rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:ring focus:ring-green-500 focus:ring-opacity-50 flex justify-between items-center ${error ? 'border-red-500' : ''}`}
                >
                    <span className={selectedOption ? "" : "text-slate-400"}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDownIcon className="h-5 w-5" />
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 shadow-xl rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-2 border-b dark:border-slate-700">
                            <input
                                type="text"
                                className="w-full text-xs p-2 rounded bg-slate-50 dark:bg-slate-900 border-none focus:ring-0 text-slate-900 dark:text-white"
                                placeholder="Cari..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <ul className="max-h-60 overflow-auto py-1">
                            {filteredOptions.map(opt => (
                                <li key={opt.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onSelect(opt.id);
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-green-900/30 text-slate-700 dark:text-slate-200"
                                    >
                                        {opt.label || 'Tanpa Nama'}
                                    </button>
                                </li>
                            ))}
                            {filteredOptions.length === 0 && (
                                <li className="p-4 text-xs text-slate-400 italic">Data tidak ditemukan</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </InputGroup>
    );
};

const SuccessModal = ({ show, message }) => {
    return (
        <Transition show={show} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-900/75 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 rounded-xl shadow-2xl p-12 flex flex-col items-center gap-6 text-center max-w-sm w-full">
                    <h2 className="text-3xl font-bold text-white leading-tight">{message.line1} <br /> {message.line2}</h2>
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-12 h-12 text-white" />
                    </div>
                </div>
            </div>
        </Transition>
    );
};

// --- KOMPONEN UTAMA FORM ---
export default function Form({
    inventari,
    auth,
    ruanganList = [],
    asalPerolehanList = [],
    jenisPerawatanList = [],
    kategoriList = [],
    masterBarangList = []
}) {
    const { flash } = usePage().props;
    const [flashError, setFlashError] = useState(null);

    const { data, setData, post, errors, recentlySuccessful, processing, reset } = useForm({
        master_barang_id: inventari?.master_barang_id || '',
        nama_barang: inventari?.nama_barang || '',
        master_kategori_id: inventari?.master_kategori_id || '',
        master_ruangan_id: inventari?.master_ruangan_id || '',
        master_asal_perolehan_id: inventari?.master_asal_perolehan_id || '',
        master_jenis_perawatan_id: inventari?.master_jenis_perawatan_id || '',
        jumlah: inventari?.jumlah || '',
        jumlah_dipakai: inventari?.jumlah_dipakai ?? 0,
        jumlah_rusak: inventari?.jumlah_rusak ?? 0,
        tanggal_masuk: inventari?.tanggal_masuk ? inventari.tanggal_masuk.split('T')[0] : new Date().toISOString().split('T')[0],
        harga: inventari?.harga || '',
        spesifikasi: inventari?.spesifikasi || '',
        foto: null,
        remove_foto: false,
        ...(inventari && { _method: 'PUT' }),
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [preview, setPreview] = useState(inventari?.foto || null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        if (recentlySuccessful) {
            if (flash.success) {
                setShowSuccessModal(true);
                if (!inventari) reset();
            } else if (flash.error) {
                setFlashError(flash.error);
            }
        }
    }, [recentlySuccessful, flash]);

    // --- LOGIKA KALKULASI OTOMATIS ---

    // 1. Cek apakah Total sudah diisi (Dipanggil saat onFocus)
    const checkTotalFilled = (e) => {
        if (!data.jumlah || parseInt(data.jumlah) <= 0) {
            alert("Harap isi 'Jumlah Total' terlebih dahulu!");
            e.target.blur(); // Hilangkan fokus agar user tidak bisa mengetik
        }
    };

    // 2. Handle perubahan pada Jumlah Total
    const handleTotalChange = (e) => {
        const val = e.target.value;
        const total = parseInt(val) || 0;

        // Reset logika: Jika total berubah, defaultkan ke semua dipakai (baik) dan rusak 0
        // Atau sesuaikan dengan logika bisnis Anda. Di sini saya set default Baik = Total.
        setData(prev => ({
            ...prev,
            jumlah: val,
            jumlah_dipakai: total,
            jumlah_rusak: 0
        }));
    };

    // 3. Handle perubahan Jumlah Dipakai
    const handleDipakaiChange = (e) => {
        let val = parseInt(e.target.value);
        const total = parseInt(data.jumlah) || 0;

        if (isNaN(val)) val = 0; // Handle jika dihapus habis
        if (val < 0) val = 0; // Tidak boleh negatif

        // Validasi: Tidak boleh melebihi total
        if (val > total) {
            // alert(`Jumlah dipakai tidak boleh melebihi total (${total})`);
            val = total; // Clamp value
        }

        // Kalkulasi otomatis jumlah rusak
        const sisaRusak = total - val;

        setData(prev => ({
            ...prev,
            jumlah_dipakai: val,
            jumlah_rusak: sisaRusak
        }));
    };

    // 4. Handle perubahan Jumlah Rusak
    const handleRusakChange = (e) => {
        let val = parseInt(e.target.value);
        const total = parseInt(data.jumlah) || 0;

        if (isNaN(val)) val = 0;
        if (val < 0) val = 0;

        // Validasi: Tidak boleh melebihi total
        if (val > total) {
            // alert(`Jumlah rusak tidak boleh melebihi total (${total})`);
            val = total;
        }

        // Kalkulasi otomatis jumlah dipakai
        const sisaDipakai = total - val;

        setData(prev => ({
            ...prev,
            jumlah_rusak: val,
            jumlah_dipakai: sisaDipakai
        }));
    };

    // --- END LOGIKA ---

    const handleAIFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setData('foto', file);
    };

    const handleAIScan = async () => {
        if (!data.foto) return alert("Pilih foto terlebih dahulu!");
        setIsScanning(true);
        const formData = new FormData();
        formData.append('image', data.foto);

        try {
            const response = await axios.post('/scan-barang-ai', formData);
            const result = response.data;
            setData(prev => ({
                ...prev,
                nama_barang: result.nama_barang?.toUpperCase() || prev.nama_barang,
                spesifikasi: result.spesifikasi?.toUpperCase() || prev.spesifikasi,
            }));
            alert("AI Berhasil mengidentifikasi barang!");
        } catch (error) {
            alert("Gagal melakukan scan AI.");
        } finally {
            setIsScanning(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = inventari ? route('inventaris.update', inventari.id) : route('inventaris.store');
        post(url, { forceFormData: true });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData(prev => ({ ...prev, foto: file, remove_foto: false }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
        setData(prev => ({ ...prev, foto: null, remove_foto: true }));
    };

    return (
        <>
            <Head title={inventari ? "Edit Data Inventaris" : "Tambah Data Baru"} />
            <SuccessModal show={showSuccessModal} message={{ line1: 'Data Telah Berhasil', line2: inventari ? 'Diperbarui' : 'Ditambahkan' }} />

            <main className="bg-slate-100 dark:bg-slate-900 min-h-screen py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('inventaris.index')} className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-500 transition">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Kembali ke Daftar Inventaris
                        </Link>
                    </div>

                    <form onSubmit={submit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold dark:text-white">Form Inventaris</h1>
                                    <p className="text-slate-400 text-sm mt-1">Gunakan relasi master untuk akurasi data.</p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center gap-4">
                                    <input type="file" id="ai-capture" className="hidden" accept="image/*" onChange={handleAIFileChange} />
                                    <label htmlFor="ai-capture" className="cursor-pointer bg-white dark:bg-slate-700 p-2 rounded-lg shadow-sm hover:scale-105 transition">
                                        <CameraIcon className="w-6 h-6 text-blue-600" />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAIScan}
                                        disabled={isScanning || !data.foto}
                                        className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isScanning ? "Scanning..." : "Proses AI"}
                                    </button>
                                </div>
                            </div>
                            

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Bagian Kiri */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Informasi Dasar</h3>

                                    <RelationalDropdown
                                        label="Pilih Dari Master Barang"
                                        value={data.master_barang_id}
                                        options={masterBarangList}
                                        onSelect={id => {
                                            const selected = masterBarangList.find(b => b.id === id);
                                            setData(prev => ({
                                                ...prev,
                                                master_barang_id: id,
                                                nama_barang: selected?.label || prev.nama_barang,
                                                master_kategori_id: selected?.kategori_id || '',
                                            }));
                                        }}
                                        placeholder="Cari Barang di Master..."
                                        error={errors.master_barang_id}
                                        required
                                    />

                                    <RelationalDropdown
                                        label="Lokasi Ruangan"
                                        value={data.master_ruangan_id}
                                        options={ruanganList}
                                        onSelect={id => setData('master_ruangan_id', id)}
                                        error={errors.master_ruangan_id}
                                        required
                                    />

                                    <RelationalDropdown
                                        label="Asal Perolehan"
                                        value={data.master_asal_perolehan_id}
                                        options={asalPerolehanList}
                                        onSelect={id => setData('master_asal_perolehan_id', id)}
                                        error={errors.master_asal_perolehan_id}
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* INPUT JUMLAH TOTAL */}
                                        <TextInput
                                            label="Jumlah Total"
                                            type="number"
                                            value={data.jumlah}
                                            onChange={handleTotalChange} // Pakai handler baru
                                            error={errors.jumlah}
                                            required
                                        />
                                        <TextInput
                                            label="Tanggal Masuk"
                                            type="date"
                                            value={data.tanggal_masuk}
                                            onChange={e => setData('tanggal_masuk', e.target.value)}
                                            error={errors.tanggal_masuk}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Bagian Kanan */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Detail & Kondisi</h3>

                                    <RelationalDropdown
                                        label="Jenis Perawatan"
                                        value={data.master_jenis_perawatan_id}
                                        options={jenisPerawatanList}
                                        onSelect={id => setData('master_jenis_perawatan_id', id)}
                                        error={errors.master_jenis_perawatan_id}
                                        placeholder="Pilih jenis perawatan..."
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* INPUT JUMLAH DIPAKAI */}
                                        <TextInput
                                            label="Jumlah Dipakai"
                                            type="number"
                                            value={data.jumlah_dipakai}
                                            onChange={handleDipakaiChange} // Pakai handler baru
                                            onFocus={checkTotalFilled}     // Cek apakah total sudah diisi
                                            error={errors.jumlah_dipakai}
                                        />

                                        {/* INPUT JUMLAH RUSAK */}
                                        <TextInput
                                            label="Jumlah Rusak"
                                            type="number"
                                            value={data.jumlah_rusak}
                                            onChange={handleRusakChange}   // Pakai handler baru
                                            onFocus={checkTotalFilled}     // Cek apakah total sudah diisi
                                            error={errors.jumlah_rusak}
                                        />
                                    </div>

                                    <TextInput
                                        label="Harga Satuan"
                                        type="text"
                                        value={
                                            data.harga
                                                ? new Intl.NumberFormat('id-ID').format(data.harga)
                                                : ''
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'harga',
                                                e.target.value.replace(/[^0-9]/g, '')
                                            )
                                        }
                                        error={errors.harga}
                                        prefix="Rp"
                                    />
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t dark:border-slate-700">
                                    <div className="md:col-span-1">
                                        <FileInput
                                            name="foto"
                                            label="Foto Barang (Untuk Database)"
                                            onChange={handleFileChange}
                                            onRemove={handleRemoveImage}
                                            error={errors.foto}
                                            previewUrl={preview}
                                            subtext="Pilih file untuk disimpan (JPG, PNG, GIF maks. 2MB)."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <TextArea label="Spesifikasi Lengkap" rows={6} value={data.spesifikasi} onChange={e => setData('spesifikasi', e.target.value.toUpperCase())} error={errors.spesifikasi} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex justify-end gap-4 border-t dark:border-slate-700">
                            <Link href={route('inventaris.index')} className="px-6 py-2 text-slate-500 font-semibold hover:text-slate-700 transition">Batal</Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 text-white px-10 py-2 rounded-xl font-bold shadow-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {processing ? "Memproses..." : "Simpan Data"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}