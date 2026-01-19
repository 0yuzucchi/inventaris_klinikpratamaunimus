// import React, { useState, useMemo, useEffect, useRef } from 'react';
// import { Head, Link, useForm } from '@inertiajs/react';
// import { route } from 'ziggy-js';
// import {
//     ArrowLeftIcon, PhotoIcon, CheckCircleIcon,
//     ChevronDownIcon, ChevronRightIcon, ChevronDoubleDownIcon, CheckIcon,
//     ExclamationTriangleIcon, ArrowUpTrayIcon, TrashIcon
// } from '@heroicons/react/24/solid';

// // --- TIDAK ADA PERUBAHAN DI KOMPONEN BANTU ---
// const Notification = ({ message }) => {
//     const [show, setShow] = useState(false);
//     useEffect(() => {
//         if (message) {
//             setShow(true);
//             const timer = setTimeout(() => setShow(false), 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [message]);
//     return (
//         <div className={`fixed top-5 right-5 z-50 transform transition-all duration-300 ease-in-out ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
//             <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center">
//                 <CheckCircleIcon className="w-6 h-6 mr-3" />
//                 <span>{message}</span>
//             </div>
//         </div>
//     );
// };
// const InputGroup = ({ label, children, htmlFor }) => (
//     <div>
//         {label && <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>}
//         <div className="relative">{children}</div>
//     </div>
// );
// const DropdownInput = ({ name, label, value, onChange, error, customError, options, onOptionSelect, placeholder }) => {
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
//             if (item) item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
//         }
//     }, [activeIndex, isOpen]);
//     const handleKeyDown = (e) => {
//         if (!isOpen) { if (e.key === 'ArrowDown' || e.key === 'Enter') { e.preventDefault(); setIsOpen(true); } return; }
//         switch (e.key) {
//             case 'ArrowDown': e.preventDefault(); setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev)); break;
//             case 'ArrowUp': e.preventDefault(); setActiveIndex(prev => (prev > 0 ? prev - 1 : 0)); break;
//             case 'Enter':
//                 e.preventDefault();
//                 if (activeIndex >= 0 && filteredOptions[activeIndex]) { handleOptionClick(filteredOptions[activeIndex]); }
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
//         <InputGroup label={label} htmlFor={name}>
//             <div className="relative" ref={dropdownRef}>
//                 <input
//                     id={name} name={name} type="text" value={value || ''}
//                     onChange={onChange} onFocus={() => setIsOpen(true)} onKeyDown={handleKeyDown}
//                     placeholder={placeholder} autoComplete="off"
//                     className={`block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50 ${error || customError ? 'border-red-500' : ''}`}
//                 />
//                 <button type="button" onClick={() => setIsOpen(!isOpen)} className="absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
//                     <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//                 </button>
//                 {isOpen && (
//                     <div className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-700 shadow-lg rounded-md border border-slate-200 dark:border-slate-600 max-h-60 overflow-auto animate-fade-in-down-fast">
//                         <ul className="py-1" ref={listRef}>
//                             {filteredOptions.length > 0 ? (
//                                 filteredOptions.map((option, index) => (
//                                     <li key={`${option.kode}-${index}`}>
//                                         <button type="button" onClick={() => handleOptionClick(option)}
//                                             className={`w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 flex justify-between items-center transition-colors ${activeIndex === index ? 'bg-green-100 dark:bg-green-900/50' : 'hover:bg-green-50 dark:hover:bg-slate-600'}`}
//                                             onMouseEnter={() => setActiveIndex(index)}
//                                         >
//                                             <span><span className="font-bold">{option.kode}</span><span className="text-slate-500 dark:text-slate-400 ml-2">({option.keterangan})</span></span>
//                                             {cleanValueForCheck.toUpperCase() === String(option.kode).toUpperCase() && <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />}
//                                         </button>
//                                     </li>
//                                 ))
//                             ) : <li className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">Tidak ada hasil ditemukan.</li>}
//                         </ul>
//                     </div>
//                 )}
//             </div>
//             {(error || customError) && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{error || customError}</p>}
//         </InputGroup>
//     );
// };

// // --- KOMPONEN UTAMA FORM ---
// export default function BulkEditForm({ inventaris, ruangList = [] }) {

//     const sortedInventaris = useMemo(() => {
//         return [...inventaris].sort((a, b) => {
//             return String(a.nomor ?? '').localeCompare(String(b.nomor ?? ''), undefined, { numeric: true, sensitivity: 'base' });
//         });
//     }, [inventaris]);

//     const { data, setData, post, processing, errors } = useForm({
//         items: sortedInventaris.map(item => ({
//             ...item,
//             // PENAMBAHAN: Inisialisasi 'jenis_perawatan'
//             jenis_perawatan: item.jenis_perawatan || '',
//             tanggal_masuk: item.tanggal_masuk ? new Date(item.tanggal_masuk).toISOString().split('T')[0] : '',
//             foto: null,
//             remove_foto: false,
//         }))
//     });

//     const [previews, setPreviews] = useState({});
//     const [masterFoto, setMasterFoto] = useState(null);
//     const [masterPreview, setMasterPreview] = useState(null);

//     useEffect(() => {
//         return () => {
//             Object.values(previews).forEach(URL.revokeObjectURL);
//             if (masterPreview) {
//                 URL.revokeObjectURL(masterPreview);
//             }
//         };
//     }, [previews, masterPreview]);

//     const [openItems, setOpenItems] = useState({});
    
//     const [masterData, setMasterData] = useState({ 
//         nama_barang: '', 
//         kode_barang: '', 
//         spesifikasi: '', 
//         // PENAMBAHAN: State untuk master 'jenis_perawatan'
//         jenis_perawatan: '',
//         jumlah: '', 
//         jumlah_dipakai: '', 
//         jumlah_rusak: '', 
//         tempat_pemakaian: 'R.',
//         nomor_ruang: '', 
//         asal_perolehan: '', 
//         tanggal_masuk: '', 
//         harga: ''
//     });

//     const [validationErrors, setValidationErrors] = useState({});
//     const [masterValidationErrors, setMasterValidationErrors] = useState({});
//     const [notification, setNotification] = useState('');
//     useEffect(() => { if (notification) { const timer = setTimeout(() => setNotification(''), 4000); return () => clearTimeout(timer); } }, [notification]);
    
//     useEffect(() => {
//         const currentCleanTempat = (masterData.tempat_pemakaian || '').replace(/^R\./i, '');
//         const currentRuang = String(masterData.nomor_ruang || '');
//         const newErrors = {};
//         if (currentCleanTempat && currentRuang) {
//             const conflictingRuang = ruangList.find(r => {
//                 const listCleanTempat = (r.tempat_pemakaian || '').replace(/^R\./i, '');
//                 return listCleanTempat.toUpperCase() === currentCleanTempat.toUpperCase() && String(r.nomor_ruang) !== currentRuang;
//             });
//             if (conflictingRuang) { newErrors.tempat_pemakaian = `Tempat ini sudah untuk Ruang ${conflictingRuang.nomor_ruang}.`; }

//             const conflictingTempat = ruangList.find(r => {
//                 const listCleanTempat = (r.tempat_pemakaian || '').replace(/^R\./i, '');
//                 return String(r.nomor_ruang) === currentRuang && listCleanTempat.toUpperCase() !== currentCleanTempat.toUpperCase();
//             });
//             if (conflictingTempat) { newErrors.nomor_ruang = `Ruang ini sudah untuk ${conflictingTempat.tempat_pemakaian}.`; }
//         }
//         setMasterValidationErrors(newErrors);
//     }, [masterData.tempat_pemakaian, masterData.nomor_ruang, ruangList]);

//     useEffect(() => {
//         const newErrors = {};
//         data.items.forEach(item => {
//             const currentCleanTempat = (item.tempat_pemakaian || '').replace(/^R\./i, '');
//             const currentRuang = String(item.nomor_ruang || '');
//             if (!currentCleanTempat || !currentRuang) return;
//             const itemErrors = {};

//             const conflictingRuang = ruangList.find(r => {
//                 const listCleanTempat = (r.tempat_pemakaian || '').replace(/^R\./i, '');
//                 return listCleanTempat.toUpperCase() === currentCleanTempat.toUpperCase() && String(r.nomor_ruang) !== currentRuang && item.id !== r.inventaris_id;
//             });
//             if (conflictingRuang) { itemErrors.tempat_pemakaian = `Tempat ini sudah untuk Ruang ${conflictingRuang.nomor_ruang}.`; }

//             const conflictingTempat = ruangList.find(r => {
//                 const listCleanTempat = (r.tempat_pemakaian || '').replace(/^R\./i, '');
//                 return String(r.nomor_ruang) === currentRuang && listCleanTempat.toUpperCase() !== currentCleanTempat.toUpperCase() && item.id !== r.inventaris_id;
//             });
//             if (conflictingTempat) { itemErrors.nomor_ruang = `Ruang ini sudah untuk ${conflictingTempat.tempat_pemakaian}.`; }

//             if (Object.keys(itemErrors).length > 0) { newErrors[item.id] = itemErrors; }
//         });
//         setValidationErrors(newErrors);
//     }, [data.items, ruangList]);

//     const kodeBarangOptions = useMemo(() => [{ kode: '01-EL', keterangan: 'ELEKTRIKAL' }, { kode: '02-UM', keterangan: 'UMUM' }, { kode: '03-MB', keterangan: 'MEBELER' }, { kode: '04-MK', keterangan: 'MEKANIKAL' }, { kode: '05-AK', keterangan: 'ALAT KESEHATAN' }, { kode: '06-MT', keterangan: 'MOTOR' }], []);
//     const tempatOptions = useMemo(() => {
//         const uniqueTempat = [...new Map(ruangList.map(item => {
//             const cleanTempat = (item.tempat_pemakaian || '').replace(/^R\./i, '');
//             return [cleanTempat, { ...item, tempat_pemakaian: cleanTempat }];
//         })).values()];
//         return uniqueTempat.filter(item => item.tempat_pemakaian).map(item => ({ kode: item.tempat_pemakaian, keterangan: `RUANG ${item.nomor_ruang || 'N/A'}` }));
//     }, [ruangList]);
//     const nomorRuangOptions = useMemo(() => {
//         const uniqueRuang = [...new Map(ruangList.map(item => [item.nomor_ruang, item])).values()];
//         return uniqueRuang.filter(item => item.nomor_ruang).map(item => ({ kode: item.nomor_ruang, keterangan: (item.tempat_pemakaian || 'N/A').replace(/^R\./i, '') }));
//     }, [ruangList]);
    
//     const toggleItem = (id) => setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));

//     const handleMasterChange = (field, value) => {
//         let finalValue = value.toUpperCase();
//         if (field === 'nomor_ruang') {
//             finalValue = value.replace(/[^0-9]/g, '');
//         }
//         setMasterData(prev => ({ ...prev, [field]: finalValue }));
//     };

//     const handleMasterSelect = (field, option) => {
//         if (field === 'tempat_pemakaian') {
//             const originalRuang = ruangList.find(r => (r.tempat_pemakaian || '').replace(/^R\./i, '') === option.kode);
//             const originalTempatPemakaian = originalRuang ? originalRuang.tempat_pemakaian : option.kode;
//             setMasterData(prev => ({ ...prev, tempat_pemakaian: (originalTempatPemakaian || '').toUpperCase(), nomor_ruang: originalRuang?.nomor_ruang || '' }));
//         } else if (field === 'nomor_ruang') {
//             const correspondingTempat = ruangList.find(r => r.nomor_ruang === option.kode);
//             setMasterData(prev => ({ ...prev, nomor_ruang: option.kode, tempat_pemakaian: (correspondingTempat?.tempat_pemakaian || '').toUpperCase() }));
//         } else {
//             setMasterData(prev => ({ ...prev, [field]: option.kode }));
//         }
//     };
    
//     const handleMasterFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setMasterFoto(file);
//             if (masterPreview) {
//                 URL.revokeObjectURL(masterPreview);
//             }
//             setMasterPreview(URL.createObjectURL(file));
//         }
//     };

//     const applyAllMasterData = () => {
//         if (Object.keys(masterValidationErrors).length > 0) {
//             alert('Tidak dapat menerapkan semua perubahan karena ada error validasi pada data master. Harap perbaiki terlebih dahulu.');
//             return;
//         }

//         const masterUpdates = Object.entries(masterData).reduce((acc, [key, value]) => {
//             if (value !== '' && value !== null) {
//                 if (key === 'tempat_pemakaian' && value.trim().toUpperCase() === 'R.') {
//                     return acc;
//                 }
//                 acc[key] = value;
//             }
//             return acc;
//         }, {});

//         const isFotoUpdated = masterFoto instanceof File;
//         if (Object.keys(masterUpdates).length === 0 && !isFotoUpdated) {
//             alert('Isi setidaknya satu field atau pilih file master untuk diterapkan.');
//             return;
//         }

//         const updatedItems = data.items.map(item => ({
//             ...item,
//             ...masterUpdates,
//             ...(isFotoUpdated && { foto: masterFoto, remove_foto: false }),
//         }));
//         setData('items', updatedItems);

//         if (isFotoUpdated) {
//             setPreviews(prev => {
//                 Object.values(prev).forEach(URL.revokeObjectURL);
//                 const newPreviews = {};
//                 updatedItems.forEach(item => {
//                     newPreviews[item.id] = masterPreview;
//                 });
//                 return newPreviews;
//             });
//         }
        
//         const updatedFieldsCount = Object.keys(masterUpdates).length + (isFotoUpdated ? 1 : 0);
//         setNotification(`Perubahan dari ${updatedFieldsCount} field master telah diterapkan.`);
//     };
    
//     const applyBulkImageRemoval = () => {
//         if (confirm('Apakah Anda yakin ingin menghapus SEMUA foto barang? Aksi ini akan diterapkan pada semua item di bawah.')) {
//             const updatedItems = data.items.map(item => ({
//                 ...item,
//                 foto: null,
//                 remove_foto: true,
//             }));
//             setData('items', updatedItems);

//             Object.values(previews).forEach(URL.revokeObjectURL);
//             setPreviews({});

//             setMasterFoto(null);
//             if (masterPreview) {
//                 URL.revokeObjectURL(masterPreview);
//                 setMasterPreview(null);
//             }

//             setNotification('Semua foto telah ditandai untuk dihapus.');
//         }
//     };

//     const handleItemChange = (index, field, value) => {
//         const updatedItems = [...data.items];
//         let finalValue = value.toUpperCase();
//         if (field === 'nomor_ruang') {
//             finalValue = value.replace(/[^0-9]/g, '');
//         }
//         updatedItems[index] = { ...updatedItems[index], [field]: finalValue };
//         setData('items', updatedItems);
//     };

//     const handleFileChange = (index, e) => {
//         const file = e.target.files[0];
//         if (!file) return;
        
//         const updatedItems = [...data.items];
//         updatedItems[index].foto = file;
//         updatedItems[index].remove_foto = false;
//         setData('items', updatedItems);

//         setPreviews(prev => {
//             if (prev[updatedItems[index].id]) {
//                 URL.revokeObjectURL(prev[updatedItems[index].id]);
//             }
//             return {
//                 ...prev,
//                 [updatedItems[index].id]: URL.createObjectURL(file)
//             };
//         });
//     };

//     const handleItemRemoveImage = (index) => {
//         const updatedItems = [...data.items];
//         const itemId = updatedItems[index].id;
        
//         updatedItems[index].foto = null;
//         updatedItems[index].remove_foto = true;
//         setData('items', updatedItems);

//         setPreviews(prev => {
//             const newPreviews = { ...prev };
//             if (newPreviews[itemId]) {
//                 URL.revokeObjectURL(newPreviews[itemId]);
//                 delete newPreviews[itemId];
//             }
//             return newPreviews;
//         });
//     };

//     const handleItemSelect = (index, field, option) => {
//         const updatedItems = [...data.items];
//         let newValues = {};
//         if (field === 'tempat_pemakaian') {
//             const originalRuang = ruangList.find(r => (r.tempat_pemakaian || '').replace(/^R\./i, '') === option.kode);
//             const originalTempatPemakaian = originalRuang ? originalRuang.tempat_pemakaian : option.kode;
//             newValues = { tempat_pemakaian: (originalTempatPemakaian || '').toUpperCase(), nomor_ruang: originalRuang?.nomor_ruang || '' };
//         } else if (field === 'nomor_ruang') {
//             const correspondingTempat = ruangList.find(r => r.nomor_ruang === option.kode);
//             newValues = { nomor_ruang: option.kode, tempat_pemakaian: (correspondingTempat?.tempat_pemakaian || '').toUpperCase() };
//         } else {
//             newValues = { [field]: option.kode };
//         }
//         updatedItems[index] = { ...updatedItems[index], ...newValues };
//         setData('items', updatedItems);
//     };
    
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (Object.keys(validationErrors).length > 0) {
//             alert('Terdapat error validasi pada item. Harap periksa item yang ditandai dengan ikon peringatan dan perbaiki sebelum menyimpan.');
//             return;
//         }
        
//         post(route('inventaris.bulkUpdate'), {
//             preserveScroll: true,
//             forceFormData: true,
//             transform: (data) => {
//                 const transformedItems = data.items.map(item => {
//                     const newItem = { ...item };
//                     if (!(newItem.foto instanceof File) && !newItem.remove_foto) {
//                         delete newItem.foto;
//                     }
//                     return newItem;
//                 });
//                 return { ...data, items: transformedItems };
//             },
//         });
//     };
    
//     // PENAMBAHAN: 'jenis_perawatan' ditambahkan ke dalam masterFields
//     const masterFields = [
//         { name: 'nama_barang', label: 'Nama Barang', type: 'text', placeholder: 'Cth: Laptop' }, 
//         { name: 'kode_barang', label: 'Kode Barang', type: 'dropdown', options: kodeBarangOptions, placeholder: 'Pilih atau ketik kode' }, 
//         { name: 'spesifikasi', label: 'Spesifikasi', type: 'text', placeholder: 'Cth: Core i7, 16GB RAM' }, 
//         { name: 'jenis_perawatan', label: 'Jenis Perawatan', type: 'text', placeholder: 'Cth: Berkala, Perbaikan' },
//         { name: 'jumlah', label: 'Jumlah Total', type: 'number', placeholder: '0' }, 
//         { name: 'jumlah_dipakai', label: 'Jumlah Dipakai', type: 'number', placeholder: '0' }, 
//         { name: 'jumlah_rusak', label: 'Jumlah Rusak', type: 'number', placeholder: '0' }, 
//         { name: 'tempat_pemakaian', label: 'Tempat Pemakaian', type: 'dropdown', options: tempatOptions, placeholder: 'Ketik atau pilih tempat' }, 
//         { name: 'nomor_ruang', label: 'Nomor Ruang', type: 'dropdown', options: nomorRuangOptions, placeholder: 'Ketik atau pilih nomor' }, 
//         { name: 'asal_perolehan', label: 'Asal Perolehan', type: 'text', placeholder: 'Cth: Pembelian Dana BOS' }, 
//         { name: 'tanggal_masuk', label: 'Tanggal Masuk', type: 'date' }, 
//         // { name: 'harga', label: 'Harga Satuan', type: 'number', placeholder: 'Cth: 15000000' }
//     ];

//     return (
//         <>
//             <Head title="Edit Massal Inventaris" />
//             <Notification message={notification} />
//             <main className="bg-slate-100 dark:bg-slate-900 min-h-screen py-8 sm:py-12">
//                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="mb-6">
//                         <Link href={route('inventaris.index')} className="group inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-500 transition-colors">
//                             <ArrowLeftIcon className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
//                             Kembali ke Daftar Inventaris
//                         </Link>
//                     </div>
//                     <form onSubmit={handleSubmit}>
//                         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg space-y-10">
//                             <div className="p-6 sm:p-8 space-y-10">
//                                 <div>
//                                     <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Edit Semua Inventaris</h1>
//                                     <p className="text-sm text-slate-500 dark:text-slate-400">Ubah beberapa data inventaris sekaligus dengan cepat dan mudah.</p>
//                                 </div>
//                                 <hr className="my-6 border-slate-200 dark:border-slate-700" />
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Seragamkan Data (Opsional)</h2>
//                                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Isi field di bawah ini untuk diterapkan ke semua item yang dipilih.</p>
//                                     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                         {masterFields.map(field => {
//                                             const customError = masterValidationErrors[field.name];
//                                             return (
//                                                 <div key={`master-${field.name}`}>
//                                                     {field.type === 'dropdown' ? (
//                                                         <DropdownInput name={field.name} label={field.label} value={masterData[field.name]}
//                                                             onChange={(e) => handleMasterChange(field.name, e.target.value)}
//                                                             onOptionSelect={(option) => handleMasterSelect(field.name, option)}
//                                                             options={field.options} placeholder={field.placeholder}
//                                                             customError={customError} />
//                                                     ) : (
//                                                         <InputGroup label={field.label} htmlFor={`master_${field.name}`}>
//                                                             <input id={`master_${field.name}`} type={field.type} name={field.name} value={masterData[field.name] || ''}
//                                                                 onChange={(e) => handleMasterChange(field.name, e.target.value)}
//                                                                 className="form-input block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50"
//                                                                 placeholder={field.placeholder} />
//                                                         </InputGroup>
//                                                     )}
//                                                 </div>
//                                             );
//                                         })}
//                                         <div className="lg:col-span-3">
//                                             <InputGroup label="Seragamkan Foto Barang">
//                                                 <div className="flex items-start gap-4">
//                                                     {masterPreview ? <img src={masterPreview} className="w-24 h-24 object-cover rounded-lg bg-slate-200" alt="Pratinjau master" /> : <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400"><PhotoIcon className="w-10 h-10" /></div>}
//                                                     <div className="flex flex-col gap-2">
//                                                         <div>
//                                                             <label htmlFor="master_foto" className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 text-sm font-semibold text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 rounded-md hover:bg-green-50 dark:hover:bg-slate-600 transition">
//                                                                 <ArrowUpTrayIcon className="w-4 h-4" />
//                                                                 Pilih File Untuk Semua
//                                                             </label>
//                                                             <input id="master_foto" type="file" onChange={handleMasterFileChange} className="hidden" accept="image/png, image/jpeg, image/gif" />
//                                                         </div>
//                                                         <div>
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={applyBulkImageRemoval}
//                                                                 className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-slate-700 text-sm font-semibold text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-slate-600 transition"
//                                                             >
//                                                                 <TrashIcon className="w-4 h-4" />
//                                                                 Hapus Semua Foto
//                                                             </button>
//                                                         </div>
//                                                         <p className="text-xs text-slate-500 mt-1">Pilih file untuk mengganti semua foto, atau hapus semua foto.</p>
//                                                     </div>
//                                                 </div>
//                                             </InputGroup>
//                                         </div>
//                                     </div>
//                                     <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
//                                         <button type="button" onClick={applyAllMasterData} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform hover:scale-105">
//                                             <ChevronDoubleDownIcon className="w-5 h-5" />
//                                             Terapkan Perubahan Data
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <hr className="my-8 border-slate-200 dark:border-slate-700" />
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Item yang Akan Diperbarui ({data.items.length})</h2>
//                                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Klik pada setiap item untuk membuka dan mengedit detailnya.</p>
//                                     <div className="mt-6 border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-200 dark:divide-slate-700">
//                                         {data.items.map((item, index) => {
//                                             const displayImageUrl = previews[item.id] || (item.foto_url && !item.remove_foto ? item.foto_url : null);
                                            
//                                             return (
//                                             <div key={item.id}>
//                                                 <div className="flex items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" onClick={() => toggleItem(item.id)}>
//                                                     <div className="flex-shrink-0 mr-4">
//                                                         {displayImageUrl ? <img src={displayImageUrl} className="w-12 h-12 object-cover rounded-md bg-slate-200" alt={item.nama_barang} /> : <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center text-slate-400"><PhotoIcon className="w-7 h-7" /></div>}
//                                                     </div>
//                                                     <div className="flex-grow">
//                                                         <p className="font-semibold text-slate-800 dark:text-white">{sortedInventaris[index].nama_barang}</p>
//                                                         <p className="text-xs text-slate-500 dark:text-slate-400">Nomor Barang: {item.nomor || 'N/A'} | Kode: {item.kode_barang || 'Belum diatur'}</p>
//                                                     </div>
//                                                     {validationErrors[item.id] && (<div className="flex items-center gap-2 text-red-600 font-semibold text-xs mr-4 animate-pulse"><ExclamationTriangleIcon className="w-5 h-5" /><span className="hidden md:inline">Error Validasi</span></div>)}
//                                                     <div className="ml-4">{openItems[item.id] ? <ChevronDownIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" /> : <ChevronRightIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />}</div>
//                                                 </div>
//                                                 <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openItems[item.id] ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
//                                                     <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
//                                                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
//                                                             <InputGroup label="Nama Barang"><input type="text" value={item.nama_barang ?? ''} onChange={e => handleItemChange(index, 'nama_barang', e.target.value)} className="form-input w-full text-sm rounded-md bg-white dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white" />{errors[`items.${index}.nama_barang`] && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors[`items.${index}.nama_barang`]}</p>}</InputGroup>
//                                                             <DropdownInput name={`items[${index}].kode_barang`} label="Kode Barang" value={item.kode_barang} onChange={e => handleItemChange(index, 'kode_barang', e.target.value)} onOptionSelect={option => handleItemSelect(index, 'kode_barang', option)} options={kodeBarangOptions} customError={errors[`items.${index}.kode_barang`]} />
//                                                             <InputGroup label="Spesifikasi"><input type="text" value={item.spesifikasi ?? ''} onChange={e => handleItemChange(index, 'spesifikasi', e.target.value)} className="form-input w-full text-sm rounded-md bg-white dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white" /></InputGroup>
                                                            
//                                                             {/* PENAMBAHAN: Input 'Jenis Perawatan' untuk setiap item */}
//                                                             <InputGroup label="Jenis Perawatan"><input type="text" value={item.jenis_perawatan ?? ''} onChange={e => handleItemChange(index, 'jenis_perawatan', e.target.value)} className="form-input w-full text-sm rounded-md bg-white dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white" /></InputGroup>
                                                            
//                                                             <InputGroup label="Jumlah Total"><input type="number" value={item.jumlah ?? ''} onChange={e => handleItemChange(index, 'jumlah', e.target.value)} className="form-input w-full text-sm rounded-md bg-white dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white" />{errors[`items.${index}.jumlah`] && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors[`items.${index}.jumlah`]}</p>}</InputGroup>
//                                                             <InputGroup label="Jumlah Dipakai"><input type="number" value={item.jumlah_dipakai ?? ''} onChange={e => handleItemChange(index, 'jumlah_dipakai', e.target.value)} className="form-input w-full text-sm rounded-md bg-white dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white" /></InputGroup>
//                                                             <InputGroup label="Jumlah Rusak"><input type="number" value={item.jumlah_rusak ?? ''} onChange={e => handleItemChange(index, 'jumlah_rusak', e.target.value)} className="form-input w-full text-sm rounded-md bg-white dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white" /></InputGroup>
//                                                             <DropdownInput name={`items[${index}].tempat_pemakaian`} label="Tempat Pemakaian" value={item.tempat_pemakaian} onChange={e => handleItemChange(index, 'tempat_pemakaian', e.target.value)} onOptionSelect={option => handleItemSelect(index, 'tempat_pemakaian', option)} options={tempatOptions} customError={validationErrors[item.id]?.tempat_pemakaian || errors[`items.${index}.tempat_pemakaian`]} />
//                                                             <DropdownInput name={`items[${index}].nomor_ruang`} label="Nomor Ruang" value={item.nomor_ruang} onChange={e => handleItemChange(index, 'nomor_ruang', e.target.value)} onOptionSelect={option => handleItemSelect(index, 'nomor_ruang', option)} options={nomorRuangOptions} customError={validationErrors[item.id]?.nomor_ruang || errors[`items.${index}.nomor_ruang`]} />
//                                                             <InputGroup label="Asal Perolehan"><input type="text" value={item.asal_perolehan ?? ''} onChange={e => handleItemChange(index, 'asal_perolehan', e.target.value)} className="form-input w-full text-sm rounded-md bg-white dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white" />{errors[`items.${index}.asal_perolehan`] && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors[`items.${index}.asal_perolehan`]}</p>}</InputGroup>
//                                                             <InputGroup label="Tanggal Masuk"><input type="date" value={item.tanggal_masuk} onChange={e => handleItemChange(index, 'tanggal_masuk', e.target.value)} className="form-input w-full text-sm rounded-md bg-white dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white" />{errors[`items.${index}.tanggal_masuk`] && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors[`items.${index}.tanggal_masuk`]}</p>}</InputGroup>
//                                                             {/* <InputGroup label="Harga Satuan"><input type="number" value={item.harga ?? ''} onChange={e => handleItemChange(index, 'harga', e.target.value)} className="form-input w-full text-sm rounded-md bg-white dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white" />{errors[`items.${index}.harga`] && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors[`items.${index}.harga`]}</p>}</InputGroup> */}
                                                            
//                                                             <div className="lg:col-span-3">
//                                                                 <InputGroup label="Ubah Foto Barang" htmlFor={`foto_${item.id}`}>
//                                                                     <div className="flex items-start gap-4">
//                                                                         {displayImageUrl ? <img src={displayImageUrl} className="w-24 h-24 object-cover rounded-lg bg-slate-200" alt="Pratinjau" /> : <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400"><PhotoIcon className="w-10 h-10" /></div>}
//                                                                         <div className="flex flex-col gap-2">
//                                                                             <label htmlFor={`foto_${item.id}`} className="cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 text-sm font-semibold text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 rounded-md hover:bg-green-50 dark:hover:bg-slate-600 transition">
//                                                                                 <ArrowUpTrayIcon className="w-4 h-4" />
//                                                                                 {displayImageUrl ? 'Ganti File' : 'Pilih File'}
//                                                                             </label>
//                                                                             {displayImageUrl && (
//                                                                                  <button type="button" onClick={() => handleItemRemoveImage(index)} className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-slate-700 text-sm font-semibold text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-slate-600 transition">
//                                                                                     <TrashIcon className="w-4 h-4" />
//                                                                                     Hapus Gambar
//                                                                                 </button>
//                                                                             )}
//                                                                             <input id={`foto_${item.id}`} name={`items[${index}].foto`} type="file" onChange={(e) => handleFileChange(index, e)} className="hidden" accept="image/png, image/jpeg, image/gif" />
//                                                                             {errors[`items.${index}.foto`] && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{errors[`items.${index}.foto`]}</p>}
//                                                                             <p className="text-xs text-slate-500 mt-1">File JPG, PNG, atau GIF (Maks 2MB).</p>
//                                                                         </div>
//                                                                     </div>
//                                                                 </InputGroup>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             )
//                                         })}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="sticky bottom-4 z-10">
//                                 <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.1)] dark:shadow-black/20 border border-slate-200 dark:border-slate-700">
//                                     <div className="px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end items-center gap-4">
//                                         <Link
//                                             href={route('inventaris.index')}
//                                             className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-red-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
//                                         >
//                                             Batalkan
//                                         </Link>
//                                         <button
//                                             type="submit"
//                                             disabled={processing}
//                                             className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-green-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//                                         >
//                                             {processing ? 'Menyimpan...' : (<> <CheckCircleIcon className="w-5 h-5 mr-2" /> Simpan Semua Perubahan </>)}
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </main>
//         </>
//     );
// }
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    ArrowLeftIcon, PhotoIcon, CheckCircleIcon,
    ChevronDownIcon, ChevronRightIcon, ChevronDoubleDownIcon, CheckIcon,
    ExclamationTriangleIcon, ArrowUpTrayIcon, TrashIcon
} from '@heroicons/react/24/solid';

// --- TIDAK ADA PERUBAHAN DI KOMPONEN BANTU ---
const Notification = ({ message }) => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    return (
        <div className={`fixed top-5 right-5 z-50 transform transition-all duration-300 ease-in-out ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center">
                <CheckCircleIcon className="w-6 h-6 mr-3" />
                <span>{message}</span>
            </div>
        </div>
    );
};

const InputGroup = ({ label, children, htmlFor }) => (
    <div>
        {label && <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>}
        <div className="relative">{children}</div>
    </div>
);

// --- GANTI SELURUH KOMPONEN DropdownInput DENGAN INI ---
const DropdownInput = ({ label, value, error, customError, options = [], onOptionSelect, placeholder = "Pilih..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Cari opsi yang terpilih berdasarkan value (kode/ID)
    const selectedOption = useMemo(() => 
        options.find(opt => opt.kode === value), 
    [value, options]);

    // Filter opsi berdasarkan search term
    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        return options.filter(opt =>
            opt.keterangan.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    // Handle klik di luar untuk menutup dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fokus ke input search saat dropdown dibuka & Reset search saat ditutup
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        } else {
            setSearchTerm("");
        }
    }, [isOpen]);

    return (
        <InputGroup label={label}>
            <div className="relative" ref={dropdownRef}>
                {/* 1. Tombol Trigger (Tampilan Utama) */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`block w-full text-left rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:ring focus:ring-green-500 focus:ring-opacity-50 flex justify-between items-center ${error || customError ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                >
                    <span className={`block truncate ${selectedOption ? "" : "text-slate-400"}`}>
                        {selectedOption ? selectedOption.keterangan : placeholder}
                    </span>
                    <ChevronDownIcon className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 2. Panel Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 shadow-xl rounded-md border border-slate-200 dark:border-slate-600 overflow-hidden animate-fade-in-down">
                        
                        {/* Input Pencarian Sticky di Atas */}
                        <div className="p-2 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                placeholder="Ketik untuk mencari..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()} // Mencegah dropdown tertutup saat klik input
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Jangan submit form
                                        if (filteredOptions.length > 0) {
                                            onOptionSelect(filteredOptions[0]);
                                            setIsOpen(false);
                                        }
                                    }
                                }}
                            />
                        </div>

                        {/* List Item */}
                        <ul className="max-h-60 overflow-auto py-1 custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <li key={`${option.kode}-${index}`}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onOptionSelect(option);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm flex justify-between items-center transition-colors
                                                ${value === option.kode 
                                                    ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-medium' 
                                                    : 'text-slate-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            <span className="truncate">{option.keterangan}</span>
                                            {value === option.kode && <CheckIcon className="h-5 w-5 text-green-600" />}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-3 text-sm text-center text-slate-500 dark:text-slate-400 italic">
                                    "{searchTerm}" tidak ditemukan.
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
            {(error || customError) && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{error || customError}</p>}
        </InputGroup>
    );
};

// --- KOMPONEN UTAMA FORM ---
export default function BulkEditForm({ 
    inventaris, 
    ruanganList = [], 
    asalPerolehanList = [], 
    masterBarangList = [], 
    jenisPerawatanList = [] 
}) {

    // Format opsi untuk DropdownInput (kode = ID, keterangan = label)
    const barangOptions = useMemo(() => masterBarangList.map(b => ({ kode: b.id, keterangan: b.label, kategori_id: b.kategori_id })), [masterBarangList]);
    const ruanganOptions = useMemo(() => ruanganList.map(r => ({ kode: r.id, keterangan: r.label })), [ruanganList]);
    const asalOptions = useMemo(() => asalPerolehanList.map(a => ({ kode: a.id, keterangan: a.label })), [asalPerolehanList]);
    const perawatanOptions = useMemo(() => jenisPerawatanList.map(j => ({ kode: j.id, keterangan: j.label })), [jenisPerawatanList]);

    const sortedInventaris = useMemo(() => {
        return [...inventaris].sort((a, b) => String(a.nomor ?? '').localeCompare(String(b.nomor ?? ''), undefined, { numeric: true }));
    }, [inventaris]);

    const { data, setData, post, processing, errors } = useForm({
        items: sortedInventaris.map(item => ({
            id: item.id,
            master_barang_id: item.master_barang_id || '',
            master_ruangan_id: item.master_ruangan_id || '',
            master_asal_perolehan_id: item.master_asal_perolehan_id || '',
            master_jenis_perawatan_id: item.master_jenis_perawatan_id || '',
            master_kategori_id: item.master_kategori_id || '',
            jumlah: item.jumlah || '',
            jumlah_dipakai: item.jumlah_dipakai ?? 0,
            jumlah_rusak: item.jumlah_rusak ?? 0,
            spesifikasi: item.spesifikasi || '',
            tanggal_masuk: item.tanggal_masuk ? item.tanggal_masuk.split('T')[0] : '',
            harga: item.harga || '',
            foto: null, // Ini untuk file baru yang akan diupload
            old_foto: item.foto, // Simpan path foto lama untuk pratinjau
            remove_foto: false,
        }))
    });

    const [previews, setPreviews] = useState({});
    const [masterFoto, setMasterFoto] = useState(null);
    const [masterPreview, setMasterPreview] = useState(null);
    const [openItems, setOpenItems] = useState({});
    const [notification, setNotification] = useState('');

    const [masterData, setMasterData] = useState({ 
        master_barang_id: '', 
        master_ruangan_id: '', 
        master_asal_perolehan_id: '', 
        master_jenis_perawatan_id: '',
        master_kategori_id: '',
        spesifikasi: '', 
        tanggal_masuk: '', 
        harga: ''
    });

    useEffect(() => {
        return () => {
            Object.values(previews).forEach(URL.revokeObjectURL);
            if (masterPreview) URL.revokeObjectURL(masterPreview);
        };
    }, [previews, masterPreview]);
    
    const toggleItem = (id) => setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));

    const handleMasterSelect = (field, option) => {
        if (field === 'master_barang_id') {
            setMasterData(prev => ({ ...prev, master_barang_id: option.kode, master_kategori_id: option.kategori_id }));
        } else {
            setMasterData(prev => ({ ...prev, [field]: option.kode }));
        }
    };
    
    const handleMasterFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMasterFoto(file);
            if (masterPreview) URL.revokeObjectURL(masterPreview);
            setMasterPreview(URL.createObjectURL(file));
        }
    };

    const applyAllMasterData = () => {
        const updates = Object.entries(masterData).reduce((acc, [key, value]) => {
            if (value !== '' && value !== null) acc[key] = value;
            return acc;
        }, {});

        if (Object.keys(updates).length === 0 && !masterFoto) {
            alert('Isi setidaknya satu field master.');
            return;
        }

        const updatedItems = data.items.map(item => ({
            ...item,
            ...updates,
            ...(masterFoto instanceof File && { foto: masterFoto, remove_foto: false }),
        }));
        setData('items', updatedItems);

        if (masterFoto instanceof File) {
            setPreviews(prev => {
                const newPreviews = {};
                updatedItems.forEach(item => { newPreviews[item.id] = masterPreview; });
                return newPreviews;
            });
        }
        setNotification(`Data master telah diterapkan.`);
    };
    
    const applyBulkImageRemoval = () => {
        if (confirm('Hapus SEMUA foto barang?')) {
            const updatedItems = data.items.map(item => ({ ...item, foto: null, remove_foto: true }));
            setData('items', updatedItems);
            setPreviews({});
            setMasterFoto(null);
            if (masterPreview) setMasterPreview(null);
            setNotification('Semua foto ditandai untuk dihapus.');
        }
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...data.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value.toUpperCase() };
        setData('items', updatedItems);
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const updatedItems = [...data.items];
        updatedItems[index].foto = file;
        updatedItems[index].remove_foto = false;
        setData('items', updatedItems);
        setPreviews(prev => ({ ...prev, [updatedItems[index].id]: URL.createObjectURL(file) }));
    };

    const handleItemRemoveImage = (index) => {
        const updatedItems = [...data.items];
        updatedItems[index].foto = null;
        updatedItems[index].remove_foto = true;
        setData('items', updatedItems);
        setPreviews(prev => {
            const n = { ...prev };
            delete n[updatedItems[index].id];
            return n;
        });
    };

    const handleItemSelect = (index, field, option) => {
        const updatedItems = [...data.items];
        if (field === 'master_barang_id') {
            updatedItems[index] = { ...updatedItems[index], master_barang_id: option.kode, master_kategori_id: option.kategori_id };
        } else {
            updatedItems[index] = { ...updatedItems[index], [field]: option.kode };
        }
        setData('items', updatedItems);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('inventaris.bulkUpdate'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };
    
    const masterFields = [
        { name: 'master_barang_id', label: 'Nama Barang', type: 'dropdown', options: barangOptions, placeholder: 'Pilih Barang' }, 
        { name: 'master_ruangan_id', label: 'Lokasi Ruangan', type: 'dropdown', options: ruanganOptions, placeholder: 'Pilih Ruangan' }, 
        { name: 'spesifikasi', label: 'Spesifikasi', type: 'text', placeholder: 'Cth: Core i7, 16GB RAM' }, 
        { name: 'master_jenis_perawatan_id', label: 'Jenis Perawatan', type: 'dropdown', options: perawatanOptions, placeholder: 'Pilih Jenis Perawatan' },
        { name: 'master_asal_perolehan_id', label: 'Asal Perolehan', type: 'dropdown', options: asalOptions, placeholder: 'Pilih Asal' }, 
        { name: 'tanggal_masuk', label: 'Tanggal Masuk', type: 'date' }, 
    ];

    return (
        <>
            <Head title="Edit Massal Inventaris" />
            <Notification message={notification} />
            <main className="bg-slate-100 dark:bg-slate-900 min-h-screen py-8 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('inventaris.index')} className="group inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-500 transition-colors">
                            <ArrowLeftIcon className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Kembali ke Daftar Inventaris
                        </Link>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg space-y-10">
                            <div className="p-6 sm:p-8 space-y-10">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Edit Semua Inventaris</h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Gunakan data master untuk menjaga akurasi dan konsistensi data.</p>
                                </div>
                                <hr className="my-6 border-slate-200 dark:border-slate-700" />
                                
                                {/* --- MASTER SERAGAMKAN --- */}
                                <div>
                                    <h2 className="text-lg font-semibold dark:text-white flex items-center gap-2">
                                        <ChevronDoubleDownIcon className="w-5 h-5 text-blue-500" /> Seragamkan Data (Opsional)
                                    </h2>
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {masterFields.map(field => (
                                            <div key={`master-${field.name}`}>
                                                {field.type === 'dropdown' ? (
                                                    <DropdownInput label={field.label} value={masterData[field.name]}
                                                        onOptionSelect={(opt) => handleMasterSelect(field.name, opt)}
                                                        options={field.options} placeholder={field.placeholder} />
                                                ) : (
                                                    <InputGroup label={field.label}>
                                                        <input type={field.type} value={masterData[field.name] || ''}
                                                            onChange={(e) => setMasterData({...masterData, [field.name]: e.target.value.toUpperCase()})}
                                                            className="form-input block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 text-slate-900 dark:text-white shadow-sm px-4 py-2 focus:border-green-500 focus:ring focus:ring-green-500 dark:focus:ring-green-600 focus:ring-opacity-50"
                                                            placeholder={field.placeholder} />
                                                    </InputGroup>
                                                )}
                                            </div>
                                        ))}
                                        <div className="lg:col-span-3">
                                            <InputGroup label="Seragamkan Foto Barang">
                                                <div className="flex items-start gap-4">
                                                    {masterPreview ? <img src={masterPreview} className="w-24 h-24 object-cover rounded-lg bg-slate-200" alt="Preview master" /> : <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400"><PhotoIcon className="w-10 h-10" /></div>}
                                                    <div className="flex flex-col gap-2">
                                                        <label htmlFor="master_foto" className="cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 text-sm font-semibold text-green-700 dark:text-green-400 border border-green-300 rounded-md hover:bg-green-50 transition shadow-sm">
                                                            <ArrowUpTrayIcon className="w-4 h-4" /> Pilih File Semua
                                                        </label>
                                                        <input id="master_foto" type="file" onChange={handleMasterFileChange} className="hidden" accept="image/*" />
                                                        <button type="button" onClick={applyBulkImageRemoval} className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-300 rounded-md hover:bg-red-100 transition text-sm font-semibold shadow-sm">
                                                            <TrashIcon className="w-4 h-4" /> Hapus Semua Foto
                                                        </button>
                                                    </div>
                                                </div>
                                            </InputGroup>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t dark:border-slate-700 flex justify-end">
                                        <button type="button" onClick={applyAllMasterData} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105">
                                            <ChevronDoubleDownIcon className="w-5 h-5" /> Terapkan Perubahan Master
                                        </button>
                                    </div>
                                </div>

                                <hr className="my-8 border-slate-200 dark:border-slate-700" />

                                {/* --- DAFTAR ITEM --- */}
                                <div>
                                    <h2 className="text-lg font-semibold dark:text-white">Item yang Akan Diperbarui ({data.items.length})</h2>
                                    <div className="mt-6 border dark:border-slate-700 rounded-lg divide-y dark:divide-slate-700 shadow-sm">
                                        {data.items.map((item, index) => {
                                            // LOGIKA PRATINJAU FOTO (Lama vs Baru)
                                            let displayImageUrl = previews[item.id]; // Cek pratinjau upload baru dulu
                                            if (!displayImageUrl && item.old_foto && !item.remove_foto) {
                                                // Jika tidak ada upload baru, tampilkan foto lama
                                                displayImageUrl = item.old_foto.startsWith('http') ? item.old_foto : `/storage/${item.old_foto}`;
                                            }

                                            return (
                                            <div key={item.id} className="bg-white dark:bg-slate-800">
                                                <div className="flex items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition" onClick={() => toggleItem(item.id)}>
                                                    <div className="flex-shrink-0 mr-4">
                                                        {displayImageUrl ? <img src={displayImageUrl} className="w-12 h-12 object-cover rounded-md shadow-sm border dark:border-slate-600" alt="Foto Unit" /> : <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center text-slate-400"><PhotoIcon className="w-7 h-7" /></div>}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-bold text-slate-800 dark:text-white uppercase">
                                                            {barangOptions.find(o => o.kode === item.master_barang_id)?.keterangan || "Pilih Nama Barang..."}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">ID: {item.id} | Ruang: {ruanganOptions.find(o => o.kode === item.master_ruangan_id)?.keterangan || "N/A"}</p>
                                                    </div>
                                                    <div className="ml-4">{openItems[item.id] ? <ChevronDownIcon className="w-6 h-6 dark:text-slate-300" /> : <ChevronRightIcon className="w-6 h-6 text-slate-400" />}</div>
                                                </div>
                                                
                                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openItems[item.id] ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className="p-6 border-t dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            <DropdownInput label="Master Barang" value={item.master_barang_id} onOptionSelect={opt => handleItemSelect(index, 'master_barang_id', opt)} options={barangOptions} error={errors[`items.${index}.master_barang_id`]} />
                                                            <DropdownInput label="Lokasi Ruangan" value={item.master_ruangan_id} onOptionSelect={opt => handleItemSelect(index, 'master_ruangan_id', opt)} options={ruanganOptions} error={errors[`items.${index}.master_ruangan_id`]} />
                                                            <InputGroup label="Jumlah Total"><input type="number" value={item.jumlah} onChange={e => handleItemChange(index, 'jumlah', e.target.value)} className="form-input w-full rounded-md dark:bg-slate-700 dark:text-white border-transparent" /></InputGroup>
                                                            <DropdownInput label="Asal Perolehan" value={item.master_asal_perolehan_id} onOptionSelect={opt => handleItemSelect(index, 'master_asal_perolehan_id', opt)} options={asalOptions} />
                                                            <DropdownInput label="Jenis Perawatan" value={item.master_jenis_perawatan_id} onOptionSelect={opt => handleItemSelect(index, 'master_jenis_perawatan_id', opt)} options={perawatanOptions} />
                                                            <InputGroup label="Tanggal Masuk"><input type="date" value={item.tanggal_masuk} onChange={e => handleItemChange(index, 'tanggal_masuk', e.target.value)} className="form-input w-full rounded-md dark:bg-slate-700 dark:text-white border-transparent" /></InputGroup>
                                                            
                                                            <div className="lg:col-span-3">
                                                                <InputGroup label="Spesifikasi / Catatan">
                                                                    <textarea value={item.spesifikasi || ''} onChange={e => handleItemChange(index, 'spesifikasi', e.target.value)} className="form-input w-full rounded-md dark:bg-slate-700 dark:text-white border-transparent" rows="2"></textarea>
                                                                </InputGroup>
                                                            </div>

                                                            <div className="lg:col-span-3">
                                                                <InputGroup label="Foto Barang Unit" htmlFor={`foto_${item.id}`}>
                                                                    <div className="flex items-start gap-4">
                                                                        {displayImageUrl ? <img src={displayImageUrl} className="w-24 h-24 object-cover rounded-lg border dark:border-slate-600 shadow-sm" alt="Pratinjau Unit" /> : <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400"><PhotoIcon className="w-10 h-10" /></div>}
                                                                        <div className="flex flex-col gap-2">
                                                                            <label htmlFor={`foto_${item.id}`} className="cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 text-sm font-semibold text-green-700 dark:text-green-400 border border-green-300 rounded-md hover:bg-green-50 transition shadow-sm">
                                                                                <ArrowUpTrayIcon className="w-4 h-4" /> {displayImageUrl ? 'Ganti File' : 'Pilih File'}
                                                                            </label>
                                                                            {displayImageUrl && (
                                                                                 <button type="button" onClick={() => handleItemRemoveImage(index)} className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-300 rounded-md hover:bg-red-100 transition text-sm font-semibold shadow-sm">
                                                                                    <TrashIcon className="w-4 h-4" /> Hapus Foto
                                                                                </button>
                                                                            )}
                                                                            <input id={`foto_${item.id}`} type="file" onChange={(e) => handleFileChange(index, e)} className="hidden" accept="image/*" />
                                                                        </div>
                                                                    </div>
                                                                </InputGroup>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* --- STICKY FOOTER --- */}
                            <div className="sticky bottom-4 z-10">
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.1)] dark:shadow-black/20 border border-slate-200 dark:border-slate-700 p-6 flex flex-col-reverse sm:flex-row sm:justify-end items-center gap-4">
                                    <Link href={route('inventaris.index')} className="w-full sm:w-auto text-center px-6 py-2.5 text-slate-500 font-semibold hover:text-slate-700 uppercase tracking-widest text-xs transition">
                                        Batalkan
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-2.5 bg-green-600 border border-transparent rounded-lg font-semibold text-white uppercase tracking-widest hover:bg-green-700 transition disabled:opacity-50 shadow-md"
                                    >
                                        {processing ? 'Menyimpan...' : (<> <CheckCircleIcon className="w-5 h-5 mr-2" /> Simpan Semua Perubahan </>)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}