import { Head, Link, useForm } from '@inertiajs/react';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

// Komponen Input dengan gaya abu-abu muda, disesuaikan dengan desain
function InputWithIcon({ id, placeholder, icon, ...props }) {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                {icon}
            </div>
            <input
                id={id}
                {...props}
                placeholder={placeholder}
                className={`block w-full rounded-xl border-transparent bg-gray-100 pl-12 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm h-14 placeholder:text-gray-500`}
            />
        </div>
    );
}

// Komponen untuk menggabungkan Label (hanya desktop) dan Input
function LabelInputContainer({ label, children }) {
    return (
        <div>
            {/* Label ini hanya akan muncul di layar desktop (md dan lebih besar) */}
            <label htmlFor={children.props.id} className="hidden md:block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {children}
        </div>
    );
}

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Lupa Kata Sandi" />

            {/* Latar belakang: Putih di mobile, Abu-abu pucat di desktop */}
            <div className="flex min-h-screen items-center justify-center bg-white p-4 font-sans md:bg-slate-100">
                {/* Wrapper utama: menjadi 'card' yang lebar hanya di desktop */}
                <div className="w-full max-w-5xl md:overflow-hidden md:rounded-2xl md:bg-white md:shadow-xl">
                    <div className="flex flex-col md:flex-row">
                        
                        {/* [HANYA DESKTOP] Kolom Kiri - Ilustrasi */}
                        <div className="hidden w-full items-center justify-center bg-green-50 p-12 md:flex md:w-1/2">
                             <img 
                                src="/images/login-animation.svg" 
                                alt="Clinic Illustration" 
                                className="w-full h-auto max-w-md" 
                            />
                        </div>

                        {/* Konten Utama (Mobile & Kolom Kanan Desktop) */}
                        <div className="w-full px-4 py-8 md:w-1/2 md:p-16">
                            
                            {/* --- HEADER --- */}
                            {/* Menggunakan perataan teks untuk responsivitas */}
                            <div className="text-center md:text-left mb-8">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Lupa Kata Sandi?
                                </h1>
                                <p className="text-gray-500 mt-4 max-w-md mx-auto md:mx-0">
                                    Tidak Masalah. Cukup beritahu kami alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                                </p>
                            </div>

                            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                            {errors.email && <p className="mb-4 text-sm text-red-600">{errors.email}</p>}

                            {/* --- FORM --- */}
                            <form onSubmit={submit} className="space-y-6">
                                <LabelInputContainer label="Email Pengguna:">
                                    <InputWithIcon
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Alamat Email Anda" // Placeholder untuk mobile
                                        required
                                        autoFocus
                                        icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                                    />
                                </LabelInputContainer>

                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full rounded-xl bg-green-600 px-4 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 h-14">
                                    Kirim Tautan Reset
                                </button>
                            </form>

                            {/* --- Link Kembali ke Login --- */}
                            <div className="mt-8 text-center">
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
                                >
                                    <ArrowLeftIcon className="h-4 w-4" />
                                    Kembali ke Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}   