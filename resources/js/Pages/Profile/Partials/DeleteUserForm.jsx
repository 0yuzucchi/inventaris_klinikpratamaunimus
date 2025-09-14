import { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Hapus Akun</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. Sebelum menghapus akun Anda, harap unduh data atau informasi apa pun yang ingin Anda simpan.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>Hapus Akun</DangerButton>

            {/* Asumsi: Komponen Modal telah dimodifikasi untuk memiliki latar belakang gelap, misal dark:bg-slate-800 */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Apakah Anda yakin ingin menghapus akun Anda?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. Silakan masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun Anda secara permanen.
                    </p>
                    <div className="mt-6">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-3/4 rounded-md bg-slate-100 dark:bg-slate-700 dark:text-slate-200 border-transparent shadow-sm px-4 py-2 focus:border-red-500 focus:ring-red-500"
                            placeholder="Password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        {/* Asumsi: Komponen SecondaryButton & DangerButton sudah mendukung mode gelap */}
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <DangerButton className="ml-3" disabled={processing}>
                            Hapus Akun
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}