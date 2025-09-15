<?php
// InventarisExportController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventaris;

class InventarisExportController extends Controller
{
    public function index()
    {
        $inventaris = Inventaris::all();

        // kirim data ke Inertia
        return inertia('Inventaris/Export', [
            'inventaris' => $inventaris,
        ]);
    }
}
