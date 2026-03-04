'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, UploadCloud, Target, Type, AlignLeft, Calendar as CalendarIcon, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateCampaignPage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // Form Stats
    const [formData, setFormData] = useState({
        title: '',
        target_amount: '',
        start_date: '',
        end_date: '',
        description: '',
    });

    const [flyerPreview, setFlyerPreview] = useState<string | null>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Mock preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFlyerPreview(reader.result as string);
            };
            // Note: In real app, we upload to Supabase Storage and get URL
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Mock API Call
        setTimeout(() => {
            setIsSaving(false);
            alert('Program Donasi berhasil dibuat! (Mock)');
            router.push('/admin/donations');
        }, 1500);
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 pb-24 relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-transparent pointer-events-none"></div>

            {/* Header */}
            <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-5 py-5 sticky top-0 z-40 border-b border-white/20 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <Link href="/admin/donations" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">Buat Program Baru</h1>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">PENGGALANGAN DANA</p>
                    </div>
                </div>
            </header>

            <main className="px-5 mt-6 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Flyer Upload Box */}
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/40 dark:border-white/10 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                            <ImageIcon size={18} className="text-pink-500" />
                            Poster / Flyer Kampanye
                        </h3>

                        <div className="relative">
                            <input
                                type="file"
                                id="flyer-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                            <label
                                htmlFor="flyer-upload"
                                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden relative group
                                    ${flyerPreview
                                        ? 'border-transparent'
                                        : 'border-pink-300/50 dark:border-pink-800/50 bg-pink-50/50 dark:bg-pink-900/10 hover:bg-pink-100/50 dark:hover:bg-pink-900/20'}`}
                            >
                                {flyerPreview ? (
                                    <>
                                        <img src={flyerPreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <div className="bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 font-semibold">
                                                <UploadCloud size={18} /> Ganti Poster
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-pink-100 dark:border-pink-900/30 text-pink-500">
                                            <UploadCloud size={24} />
                                        </div>
                                        <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Upload Poster</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Rekomendasi rasio 16:9 atau 4:3</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Main Details */}
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/40 dark:border-white/10 shadow-sm space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-1.5">
                                <Type size={14} className="text-pink-500" />
                                Judul Program
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Misal: Renovasi Atap Masjid Al-Ikhlas"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all placeholder:text-slate-400 placeholder:font-normal"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-1.5">
                                <Target size={14} className="text-pink-500" />
                                Target Dana (Rp)
                            </label>
                            <input
                                required
                                type="number"
                                placeholder="50000000"
                                value={formData.target_amount}
                                onChange={e => setFormData({ ...formData, target_amount: e.target.value })}
                                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all placeholder:text-slate-400 placeholder:font-normal"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-1.5">
                                    <CalendarIcon size={14} className="text-pink-500" />
                                    Tanggal Mulai
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={formData.start_date}
                                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-3 py-3 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all appearance-none uppercase"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-1.5">
                                    <CalendarIcon size={14} className="text-slate-400" />
                                    Tanggal Selesai
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={formData.end_date}
                                    onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-3 py-3 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all appearance-none uppercase"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-1.5">
                                <AlignLeft size={14} className="text-pink-500" />
                                Narasi / Deskripsi
                            </label>
                            <textarea
                                required
                                rows={5}
                                placeholder="Ceritakan urgensi kebutuhan dana ini untuk meyakinkan calon donatur..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-4 py-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all resize-none placeholder:text-slate-400 leading-relaxed"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                                ${isSaving
                                    ? 'bg-slate-200 text-slate-400 shadow-none'
                                    : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            {isSaving ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full"
                                />
                            ) : (
                                <>
                                    <Save size={20} className="drop-shadow-sm" />
                                    <span>Simpan & Terbitkan</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
