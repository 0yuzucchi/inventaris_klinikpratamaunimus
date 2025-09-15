<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Inventaris;

class InventarisExportController extends Controller
{
    public function index()
    {
        // halaman export (pakai inertia)
        return inertia('Inventaris/Export');
    }

    public function generatePdf(Request $request)
    {
        $inventaris = Inventaris::all();

        $pdf = Pdf::loadView('inventaris.pdf', compact('inventaris'));

        // langsung download file ke browser
        return $pdf->download('laporan-inventaris.pdf');
    }
}
