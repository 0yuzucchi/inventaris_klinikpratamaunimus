<?php

namespace App\Filament\Resources\MasterKategoriBarangResource\Pages;

use App\Filament\Resources\MasterKategoriBarangResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMasterKategoriBarang extends EditRecord
{
    protected static string $resource = MasterKategoriBarangResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
