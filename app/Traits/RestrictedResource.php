<?php

namespace App\Traits;

use App\Models\User;

trait RestrictedResource
{
    /**
     * Cek apakah user punya role yang diizinkan.
     * Jika properti $allowedRoles tidak didefinisikan, maka anggap terbuka untuk semua (atau batasi, terserah logic Anda).
     */
    public static function checkRoleAccess(): bool
    {
        $user = auth()->user();

        // 1. Super Admin Selalu Boleh
        if ($user->role === User::ROLE_SUPER_ADMIN) {
            return true;
        }

        // 2. Ambil daftar role yang diizinkan dari Resource
        // Jika tidak ada variabel $allowedRoles, defaultnya array kosong (akses ditolak kecuali super admin)
        $allowedRoles = static::$allowedRoles ?? [];

        return in_array($user->role, $allowedRoles);
    }

    // --- Override Fungsi Bawaan Filament ---

    public static function canViewAny(): bool
    {
        return self::checkRoleAccess();
    }

    public static function canCreate(): bool
    {
        return self::checkRoleAccess();
    }

    public static function canEdit($record): bool
    {
        return self::checkRoleAccess();
    }

    public static function canDelete($record): bool
    {
        // Opsional: Jika mau delete hanya super admin, ubah logic ini
        return self::checkRoleAccess(); 
    }
}
