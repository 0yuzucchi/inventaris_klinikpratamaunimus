<?php

namespace App\Filament\Resources\MasterJenisPerawatanResource\Pages;

use App\Filament\Resources\MasterJenisPerawatanResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMasterJenisPerawatan extends EditRecord
{
    protected static string $resource = MasterJenisPerawatanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
