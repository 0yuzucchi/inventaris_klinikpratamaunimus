<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventaris;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Inertia\Inertia;

class InventarisExportController extends Controller
{
    /**
     * Render halaman export React
     */
    public function index()
    {
        return Inertia::render('Inventaris/Export');
    }

    /**
     * Generate PDF & upload ke Supabase, return pre-signed URL
     */
    public function getPresignedUrl(Request $request)
    {
        $request->validate([
            'fileName' => 'required|string',
        ]);

        $bucket = 'inventaris-fotos';
        $fileName = $request->fileName;

        try {
            // 1. Query inventaris
            $inventaris = Inventaris::latest('tanggal_masuk')->get();

            // 2. Data untuk PDF
            $data = [
                'inventaris' => $inventaris,
                'date' => Carbon::now()->format('d F Y'),
            ];

            // 3. Generate PDF
            $pdfContent = Pdf::loadView('inventaris.pdf', $data)
                ->setOption('isRemoteEnabled', true)
                ->setPaper('a4', 'landscape')
                ->output();

            // 4. Upload PDF ke Supabase
            $response = Http::withHeaders([
                'apikey' => env('SUPABASE_KEY'),
                'Authorization' => 'Bearer ' . env('SUPABASE_SERVICE_ROLE_KEY'),
            ])->put(env('SUPABASE_URL') . "/storage/v1/object/{$bucket}/{$fileName}", $pdfContent);

            if ($response->failed()) {
                throw new \Exception($response->body());
            }

            $publicUrl = env('SUPABASE_URL') . "/storage/v1/object/public/{$bucket}/{$fileName}";

            return response()->json([
                'fileName' => $fileName,
                'fileUrl' => $publicUrl,
            ]);

        } catch (\Exception $e) {
            Log::error('InventarisExportController::getPresignedUrl Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
