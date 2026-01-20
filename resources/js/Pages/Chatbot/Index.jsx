// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head } from '@inertiajs/react';
// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// // --- PERUBAHAN 1: Buat helper function untuk mengubah teks AI menjadi HTML ---
// /**
//  * Mengubah format Markdown sederhana dari AI menjadi string HTML.
//  * - **Teks** -> <strong>Teks</strong>
//  * - * Poin   -> • Poin (menggunakan bullet character)
//  * - \n       -> <br>
//  * @param {string} text Teks mentah dari AI.
//  * @returns {string} String yang sudah diformat sebagai HTML.
//  */
// const parseAiResponse = (text) => {
//     if (!text) return '';

//     return text
//         // Ubah **Teks** menjadi <strong>Teks</strong>
//         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//         // Ubah baris yang diawali dengan "* " menjadi bullet point
//         .replace(/^\* (.*$)/gm, '<p style="margin: 0; padding-left: 1em; text-indent: -1em;">• $1</p>')
//         // Ubah baris baru menjadi <br> (opsional, tapi bagus untuk spasi)
//         .replace(/\n/g, '<br />');
// };


// export default function ChatbotIndex({ auth, promptSuggestions = [] }) {
//     const [messages, setMessages] = useState([
//         { sender: 'ai', text: 'Halo! Saya asisten inventaris Anda. Klik salah satu contoh di samping atau ketik pertanyaan Anda di bawah.' }
//     ]);
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const chatContainerRef = useRef(null);

//     useEffect(() => {
//         if (chatContainerRef.current) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//     }, [messages]);

//     const sendMessage = async (messageText) => {
//         if (!messageText.trim() || isLoading) return;

//         const userMessage = { sender: 'user', text: messageText };
//         const newMessages = [...messages, userMessage];
//         setMessages(newMessages);
// setIsLoading(true);

//         try {
//             const history = newMessages.slice(-5, -1);

//             const response = await axios.post(route('chatbot.ask'), {
//                 question: messageText,
//                 history: history,
//             });

//             const aiMessage = { sender: 'ai', text: response.data.answer };
//             setMessages(prevMessages => [...prevMessages, aiMessage]);
//         } catch (error) {
//             console.error("Error saat bertanya ke AI:", error);
//             const errorMessage = { sender: 'ai', text: 'Maaf, terjadi kesalahan pada server. Silakan coba lagi nanti.' };
//             setMessages(prevMessages => [...prevMessages, errorMessage]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         sendMessage(input);
//         setInput('');
//     };

//     const handlePromptClick = (prompt) => {
//         setInput('');
//         sendMessage(prompt);
//     };

//     return (
//         <AuthenticatedLayout
//             user={auth.user}
//         >
//             <Head title="Chatbot" />
//             <div className="flex h-[calc(100vh-65px)] bg-gray-50">
//                 {/* Kolom Kiri - Antarmuka Chat */}
//                 <div className="flex-1 flex flex-col bg-white">
//                     <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
//                         {messages.map((msg, index) => (
//                             <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//                                 <div className={`max-w-xs md:max-w-lg p-3 rounded-lg shadow-md text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
//                                     {/* --- PERUBAHAN 2: Gunakan `dangerouslySetInnerHTML` untuk merender HTML --- */}
//                                     <div
//                                         dangerouslySetInnerHTML={{ __html: parseAiResponse(msg.text) }}
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                         {isLoading && (
//                             <div className="flex justify-start">
//                                 <div className="max-w-xs p-3 rounded-lg shadow-md bg-gray-200 text-gray-800">
//                                     <p className="text-sm italic">AI sedang mengetik...</p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <div className="p-4 bg-white border-t border-gray-200">
//                         <form onSubmit={handleSubmit} className="flex items-center space-x-4">
//                             <input
//                                 type="text"
//                                 value={input}
//                                 onChange={(e) => setInput(e.target.value)}
//                                 placeholder="Tanyakan sesuatu tentang inventaris..."
//                                 className="flex-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm disabled:bg-gray-100"
//                                 disabled={isLoading}
//                                 autoComplete="off"
//                             />
//                             <button
//                                 type="submit"
//                                 className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
//                                 disabled={isLoading}
//                             >
//                                 Kirim
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//                 {/* Kolom Kanan - Sidebar Prompt */}
//                 <div className="hidden lg:block w-1/4 max-w-xs border-l border-gray-200 p-6">
//                     <h3 className="font-semibold text-lg mb-4 text-gray-800">Contoh Pertanyaan</h3>
//                     <div className="space-y-3">
//                         {promptSuggestions.map((prompt, index) => (
//                             <div
//                                 key={index}
//                                 onClick={() => handlePromptClick(prompt)}
//                                 className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-colors"
//                             >
//                                 {prompt}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Helper function yang lebih canggih untuk parsing Markdown sederhana
const parseAiResponse = (text) => {
    if (!text) return '';

    // 1. Escape HTML dasar untuk keamanan (mencegah XSS)
    let formatted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 2. Format Bold (**teks**)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-indigo-900">$1</strong>');

    // 3. Format Italic (*teks* atau _teks_)
    formatted = formatted.replace(/(\*|_)(.*?)\1/g, '<em class="italic">$2</em>');

    // 4. Menangani List Bullet (* item atau - item)
    // Kita split per baris untuk menangani list dengan lebih rapi
    const lines = formatted.split('\n');
    let inList = false;
    let result = '';

    lines.forEach((line) => {
        // Cek apakah baris dimulai dengan * atau - diikuti spasi
        const listMatch = line.match(/^(\*|-)\s+(.*)/);

        if (listMatch) {
            if (!inList) {
                result += '<ul class="list-disc pl-5 my-2 space-y-1">';
                inList = true;
            }
            result += `<li>${listMatch[2]}</li>`;
        } else {
            if (inList) {
                result += '</ul>';
                inList = false;
            }
            // Jika baris kosong, beri jarak, jika tidak bungkus paragraph
            if (line.trim() === '') {
                result += '<br />';
            } else {
                result += `<p class="mb-1">${line}</p>`;
            }
        }
    });

    if (inList) result += '</ul>';

    return result;
};

export default function ChatbotIndex({ auth, promptSuggestions = [] }) {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Halo! Saya asisten inventaris Anda. **Apa yang bisa saya bantu?**\n\nAnda bisa memilih contoh pertanyaan di menu samping atau ketik langsung.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State sidebar
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll ke bawah saat pesan baru masuk
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const sendMessage = async (messageText) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setIsSidebarOpen(false); // Tutup sidebar di mobile setelah memilih

        try {
            // Ambil history chat terakhir untuk konteks
            const history = messages.slice(-6).map(m => ({ 
                role: m.sender === 'user' ? 'user' : 'assistant', 
                content: m.text 
            }));

            const response = await axios.post(route('chatbot.ask'), {
                question: messageText,
                history: history,
            });

            const aiMessage = { sender: 'ai', text: response.data.answer };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = { sender: 'ai', text: 'Maaf, terjadi kesalahan koneksi. Mohon coba lagi.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            // Fokus kembali ke input di desktop
            if (window.innerWidth >= 1024) {
                setTimeout(() => inputRef.current?.focus(), 100);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
        setInput('');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="AI Assistant" />

            {/* Container Utama: Menggunakan tinggi viewport dinamis (dvh) agar pas di mobile browser */}
            <div className="flex h-[calc(100vh-65px)] overflow-hidden bg-gray-100 relative">
                
                {/* --- SIDEBAR (Desktop & Mobile Drawer) --- */}
                
                {/* Overlay Gelap (Hanya Mobile) */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Panel Sidebar */}
                <aside 
                    className={`
                        fixed lg:relative z-30 inset-y-0 left-0 
                        w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        flex flex-col h-full shadow-xl lg:shadow-none
                    `}
                >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Saran Pertanyaan
                        </h3>
                        {/* Tombol Tutup (Mobile Only) */}
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-red-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {promptSuggestions.length > 0 ? (
                            promptSuggestions.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setInput('');
                                        sendMessage(prompt);
                                    }}
                                    className="w-full text-left p-3 text-sm text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 rounded-lg transition-all duration-200 active:scale-95 shadow-sm"
                                >
                                    {prompt}
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm text-center italic mt-10">Belum ada saran tersedia.</p>
                        )}
                    </div>
                    
                    {/* Info Footer Sidebar */}
                    <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                        AI Inventory Assistant v1.0
                    </div>
                </aside>


                {/* --- MAIN CHAT AREA --- */}
                <main className="flex-1 flex flex-col h-full w-full bg-white relative">
                    
                    {/* Header Chat Mobile */}
                    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm z-10">
                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            AI Chat
                        </div>
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                            <span className="text-xs font-medium mr-1">Contoh</span>
                            <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>

                    {/* Area Pesan (Scrollable) */}
                    <div 
                        ref={chatContainerRef} 
                        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50 scroll-smooth"
                    >
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`
                                    flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%] 
                                    ${msg.sender === 'user' ? 'items-end' : 'items-start'}
                                `}>
                                    {/* Label Sender */}
                                    <span className="text-[10px] text-gray-400 mb-1 px-1">
                                        {msg.sender === 'user' ? 'Anda' : 'AI Assistant'}
                                    </span>
                                    
                                    {/* Bubble Chat */}
                                    <div 
                                        className={`
                                            px-4 py-3 rounded-2xl text-sm sm:text-base shadow-sm leading-relaxed
                                            ${msg.sender === 'user' 
                                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'}
                                        `}
                                    >
                                        <div 
                                            className="prose prose-sm max-w-none dark:prose-invert"
                                            dangerouslySetInnerHTML={{ __html: parseAiResponse(msg.text) }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start w-full animate-pulse">
                                <div className="flex items-center space-x-2 bg-gray-200 rounded-full px-4 py-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="bg-white p-3 sm:p-4 border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ketik pertanyaan Anda..."
                                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full py-2.5 px-4 shadow-sm text-sm sm:text-base disabled:bg-gray-50"
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className={`
                                    inline-flex items-center justify-center rounded-full p-2.5 sm:px-6 sm:py-2.5 
                                    font-semibold text-white transition-all duration-200 shadow-md
                                    ${isLoading || !input.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}
                                `}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin w-5 h-5 sm:mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <span className="hidden sm:inline">Kirim</span>
                                        <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </main>
            </div>
        </AuthenticatedLayout>
    );
}