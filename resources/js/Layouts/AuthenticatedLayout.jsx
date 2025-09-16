import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { Bars3Icon, XMarkIcon, QuestionMarkCircleIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid';
// --- PENAMBAHAN 1: Impor komponen notifikasi yang baru dibuat ---
import Notification from '@/Components/Notification';

// Custom Hook untuk mengelola state dan efek tema (Tidak berubah)
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

// Komponen ThemeSwitcher (Tidak berubah)
const ThemeSwitcher = ({ theme, onToggle }) => (
    <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 w-10 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        aria-label="Toggle theme"
    >
        {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
    </button>
);

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [theme, setTheme] = useTheme();
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            {/* --- PENAMBAHAN 2: Render komponen notifikasi di sini --- */}
            <Notification />

            {/* Navigasi utama */}
            <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            <Link href="/" className="flex shrink-0 items-center gap-3">
                                <img src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/logo_klinik.png " alt="Logo Klinik" className="block h-10 w-auto" />
                                <div className="sm:hidden text-lg font-bold text-slate-800 dark:text-slate-200">
                                    {header}
                                </div>
                            </Link>
                            <div className="hidden space-x-4 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</NavLink>
                                <NavLink href={route('inventaris.index')} active={route().current('inventaris.*')}>Inventaris</NavLink>
                                <NavLink href={route('panduan.index')} active={route().current('panduan.*')}>Panduan</NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-700">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold text-base">{user.name.substring(0, 1).toUpperCase()}</div>
                                                <span className="mx-2 hidden lg:block">{user.name}</span>
                                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    
                                    <Dropdown.Content 
                                        align="right" 
                                        width="48" 
                                        contentClasses="py-1 bg-white dark:bg-slate-700 rounded-md shadow-lg border border-slate-200 dark:border-slate-600"
                                    >
                                        <Dropdown.Link 
                                            href={route('profile.edit')} 
                                            className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button" 
                                            className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 w-full text-left"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
                            <button onClick={() => setShowingNavigationDropdown((p) => !p)} className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-slate-400">
                                {showingNavigationDropdown ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                     <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('inventaris.index')} active={route().current('inventaris.*')}>Inventaris</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('panduan.index')} active={route().current('panduan.*')}>Panduan</ResponsiveNavLink>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pb-1 pt-4">
                        <div className="px-4"><div className="text-base font-medium text-slate-800 dark:text-slate-200">{user.name}</div><div className="text-sm font-medium text-slate-500">{user.email}</div></div>
                        <div className="mt-3 space-y-1"><ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink><ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink></div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-slate-800 shadow hidden sm:block">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{header}</h1>
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}