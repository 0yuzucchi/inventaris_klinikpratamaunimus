<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MasterBarangResource\Pages;
use App\Models\MasterBarang;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection; // Pastikan ini diimport
use App\Traits\RestrictedResource; // <--- 1. Import Trait
use App\Models\User; // <--- 1. Import User

class MasterBarangResource extends Resource
{
    use RestrictedResource; // <--- 2. Pakai Trait

    // <--- 3. Daftar Role (Mirip Middleware)
    protected static ?array $allowedRoles = [
        User::ROLE_KEPALA_RT, 
        // Super Admin sudah otomatis boleh di Trait
    ];

    protected static ?string $model = MasterBarang::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $modelLabel = 'Master Barang';
    protected static ?string $pluralModelLabel = 'Master Barang';
    protected static ?string $navigationGroup = 'Master Data';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('nama_barang')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Contoh: APAR Powder 6kg'),

                        Forms\Components\TextInput::make('nomor_barang')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(100)
                            ->placeholder('Contoh: BRG-001'),

                        Forms\Components\Select::make('master_kategori_barang_id')
                            ->relationship('kategori', 'nama')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->label('Kategori Barang'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nomor_barang')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('nama_barang')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('kategori.nama')
                    ->label('Kategori')
                    ->sortable()
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('created_at')
                    ->date('d-m-Y') // Format hari-bulan-tahun sesuai permintaan sebelumnya
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('master_kategori_barang_id')
                    ->relationship('kategori', 'nama')
                    ->label('Filter Kategori'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),

                    // FITUR BULK EDIT KATEGORI
                    Tables\Actions\BulkAction::make('updateKategori')
                        ->label('Update Kategori Massal')
                        ->icon('heroicon-o-pencil-square')
                        ->color('warning')
                        ->form([
                            Forms\Components\Select::make('master_kategori_barang_id')
                                ->relationship('kategori', 'nama')
                                ->required()
                                ->label('Pilih Kategori Baru')
                                ->searchable()
                                ->preload(),
                        ])
                        ->action(function (Collection $records, array $data): void {
                            // Melakukan update pada setiap record yang dipilih
                            $records->each(function ($record) use ($data) {
                                $record->update([
                                    'master_kategori_barang_id' => $data['master_kategori_barang_id'],
                                ]);
                            });
                        })
                        ->deselectRecordsAfterCompletion()
                        ->requiresConfirmation(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMasterBarangs::route('/'),
            'create' => Pages\CreateMasterBarang::route('/create'),
            'edit' => Pages\EditMasterBarang::route('/{record}/edit'),
        ];
    }
}