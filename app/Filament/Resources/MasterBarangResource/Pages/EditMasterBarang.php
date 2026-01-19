<?php

namespace App\Filament\Resources\MasterBarangResource\Pages;

use App\Filament\Resources\MasterBarangResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMasterBarang extends EditRecord
{
    protected static string $resource = MasterBarangResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
