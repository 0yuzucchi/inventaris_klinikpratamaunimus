import React, { useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Chart as ChartJS,
    ArcElement, Tooltip, Legend, Title,
    CategoryScale, LinearScale, PointElement, LineElement, Filler
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import {
    CubeIcon, ArchiveBoxIcon, BanknotesIcon, ExclamationTriangleIcon, InboxIcon,
    CurrencyDollarIcon, ArrowTrendingDownIcon, BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { route } from 'ziggy-js';

// Registrasi ChartJS (tidak ada perubahan)
ChartJS.register(
    ArcElement, Tooltip, Legend, Title,
    CategoryScale, LinearScale, PointElement, LineElement, Filler
);

// Komponen StatCard (tidak ada perubahan)
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
    const currentYear = new Date().getFullYear();
    const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);
    const isDarkMode = document.documentElement.classList.contains('dark');
    const chartTextColor = isDarkMode ? '#cbd5e1' : '#475569';

    // Data untuk Pie Chart dengan palet warna yang lebih baik
    const pieChartData = useMemo(() => {
        const locationData = stats.barang_berdasarkan_lokasi || {};
        const sortedEntries = Object.entries(locationData).sort(([, a], [, b]) => b - a);
        
        return {
            labels: sortedEntries.map(([label]) => label),
            datasets: [{
                data: sortedEntries.map(([, value]) => value),
                backgroundColor: [
                    '#38bdf8', // sky-400
                    '#818cf8', // indigo-400
                    '#fbbf24', // amber-400
                    '#34d399', // emerald-400
                    '#f87171', // red-400
                    '#a78bfa', // violet-400
                    '#fb923c', // orange-400
                ],
                borderColor: isDarkMode ? '#1e293b' : '#ffffff',
                borderWidth: 3,
            }],
        };
    }, [stats.barang_berdasarkan_lokasi, isDarkMode]);
    
    // Opsi untuk Pie Chart yang telah disempurnakan
    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'center',
                labels: {
                    boxWidth: 15,
                    padding: 20,
                    color: chartTextColor,
                    font: {
                        size: 12
                    },
                },
                // Fungsi ini akan dipanggil saat item legend diklik
                onClick: (e, legendItem, legend) => {
                    const index = legendItem.index;
                    const ci = legend.chart;
                    
                    // Toggle visibilitas dataset
                    ci.toggleDataVisibility(index);

                    // Tambahkan atau hapus gaya 'line-through' pada label
                    const legendLabel = legend.legendItems[index];
                    legendLabel.fontColor = ci.getDataVisibility(index) ? chartTextColor : '#94a3b8'; // Abu-abu saat disembunyikan
                    legendLabel.hidden = !ci.getDataVisibility(index); // Chart.js v3+
                    
                    ci.update();
                }
            },
            tooltip: {
                // Konfigurasi Tooltip sudah cukup informatif, bisa ditambahkan styling jika perlu
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                titleColor: isDarkMode ? '#f1f5f9' : '#1e293b',
                bodyColor: isDarkMode ? '#cbd5e1' : '#475569',
                borderColor: isDarkMode ? '#475569' : '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.chart.getDatasetMeta(0).total;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} item (${percentage}%)`;
                    }
                }
            },
            title: {
                 display: true,
                 text: 'Sebaran Barang Berdasarkan Ruangan',
                 color: chartTextColor,
                 font: {
                     size: window.innerWidth < 640 ? 14 : 16,
                     weight: 'bold'
                 },
                 padding: {
                     bottom: 10
                 }
            }
        }
    };

    // Data dan Opsi untuk Line Chart (tidak ada perubahan)
    const lineChartAsetData = {
        labels: stats.chart_nilai_aset?.labels || [],
        datasets: [
            {
                label: 'Nilai Buku Aset',
                data: stats.chart_nilai_aset?.datasets[2]?.data || [],
                borderColor: '#10B981',
                fill: false,
                tension: 0.3,
                borderWidth: 3,
                pointBackgroundColor: '#10B981',
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Nilai Perolehan',
                data: stats.chart_nilai_aset?.datasets[0]?.data || [],
                borderColor: '#3B82F6',
                tension: 0.3,
                borderWidth: 2,
                pointBackgroundColor: '#3B82F6',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
            {
                label: 'Akumulasi Penyusutan',
                data: stats.chart_nilai_aset?.datasets[1]?.data || [],
                borderColor: '#EF4444',
                tension: 0.3,
                borderWidth: 2,
                pointBackgroundColor: '#EF4444',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
        ],
    };
    
    const lineChartAsetOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'top',
                labels: { 
                    color: chartTextColor,
                    padding: 15,
                    font: {
                        size: window.innerWidth < 640 ? 10 : 12
                    },
                    boxWidth: 12
                } 
            },
            title: { 
                display: true, 
                text: 'Perkembangan Nilai Aset Kumulatif (Historis)', 
                color: chartTextColor, 
                font: { 
                    size: window.innerWidth < 640 ? 14 : 16 
                },
                padding: {
                    bottom: 20
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                titleColor: isDarkMode ? '#cbd5e1' : '#475569',
                bodyColor: isDarkMode ? '#cbd5e1' : '#475569',
                borderColor: isDarkMode ? '#475569' : '#cbd5e1',
                borderWidth: 1,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${formatCurrency(value)}`;
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'nearest'
        },
        scales: {
            y: { 
                beginAtZero: true,
                ticks: { 
                    color: chartTextColor, 
                    font: {
                        size: window.innerWidth < 640 ? 10 : 12
                    },
                    callback: (v) => new Intl.NumberFormat('id-ID', { 
                        notation: 'compact',
                        maximumFractionDigits: 1 
                    }).format(v) 
                }, 
                grid: { 
                    color: isDarkMode ? '#334155' : '#e2e8f0',
                    drawBorder: false
                },
                title: {
                    display: true,
                    text: 'Nilai (Rp)',
                    color: chartTextColor,
                    font: {
                        size: window.innerWidth < 640 ? 10 : 12
                    }
                }
            },
            x: { 
                ticks: { 
                    color: chartTextColor,
                    font: {
                        size: window.innerWidth < 640 ? 10 : 12
                    },
                    maxRotation: window.innerWidth < 640 ? 45 : 0
                }, 
                grid: { 
                    color: isDarkMode ? '#334155' : '#e2e8f0',
                    drawBorder: false
                }
            }
        }
    };
    
    // Perubahan logika untuk menangani klik legenda Pie Chart
    // Chart.js memiliki plugin bawaan untuk ini, namun kita perlu kustomisasi untuk efek strikethrough.
    // Kode di bawah ini adalah cara alternatif yang lebih modern untuk menangani klik, namun cara di atas (dalam 'onClick') lebih langsung untuk Chart.js 3+.
    // Kita tetap menggunakan 'onClick' dalam options untuk kesederhanaan.

    return (
        <AuthenticatedLayout user={auth.user} header={"Dasbor Aset & Inventaris"}>
            <Head title="Dashboard" />

            <div className="py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    {/* Bagian lainnya tidak berubah */}

                    {/* === BAGIAN 3: STATISTIK OPERASIONAL INVENTARIS === */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Statistik Operasional Inventaris</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <StatCard icon={<ArchiveBoxIcon />} title="Total Jenis Barang" value={stats.total_jenis_barang} colorClass="bg-indigo-100 dark:bg-indigo-900/50" iconColorClass="text-indigo-600 dark:text-indigo-400" />
                                    <StatCard icon={<CubeIcon />} title="Total Kuantitas Barang" value={stats.total_kuantitas} colorClass="bg-purple-100 dark:bg-purple-900/50" iconColorClass="text-purple-600 dark:text-purple-400" />
                                    <StatCard icon={<BanknotesIcon />} title="Estimasi Nilai Inventaris" value={formatCurrency(stats.estimasi_nilai)} colorClass="bg-teal-100 dark:bg-teal-900/50" iconColorClass="text-teal-600 dark:text-teal-400" />
                                    <StatCard icon={<ExclamationTriangleIcon />} title="Jumlah Barang Rusak" value={stats.total_barang_rusak} colorClass="bg-amber-100 dark:bg-amber-900/50" iconColorClass="text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Aktivitas Terbaru</h3>
                                    {stats.aktivitas_terbaru && stats.aktivitas_terbaru.length > 0 ? (
                                        stats.aktivitas_terbaru.map(item => (
                                            <div key={item.id} className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 py-3 last:border-b-0">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200 uppercase truncate">{item.nama_barang}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Jumlah: {item.jumlah}</p>
                                                </div>
                                                <p className="text-sm text-right text-slate-500 dark:text-slate-400 ml-4">{item.tanggal}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">Tidak ada aktivitas terbaru.</p>
                                    )}
                                    <div className="mt-5 text-right">
                                        <Link href={route('inventaris.index')} className="text-sm font-semibold text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400">Kelola Inventaris &rarr;</Link>
                                    </div>
                                </div>
                            </div>
                            
                            {/* === SEBARAN BARANG PER RUANGAN (PENYESUAIAN DI SINI) === */}
                            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-md flex flex-col">
                                {pieChartData.labels.length > 0 ? (
                                    <div className="flex-grow min-h-0">
                                        <Pie data={pieChartData} options={pieChartOptions} />
                                    </div>
                                ) : (
                                    <div className="text-center py-10 my-auto">
                                        <InboxIcon className="mx-auto h-12 w-12 text-slate-400" />
                                        <p className="mt-4 text-sm text-slate-500">Data lokasi tidak cukup.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* === BAGIAN 1: RINGKASAN FINANSIAL SAAT INI === */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                            {`Ringkasan Finansial Aset (Per ${currentYear})`}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard icon={<BuildingLibraryIcon />} title="Total Nilai Buku Aset" value={formatCurrency(stats.total_nilai_buku)} colorClass="bg-green-100 dark:bg-green-900/50" iconColorClass="text-green-600 dark:text-green-400" />
                            <StatCard icon={<CurrencyDollarIcon />} title="Akumulasi Nilai Perolehan" value={formatCurrency(stats.total_nilai_perolehan)} colorClass="bg-blue-100 dark:bg-blue-900/50" iconColorClass="text-blue-600 dark:text-blue-400" />
                            <StatCard icon={<ArrowTrendingDownIcon />} title="Akumulasi Penyusutan" value={formatCurrency(stats.total_akumulasi_penyusutan)} colorClass="bg-red-100 dark:bg-red-900/50" iconColorClass="text-red-600 dark:text-red-400" />
                        </div>
                    </div>

                    {/* === BAGIAN 2: GRAFIK PERKEMBANGAN ASET (HISTORIS) === */}
                    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-md">
                        <div className="h-[400px] sm:h-[450px] lg:h-[500px]">
                            <Line options={lineChartAsetOptions} data={lineChartAsetData} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}