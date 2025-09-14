import React, { useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { 
    CubeIcon, 
    ArchiveBoxIcon, 
    BanknotesIcon, 
    ExclamationTriangleIcon, 
    InboxIcon,
} from '@heroicons/react/24/outline';
import { route } from 'ziggy-js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Komponen Kartu Statistik yang Didesain Ulang
const StatCard = ({ icon, title, value, colorClass, iconColorClass }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
        <div className={`flex-shrink-0 w-12 h-12 mb-4 rounded-full flex items-center justify-center ${colorClass}`}>
            {React.cloneElement(icon, { className: `w-6 h-6 ${iconColorClass}` })}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
    </div>
);

export default function Dashboard({ auth, stats }) {
    const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);
    const formatDate = (dateString) => !dateString ? '-' : new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });

    const sortedPieChartData = useMemo(() => {
        const locationData = stats.barang_berdasarkan_lokasi || {};
        const sortedEntries = Object.entries(locationData).sort(([, a], [, b]) => b - a);
        return {
            labels: sortedEntries.map(([label]) => label),
            datasets: [{
                label: 'Jumlah Barang',
                data: sortedEntries.map(([, value]) => value),
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#6B7280', '#EF4444', '#14B8A6', '#F97316'],
                borderColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
                borderWidth: 3,
            }],
        };
    }, [stats.barang_berdasarkan_lokasi]);
    
    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { padding: 15, boxWidth: 12, font: { size: 12 }, color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#475569', align: 'start' }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { size: 14 }, bodyFont: { size: 12 }, padding: 12, cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        const total = context.chart.data.datasets[0].data.reduce((acc, current) => acc + current, 0);
                        const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) + '%' : '0%';
                        return `Jumlah: ${context.raw} (${percentage})`;
                    }
                }
            }
        },
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={"Statistik Data Barang"}
        >
            <Head title="Dashboard" />

            <div className="py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <StatCard icon={<ArchiveBoxIcon />} title="Total Jenis Barang" value={stats.total_jenis_barang} colorClass="bg-blue-100 dark:bg-blue-900/50" iconColorClass="text-blue-600 dark:text-blue-400"/>
                                <StatCard icon={<CubeIcon />} title="Total Kuantitas Barang" value={stats.total_kuantitas} colorClass="bg-purple-100 dark:bg-purple-900/50" iconColorClass="text-purple-600 dark:text-purple-400"/>
                                <StatCard icon={<BanknotesIcon />} title="Estimasi Nilai Inventaris" value={formatCurrency(stats.estimasi_nilai)} colorClass="bg-green-100 dark:bg-green-900/50" iconColorClass="text-green-600 dark:text-green-400"/>
                                <StatCard icon={<ExclamationTriangleIcon />} title="Jumlah Barang Rusak" value={stats.total_barang_rusak} colorClass="bg-amber-100 dark:bg-amber-900/50" iconColorClass="text-amber-600 dark:text-amber-400"/>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Aktivitas Terbaru</h3>
                                <div className="space-y-3">
                                    {stats.aktivitas_terbaru.map(item => (
                                        // --- PERUBAHAN DI SINI ---
                                        // Mengganti `flex justify-between` menjadi flex dengan lebar kolom yang ditentukan
                                        <div key={item.id} className="flex items-center border-b border-slate-200/80 dark:border-slate-700 pb-3 last:border-b-0">
                                            {/* Kolom 1: Nama & Kode Barang (Lebar 5/12) */}
                                            <div className="w-5/12">
                                                <p className="font-semibold text-slate-800 dark:text-slate-200 uppercase truncate pr-2">{item.nama_barang}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 uppercase">{item.kode_barang || 'N/A'}</p>
                                            </div>
                                            {/* Kolom 2: Lokasi (Lebar 4/12, teks di tengah) */}
                                            <p className="w-4/12 text-sm text-center text-slate-600 dark:text-slate-300 uppercase">{item.tempat_pemakaian}</p>
                                            {/* Kolom 3: Tanggal (Lebar 3/12, teks di kanan) */}
                                            <p className="w-3/12 text-sm text-right text-slate-500 dark:text-slate-400">{formatDate(item.tanggal_masuk)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 text-right">
                                    <Link href={route('inventaris.index')} className="text-sm font-semibold text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400">
                                        Kelola Inventaris &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Sebaran Barang per Ruangan</h3>
                            {sortedPieChartData.labels.length > 0 ? (
                                <Pie data={sortedPieChartData} options={pieChartOptions} />
                            ) : (
                                <div className="text-center py-10"><InboxIcon className="mx-auto h-12 w-12 text-slate-400" /><p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Data lokasi tidak cukup.</p></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}