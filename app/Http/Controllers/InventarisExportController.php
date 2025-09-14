<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InventarisExportController extends Controller
{
    public function index()
    {
        return inertia('Inventaris/Export');
    }

    public function getPresignedUrl(Request $request)
    {
        $request->validate([
            'fileName' => 'required|string',
        ]);

        $bucket = 'inventaris-fotos';
        $fileName = $request->fileName;

        try {
            $response = Http::withHeaders([
                'apikey' => env('SUPABASE_KEY'),
                'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
            ])->post(env('SUPABASE_URL') . "/storage/v1/object/sign/{$bucket}/{$fileName}", [
                'expiresIn' => 300, // 5 menit
            ]);

            if ($response->failed()) {
                throw new \Exception($response->body());
            }

            return response()->json($response->json());
        } catch (\Exception $e) {
            Log::error('InventarisExportController::getPresignedUrl Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
