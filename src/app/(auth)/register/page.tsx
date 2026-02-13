'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Building2, User, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Mock Form Data
    const [formData, setFormData] = useState({
        masjidName: 'Masjid Raya Bintaro',
        city: 'Tangerang Selatan',
        address: 'Jl. Merpati Raya No. 1, Bintaro Jaya Sektor 1',
        adminName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { data, error } = await authClient.signUp.email({
            email: formData.email,
            password: formData.password,
            name: formData.adminName,
            image: undefined, // Optional
        });

        setIsLoading(false);

        if (error) {
            alert(error.message); // Simple alert for now, can be improved
        } else {
            setStep(3); // Success State
            // Auto-redirect
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 3000);
        }
    };

    return (
        <div>
            {/* Header (Hidden on Success) */}
            {step < 3 && (
                <div className="text-center mb-8">
                    <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 mb-6 transition-colors">
                        <ArrowLeft size={16} /> Kembali ke Login
                    </Link>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className={`h-2 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        <div className={`h-2 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {step === 1 ? 'Data Masjid' : 'Akun Pengurus'}
                    </h1>
                    <p className="text-slate-500 text-sm">Langkah {step} dari 2</p>
                </div>
            )}

            {/* Wizard Content */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleNext}
                            className="space-y-5"
                        >
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Nama Masjid</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                        placeholder="Contoh: Masjid Raya Bintaro"
                                        value={formData.masjidName}
                                        onChange={e => setFormData({ ...formData, masjidName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Kota / Kabupaten</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                    <select
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none transition-all text-slate-800 font-medium appearance-none"
                                        required
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    >
                                        <option value="">Pilih Kota...</option>
                                        <option value="Jakarta">Jakarta</option>
                                        <option value="Bogor">Bogor</option>
                                        <option value="Depok">Depok</option>
                                        <option value="Tangerang">Tangerang</option>
                                        <option value="Bekasi">Bekasi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Alamat Singkat</label>
                                <textarea
                                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium resize-none h-24"
                                    placeholder="Jl. Merpati No. 10, RT 01/02..."
                                    required
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                Lanjut ke Akun Pengurus <ArrowRight size={20} />
                            </button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Nama Lengkap (Ketua/Admin)</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                        placeholder="H. Budi Santoso"
                                        value={formData.adminName}
                                        onChange={e => setFormData({ ...formData, adminName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                    placeholder="budi@masjid.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="space-y-1.5 flex-1">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                        placeholder="******"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5 flex-1">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Konfirmasi</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                        placeholder="******"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={20} />
                                            Bismillah, Buat Akun
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center text-center h-full py-12"
                        >
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 animate-pulse">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Alhamdulillah!</h2>
                            <p className="text-slate-500 mb-8">Akun masjid berhasil dibuat.</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                                Mengalihkan ke Dashboard...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
