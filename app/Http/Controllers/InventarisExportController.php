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
     * Generate PDF & upload ke Supabase
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

            // 3. Siapkan logo base64
            $logoPath = public_path('logo_klinik.png'); // pastikan file ini ada
            $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));

            // 4. Siapkan foto inventaris base64
            foreach ($inventaris as $item) {
                $item->fotoBase64 = $item->foto_url
                    ? 'data:image/png;base64,' . base64_encode(@file_get_contents($item->foto_url))
                    : null;
            }

            $data = [
                'inventaris' => $inventaris,
                'title' => $title,
                'date' => Carbon::now()->format('d F Y'),
                'logoBase64' => $logoBase64,
            ];

            // 5. Generate PDF
            $pdfContent = Pdf::loadView('inventaris.pdf', $data)
                ->setOption('isRemoteEnabled', true)
                ->setPaper('a4', 'landscape')
                ->output();

            // 6. Upload ke Supabase
            $bucket = 'inventaris-fotos';
            $fileName = 'laporan-inventaris-' . date('Ymd-His') . '.pdf';

            $response = Http::withHeaders([
                'apikey' => env('SUPABASE_SERVICE_ROLE_KEY'),
                'Authorization' => 'Bearer ' . env('SUPABASE_SERVICE_ROLE_KEY'),
            ])->put(env('SUPABASE_URL') . "/storage/v1/object/{$bucket}/{$fileName}", $pdfContent);

            if ($response->failed()) {
                return response()->json([
                    'error' => 'Upload ke Supabase gagal',
                    'body' => $response->body()
                ], 500);
            }

            $publicUrl = env('SUPABASE_URL') . "/storage/v1/object/public/{$bucket}/{$fileName}";

            return response()->json([
                'fileName' => $fileName,
                'fileUrl' => $publicUrl,
            ]);

        } catch (\Exception $e) {
            Log::error('InventarisExportController::getPdfUploadUrl Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
