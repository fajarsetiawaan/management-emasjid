'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, User, Tag, Eye, Share2, Trash2, Edit3, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { getArticleBySlug, type Article } from '@/services/articles';

export default function ArticleDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getArticleBySlug(slug).then(data => {
            setArticle(data);
            setIsLoading(false);
        });
    }, [slug]);

    const getCategoryStyle = (category: string): string => {
        switch (category) {
            case 'PENGUMUMAN': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'KAJIAN': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'KEGIATAN': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'EDUKASI': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'INFAQ': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusStyle = (status: string): string => {
        switch (status) {
            case 'PUBLISHED': return 'bg-emerald-100 text-emerald-700';
            case 'DRAFT': return 'bg-amber-100 text-amber-700';
            case 'ARCHIVED': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusLabel = (status: string): string => {
        switch (status) {
            case 'PUBLISHED': return 'Terbit';
            case 'DRAFT': return 'Draft';
            case 'ARCHIVED': return 'Arsip';
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
                <Newspaper className="text-slate-300 dark:text-slate-600" size={64} />
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Artikel Tidak Ditemukan</h2>
                <Link href="/admin/articles" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                    ← Kembali ke Daftar Artikel
                </Link>
            </div>
        );
    }

    const formattedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Belum diterbitkan';

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 relative pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
                <div className="px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/articles" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <ArrowLeft size={18} className="text-slate-600 dark:text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate max-w-[200px]">Detail Artikel</h1>
                            <div className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(article.status)}`}>
                                {getStatusLabel(article.status)}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <Share2 size={16} className="text-slate-500" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <Edit3 size={16} className="text-slate-500" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                            <Trash2 size={16} className="text-red-500" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10">
                {/* Banner Image */}
                {article.flyer_url ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full aspect-video relative overflow-hidden"
                    >
                        <img src={article.flyer_url} alt={article.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </motion.div>
                ) : (
                    <div className="w-full h-48 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                        <Newspaper className="text-slate-400/50" size={64} />
                    </div>
                )}

                {/* Content */}
                <div className="px-6 -mt-4 relative z-10">
                    {/* Title Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-100 dark:border-slate-800"
                    >
                        {/* Category Badge */}
                        <div className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider mb-3 ${getCategoryStyle(article.category)}`}>
                            {article.category}
                        </div>

                        {/* Title */}
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                            {article.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <User size={14} className="text-slate-400" />
                                <span className="font-medium">{article.author_name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CalendarDays size={14} className="text-slate-400" />
                                <span className="font-medium">{formattedDate}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Row (Dummy) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-3 gap-3 mt-4"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-800">
                            <Eye size={16} className="mx-auto text-blue-500 mb-1" />
                            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">128</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Views</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-800">
                            <Share2 size={16} className="mx-auto text-emerald-500 mb-1" />
                            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">24</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shares</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-800">
                            <Tag size={16} className="mx-auto text-purple-500 mb-1" />
                            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{article.category}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</p>
                        </div>
                    </motion.div>

                    {/* Article Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-5 mt-4 shadow-sm border border-slate-100 dark:border-slate-800"
                    >
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Isi Artikel</h3>
                        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                            {article.content}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
