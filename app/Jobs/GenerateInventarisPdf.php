<?php

namespace App\Jobs;

use App\Models\Inventaris;
use App\Models\Report;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
        // Log saat job dimulai
        Log::info('[Report ID: ' . $this->report->id . '] Job Dimulai.');

        try {
            // 1. Update status laporan menjadi 'processing'
            $this->report->update(['status' => 'processing']);
            Log::info('[Report ID: ' . $this->report->id . '] Status diubah menjadi -> processing.');

            // 2. Logika query
            $filters = json_decode($this->report->filters, true);
            Log::info('[Report ID: ' . $this->report->id . '] Filter yang diterima: ', $filters);

            $query = Inventaris::query();

            // --- SALIN SEMUA LOGIKA FILTER ANDA DARI CONTROLLER KE SINI ---
            if (!empty($filters['tanggal_mulai']) && !empty($filters['tanggal_selesai'])) {
                 $query->whereBetween('tanggal_masuk', [$filters['tanggal_mulai'], $filters['tanggal_selesai']]);
            } else {
                if (!empty($filters['hari'])) {
                    $query->whereDay('tanggal_masuk', $filters['hari']);
                }
                if (!empty($filters['bulan'])) {
                    $query->whereMonth('tanggal_masuk', $filters['bulan']);
                }
                if (!empty($filters['tahun'])) {
                    $query->whereYear('tanggal_masuk', $filters['tahun']);
                }
            }
            // --- AKHIR DARI LOGIKA FILTER ---

            $inventaris = $query->latest('tanggal_masuk')->get();
            Log::info('[Report ID: ' . $this->report->id . '] Query ke database selesai. Ditemukan ' . $inventaris->count() . ' baris data.');

            $data = [
                'inventaris' => $inventaris,
                'title'      => $this->report->title,
                'date'       => date('d F Y')
            ];

            // 3. Generate PDF
            Log::info('[Report ID: ' . $this->report->id . '] Memulai proses pembuatan PDF...');
            $pdf = Pdf::loadView('inventaris.pdf', $data);
            $pdf->setOption('isRemoteEnabled', true);
            $pdf->setPaper('a4', 'landscape');
            $pdfContent = $pdf->output();
            Log::info('[Report ID: ' . $this->report->id . '] PDF berhasil dibuat. Ukuran file: ' . round(strlen($pdfContent) / 1024, 2) . ' KB.');

            // 4. Upload ke Supabase Storage
            $fileName = $this->report->file_name;

            // =================== KODE TES KONEKSI SEMENTARA ===================
            // Baris ini akan mencoba mengunggah file teks sederhana untuk memastikan
            // koneksi, izin, dan konfigurasi Supabase sudah benar.
            try {
                Storage::disk('supabase')->put('uji-koneksi.txt', 'Tes koneksi Supabase berhasil pada ' . now());
                Log::info('[Report ID: ' . $this->report->id . '] TES KONEKSI BERHASIL: File uji-koneksi.txt berhasil diunggah.');
            } catch (\Exception $e) {
                // Jika tes ini saja sudah gagal, kita tidak perlu melanjutkan.
                Log::error('[Report ID: ' . $this->report->id . '] TES KONEKSI GAGAL: Tidak bisa mengunggah file teks sederhana. Periksa RLS/Policies, .env, dan config/filesystems.php. Error: ' . $e->getMessage());
                throw $e; // Lempar ulang error agar job ini dianggap gagal total.
            }
            // =================== AKHIR KODE TES KONEKSI ===================

            Log::info('[Report ID: ' . $this->report->id . '] Mencoba mengunggah file PDF dengan nama: ' . $fileName);
            Storage::disk('supabase')->put($fileName, $pdfContent);
            Log::info('[Report ID: ' . $this->report->id . '] Unggah PDF BERHASIL.');

            Log::info('[Report ID: ' . $this->report->id . '] Mengambil URL publik dari Supabase...');
            $filePath = Storage::disk('supabase')->url($fileName);
            Log::info('[Report ID: ' . $this->report->id . '] URL publik yang didapat: ' . $filePath);

            // 5. Update record laporan di database
            $this->report->update([
                'status'    => 'completed',
                'file_path' => $filePath,
            ]);
            Log::info('[Report ID: ' . $this->report->id . '] Status diubah menjadi -> completed. Job Selesai dengan SUKSES.');

        } catch (\Exception $e) {
            // Jika terjadi error di mana pun dalam blok 'try', proses akan lompat ke sini
            Log::error('[Report ID: ' . $this->report->id . '] TERJADI ERROR PADA JOB. Pesan: ' . $e->getMessage() . ' | File: ' . $e->getFile() . ' | Baris: ' . $e->getLine());

            // Update status di database menjadi 'failed' agar pengguna tahu ada masalah
            $this->report->update([
                'status' => 'failed',
                'error_message' => substr($e->getMessage(), 0, 500) // Ambil 500 karakter pertama dari pesan error
            ]);
        }
    }
}