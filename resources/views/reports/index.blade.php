{{-- resources/views/reports/index.blade.php --}}

<h1>Daftar Laporan Saya</h1>

@if(session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif

<table>
    <thead>
        <tr>
            <th>Judul Laporan</th>
            <th>Tanggal Permintaan</th>
            <th>Status</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        @forelse($reports as $report)
            <tr>
                <td>{{ $report->title }}</td>
                <td>{{ $report->created_at->format('d F Y H:i') }}</td>
                <td>
                    <span class="status-{{ $report->status }}">{{ ucfirst($report->status) }}</span>
                </td>
                <td>
                    @if($report->status == 'completed')
                        <a href="{{ $report->file_path }}" target="_blank" class="btn-download">Download</a>
                    @elseif($report->status == 'failed')
                        <span class="text-danger">Gagal</span>
                    @else
                        <span>Memproses...</span>
                    @endif
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="4">Belum ada laporan yang dibuat.</td>
            </tr>
        @endforelse
    </tbody>
</table>

{{-- Untuk UX yang lebih baik, Anda bisa menambahkan JavaScript
     untuk auto-refresh halaman ini setiap beberapa detik --}}
<script>
    setTimeout(() => {
        // Cek jika ada laporan yang masih berstatus 'pending' atau 'processing'
        const hasPending = document.querySelector('.status-pending, .status-processing');
        if (hasPending) {
            window.location.reload();
        }
    }, 10000); // Refresh setiap 10 detik
</script>