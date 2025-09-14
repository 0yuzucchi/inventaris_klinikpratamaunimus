<?php

namespace App\Jobs;

use App\Models\Inventaris;
use App\Models\PdfExport; // Ganti dengan model Anda jika berbeda
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateAndUploadInventoryPdf implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filters;
    protected $exportRecord;

    /**
     * Create a new job instance.
     */
    public function __construct(array $filters, PdfExport $exportRecord)
    {
        $this->filters = $filters;
        $this->exportRecord = $exportRecord;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Tandai status menjadi processing
        $this->exportRecord->update(['status' => 'processing']);

        try {
            $query = Inventaris::query();
            $titleParts = [];

            // Menggunakan filter yang dikirim dari controller
            $requestData = $this->filters;

            if (!empty($requestData['tanggal_mulai']) && !empty($requestData['tanggal_selesai'])) {
                $startDate = Carbon::parse($requestData['tanggal_mulai'])->format('d F Y');
                $endDate = Carbon::parse($requestData['tanggal_selesai'])->format('d F Y');
                $query->whereBetween('tanggal_masuk', [$requestData['tanggal_mulai'], $requestData['tanggal_selesai']]);
                $titleParts[] = "dari {$startDate} sampai {$endDate}";
            } else {
                if (!empty($requestData['hari'])) {
                    $query->whereDay('tanggal_masuk', $requestData['hari']);
                    $titleParts[] = 'Tanggal ' . $requestData['hari'];
                }
                if (!empty($requestData['bulan'])) {
                    $query->whereMonth('tanggal_masuk', $requestData['bulan']);
                    $titleParts[] = 'Bulan ' . Carbon::create()->month($requestData['bulan'])->format('F');
                }
                if (!empty($requestData['tahun'])) {
                    $query->whereYear('tanggal_masuk', $requestData['tahun']);
                    $titleParts[] = 'Tahun ' . $requestData['tahun'];
                }
            }

            $title = empty($titleParts) ? 'Laporan Keseluruhan Inventaris' : 'Laporan Inventaris ' . implode(', ', $titleParts);
            $inventaris = $query->latest('tanggal_masuk')->get();

            $data = [
                'inventaris' => $inventaris,
                'title'      => $title,
                'date'       => date('d F Y')
            ];

            // Generate PDF
            $pdf = Pdf::loadView('inventaris.pdf', $data)->setPaper('a4', 'landscape');
            $pdf->setOption('isRemoteEnabled', true);
            $pdfContent = $pdf->output();

            // Nama file unik
            $fileName = 'laporan-inventaris-' .
                str_replace(' ', '-', strtolower(implode('-', $titleParts) ?: 'semua')) .
                '-' . date('Ymd') . '-' . Str::random(6) . '.pdf';

            // Upload ke Supabase
            $response = Http::withHeaders([
                'apikey'        => env('SUPABASE_KEY'),
                'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
            ])->attach('file', $pdfContent, $fileName)
              ->post(env('SUPABASE_URL') . '/storage/v1/object/exports/' . $fileName);

            if ($response->failed()) {
                throw new \Exception('Gagal upload file ke Supabase: ' . $response->body());
            }

            // Dapatkan Public URL dan update record
            $downloadUrl = env('SUPABASE_URL') . '/storage/v1/object/public/exports/' . $fileName;

            $this->exportRecord->update([
                'status' => 'completed',
                'file_name' => $fileName,
                'download_url' => $downloadUrl,
            ]);

        } catch (\Throwable $e) {
            // Jika gagal, tandai sebagai failed
            $this->exportRecord->update(['status' => 'failed']);
            // Anda bisa menambahkan logging di sini
            // Log::error('PDF Export Failed: ' . $e->getMessage());
        }
    }
}