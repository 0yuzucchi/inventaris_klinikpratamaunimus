<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function index()
    {
        // Ambil semua laporan, misalnya milik user yang login, diurutkan dari yang terbaru
        $reports = Report::latest()->paginate(15);
        return view('reports.index', compact('reports'));
    }
}