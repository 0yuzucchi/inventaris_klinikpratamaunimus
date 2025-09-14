<?php

namespace App\Jobs;

use App\Models\Inventaris;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ExportInventarisJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filters;
    protected $userId; // kalau mau kasih link ke user

    public function __construct(array $filters, $userId = null)
    {
        $this->filters = $filters;
        $this->userId = $userId;
    }

    public function handle()
    {
        $query = Inventaris::query();
        $titleParts = [];

        if (!empty($this->filters['tanggal_mulai']) && !empty($this->filters['tanggal_selesai'])) {
            $query->whereBetween('tanggal_masuk', [
                $this->filters['tanggal_mulai'],
                $this->filters['tanggal_selesai']
            ]);
            $titleParts[] = "dari {$this->filters['tanggal_mulai']} sampai {$this->filters['tanggal_selesai']}";
        }

        if (!empty($this->filters['hari'])) {
            $query->whereDay('tanggal_masuk', $this->filters['hari']);
            $titleParts[] = "Tanggal {$this->filters['hari']}";
        }

        if (!empty($this->filters['bulan'])) {
            $query->whereMonth('tanggal_masuk', $this->filters['bulan']);
            $titleParts[] = "Bulan {$this->filters['bulan']}";
        }

        if (!empty($this->filters['tahun'])) {
            $query->whereYear('tanggal_masuk', $this->filters['tahun']);
            $titleParts[] = "Tahun {$this->filters['tahun']}";
        }

        $title = empty($titleParts) ? 'Laporan Keseluruhan Inventaris' : 'Laporan Inventaris ' . implode(', ', $titleParts);

        $inventaris = $query->latest('tanggal_masuk')->get();

        $data = [
            'inventaris' => $inventaris,
            'title'      => $title,
            'date'       => date('d F Y'),
        ];

        $pdf = Pdf::loadView('inventaris.pdf', $data)->setPaper('a4', 'landscape');
        $pdf->setOption('isRemoteEnabled', true);

        $fileName = 'laporan-inventaris-' .
            str_replace(' ', '-', strtolower(implode('-', $titleParts) ?: 'semua')) .
            '-' . date('Ymd') . '-' . Str::random(6) . '.pdf';

        $fileContent = $pdf->output();

        // 🔹 Upload ke Supabase Storage
        $response = Http::withHeaders([
            'apikey'        => env('SUPABASE_KEY'),
            'Authorization' => 'Bearer ' . env('SUPABASE_KEY'),
        ])->attach(
            'file', $fileContent, $fileName
        )->post(env('SUPABASE_URL') . '/storage/v1/object/exports/' . $fileName);

        if ($response->successful()) {
            $downloadUrl = env('SUPABASE_URL') . '/storage/v1/object/public/exports/' . $fileName;

            // Simpan ke DB atau kasih notifikasi ke user
            // misalnya: ExportResult::create([...])
        }
    }
}
