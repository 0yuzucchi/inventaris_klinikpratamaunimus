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
            $items = Inventaris::query()->whereNotNull('nama_barang')->inRandomOrder()->limit(5)->get();

            if ($items->isNotEmpty()) {
                // --- KUMPULAN SEMUA POLA PERTANYAAN ---
                $suggestions[] = "Berapa jumlah {$items->first()->nama_barang} yang tersedia?";
                if ($itemWithCode = $items->firstWhere('kode_barang')) {
                    $suggestions[] = "Cari barang dengan kode {$itemWithCode->kode_barang}";
                }
                if ($itemWithLocation = $items->firstWhere('tempat_pemakaian')) {
                    $suggestions[] = "Cek stok {$itemWithLocation->nama_barang} di {$itemWithLocation->tempat_pemakaian}";
                    $suggestions[] = "Sebutkan semua inventaris di {$itemWithLocation->tempat_pemakaian}.";
                }
                if ($itemWithSpec = $items->firstWhere('spesifikasi')) {
                    $suggestions[] = "Apa spesifikasi dari {$itemWithSpec->nama_barang}?";
                }
                if ($itemWithDate = $items->firstWhere('tanggal_masuk')) {
                    $suggestions[] = "Kapan {$itemWithDate->nama_barang} ditambahkan?";
                }

                // --- PERUBAHAN UTAMA: TAMBAHKAN POLA PERTANYAAN KONDISI ---
                // Pola 8: Menanyakan kondisi barang secara spesifik
                $suggestions[] = "Bagaimana kondisi {$items->last()->nama_barang}?";
            }

            // Tambahkan pertanyaan statis yang bersifat "intent" atau umum
            $suggestions[] = 'Tampilkan 3 barang yang terakhir masuk';
            // Tambahkan pertanyaan statis untuk kondisi rusak, ini sangat penting untuk manajerial
            $suggestions[] = 'Tampilkan daftar barang yang rusak';

        } catch (\Throwable $e) {
            Log::error('[Chatbot Suggestions] Gagal generate: ' . $e->getMessage());
            $suggestions = [
                'Berapa jumlah APAR yang tersedia?',
                'Tampilkan 3 barang yang terakhir masuk',
                'Bagaimana kondisi Proyektor?',
                'Tampilkan semua barang yang rusak',
            ];
        }

        return Inertia::render('Chatbot/Index', [
            'promptSuggestions' => array_values(array_unique($suggestions))
        ]);
    }

    /**
     * Endpoint untuk memproses chat user, sekarang dengan pemahaman kondisi aset.
     */
    public function chat(Request $request)
    {
        $request->validate(['question' => 'required|string|max:1000', 'history' => 'nullable|array']);
        $question = trim($request->input('question'));
        $history = $request->input('history', []);
        $cleanQuestion = strtolower($question);

        try {
            $apiKey = config('services.gemini.api_key', env('GEMINI_API_KEY'));
            if (empty($apiKey)) return response()->json(['error' => 'API Key belum dikonfigurasi.'], 500);

            // --- PERUBAHAN UTAMA: LOGIKA PEMBUATAN QUERY PROGRESIF ---
            $query = Inventaris::query();
            $isQueryModified = false; // Flag untuk menandai apakah query sudah ditambahi kondisi

            // 1. Deteksi Intent Kondisi: Menambahkan filter untuk barang rusak
            if (preg_match('/(rusak|kondisi buruk|jelek|perlu perbaikan|tidak berfungsi)/', $cleanQuestion)) {
                $query->where('jumlah_rusak', '>', 0);
                $isQueryModified = true;
            }

            // 2. Deteksi Intent Terbaru: Menambahkan pengurutan dan limit untuk barang terbaru
            if (preg_match('/(terbaru|terakhir|paling baru|baru saja masuk)/', $cleanQuestion)) {
                $limit = preg_match('/(\d+)/', $cleanQuestion, $m) ? (int)$m[1] : 5;
                $query->orderBy('tanggal_masuk', 'DESC')->limit($limit);
                $isQueryModified = true;
            }

            // 3. Pencarian Berdasarkan Kata Kunci (berjalan bersamaan dengan intent di atas)
            // Daftar kata yang diabaikan diperbarui untuk memasukkan kata-kata dari intent
            $stopWords = [
                'apa', 'apakah', 'siapa', 'mengapa', 'bagaimana', 'kapan', 'dimana', 'berapa', 'aja', 'saja',
                'tolong', 'mohon', 'cek', 'lihat', 'tampilkan', 'tunjukkan', 'berikan', 'cari', 'carikan', 'dari',
                'sebutkan', 'kasih', 'tau', 'info', 'informasi', 'mengenai', 'tentang', 'spesifikasi', 'jenis',
                'ada', 'adakah', 'masih', 'punya', 'sisa', 'jumlah', 'stok', 'total', 'semua', 'seluruh',
                'lokasi', 'tempat', 'tersedia', 'terdaftar', 'milik', 'dengan', 'kode', 'nomor', 'ditambahkan',
                'lengkapnya', 'yang', 'untuk', 'pada', 'ke', 'para', 'namun', 'menurut', 'antara', 'dan',
                'dalam', 'di', 'saat', 'jika', 'karena', 'kepada', 'oleh', 'seperti', 'ini', 'itu', 'adalah',
                'ialah', 'merupakan', 'atau', 'tapi', 'tersebut', 'ruang', 'rawat', 'inap', 'barang', 'inventaris',
                'dimasukkan', 'berdasarkan', 'tanggal', 'masuk', 'halo', 'hai', 'hello', 'selamat',
                'aset', 'data', 'no', 'terima', 'kasih', 'saya', 'kamu', 'anda',
                // Kata kunci terkait intent agar tidak ikut dicari sebagai teks biasa
                'kondisi', 'status', 'rusak', 'jelek', 'buruk', 'terbaru', 'terakhir', 'paling', 'baru'
            ];

            $getKeywords = function ($text) use ($stopWords) {
                $clean = strtolower(preg_replace('/[^\p{L}\p{N}\s\-\/]/u', ' ', $text));
                $tokens = array_values(array_filter(preg_split('/\s+/', $clean)));
                return array_values(array_filter($tokens, fn($t) => $t !== '' && !in_array($t, $stopWords)));
            };

            $keywords = $getKeywords($question);
            if (empty($keywords) && !empty($history)) {
                $lastUserMessage = collect($history)->last(fn($msg) => $msg['sender'] === 'user');
                if ($lastUserMessage) $keywords = $getKeywords($lastUserMessage['text']);
            }

            if (!empty($keywords)) {
                $query->where(function ($subQuery) use ($keywords) {
                    foreach ($keywords as $keyword) {
                        $subQuery->whereRaw("CONCAT_WS(' ', nama_barang, kode_barang, spesifikasi, tempat_pemakaian) ILIKE ?", ["%{$keyword}%"]);
                    }
                });
                $isQueryModified = true;
            }

            // Eksekusi query hanya jika ada kondisi yang diterapkan (untuk menghindari pengambilan semua data saat input tidak jelas)
            $matchesCollection = collect();
            if ($isQueryModified) {
                // Jika tidak ada intent "terbaru" yang sudah menetapkan limit, berikan limit pengaman
                if (!preg_match('/(terbaru|terakhir|paling baru|baru saja masuk)/', $cleanQuestion)) {
                    $query->limit(50);
                }
                $matchesCollection = $query->get();
            }
            // --- AKHIR DARI PERUBAHAN LOGIKA ---

            // Bagian ini tetap sama, karena sudah bagus dalam memformat data untuk AI
            $contextData = $matchesCollection->map(fn($item) => [
                'nama_barang' => (string) $item->nama_barang,
                'kode_barang' => (string) $item->kode_barang,
                'jumlah_total' => (int) ($item->jumlah ?? 0),
                'jumlah_dipakai' => (int) ($item->jumlah_dipakai ?? 0),
                'jumlah_rusak' => (int) ($item->jumlah_rusak ?? 0),
                'lokasi' => (string) ($item->tempat_pemakaian ?? ''),
                'spesifikasi' => (string) ($item->spesifikasi ?? ''),
                'tanggal_masuk' => $item->tanggal_masuk ? $item->tanggal_masuk->format('d-m-Y') : null,
            ])->values()->toArray();

            $prompt = "Kamu adalah asisten inventaris AI yang cerdas. Tugasmu adalah memahami pertanyaan user dan memberikan jawaban yang paling relevan HANYA dari data JSON yang disediakan.\n\n";
            if (!empty($history)) {
                $prompt .= "KONTEKS PERCAKAPAN SEBELUMNYA:\n";
                foreach ($history as $msg) $prompt .= ($msg['sender'] === 'user' ? 'User' : 'Asisten') . ": {$msg['text']}\n";
                $prompt .= "\n";
            }
            $prompt .= "INSTRUKSI UTAMA:\n";
            $prompt .= "1. PAHAMI MAKSUD USER: Lihat pertanyaan dan konteks. Apakah user bertanya soal jumlah, lokasi, atau kondisi?\n";
            $prompt .= "2. JAWAB BERDASARKAN DATA: Gunakan HANYA 'DATA_INVENTARIS_JSON'.\n";
            $prompt .= "3. BERIKAN JAWABAN LENGKAP: SELALU tampilkan detail dalam format daftar yang mudah dibaca.\n";
            $prompt .= "4. ANALISIS KONDISI ASET: Jika pertanyaan menyinggung 'kondisi', 'status', 'rusak', atau 'baik', gunakan field `jumlah_rusak` untuk menyimpulkan. Jika `jumlah_rusak` > 0, sebutkan dengan jelas bahwa ada unit yang rusak. Jika `jumlah_rusak` == 0, sebutkan bahwa kondisinya baik.\n";
            $prompt .= "5. JIKA TIDAK DITEMUKAN: Berikan jawaban sopan seperti: 'Maaf, saya tidak menemukan data mengenai \"[istilah]\" dalam inventaris.' Jika DATA_INVENTARIS_JSON kosong, sampaikan bahwa tidak ada data yang cocok dengan permintaan tersebut.\n\n";
            $prompt .= "DATA_INVENTARIS_JSON:\n" . json_encode($contextData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
            $prompt .= "PERTANYAAN USER SAAT INI:\n{$question}\n\n";
            $prompt .= "JAWABAN ANDA (FLEKSIBEL DAN INFORMATIF):\n";

            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
            $response = Http::withoutVerifying()->post($url, ['contents' => [['parts' => [['text' => $prompt]]]]]);

            if ($response->failed()) return response()->json(['error' => 'Layanan AI sedang tidak dapat dihubungi.'], 502);
            $body = $response->json();
            $answer = $body['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, terjadi sedikit kendala. Silakan coba lagi.';

            return response()->json(['answer' => $answer]);
        } catch (\Throwable $e) {
            Log::error('[Chatbot] Error: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
            return response()->json(['error' => 'Terjadi kesalahan sistem.'], 500);
        }
    }
}