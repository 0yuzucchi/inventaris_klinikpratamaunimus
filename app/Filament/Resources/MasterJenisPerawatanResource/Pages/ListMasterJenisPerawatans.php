<?php

namespace App\Filament\Resources\MasterJenisPerawatanResource\Pages;

use App\Filament\Resources\MasterJenisPerawatanResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMasterJenisPerawatans extends ListRecords
{
    protected static string $resource = MasterJenisPerawatanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
