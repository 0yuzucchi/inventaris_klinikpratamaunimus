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
use Illuminate\Support\Facades\Http; // <--- PENTING: Tambahkan use statement ini
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

            // Logika filter Anda yang sudah aman
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

            // ======================= MENGGUNAKAN HTTP CLIENT MANUAL (SESUAI PERMINTAAN) =======================

            // 1. Siapkan semua variabel yang dibutuhkan dari .env dan model
            $fileName   = $report->file_name;
            $bucketName = env('SUPABASE_BUCKET');
            $supabaseKey = env('SUPABASE_KEY');
            $supabaseUrl = env('SUPABASE_URL');
            
            // 2. Bangun URL untuk endpoint upload Supabase Storage API
            $uploadUrl = "{$supabaseUrl}/storage/v1/object/{$bucketName}/{$fileName}";
            
            // 3. Lakukan panggilan HTTP POST dengan header yang benar
            $response = Http::withHeaders([
                'apikey'        => $supabaseKey,
                'Authorization' => 'Bearer ' . $supabaseKey,
                'Content-Type'  => 'application/pdf', // Header ini wajib untuk file biner
                'x-upsert'      => 'true', // Opsi untuk menimpa file jika sudah ada
            ])->post($uploadUrl, $pdfContent);
            
            // 4. Periksa responsnya secara eksplisit
            if ($response->failed()) {
                // Jika gagal, lemparkan error dengan pesan dari Supabase agar sangat jelas
                throw new \Exception('GAGAL UNGGAH VIA HTTP: Status Code ' . $response->status() . ' - Pesan: ' . $response->body());
            }

            // 5. Jika berhasil, bangun URL publik secara manual
            $filePath = "{$supabaseUrl}/storage/v1/object/public/{$bucketName}/{$fileName}";
            
            // =================================== AKHIR DARI BLOK HTTP ===================================

            // Perbarui status laporan di database menjadi selesai
            $report->update([
                'status'    => 'completed',
                'file_path' => $filePath,
            ]);

        } catch (\Exception $e) {
            // Catat error yang terjadi, termasuk error dari HTTP
            Log::error("Gagal generate PDF untuk Report ID {$this->reportId}: " . $e->getMessage());

            $report->update([
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            // Lemparkan kembali error agar terminal queue worker menampilkan status "FAILED"
            throw $e;
        }
    }
}