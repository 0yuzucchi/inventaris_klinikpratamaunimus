<?php

namespace App\Filament\Resources\MasterKategoriBarangResource\Pages;

use App\Filament\Resources\MasterKategoriBarangResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMasterKategoriBarangs extends ListRecords
{
    protected static string $resource = MasterKategoriBarangResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
