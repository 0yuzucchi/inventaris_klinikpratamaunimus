<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventaris;
use Barryvdh\DomPDF\Facade\Pdf;
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
     * Generate PDF & kembalikan dalam base64
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

            // Ambil data & pastikan semua string UTF-8
            $inventaris = $query->latest('tanggal_masuk')->get()->map(function($item) {
                foreach ($item->getAttributes() as $key => $value) {
                    if (is_string($value)) {
                        $item->$key = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
                    }
                }
                return $item;
            });

            $title = empty($titleParts) ? 'Laporan Keseluruhan Inventaris' : 'Laporan Inventaris ' . implode(', ', $titleParts);

            // 3. Logo base64
            $logoPath = public_path('logo_klinik.png');
            $logoBase64 = file_exists($logoPath) 
                ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
                : '';

            $data = [
                'inventaris' => $inventaris,
                'title' => $title,
                'date' => Carbon::now()->format('d F Y'),
                'logoBase64' => $logoBase64,
            ];

            // 4. Nama file
            $fileName = 'laporan-inventaris-' . str_replace(' ', '-', strtolower(implode('-', $titleParts) ?: 'semua')) . '-' . date('Ymd-His') . '.pdf';

            // 5. Generate PDF
            $pdfContent = Pdf::loadView('inventaris.pdf', $data)
                ->setOption('isRemoteEnabled', true)
                ->setPaper('a4', 'landscape')
                ->output();

            $pdfBase64 = base64_encode($pdfContent);

            return response()->json([
                'fileName' => $fileName,
                'pdfBase64' => $pdfBase64,
            ]);

        } catch (\Exception $e) {
            Log::error('InventarisExportController::getPdfUploadUrl Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
