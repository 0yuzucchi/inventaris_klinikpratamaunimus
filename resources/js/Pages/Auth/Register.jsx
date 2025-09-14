import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';

// Komponen Input dengan gaya baru (latar biru muda) agar cocok dengan desain desktop
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
                // Gaya input diubah menjadi biru muda agar sesuai dengan layout desktop baru
                className={`block w-full rounded-xl border-transparent bg-indigo-50 pl-12 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm h-14 placeholder:text-gray-500 ${hasError ? 'ring-2 ring-red-500' : ''}`}
            />
        </div>
    );
}

// Komponen Utama Halaman Registrasi
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Buat Akun" />
            
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
                            {/* [HANYA MOBILE] Header besar dan terpusat untuk mobile */}
                            <div className="flex flex-col items-center text-center mb-10 md:hidden">
                                <img 
                                    src="/images/logoklinik.png" 
                                    alt="Logo Klinik Unimus" 
                                    className="h-24 w-24 mb-5"
                                />
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                    Inventaris Klinik <br/> Pratama UNIMUS
                                </h1>
                                <p className="text-gray-500 mt-2">
                                    Buat Akun Baru Anda
                                </p>
                            </div>
                            
                            {/* [HANYA DESKTOP] Header ringkas dan rata kiri untuk desktop */}
                            <div className="hidden md:block">
                                <div className="flex items-center gap-4 mb-4">
                                    <img src="/images/logoklinik.png" alt="Logo Klinik Unimus" className="h-14 w-14" />
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800 leading-tight">Inventaris Klinik</h2>
                                        <h2 className="text-lg font-bold text-gray-800 leading-tight">Pratama UNIMUS</h2>
                                    </div>
                                </div>
                                <p className="mb-8 text-gray-500">Buat Akun Baru Anda</p>
                            </div>


                            {/* --- FORM REGISTRASI --- */}
                            <form onSubmit={submit} className="space-y-5">
                                {/* Input Nama Lengkap */}
                                <div>
                                    <InputWithIcon
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nama Lengkap"
                                        autoComplete="name"
                                        hasError={!!errors.name}
                                        icon={<UserIcon className="h-5 w-5 text-gray-400" />}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                
                                {/* Input lainnya tidak berubah */}
                                <div>
                                    <InputWithIcon
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Alamat Email"
                                        autoComplete="username"
                                        hasError={!!errors.email}
                                        icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>
                                <div>
                                    <InputWithIcon
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kata Sandi"
                                        autoComplete="new-password"
                                        hasError={!!errors.password}
                                        icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                </div>
                                <div>
                                     <InputWithIcon
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Konfirmasi Kata Sandi"
                                        autoComplete="new-password"
                                        hasError={!!errors.password_confirmation}
                                        icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                                    />
                                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                                </div>

                                {/* Tombol Daftar */}
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full rounded-xl bg-green-600 px-4 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 h-14">
                                    Daftar
                                </button>
                            </form>
                            
                            {/* Link ke Halaman Login */}
                            <div className="mt-8 text-center text-sm text-gray-600">
                                Sudah memiliki akun?{' '}
                                <Link href={route('login')} className="font-medium text-green-600 hover:text-green-500">
                                    Masuk sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}