<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Inventaris; // Pastikan menggunakan Model yang benar

class InventoryAIController extends Controller
{
    public function identifyItem(Request $request)
    {
        // 1. Validasi Input
        if (!$request->hasFile('image')) {
            return response()->json(['error' => 'Tidak ada gambar yang diupload.'], 400);
        }

        $request->validate(['image' => 'required|image|max:5120']);

        try {
            // 2. Cek API Key
            $apiKey = env('GEMINI_API_KEY');
            if (empty($apiKey)) throw new \Exception('API Key belum disetting.');

            // 3. Ambil Konteks dari Database (Learning from Data)
            $rawItems = Inventaris::inRandomOrder()
                ->limit(60) 
                ->get(['nama_barang', 'kode_barang', 'tempat_pemakaian', 'nomor_ruang']);

            // Filter Unik via PHP Collection
            $existingItems = $rawItems->unique('nama_barang')->take(30);
            
            // Susun text context
            $dbContext = "Berikut adalah daftar contoh barang dan lokasi penyimpanannya yang SUDAH ADA di database (Gunakan sebagai referensi pola):\n";
            foreach ($existingItems as $item) {
                $dbContext .= "- Barang: {$item->nama_barang} | Kode: {$item->kode_barang} | Tempat: {$item->tempat_pemakaian} | Ruang: {$item->nomor_ruang}\n";
            }

            // 4. Persiapkan Gambar
            $image = $request->file('image');
            $mimeType = $image->getMimeType();
            $imageData = base64_encode(file_get_contents($image->getRealPath()));
            
            // 5. Susun Prompt (Instruksi ke AI)
            // PERUBAHAN ADA DI POIN NOMOR 5
            $prompt = "Kamu adalah asisten inventaris klinik cerdas.\n\n" .
                      $dbContext . "\n" . 
                      "TUGAS: Analisis gambar yang diupload ini berdasarkan pola data di atas.\n" .
                      "1. Identifikasi Nama Barang (Indonesia baku, sertakan merek/ukuran/dosis jika terlihat).\n" .
                      "2. Tentukan Kode Barang (Ikuti pola kode dari daftar contoh. Misal: 05-AK untuk alat medis).\n" .
                      "3. Prediksi Tempat Pemakaian (Jika barang ini mirip dengan contoh di atas, gunakan tempat yang sama).\n" .
                      "4. Tentukan Nomor Ruang (Sangat Penting: Sesuaikan Nomor Ruang dengan Tempat Pemakaian berdasarkan daftar contoh).\n" .
                      "5. Buat Spesifikasi singkat (Warna, bahan, ciri fisik). INSTRUKSI KHUSUS: Gunakan tanda KOMA (,) sebagai pemisah antar ciri-ciri. JANGAN gunakan titik (.) atau bullet points. Contoh: 'Besi, Warna Hitam, Roda 4'.\n\n" .
                      "PENTING: Keluarkan output HANYA dalam format JSON valid. Jangan ada teks lain. Format:\n" .
                      "{\n" .
                      "  \"nama_barang\": \"...\",\n" .
                      "  \"kode_barang\": \"...\",\n" .
                      "  \"tempat_pemakaian\": \"...\",\n" .
                      "  \"nomor_ruang\": \"...\",\n" .
                      "  \"spesifikasi\": \"...\"\n" .
                      "}";

            // 6. Kirim Request ke Google Gemini
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

            $response = Http::withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json'
            ])->post($url, [
                'contents' => [[
                    'parts' => [
                        ['text' => $prompt],
                        ['inline_data' => ['mime_type' => $mimeType, 'data' => $imageData]]
                    ]
                ]]
            ]);

            // 7. Error Handling
            if ($response->failed()) {
                Log::error('Gemini Error: ' . $response->body());
                $googleMsg = $response->json('error.message') ?? 'Unknown Error';
                return response()->json(['error' => 'AI Error: ' . $googleMsg], 500);
            }

            // 8. Parsing Hasil
            $result = $response->json();
            $rawText = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
            
            $cleanJson = str_replace(['```json', '```'], '', $rawText);
            $parsedData = json_decode($cleanJson, true);

            if (!$parsedData) {
                return response()->json(['error' => 'Gagal memproses data AI (Format JSON rusak).'], 500);
            }

            // --- FILTER TAMBAHAN DI PHP AGAR LEBIH AMAN ---
            // Jika AI masih bandel pakai titik di akhir kalimat, kita ganti manual di sini
            if (isset($parsedData['spesifikasi'])) {
                // Hapus titik di akhir kalimat jika ada
                $parsedData['spesifikasi'] = rtrim($parsedData['spesifikasi'], '.');
                // Ganti newline dengan koma spasi (jika AI membuat list ke bawah)
                $parsedData['spesifikasi'] = str_replace(["\n", "\r"], ", ", $parsedData['spesifikasi']);
            }

            return response()->json($parsedData);

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}