import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    const baseClasses = 'block w-full py-2 px-3 text-left text-base font-medium transition duration-150 ease-in-out';

    // --- PERUBAHAN DI SINI: Gaya aktif dan tidak aktif agar sesuai dengan tema hijau dan dark mode ---
    const activeClasses = 'border-l-4 border-green-600 dark:border-green-400 text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 focus:outline-none';
    
    // Pastikan warna inactive juga disesuaikan dengan palet slate dan dark mode
    const inactiveClasses = 'border-l-4 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-slate-300 dark:focus:border-slate-600 focus:bg-slate-100 dark:focus:bg-slate-700 focus:text-slate-800 dark:focus:text-slate-200';
    // --- AKHIR PERUBAHAN ---

    return (
        <Link
            {...props}
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${className}`}
        >
            {children}
        </Link>
    );
}