import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// --- PERUBAHAN 1: Buat helper function untuk mengubah teks AI menjadi HTML ---
/**
 * Mengubah format Markdown sederhana dari AI menjadi string HTML.
 * - **Teks** -> <strong>Teks</strong>
 * - * Poin   -> • Poin (menggunakan bullet character)
 * - \n       -> <br>
 * @param {string} text Teks mentah dari AI.
 * @returns {string} String yang sudah diformat sebagai HTML.
 */
const parseAiResponse = (text) => {
    if (!text) return '';

    return text
        // Ubah **Teks** menjadi <strong>Teks</strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Ubah baris yang diawali dengan "* " menjadi bullet point
        .replace(/^\* (.*$)/gm, '<p style="margin: 0; padding-left: 1em; text-indent: -1em;">• $1</p>')
        // Ubah baris baru menjadi <br> (opsional, tapi bagus untuk spasi)
        .replace(/\n/g, '<br />');
};


export default function ChatbotIndex({ auth, promptSuggestions = [] }) {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Halo! Saya asisten inventaris Anda. Klik salah satu contoh di samping atau ketik pertanyaan Anda di bawah.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (messageText) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: messageText };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
setIsLoading(true);

        try {
            const history = newMessages.slice(-5, -1);

            const response = await axios.post(route('chatbot.ask'), {
                question: messageText,
                history: history,
            });

            const aiMessage = { sender: 'ai', text: response.data.answer };
            setMessages(prevMessages => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error("Error saat bertanya ke AI:", error);
            const errorMessage = { sender: 'ai', text: 'Maaf, terjadi kesalahan pada server. Silakan coba lagi nanti.' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        sendMessage(input);
        setInput('');
    };

    const handlePromptClick = (prompt) => {
        setInput('');
        sendMessage(prompt);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Chatbot" />
            <div className="flex h-[calc(100vh-65px)] bg-gray-50">
                {/* Kolom Kiri - Antarmuka Chat */}
                <div className="flex-1 flex flex-col bg-white">
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-lg p-3 rounded-lg shadow-md text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {/* --- PERUBAHAN 2: Gunakan `dangerouslySetInnerHTML` untuk merender HTML --- */}
                                    <div
                                        dangerouslySetInnerHTML={{ __html: parseAiResponse(msg.text) }}
                                    />
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs p-3 rounded-lg shadow-md bg-gray-200 text-gray-800">
                                    <p className="text-sm italic">AI sedang mengetik...</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-white border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Tanyakan sesuatu tentang inventaris..."
                                className="flex-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm disabled:bg-gray-100"
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                Kirim
                            </button>
                        </form>
                    </div>
                </div>
                {/* Kolom Kanan - Sidebar Prompt */}
                <div className="hidden lg:block w-1/4 max-w-xs border-l border-gray-200 p-6">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">Contoh Pertanyaan</h3>
                    <div className="space-y-3">
                        {promptSuggestions.map((prompt, index) => (
                            <div
                                key={index}
                                onClick={() => handlePromptClick(prompt)}
                                className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-colors"
                            >
                                {prompt}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}