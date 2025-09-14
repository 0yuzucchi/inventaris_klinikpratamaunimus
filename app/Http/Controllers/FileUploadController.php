<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class FileUploadController extends Controller
{
    public function showForm()
    {
        return view('upload-form');
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // max 10 MB
        ]);

        $file = $request->file('file');
        $content = file_get_contents($file->getRealPath());
        $fileName = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) 
                    . '-' . Str::random(6) 
                    . '.' . $file->getClientOriginalExtension();

        // Upload ke Supabase
        $response = Http::withHeaders([
            'apikey'        => env('SUPABASE_KEY'),
            'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
            'Content-Type'  => $file->getMimeType(),
        ])->withBody($content, $file->getMimeType())
          ->put(env('SUPABASE_URL') . '/storage/v1/object/exports/' . $fileName);

        if ($response->failed()) {
            return back()->with('error', 'Gagal upload file: ' . $response->body());
        }

        $publicUrl = rtrim(env('SUPABASE_PUBLIC_URL'), '/') . '/storage/v1/object/public/exports/' . $fileName;

        return back()->with('success', 'File berhasil diupload! URL: ' . $publicUrl);
    }
}
