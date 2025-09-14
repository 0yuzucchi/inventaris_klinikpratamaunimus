import React from 'react';

export default function Home({ message }) {
    return (
        <main className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-5xl font-extrabold mb-4">Selamat Datang di Inertia & React!</h1>
                <p className="bg-blue-500 text-blue-100 px-4 py-2 rounded-lg">{ message }</p>
            </div>
        </main>
    );
}