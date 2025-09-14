{{-- resources/views/inventaris/export_form.blade.php --}}

<h1>Buat Laporan Inventaris</h1>

<p>Silakan pilih filter di bawah ini untuk membuat laporan. Laporan akan diproses di belakang layar dan akan tersedia di halaman daftar laporan setelah selesai.</p>

<form action="{{ route('inventaris.export.request') }}" method="POST">
    @csrf

    {{-- Letakkan semua input filter Anda di sini --}}
    <div>
        <label for="tahun">Tahun:</label>
        <input type="text" name="tahun" id="tahun" placeholder="Contoh: 2024">
    </div>

    <div>
        <label for="bulan">Bulan:</label>
        <input type="text" name="bulan" id="bulan" placeholder="Contoh: 09">
    </div>

    {{-- Tambahkan filter lainnya (tanggal_mulai, tanggal_selesai) --}}

    <br>
    <button type="submit">Buat Laporan Sekarang</button>
</form>