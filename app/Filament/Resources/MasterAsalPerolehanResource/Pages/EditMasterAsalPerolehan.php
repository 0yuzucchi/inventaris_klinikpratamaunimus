<?php

namespace App\Filament\Resources\MasterAsalPerolehanResource\Pages;

use App\Filament\Resources\MasterAsalPerolehanResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMasterAsalPerolehan extends EditRecord
{
    protected static string $resource = MasterAsalPerolehanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
