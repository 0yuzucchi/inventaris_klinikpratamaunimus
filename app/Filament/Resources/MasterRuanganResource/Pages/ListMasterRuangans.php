<?php

namespace App\Filament\Resources\MasterRuanganResource\Pages;

use App\Filament\Resources\MasterRuanganResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMasterRuangans extends ListRecords
{
    protected static string $resource = MasterRuanganResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
