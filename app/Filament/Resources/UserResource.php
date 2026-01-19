<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;
use App\Traits\RestrictedResource; // <--- 1. Import Trait

class UserResource extends Resource
{
    use RestrictedResource; // <--- 2. Pakai Trait

    // <--- 3. Daftar Role (Mirip Middleware)
    protected static ?array $allowedRoles = [
        User::ROLE_SUPER_ADMIN, 
        // Super Admin sudah otomatis boleh di Trait
    ];

    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationLabel = 'Manajemen User';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true), // Agar saat edit tidak error email duplikat

                // --- PILIHAN ROLE ---
                Forms\Components\Select::make('role')
                    ->options([
                        User::ROLE_SUPER_ADMIN => 'Super Admin',
                        User::ROLE_HUMAS       => 'Humas (Web Profile)',
                        User::ROLE_KEPALA_RT   => 'Kepala Rumah Tangga',
                        User::ROLE_STAFF_RT    => 'Staff Rumah Tangga',
                        User::ROLE_DIREKTUR    => 'Direktur',
                        User::ROLE_KEUANGAN    => 'Keuangan',
                    ])
                    ->required()
                    ->native(false), // Tampilan dropdown lebih modern

                // --- PASSWORD ---
                Forms\Components\TextInput::make('password')
                    ->password()
                    // Hanya required saat create user baru
                    ->required(fn ($livewire) => $livewire instanceof Pages\CreateUser)
                    // Hash password sebelum simpan
                    ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                    // Jangan update password jika field kosong saat edit
                    ->dehydrated(fn ($state) => filled($state))
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                
                // Menampilkan Role dengan Badge Warna
                Tables\Columns\TextColumn::make('role')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        User::ROLE_SUPER_ADMIN => 'danger',  // Merah
                        User::ROLE_HUMAS       => 'info',    // Biru
                        User::ROLE_DIREKTUR    => 'success', // Hijau
                        User::ROLE_KEUANGAN    => 'warning', // Kuning
                        default                => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        User::ROLE_SUPER_ADMIN => 'Super Admin',
                        User::ROLE_HUMAS       => 'Humas',
                        User::ROLE_KEPALA_RT   => 'Kepala RT',
                        User::ROLE_STAFF_RT    => 'Staff RT',
                        User::ROLE_DIREKTUR    => 'Direktur',
                        User::ROLE_KEUANGAN    => 'Keuangan',
                        default => $state,
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                // Filter berdasarkan Role
                Tables\Filters\SelectFilter::make('role')
                    ->options([
                        User::ROLE_SUPER_ADMIN => 'Super Admin',
                        User::ROLE_HUMAS       => 'Humas',
                        User::ROLE_KEPALA_RT   => 'Kepala RT',
                        User::ROLE_STAFF_RT    => 'Staff RT',
                        User::ROLE_DIREKTUR    => 'Direktur',
                        User::ROLE_KEUANGAN    => 'Keuangan',
                    ]),
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
