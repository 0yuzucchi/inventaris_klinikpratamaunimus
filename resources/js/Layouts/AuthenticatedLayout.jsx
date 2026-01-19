import { useState, useEffect, useMemo } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import Notification from '@/Components/Notification';

// --- HELPER: Cek Role User ---
const hasAccess = (user, allowedRoles) => {
    if (!user) return false;

    // Skenario 1: User memiliki kolom 'role' (String) di database
    if (typeof user.role === 'string') {
        return allowedRoles.includes(user.role);
    }

    // Skenario 2: User menggunakan Spatie (user.roles berupa Array)
    if (Array.isArray(user.roles)) {
        // Cek jika array roles berisi string atau object {name: 'admin', ...}
        return user.roles.some(r => 
            allowedRoles.includes(typeof r === 'object' ? r.name : r)
        );
    }

    // Default false jika tidak ada definisi role
    return false;
};

// --- HOOK THEME ---
const useTheme = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') { root.classList.add('dark'); } 
        else { root.classList.remove('dark'); }
        localStorage.setItem('theme', theme);
    }, [theme]);
    return [theme, setTheme];
};

// --- COMPONENT THEME SWITCHER ---
const ThemeSwitcher = ({ theme, onToggle }) => (
    <button
        onClick={onToggle}
        className="flex items-center justify-center h-9 w-9 rounded-full 
        text-slate-500 hover:text-green-600 bg-slate-100 hover:bg-green-50 
        dark:bg-slate-700 dark:text-slate-400 dark:hover:text-green-400 dark:hover:bg-slate-600 
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
        aria-label="Toggle theme"
    >
        {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
);

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    const userInitial = user.name ? user.name.substring(0, 1).toUpperCase() : 'U';

    // --- DEFINISI MENU BERDASARKAN ROLE ---
    // Menggunakan useMemo agar tidak dihitung ulang setiap render kecuali user berubah
    const navigationItems = useMemo(() => {
        return [
            {
                name: 'Dashboard',
                href: route('dashboard'),
                active: route().current('dashboard'),
                show: true // Semua user auth bisa akses
            },
            {
                name: 'Inventaris',
                href: route('inventaris.index'),
                active: route().current('inventaris.*'),
                // Sesuai middleware: super_admin, kepala_rt, staff_rt, direktur, keuangan
                show: hasAccess(user, ['super_admin', 'kepala_rt', 'staff_rt', 'direktur', 'keuangan'])
            },
            {
                name: 'Nilai Aset',
                href: route('nilai-aset.index'),
                active: route().current('nilai-aset.*'),
                // Sesuai middleware: super_admin, direktur, keuangan
                show: hasAccess(user, ['super_admin', 'direktur', 'keuangan'])
            },
            {
                name: 'ChatBot',
                href: route('chatbot.index'),
                active: route().current('chatbot.*'),
                show: true // Semua user auth bisa akses
            },
            {
                name: 'Panduan',
                href: route('panduan.index'),
                active: route().current('panduan.*'),
                show: true // Semua user auth bisa akses
            }
        ];
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Notification Component */}
            <div className="sticky top-0 z-50">
                <Notification />
            </div>

            {/* --- NAVBAR --- */}
            <nav className="bg-white/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 sm:static z-40 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        
                        {/* KIRI: Logo & Desktop Menu */}
                        <div className="flex items-center gap-6">
                            {/* Logo */}
                            <Link href="/" className="flex shrink-0 items-center gap-3 group">
                                <img 
                                    src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/logo_klinik.png" 
                                    alt="Logo Klinik" 
                                    className="block h-9 w-auto transition-transform group-hover:scale-105" 
                                />
                                <span className="hidden lg:block font-bold text-lg text-slate-700 dark:text-slate-200 tracking-tight">
                                    Sistem<span className="text-green-600">Aset</span>
                                </span>
                            </Link>

                            {/* Desktop NavLinks (Looping Dinamis) */}
                            <div className="hidden space-x-1 sm:-my-px sm:flex">
                                {navigationItems.map((item, index) => (
                                    item.show && (
                                        <NavLink key={index} href={item.href} active={item.active}>
                                            {item.name}
                                        </NavLink>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* KANAN: User Profile & Actions (Desktop) */}
                        <div className="hidden sm:flex sm:items-center sm:gap-3">
                            <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
                            
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 border border-transparent text-sm font-medium leading-4 text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none transition ease-in-out duration-150">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-700">
                                                    {userInitial}
                                                </div>
                                                <span className="hidden md:inline-block max-w-[100px] truncate">{user.name}</span>
                                                <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 rounded-lg shadow-xl">
                                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 md:hidden">
                                            <div className="text-xs text-slate-500 dark:text-slate-400">Signed in as</div>
                                            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{user.email}</div>
                                            {/* Menampilkan Role User saat ini untuk debug/info */}
                                            <div className="text-[10px] text-green-600 mt-1 uppercase font-bold tracking-wider">
                                                {typeof user.role === 'string' ? user.role : (user.roles?.[0]?.name || 'User')}
                                            </div>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* KANAN: Hamburger Menu (Mobile) */}
                        <div className="flex items-center gap-3 sm:hidden">
                            <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition focus:outline-none"
                            >
                                {showingNavigationDropdown ? (
                                    <XMarkIcon className="h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MOBILE MENU (Expandable) --- */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-lg`}>
                    <div className="space-y-1 pb-3 pt-2 px-2">
                        {/* Loop Menu Mobile */}
                        {navigationItems.map((item, index) => (
                            item.show && (
                                <ResponsiveNavLink key={index} href={item.href} active={item.active}>
                                    {item.name}
                                </ResponsiveNavLink>
                            )
                        ))}
                    </div>

                    {/* Mobile User Info */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pb-4 pt-4 bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 text-white font-bold text-lg shadow-sm">
                                    {userInitial}
                                </div>
                            </div>
                            <div className="ml-3 min-w-0">
                                <div className="text-base font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</div>
                                <div className="text-sm font-medium text-slate-500 truncate">{user.email}</div>
                                <div className="text-xs font-medium text-green-600 truncate mt-0.5 uppercase">
                                    {typeof user.role === 'string' ? user.role.replace('_', ' ') : 'User'}
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- PAGE HEADER --- */}
            {header && (
                <header className="bg-white dark:bg-slate-800 shadow-sm transition-colors duration-300">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                            {header}
                        </h1>
                    </div>
                </header>
            )}

            {/* --- MAIN CONTENT --- */}
            <main className="transition-all duration-300">
                {children}
            </main>
        </div>
    );
}