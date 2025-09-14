<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateInventarisPdf;
use App\Models\Report;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    // Halaman daftar laporan
    public function index()
    {
        $reports = Report::latest()->get();
        return view('reports.index', compact('reports'));
    }

    // Method untuk request export PDF
    public function requestPdfExport(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'tahun'          => 'nullable|date_format:Y',
            'bulan'          => 'nullable|date_format:m',
            'hari'           => 'nullable|date_format:d',
            'tanggal_mulai'  => 'nullable|date',
            'tanggal_selesai'=> 'nullable|date|after_or_equal:tanggal_mulai',
        ]);

        // 2. Bangun titleParts
        $titleParts = [];

        if ($request->filled('tanggal_mulai') && $request->filled('tanggal_selesai')) {
            $startDate = Carbon::parse($request->input('tanggal_mulai'))->format('d F Y');
            $endDate   = Carbon::parse($request->input('tanggal_selesai'))->format('d F Y');
            $titleParts[] = "dari {$startDate} sampai {$endDate}";
        } else {
            if ($request->filled('hari')) {
                $titleParts[] = 'Tanggal ' . $request->input('hari');
            }
            if ($request->filled('bulan')) {
                $titleParts[] = 'Bulan ' . $request->input('bulan');
            }
            if ($request->filled('tahun')) {
                $titleParts[] = 'Tahun ' . $request->input('tahun');
            }
        }

        $title = empty($titleParts)
            ? 'Laporan Keseluruhan Inventaris'
            : 'Laporan Inventaris ' . implode(', ', $titleParts);

        // 3. Generate nama file unik
        $fileName = 'exports/laporan-inventaris-' .
            str_replace(' ', '-', strtolower(implode('-', $titleParts) ?: 'semua')) .
            '-' . now()->timestamp . '-' . uniqid() . '.pdf';

        // 4. Buat record laporan
        $report = Report::create([
            'title'     => $title,
            'file_name' => $fileName,
            'filters'   => json_encode($request->all()),
            'status'    => 'pending',
        ]);

        // 5. Dispatch job
        GenerateInventarisPdf::dispatch($report->id);

        // 6. Redirect
        return redirect()->route('reports.index')
            ->with('success', 'Permintaan laporan Anda sedang diproses dan akan segera tersedia.');
    }
}
