<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Inventaris;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ChatbotController extends Controller
{
    /**
     * Tampilkan halaman chatbot dengan contoh pertanyaan yang dinamis,
     * termasuk pertanyaan mengenai kondisi aset.
     */
    public function index(): InertiaResponse
{
    $suggestions = [];

    try {
        $items = Inventaris::with(['masterBarang', 'ruangan'])
            ->inRandomOrder()
            ->limit(5)
            ->get();

        if ($items->isNotEmpty()) {
            $first = $items->first();

            $suggestions[] = "Berapa jumlah {$first->display_nama_barang} yang tersedia?";
            $suggestions[] = "Bagaimana kondisi {$first->display_nama_barang}?";

            if ($first->display_ruangan) {
                $suggestions[] = "Cek stok {$first->display_nama_barang} di {$first->display_ruangan}";
                $suggestions[] = "Sebutkan semua inventaris di {$first->display_ruangan}";
            }

            if ($first->spesifikasi) {
                $suggestions[] = "Apa spesifikasi dari {$first->display_nama_barang}?";
            }

            if ($first->tanggal_masuk) {
                $suggestions[] = "Kapan {$first->display_nama_barang} ditambahkan?";
            }
        }

        $suggestions[] = 'Tampilkan 3 aset yang terakhir diperbarui';
        $suggestions[] = 'Tampilkan daftar aset yang rusak';

    } catch (\Throwable $e) {
        Log::error('[Chatbot Suggestions] ' . $e->getMessage());
        $suggestions = [
            'Berapa jumlah APAR yang tersedia?',
            'Tampilkan aset yang rusak',
            'Bagaimana kondisi Proyektor?',
        ];
    }

    return Inertia::render('Chatbot/Index', [
        'promptSuggestions' => array_values(array_unique($suggestions))
    ]);
}

    public function chat(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:1000',
            'history' => 'nullable|array'
        ]);
    
        $question = trim($request->question);
        $cleanQuestion = strtolower($question);
    
        try {
            $query = Inventaris::with([
                'masterBarang.kategori',
                'ruangan',
                'jenisPerawatan'
            ]);
    
            $isModified = false;
    
            // === INTENT: BARANG RUSAK ===
            if (preg_match('/(rusak|kondisi buruk|jelek|tidak berfungsi)/', $cleanQuestion)) {
                $query->where('jumlah_rusak', '>', 0);
                $isModified = true;
            }
    
            // === INTENT: TERBARU ===
            if (preg_match('/(terbaru|terakhir|diupdate|paling baru)/', $cleanQuestion)) {
                $limit = preg_match('/(\d+)/', $cleanQuestion, $m) ? (int) $m[1] : 5;
                $query->orderByDesc('updated_at')->limit($limit);
                $isModified = true;
            }
    
            // === KEYWORD SEARCH ===
            $keywords = collect(preg_split('/\s+/', preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $cleanQuestion)))
                ->filter(fn ($w) => strlen($w) > 2)
                ->values();
    
            if ($keywords->isNotEmpty()) {
                $query->where(function ($q) use ($keywords) {
                    foreach ($keywords as $word) {
                        $q->orWhereHas('masterBarang', fn ($m) =>
                            $m->where('nama_barang', 'ILIKE', "%{$word}%")
                              ->orWhere('nomor_barang', 'ILIKE', "%{$word}%")
                        )->orWhereHas('ruangan', fn ($r) =>
                            $r->where('nama_ruangan', 'ILIKE', "%{$word}%")
                        );
                    }
                });
                $isModified = true;
            }
    
            $items = $isModified ? $query->limit(50)->get() : collect();
    
            // === DATA KE AI ===
            $contextData = $items->map(fn ($item) => [
                'nama_barang'       => $item->display_nama_barang,
                'nomor_barang'      => $item->display_nomor_barang,
                'jumlah_total'      => $item->jumlah ?? 0,
                'jumlah_dipakai'    => $item->jumlah_dipakai ?? 0,
                'jumlah_rusak'      => $item->jumlah_rusak ?? 0,
                'lokasi'            => $item->display_ruangan,
                'jenis_perawatan'   => $item->display_jenis_perawatan,
                'spesifikasi'       => $item->spesifikasi ?? '',
                'tanggal_masuk'     => optional($item->tanggal_masuk)?->format('d-m-Y'),
                'terakhir_update'   => optional($item->updated_at)?->format('d-m-Y'),
            ])->values();
    
            // === PROMPT ===
            $prompt = <<<PROMPT
    Kamu adalah asisten inventaris aset.
    
    Gunakan HANYA data JSON berikut untuk menjawab pertanyaan user.
    Jika jumlah_rusak > 0, sebutkan bahwa ada unit rusak.
    Jika kosong, jawab dengan sopan bahwa data tidak ditemukan.
    
    DATA:
    {$contextData->toJson(JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)}
    
    PERTANYAAN:
    {$question}
    PROMPT;
    
            // === CALL GEMINI ===
            $response = Http::post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . config('services.gemini.api_key'),
                ['contents' => [['parts' => [['text' => $prompt]]]]]
            );
    
            $answer = $response->json('candidates.0.content.parts.0.text')
                ?? 'Maaf, saya tidak menemukan data yang sesuai.';
    
            return response()->json(['answer' => $answer]);
    
        } catch (\Throwable $e) {
            Log::error('[Chatbot] ' . $e->getMessage());
            return response()->json(['error' => 'Terjadi kesalahan sistem'], 500);
        }
    }
    

}