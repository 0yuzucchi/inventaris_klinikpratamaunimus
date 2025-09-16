import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';

// Komponen Input dengan gaya abu-abu muda, disesuaikan dengan desain baru
function InputWithIcon({ id, type, name, value, onChange, placeholder, icon, autoComplete, hasError }) {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                {icon}
            </div>
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`block w-full rounded-xl border-transparent bg-gray-100 pl-12 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm h-14 placeholder:text-gray-500 ${hasError ? 'ring-2 ring-red-500' : ''}`}
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

// Komponen Utama Halaman Login
export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Masuk" />
            {/* Latar belakang: Putih di mobile, Abu-abu pucat di desktop */}
            <div className="flex min-h-screen items-center justify-center bg-white p-4 font-sans md:bg-slate-100">
                {/* Wrapper utama: menjadi 'card' yang lebar hanya di desktop */}
                <div className="w-full max-w-5xl md:overflow-hidden md:rounded-2xl md:bg-white md:shadow-xl">
                    <div className="flex flex-col md:flex-row">
                        
                        {/* [HANYA DESKTOP] Kolom Kiri - Ilustrasi */}
                        <div className="hidden w-full items-center justify-center bg-green-50 p-12 md:flex md:w-1/2">
                             <img 
                                src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/login-animation.svg " 
                                alt="Clinic Illustration" 
                                className="w-full h-auto max-w-md" 
                            />
                        </div>

                        {/* Konten Utama (Mobile & Kolom Kanan Desktop) */}
                        <div className="w-full px-4 py-8 md:w-1/2 md:p-16">
                            
                            {/* --- HEADER --- */}
                            {/* [HANYA MOBILE] Header besar dan terpusat */}
                            <div className="flex flex-col items-center text-center mb-10 md:hidden">
                                <img 
                                    src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/logo_klinik.png " 
                                    alt="Logo Klinik Unimus" 
                                    className="h-24 w-24 mb-5"
                                />
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                    Inventaris Klinik <br/> Pratama UNIMUS
                                </h1>
                                <p className="text-gray-500 mt-2">Selamat Datang!</p>
                            </div>
                            
                            {/* [HANYA DESKTOP] Header ringkas dan rata kiri */}
                            <div className="hidden md:flex flex-col items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <img src="https://gfztdbbmjoniayvycnsb.supabase.co/storage/v1/object/public/inventaris-fotos/aset/logo_klinik.png " alt="Logo Klinik Unimus" className="h-14 w-14" />
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800 leading-tight">Inventaris Klinik</h2>
                                        <h2 className="text-lg font-bold text-gray-800 leading-tight">Pratama UNIMUS</h2>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-500">Selamat Datang!</p>
                            </div>

                            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                            {errors.email && <p className="mb-4 text-sm text-red-600">{errors.email}</p>}

                            {/* --- FORM LOGIN --- */}
                            <form onSubmit={submit} className="space-y-5">
                                <LabelInputContainer label="Email Pengguna:">
                                    <InputWithIcon
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Alamat Email" // Placeholder untuk mobile
                                        icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer label="Password Pengguna:">
                                    <InputWithIcon
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kata Sandi" // Placeholder untuk mobile
                                        icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                                    />
                                </LabelInputContainer>

                                <div className="text-right text-sm">
                                    <Link href={route('password.request')} className="font-medium text-green-600 hover:text-green-500">
                                        Lupa kata sandi?
                                    </Link>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full rounded-xl bg-green-600 px-4 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 h-14">
                                    Login
                                </button>
                            </form>

                            {/* --- PEMISAH DAN TOMBOL REGISTER --- */}
                            {/* [HANYA DESKTOP] Pemisah "Atau" dan Tombol Register Outline */}
                            {/* <div className="hidden md:block">
                                <div className="flex items-center my-6">
                                    <hr className="flex-grow border-gray-300" />
                                    <span className="px-4 text-sm text-gray-500">Atau</span>
                                    <hr className="flex-grow border-gray-300" />
                                </div>
                                <Link 
                                    href={route('register')}
                                    className="flex h-14 w-full items-center justify-center rounded-xl border border-green-600 text-base font-semibold text-green-600 transition hover:bg-green-50"
                                >
                                    Register
                                </Link>
                            </div> */}

                            {/* [HANYA MOBILE] Link Daftar di bawah */}
                            {/* <div className="mt-8 text-center text-sm text-gray-600 md:hidden">
                                Belum memiliki akun?{' '}
                                <Link href={route('register')} className="font-medium text-green-600 hover:text-green-500">
                                    Daftar sekarang
                                </Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}