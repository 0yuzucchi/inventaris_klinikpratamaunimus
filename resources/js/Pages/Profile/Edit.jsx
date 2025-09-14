import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            // Menambahkan warna teks untuk mode gelap pada header
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* --- KARTU UTAMA BARU --- */}
                    {/* Menambahkan warna latar belakang dan bayangan untuk mode gelap pada kartu */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                        
                        {/* Bagian Informasi Profil */}
                        <div className="p-6 sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        {/* Menambahkan warna border untuk mode gelap */}
                        <hr className="border-slate-200 dark:border-slate-700" />
                        
                        {/* Bagian Ubah Kata Sandi */}
                        <div className="p-6 sm:p-8">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        {/* Menambahkan warna border untuk mode gelap */}
                        <hr className="border-slate-200 dark:border-slate-700" />

                        {/* Bagian Hapus Akun */}
                        <div className="p-6 sm:p-8">
                            <DeleteUserForm className="max-w-xl" />
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}