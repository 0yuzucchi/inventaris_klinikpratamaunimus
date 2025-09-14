<?php


use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Http\Request;


Route::post('/queue-worker', function (Request $request) {
    // Tambahkan secret key sederhana untuk keamanan
    if ($request->bearerToken() !== env('CRON_SECRET')) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Jalankan worker untuk memproses satu job dan langsung berhenti
    // --stop-when-empty sangat efisien untuk serverless
    Artisan::call('queue:work --stop-when-empty');

    return response()->json(['message' => 'Queue worker executed']);
});
