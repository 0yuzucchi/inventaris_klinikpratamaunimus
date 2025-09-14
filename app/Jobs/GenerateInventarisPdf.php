<?php

namespace App\Jobs;

use App\Models\Inventaris;
use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class GenerateInventarisPdf implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $reportId;

    public function __construct($reportId)
    {
        $this->reportId = $reportId;
    }

    public function handle()
    {
        $report = Report::find($this->reportId);

        if (! $report) {
            Log::error("Job Gagal: Report ID {$this->reportId} tidak ditemukan.");
            return;
        }

        $report->update(['status' => 'processing']);

        try {
            $filters = json_decode($report->filters, true) ?? [];
            $query = Inventaris::query();

            if (!empty($filters['tanggal_mulai']) && !empty($filters['tanggal_selesai'])) {
                $query->whereBetween('tanggal_masuk', [$filters['tanggal_mulai'], $filters['tanggal_selesai']]);
            } else {
                if (!empty($filters['hari']))  $query->whereDay('tanggal_masuk', (int) $filters['hari']);
                if (!empty($filters['bulan'])) $query->whereMonth('tanggal_masuk', (int) $filters['bulan']);
                if (!empty($filters['tahun'])) $query->whereYear('tanggal_masuk', (int) $filters['tahun']);
            }

            $inventaris = $query->latest('tanggal_masuk')->get();

            $data = [
                'inventaris' => $inventaris,
                'title'      => $report->title,
                'date'       => Carbon::now()->format('d F Y'),
            ];

            // Generate PDF
            $pdf = Pdf::loadView('inventaris.pdf', $data)
                      ->setPaper('a4', 'landscape')
                      ->setOption('isRemoteEnabled', true);

            $pdfContent = $pdf->output();

            // ======================== Upload via HTTP ke Supabase ========================
            $supabaseUrl = env('SUPABASE_URL'); // misal https://<project-id>.supabase.co
            $supabaseKey = env('SUPABASE_KEY');
            $bucket      = env('SUPABASE_BUCKET', 'inventaris-fotos');
            $fileName    = $report->file_name; // misal: report_123.pdf

            $uploadUrl = "{$supabaseUrl}/storage/v1/object/{$bucket}/{$fileName}";

            $response = Http::withHeaders([
                'apikey'        => $supabaseKey,
                'Authorization' => 'Bearer ' . $supabaseKey,
                'Content-Type'  => 'application/pdf',
                'x-upsert'      => 'true', // menimpa file jika sudah ada
            ])->post($uploadUrl, $pdfContent);

            if (!in_array($response->status(), [200, 201])) {
                throw new \Exception("Upload Supabase gagal: HTTP {$response->status()} - {$response->body()}");
            }

            $filePath = "{$supabaseUrl}/storage/v1/object/public/{$bucket}/{$fileName}";

            $report->update([
                'status'    => 'completed',
                'file_path' => $filePath,
            ]);

        } catch (\Exception $e) {
            Log::error("Gagal generate PDF untuk Report ID {$this->reportId}: " . $e->getMessage());

            $report->update([
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
