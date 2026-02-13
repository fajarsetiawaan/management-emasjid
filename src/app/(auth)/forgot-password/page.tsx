'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock API Call
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="text-center mb-8">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 mb-6 transition-colors">
                    <ArrowLeft size={16} /> Kembali ke Login
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Lupa Kata Sandi?</h1>
                <p className="text-slate-500">
                    Masukkan email yang terdaftar. Kami akan mengirimkan link untuk mereset kata sandi Anda.
                </p>
            </div>

            {/* Form */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                {!isSent ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Kirim Link Reset
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6"
                    >
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                            <Mail size={32} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Email Terkirim!</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Silakan periksa kotak masuk (dan spam) Anda untuk instruksi selanjutnya.
                        </p>
                        <button
                            onClick={() => setIsSent(false)}
                            className="text-sm font-bold text-emerald-600 hover:underline"
                        >
                            Kirim ulang?
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
