<?php

namespace App\Filament\Widgets;

use App\Models\Inventaris;
use App\Models\MasterBarang;
use App\Models\MasterRuangan;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class InventarisOverview extends BaseWidget
{
    // app/Filament/Widgets/InventarisOverview.php

    protected function getStats(): array
    {
        return [
            Stat::make('Total Jenis Barang', MasterBarang::count())
                ->description('Model barang terdaftar')
                ->descriptionIcon('heroicon-m-cube')
                ->chart([7, 3, 5, 2, 10, 3, 12]) // Grafik mini (dummy data)
                ->color('info'),
    
            Stat::make('Total Unit Inventaris', Inventaris::sum('jumlah'))
                ->description('Total fisik barang')
                ->descriptionIcon('heroicon-m-archive-box')
                ->chart([15, 4, 10, 2, 12, 4, 11])
                ->color('success'),
    
            Stat::make('Total Nilai Aset', 'Rp ' . number_format(Inventaris::sum('harga'), 0, ',', '.'))
                ->description('Estimasi nilai seluruh barang')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('warning'),
    
            Stat::make('Barang Rusak', Inventaris::sum('jumlah_rusak'))
                ->description('Unit perlu perbaikan/afkir')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->chart([2, 10, 3, 12, 1, 14, 2])
                ->color('danger'),
        ];
    }
}