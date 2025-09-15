import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
// 'tailwindcss' sudah termasuk dalam laravel-vite-plugin, jadi Anda mungkin tidak perlu ini
import react from '@vitejs/plugin-react';


export default defineConfig({
    // Tambahkan bagian 'server' ini
    // yang server di bawah sesuaikan dengan ip host ipv4 dari wifi yang dipakai serta menjalankan "php artisan serve --host=0.0.0.0 --port=8000"
    server: {
        host: '0.0.0.0',
        // doksli aseli
        // port: 5173,
        port: 5173,
        hmr: {
            host: '192.168.139.167',
        },
        cors: true 
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
