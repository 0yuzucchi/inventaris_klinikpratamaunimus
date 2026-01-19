<?php

namespace App\Filament\Widgets;

use App\Models\MasterRuangan;
use Filament\Widgets\ChartWidget;

class BarangPerRuanganChart extends ChartWidget
{
    protected static ?string $heading = 'Distribusi Barang per Ruangan';
    protected static ?int $sort = 2;

    // TAMBAHKAN BARIS INI UNTUK LEBAR PENUH
    protected int | string | array $columnSpan = 'full'; 

    protected function getData(): array
    {
        $ruangan = MasterRuangan::withCount('inventaris')->get();

        return [
            'datasets' => [
                [
                    'label' => 'Jumlah Item',
                    'data' => $ruangan->pluck('inventaris_count')->toArray(),
                    'backgroundColor' => '#36A2EB',
                ],
            ],
            'labels' => $ruangan->pluck('nama_ruangan')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}