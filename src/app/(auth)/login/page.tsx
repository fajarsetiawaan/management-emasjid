'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (!email.includes('@')) {
            setError('Format email tidak valid');
            return;
        }
        if (password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }

        setIsLoading(true);

        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        setIsLoading(false);

        if (error) {
            setError(error.message || 'Gagal masuk. Periksa email dan password Anda.');
        } else {
            router.push('/admin/dashboard');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200 text-white transform rotate-3">
                    <Building2 size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Assalamu'alaikum,</h1>
                <p className="text-slate-500">Silakan masuk untuk mengelola masjid.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="space-y-5">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                placeholder="bendahara@masjid.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                placeholder="******"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-rose-500 text-sm font-medium bg-rose-50 p-3 rounded-lg flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {error}
                        </p>
                    )}

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                            Lupa Kata Sandi?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Memuat...
                            </>
                        ) : (
                            'Masuk'
                        )}
                    </button>
                </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
                <div className="h-[1px] bg-slate-200 flex-1" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atau</span>
                <div className="h-[1px] bg-slate-200 flex-1" />
            </div>

            {/* Register CTA */}
            <div className="text-center">
                <p className="text-slate-500 mb-2">Masjid Anda belum terdaftar?</p>
                <Link
                    href="/welcome"
                    className="inline-flex items-center justify-center font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-6 py-3 rounded-xl transition-colors"
                >
                    Daftarkan Masjid Sekarang
                </Link>
            </div>
        </motion.div>
    );
}
