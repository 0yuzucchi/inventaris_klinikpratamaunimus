<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventaris;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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
     * Generate PDF & buat pre-signed URL untuk upload ke Supabase
     */
    public function getPdfUploadUrl(Request $request)
    {
        try {
            // 1. Validasi input
            $request->validate([
                'tahun' => 'nullable|date_format:Y',
                'bulan' => 'nullable|date_format:m',
                'hari' => 'nullable|date_format:d',
                'tanggal_mulai' => 'nullable|date',
                'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            ]);

            // 2. Query Inventaris
            $query = Inventaris::query();
            $titleParts = [];

            if ($request->filled('tanggal_mulai') && $request->filled('tanggal_selesai')) {
                $query->whereBetween('tanggal_masuk', [
                    $request->input('tanggal_mulai'),
                    $request->input('tanggal_selesai')
                ]);
                $titleParts[] = "dari {$request->tanggal_mulai} sampai {$request->tanggal_selesai}";
            } else {
                if ($request->filled('hari')) {
                    $query->whereDay('tanggal_masuk', $request->input('hari'));
                    $titleParts[] = 'Tanggal ' . $request->input('hari');
                }
                if ($request->filled('bulan')) {
                    $query->whereMonth('tanggal_masuk', $request->input('bulan'));
                    $titleParts[] = 'Bulan ' . Carbon::create()->month($request->input('bulan'))->format('F');
                }
                if ($request->filled('tahun')) {
                    $query->whereYear('tanggal_masuk', $request->input('tahun'));
                    $titleParts[] = 'Tahun ' . $request->input('tahun');
                }
            }

            $inventaris = $query->latest('tanggal_masuk')->get();

            $title = empty($titleParts) ? 'Laporan Keseluruhan Inventaris' : 'Laporan Inventaris ' . implode(', ', $titleParts);

            $data = [
                'inventaris' => $inventaris,
                'title' => $title,
                'date' => Carbon::now()->format('d F Y'),
            ];

            $fileName = 'laporan-inventaris-' . str_replace(' ', '-', strtolower(implode('-', $titleParts) ?: 'semua')) . '-' . date('Ymd') . '.pdf';

            // 3. Generate PDF
            $pdfContent = Pdf::loadView('inventaris.pdf', $data)
                ->setOption('isRemoteEnabled', true)
                ->setPaper('a4', 'landscape')
                ->output();

            // 4. Pre-signed URL Supabase
            $bucket = 'inventaris-fotos';
            $response = Http::withHeaders([
                'apikey' => env('SUPABASE_KEY'),
                'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
            ])->post(env('SUPABASE_URL') . "/storage/v1/object/sign/{$bucket}/{$fileName}", [
                'expiresIn' => 60 * 5 // URL berlaku 5 menit
            ]);

            if ($response->failed()) {
                Log::error('Gagal buat pre-signed URL Supabase: ' . $response->body());
                return response()->json(['error' => 'Gagal buat URL upload ke Supabase'], 500);
            }

            $signedUrl = $response->json()['signedUrl'] ?? null;
            if (!$signedUrl) {
                Log::error('Pre-signed URL kosong dari Supabase');
                return response()->json(['error' => 'Pre-signed URL kosong'], 500);
            }

            // 5. Return JSON ke frontend
            return response()->json([
                'fileName' => $fileName,
                'pdfBase64' => base64_encode($pdfContent),
                'signedUrl' => $signedUrl
            ]);

        } catch (\Exception $e) {
            Log::error('InventarisExportController::getPdfUploadUrl Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
