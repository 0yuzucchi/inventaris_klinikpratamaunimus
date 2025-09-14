<?php

namespace App\Jobs;

use App\Models\Inventaris;
use App\Models\Report; // Panggil model Report
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // Untuk upload ke Supabase
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateInventarisPdf implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $report;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Report $report)
    {
        $this->report = $report;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // 1. Update status laporan menjadi 'processing'
        $this->report->update(['status' => 'processing']);

        try {
            $filters = json_decode($this->report->filters, true);
            
            // 2. Logika query (sama seperti di controller Anda)
            $query = Inventaris::query();
            // ... (salin semua logika if/else untuk filter dari controller Anda ke sini)
            // Contoh sederhana:
            if (isset($filters['tahun'])) {
                $query->whereYear('tanggal_masuk', $filters['tahun']);
            }
            // ... lengkapi sisa logikanya

            $inventaris = $query->latest('tanggal_masuk')->get();

            $data = [
                'inventaris' => $inventaris,
                'title'      => $this->report->title,
                'date'       => date('d F Y')
            ];

            // 3. Generate PDF sebagai string, bukan download
            $pdf = Pdf::loadView('inventaris.pdf', $data);
            $pdf->setOption('isRemoteEnabled', true);
            $pdf->setPaper('a4', 'landscape');
            $pdfContent = $pdf->output(); // Dapatkan konten PDF

            // 4. Upload ke Supabase Storage
            // Pastikan Anda sudah mengatur filesystem untuk Supabase (S3 compatible) di config/filesystems.php
            $fileName = $this->report->file_name;
            Storage::disk('supabase')->put($fileName, $pdfContent);
            $filePath = Storage::disk('supabase')->url($fileName);

            // 5. Update record laporan di database dengan status 'completed' dan URL file
            $this->report->update([
                'status'    => 'completed',
                'file_path' => $filePath,
            ]);

        } catch (\Exception $e) {
            // Jika terjadi error, catat di log dan update status
            Log::error('Gagal generate PDF: ' . $e->getMessage());
            $this->report->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    }
}