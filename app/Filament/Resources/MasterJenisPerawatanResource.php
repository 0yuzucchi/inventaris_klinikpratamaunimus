<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MasterJenisPerawatanResource\Pages;
use App\Filament\Resources\MasterJenisPerawatanResource\RelationManagers;
use App\Models\MasterJenisPerawatan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use App\Traits\RestrictedResource; // <--- 1. Import Trait
use App\Models\User; // <--- 1. Import User

class MasterJenisPerawatanResource extends Resource
{
    use RestrictedResource; // <--- 2. Pakai Trait

    // <--- 3. Daftar Role (Mirip Middleware)
    protected static ?array $allowedRoles = [
        User::ROLE_KEPALA_RT, 
        // Super Admin sudah otomatis boleh di Trait
    ];

    protected static ?string $model = MasterJenisPerawatan::class;
    protected static ?string $navigationIcon = 'heroicon-o-wrench-screwdriver';
    protected static ?string $navigationGroup = 'Master Data';

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('nama')
                ->required()
                ->unique(ignoreRecord: true),

            Textarea::make('keterangan')
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('nama')->searchable()->sortable(),
            TextColumn::make('keterangan')->searchable()->sortable(),
            TextColumn::make('created_at')->searchable()->sortable()->date('d F Y'),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),
            ]),
        ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMasterJenisPerawatans::route('/'),
            'create' => Pages\CreateMasterJenisPerawatan::route('/create'),
            'edit' => Pages\EditMasterJenisPerawatan::route('/{record}/edit'),
        ];
    }
}
