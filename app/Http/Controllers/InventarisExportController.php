<?php

namespace App\Http\Controllers;

class InventarisExportController extends Controller
{
    public function index()
    {
        return inertia('Inventaris/Export');
    }
}
