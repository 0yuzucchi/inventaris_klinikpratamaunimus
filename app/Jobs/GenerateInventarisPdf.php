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
use Illuminate\Support\Facades\Storage;
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
            Log::error("Job gagal: Report ID {$this->reportId} tidak ditemukan.");
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

            $pdf = Pdf::loadView('inventaris.pdf', $data)
                ->setPaper('a4', 'landscape')
                ->setOption('isRemoteEnabled', true);

            $pdfContent = $pdf->output();

            // Upload ke Supabase
            Storage::disk('supabase')->put($report->file_name, $pdfContent, 'public');

            // Ambil URL publik langsung dari Storage
            $filePath = Storage::disk('supabase')->url($report->file_name);

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
