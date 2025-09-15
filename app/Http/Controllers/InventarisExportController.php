<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Inventaris;

class InventarisExportController extends Controller
{
    public function index()
    {
        return inertia('Inventaris/Export');
    }

    public function generatePdfBase64(Request $request)
    {
        // Ambil semua data inventaris
        $inventaris = Inventaris::all();

        // Render view inventaris/pdf.blade.php
        $pdf = Pdf::loadView('inventaris.pdf', compact('inventaris'));

        // Output PDF dalam bentuk binary
        $pdfContent = $pdf->output();

        // Encode ke base64
        $base64 = base64_encode($pdfContent);

        // Kirim balik ke frontend
        return response()->json([
            'file' => "data:application/pdf;base64," . $base64
        ]);
    }
}
