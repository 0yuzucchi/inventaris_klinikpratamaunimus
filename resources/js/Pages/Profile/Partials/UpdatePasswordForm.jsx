import { useRef } from 'react';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Ubah Kata Sandi</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kata Sandi Saat Ini</label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 dark:text-slate-200 border-transparent shadow-sm px-4 py-2 focus:border-green-500 focus:ring-green-500"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kata Sandi Baru</label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 dark:text-slate-200 border-transparent shadow-sm px-4 py-2 focus:border-green-500 focus:ring-green-500"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Konfirmasi Kata Sandi</label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 dark:text-slate-200 border-transparent shadow-sm px-4 py-2 focus:border-green-500 focus:ring-green-500"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <button disabled={processing} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50">
                        Simpan
                    </button>
                    <Transition
                        show={recentlySuccessful}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-slate-600 dark:text-slate-400">Tersimpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}