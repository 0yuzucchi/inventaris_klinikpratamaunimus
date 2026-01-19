<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait UploadsToSupabase
{
    public function uploadToSupabase($file, $bucket = 'inventaris-fotos'): string
    {
        $fileName = time() . '_' . $file->getClientOriginalName();

        $response = Http::withHeaders([
            'apikey' => env('SUPABASE_KEY'),
            'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
        ])
        ->attach('file', file_get_contents($file), $fileName)
        ->post(env('SUPABASE_URL') . "/storage/v1/object/{$bucket}/{$fileName}");

        if ($response->failed()) {
            throw new \Exception('Upload ke Supabase gagal: ' . $response->body());
        }

        return env('SUPABASE_URL') . "/storage/v1/object/public/{$bucket}/{$fileName}";
    }
}
