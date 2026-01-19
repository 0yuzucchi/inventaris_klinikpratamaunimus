<?php

namespace App\Filament\Widgets;

use App\Models\Inventaris;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestInventarisTable extends BaseWidget
{
    protected static ?int $sort = 3;
    protected int | string | array $columnSpan = 'full'; // Tabel memanjang ke samping

    public function table(Table $table): Table
    {
        return $table
            ->query(Inventaris::query()->latest()->limit(5))
            ->columns([
                Tables\Columns\TextColumn::make('nomor')->label('No. INV'),
                Tables\Columns\TextColumn::make('masterBarang.nama_barang')->label('Nama Barang'),
                Tables\Columns\TextColumn::make('ruangan.nama_ruangan')->label('Lokasi'),
                Tables\Columns\TextColumn::make('jumlah')->label('Qty')->badge(),
                Tables\Columns\TextColumn::make('tanggal_masuk')->date('d M Y'),
            ]);
    }
}