<?php
// InventarisExportController.php
namespace App\Http\Controllers;

use Inertia\Inertia;

class InventarisExportController extends Controller
{
    public function index()
{
    return response()->json(['status' => 'OK Export route works']);
}

}

