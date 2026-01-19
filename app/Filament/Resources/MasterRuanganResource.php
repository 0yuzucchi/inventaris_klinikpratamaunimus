<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MasterRuanganResource\Pages;
use App\Filament\Resources\MasterRuanganResource\RelationManagers;
use App\Models\MasterRuangan;
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

class MasterRuanganResource extends Resource
{
    use RestrictedResource; // <--- 2. Pakai Trait

    // <--- 3. Daftar Role (Mirip Middleware)
    protected static ?array $allowedRoles = [
        User::ROLE_KEPALA_RT, 
        // Super Admin sudah otomatis boleh di Trait
    ];

    protected static ?string $model = MasterRuangan::class;
    protected static ?string $navigationIcon = 'heroicon-o-building-office';
    protected static ?string $navigationGroup = 'Master Data';

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('nama_ruangan')->required(),
            TextInput::make('nomor_ruang')->numeric()->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('nama_ruangan')->searchable()->sortable(),
            TextColumn::make('nomor_ruang')->searchable()->sortable(),
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
            'index' => Pages\ListMasterRuangans::route('/'),
            'create' => Pages\CreateMasterRuangan::route('/create'),
            'edit' => Pages\EditMasterRuangan::route('/{record}/edit'),
        ];
    }
}
