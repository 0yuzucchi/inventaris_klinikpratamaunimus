import React, { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function Notification() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    
    const [notification, setNotification] = useState({
        message: { line1: '', line2: '' },
        type: 'success',
    });

    // Ref untuk mencegah notifikasi yang sama muncul berulang kali
    const lastFlashMessage = useRef(null);
    // Ref untuk elemen notifikasi agar bisa ditutup saat klik di luar
    const notificationRef = useRef(null);

    useEffect(() => {
        const messageText = flash.success || flash.error;
        const messageType = flash.success ? 'success' : 'error';

        // Hanya proses jika ada pesan baru dan berbeda dari yang terakhir diproses
        if (messageText && messageText !== lastFlashMessage.current) {
            let line1 = '';
            let line2 = '';

            // --- PERBAIKAN UTAMA: Cek tipe error TERLEBIH DAHULU ---
            if (messageType === 'error') {
                line1 = 'Terjadi Kesalahan';
                line2 = messageText; // Tampilkan pesan error apa adanya dari backend
            } else {
                // Jika bukan error, baru kita proses sebagai pesan sukses
                line1 = 'Sukses!';
                line2 = messageText;

                if (messageText.includes('ditambahkan')) {
                    line1 = 'Data Telah';
                    line2 = 'Berhasil Ditambahkan';
                } else if (messageText.includes('diperbarui')) {
                    line1 = 'Data Telah';
                    line2 = 'Berhasil Diperbarui';
                } else if (messageText.includes('dihapus')) {
                    line1 = 'Data Telah';
                    line2 = 'Berhasil Dihapus';
                } else if (messageText.includes('diduplikasi')) {
                    line1 = 'Data Telah';
                    line2 = 'Berhasil Diduplikasi';
                }
            }

            setNotification({
                message: { line1, line2 },
                type: messageType,
            });
            setVisible(true);
            lastFlashMessage.current = messageText;

            const timer = setTimeout(() => {
                setVisible(false);
                lastFlashMessage.current = null;
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Fungsi untuk menutup notifikasi saat klik di luar
    const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setVisible(false);
            lastFlashMessage.current = null;
        }
    };

    useEffect(() => {
        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible]);

    if (!visible) {
        return null;
    }

    const isSuccess = notification.type === 'success';

    return (
        <div className="fixed inset-0 bg-black/60 dark:bg-slate-900/80 flex items-center justify-center z-50 p-4">
            <Transition
                show={visible}
                enter="transition-opacity duration-300 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition-opacity duration-200 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div 
                    ref={notificationRef}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 flex flex-col items-center gap-5 text-center max-w-xs w-full border border-slate-200 dark:border-slate-700"
                >
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                        {notification.message.line1} <br /> {notification.message.line2}
                    </h2>

                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isSuccess ? (
                            <CheckIcon className="w-10 h-10 text-white" />
                        ) : (
                            <XMarkIcon className="w-10 h-10 text-white" />
                        )}
                    </div>
                </div>
            </Transition>
        </div>
    );
}