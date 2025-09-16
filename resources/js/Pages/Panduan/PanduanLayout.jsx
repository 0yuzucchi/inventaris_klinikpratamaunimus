import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    DocumentPlusIcon,
    PencilSquareIcon,
    TrashIcon,
    PrinterIcon,
    WrenchScrewdriverIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon, // <-- BARU: Ikon untuk laporan keseluruhan
    FunnelIcon,       // <-- BARU: Ikon untuk laporan dengan filter
} from '@heroicons/react/24/outline';

// Komponen NavLink khusus untuk sidebar panduan
const PanduanNavLink = ({ href, active, children, icon }) => {
    const Icon = icon;
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-grow">{children}</span>
        </Link>
    );
};

export default function PanduanLayout({ children, title }) {
    const { auth } = usePage().props;

    const navLinks = [
        { name: 'Menambah Data', route: 'panduan.tambah', icon: DocumentPlusIcon },
        { name: 'Mengedit Data', route: 'panduan.edit', icon: PencilSquareIcon },
        { name: 'Menghapus Data', route: 'panduan.hapus', icon: TrashIcon },
        { name: 'Mencetak Label', route: 'panduan.cetak', icon: PrinterIcon },
        { name: 'Cetak Laporan PDF', route: 'panduan.cetak.keseluruhan', icon: DocumentTextIcon },
        { name: 'Ekspor Laporan', route: 'panduan.export.pdf', icon: ArrowDownTrayIcon  },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={"Panduan Pengguna"}
        >
            <Head title={title || "Panduan"} />

            <div className="py-3">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8">
                        {/* --- PERUBAHAN UTAMA DI SINI --- */}
                        {/* Card tidak rounded di mobile, tapi rounded-xl di layar sm ke atas */}
                        <nav className="w-full bg-white dark:bg-slate-800 p-3 sm:rounded-xl shadow-lg">
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {navLinks.map((link) => (
                                    <PanduanNavLink
                                        key={link.name}
                                        href={route(link.route)}
                                        active={route().current(link.route)}
                                        icon={link.icon}
                                    >
                                        {link.name}
                                    </PanduanNavLink>
                                ))}
                            </div>
                        </nav>

                        <main>
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}