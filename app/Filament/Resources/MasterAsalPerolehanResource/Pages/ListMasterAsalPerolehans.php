<?php

namespace App\Filament\Resources\MasterAsalPerolehanResource\Pages;

use App\Filament\Resources\MasterAsalPerolehanResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMasterAsalPerolehans extends ListRecords
{
    protected static string $resource = MasterAsalPerolehanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
