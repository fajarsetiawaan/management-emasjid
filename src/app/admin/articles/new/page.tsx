'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, UploadCloud, Type, AlignLeft, ImageIcon, Tag, User, FileText, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
    { value: 'PENGUMUMAN', label: 'Pengumuman', color: 'bg-blue-100 text-blue-600' },
    { value: 'KAJIAN', label: 'Kajian', color: 'bg-purple-100 text-purple-600' },
    { value: 'KEGIATAN', label: 'Kegiatan', color: 'bg-orange-100 text-orange-600' },
    { value: 'EDUKASI', label: 'Edukasi', color: 'bg-emerald-100 text-emerald-600' },
    { value: 'INFAQ', label: 'Infaq', color: 'bg-pink-100 text-pink-600' },
];

export default function NewArticlePage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: 'PENGUMUMAN',
        authorName: 'H. Ahmad Dahlan',
        excerpt: '',
        content: '',
    });

    const [flyerPreview, setFlyerPreview] = useState<string | null>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFlyerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveDraft = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Artikel berhasil disimpan sebagai draft! (Mock)');
            router.push('/admin/articles');
        }, 1000);
    };

    const handlePublish = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('Judul artikel wajib diisi!');
            return;
        }
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Artikel berhasil diterbitkan! (Mock)');
            router.push('/admin/articles');
        }, 1000);
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 pb-24 relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent pointer-events-none"></div>

            {/* Header */}
            <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-5 py-5 sticky top-0 z-40 border-b border-white/20 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">Buat Artikel Baru</h1>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">MANAJEMEN PUBLIKASI</p>
                    </div>
                </div>
            </header>

            <main className="px-5 mt-6 relative z-10 max-w-2xl mx-auto">
                <form className="space-y-6">

                    {/* Flyer Upload Box */}
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/40 dark:border-white/10 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                            <ImageIcon size={18} className="text-blue-500" />
                            Poster / Gambar Banner
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
                                        : 'border-blue-300/50 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100/50 dark:hover:bg-blue-900/20'}`}
                            >
                                {flyerPreview ? (
                                    <>
                                        <img src={flyerPreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <div className="bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 font-semibold">
                                                <UploadCloud size={18} /> Ganti Gambar
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-blue-100 dark:border-blue-900/30 text-blue-500">
                                            <UploadCloud size={24} />
                                        </div>
                                        <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">Upload Gambar Banner</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Rekomendasi rasio 16:9 atau 4:3</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Main Details */}
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/40 dark:border-white/10 shadow-sm space-y-5">

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-1.5">
                                <Type size={14} className="text-blue-500" />
                                Judul Artikel
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Contoh: Jadwal Imam Tarawih Ramadhan 1447 H"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder:text-slate-400 placeholder:font-normal"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-1.5">
                                <Tag size={14} className="text-blue-500" />
                                Kategori
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        type="button"
                                        key={cat.value}
                                        onClick={() => setFormData({ ...formData, category: cat.value })}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${formData.category === cat.value
                                            ? `${cat.color} border-transparent ring-2 ring-blue-500/20 scale-105 shadow-sm`
                                            : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Author */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-1.5">
                                <User size={14} className="text-blue-500" />
                                Nama Penulis
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Nama Penulis"
                                value={formData.authorName}
                                onChange={e => setFormData({ ...formData, authorName: e.target.value })}
                                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder:text-slate-400 placeholder:font-normal"
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-1.5">
                            <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                                <span className="flex items-center gap-1.5">
                                    <FileText size={14} className="text-blue-500" />
                                    Ringkasan Topik
                                </span>
                                <span className="text-[10px] text-slate-400 font-normal">{formData.excerpt.length}/200</span>
                            </label>
                            <textarea
                                required
                                rows={2}
                                maxLength={200}
                                placeholder="Tuliskan intisari dari artikel ini untuk di preview..."
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none placeholder:text-slate-400 leading-relaxed"
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-1.5">
                                <AlignLeft size={14} className="text-blue-500" />
                                Isi Artikel Lengkap
                            </label>
                            <textarea
                                required
                                rows={8}
                                placeholder="Jabarkan narasi lengkap artikel di sini..."
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl px-4 py-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none placeholder:text-slate-400 leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={isSaving}
                            className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50"
                        >
                            <Save size={18} />
                            <span>Simpan Draft</span>
                        </button>

                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={isSaving}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                                ${isSaving
                                    ? 'bg-slate-200 text-slate-400 shadow-none'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]'
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
                                    <Send size={18} className="drop-shadow-sm" />
                                    <span>Terbitkan</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
