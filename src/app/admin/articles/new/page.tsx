'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Image, Save, Send, Newspaper } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
    { value: 'PENGUMUMAN', label: 'Pengumuman', color: 'bg-blue-100 text-blue-600' },
    { value: 'KAJIAN', label: 'Kajian', color: 'bg-purple-100 text-purple-600' },
    { value: 'KEGIATAN', label: 'Kegiatan', color: 'bg-orange-100 text-orange-600' },
    { value: 'EDUKASI', label: 'Edukasi', color: 'bg-emerald-100 text-emerald-600' },
    { value: 'INFAQ', label: 'Infaq', color: 'bg-pink-100 text-pink-600' },
];

export default function NewArticlePage() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('PENGUMUMAN');
    const [flyerUrl, setFlyerUrl] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('H. Ahmad Dahlan');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveDraft = () => {
        setIsSaving(true);
        // TODO: Simpan ke Supabase
        setTimeout(() => {
            setIsSaving(false);
            alert('Artikel berhasil disimpan sebagai draft!');
        }, 1000);
    };

    const handlePublish = () => {
        if (!title.trim()) {
            alert('Judul artikel wajib diisi!');
            return;
        }
        setIsSaving(true);
        // TODO: Simpan dan publish ke Supabase
        setTimeout(() => {
            setIsSaving(false);
            alert('Artikel berhasil diterbitkan!');
        }, 1000);
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 relative pb-24">
            {/* Ambient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-blue-500/10 animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-indigo-500/10 animate-blob animation-delay-2000" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
                <div className="px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/articles" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <ArrowLeft size={18} className="text-slate-600 dark:text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Buat Artikel</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tulis berita atau pengumuman baru</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 px-6 pt-6 flex flex-col gap-5 max-w-2xl mx-auto">
                {/* Flyer Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full aspect-video rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    {flyerUrl ? (
                        <img src={flyerUrl} alt="Preview Flyer" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                            <Newspaper className="text-slate-300 dark:text-slate-600" size={48} />
                            <span className="text-xs text-slate-400 font-medium">Preview gambar banner</span>
                        </div>
                    )}
                </motion.div>

                {/* Flyer URL */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">URL Gambar Banner</label>
                    <div className="relative">
                        <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={flyerUrl}
                            onChange={(e) => setFlyerUrl(e.target.value)}
                            className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Judul Artikel *</label>
                    <input
                        type="text"
                        placeholder="Contoh: Jadwal Tarawih Ramadhan 1447 H"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                </motion.div>

                {/* Category */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Kategori</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setCategory(cat.value)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${category === cat.value
                                        ? `${cat.color} border-transparent ring-2 ring-blue-500/20 scale-105`
                                        : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Author */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Penulis</label>
                    <input
                        type="text"
                        placeholder="Nama penulis"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                </motion.div>

                {/* Excerpt */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                        Ringkasan <span className="text-slate-300 dark:text-slate-600 font-normal normal-case">(maks 200 karakter)</span>
                    </label>
                    <textarea
                        placeholder="Ringkasan singkat yang akan tampil di preview..."
                        maxLength={200}
                        rows={2}
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none"
                    />
                    <p className="text-[10px] text-slate-400 text-right mt-1">{excerpt.length}/200</p>
                </motion.div>

                {/* Content */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Isi Artikel / Narasi</label>
                    <textarea
                        placeholder="Tulis narasi lengkap artikel Anda di sini..."
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none leading-relaxed"
                    />
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex gap-3 pb-8"
                >
                    <button
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        className="flex-1 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        <Save size={16} />
                        Simpan Draft
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isSaving}
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                    >
                        <Send size={16} />
                        Terbitkan Sekarang
                    </button>
                </motion.div>
            </main>
        </div>
    );
}
