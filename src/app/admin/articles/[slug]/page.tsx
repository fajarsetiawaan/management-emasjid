'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, User, Tag, Eye, Share2, Trash2, Edit3, Newspaper, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { getArticleBySlug, type Article } from '@/services/articles';

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        getArticleBySlug(slug).then(data => {
            setArticle(data);
            setIsLoading(false);
        });
    }, [slug]);

    const getCategoryStyle = (category: string): string => {
        switch (category) {
            case 'PENGUMUMAN': return 'bg-[#EBF3FF] text-[#2563EB] dark:bg-blue-900/30 dark:text-blue-400';
            case 'KAJIAN': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'KEGIATAN': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'EDUKASI': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'INFAQ': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusStyle = (status: string): string => {
        switch (status) {
            case 'PUBLISHED': return 'bg-[#D1FAE5] text-[#059669]';
            case 'DRAFT': return 'bg-amber-100 text-amber-700';
            case 'ARCHIVED': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusLabel = (status: string): string => {
        switch (status) {
            case 'PUBLISHED': return 'TERBIT';
            case 'DRAFT': return 'DRAFT';
            case 'ARCHIVED': return 'ARSIP';
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-950">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-slate-950 gap-4">
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
        <div className="bg-[#F8FAFC] dark:bg-slate-950 min-h-screen transition-colors duration-300 relative pb-24 font-sans" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
            {/* Header (Top Nav) */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-950/90 backdrop-blur-xl transition-colors duration-300">
                <div className="px-5 py-3 flex justify-between items-center relative">

                    {/* Back Button */}
                    <Link href="/admin/articles" className="w-10 h-10 rounded-full bg-[#F1F5F9] dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10 shrink-0">
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                    </Link>

                    {/* Center Title & Status */}
                    <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none">
                        <h1 className="text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-tight">Detail Artikel</h1>
                        <span className={`inline-block px-2 py-[2px] rounded-md text-[10px] font-extrabold uppercase tracking-wider mt-0.5 ${getStatusStyle(article.status)}`}>
                            {getStatusLabel(article.status)}
                        </span>
                    </div>

                    {/* Right Actions Dropdown */}
                    <div className="relative z-20 shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                            className="w-10 h-10 rounded-full bg-[#F1F5F9] dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <MoreVertical size={20} className="text-slate-600 dark:text-slate-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute top-12 right-0 w-48 bg-white dark:bg-slate-800 rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors pointer-events-auto text-left">
                                    <Share2 size={16} className="text-slate-500 shrink-0" />
                                    <span>Bagikan</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors pointer-events-auto text-left">
                                    <Edit3 size={16} className="text-slate-500 shrink-0" />
                                    <span>Edit Artikel</span>
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-1 mx-2"></div>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors pointer-events-auto text-left">
                                    <Trash2 size={16} className="shrink-0" />
                                    <span>Hapus Artikel</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="relative mx-auto max-w-[600px]">
                {/* Banner Image */}
                {article.flyer_url ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full aspect-[4/3] relative overflow-hidden"
                    >
                        <img src={article.flyer_url} alt={article.title} className="w-full h-full object-cover" />
                    </motion.div>
                ) : (
                    <div className="w-full aspect-[4/3] bg-gradient-to-b from-slate-200 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                        <Newspaper className="text-slate-400/50" size={64} />
                    </div>
                )}

                {/* Content Overlay */}
                <div className="px-5 -mt-6 relative z-10">
                    {/* Main Title Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white dark:border-slate-800 mb-4"
                    >
                        {/* Category Pill */}
                        <div className={`inline-block px-3 py-1 rounded-lg text-[11px] font-extrabold tracking-wider mb-4 ${getCategoryStyle(article.category)}`}>
                            {article.category}
                        </div>

                        {/* Article Title */}
                        <h2 className="text-[22px] font-bold text-[#0F172A] dark:text-white leading-[1.3] mb-5 tracking-tight">
                            {article.title}
                        </h2>

                        {/* Author & Date Box */}
                        <div className="flex items-center gap-6 text-[13px] text-[#64748B] dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-[#94A3B8]" />
                                <span>{article.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarDays size={16} className="text-[#94A3B8]" />
                                <span>{formattedDate}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-3 gap-3 mb-4"
                    >
                        {/* Box 1 */}
                        <div className="bg-white dark:bg-slate-900 rounded-[20px] py-4 px-2 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5">
                            <Eye size={18} className="text-[#3B82F6]" />
                            <p className="text-[20px] font-black text-[#0F172A] dark:text-slate-200 leading-none">128</p>
                            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">VIEWS</p>
                        </div>
                        {/* Box 2 */}
                        <div className="bg-white dark:bg-slate-900 rounded-[20px] py-4 px-2 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5">
                            <Share2 size={18} className="text-[#10B981]" />
                            <p className="text-[20px] font-black text-[#0F172A] dark:text-slate-200 leading-none">24</p>
                            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">SHARES</p>
                        </div>
                        {/* Box 3 */}
                        <div className="bg-white dark:bg-slate-900 rounded-[20px] py-4 px-2 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5">
                            <Tag size={18} className="text-[#A855F7]" />
                            <p className="text-[15px] font-black text-[#0F172A] dark:text-slate-200 leading-tight uppercase truncate w-full px-1">{article.category}</p>
                            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">KATEGORI</p>
                        </div>
                    </motion.div>

                    {/* Article Body Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50 dark:border-slate-800"
                    >
                        <h3 className="text-[14px] font-bold text-[#334155] dark:text-slate-300 mb-4 uppercase tracking-wider">
                            ISI ARTIKEL
                        </h3>
                        <div className="text-[15px] text-[#475569] dark:text-slate-400 leading-[1.8] whitespace-pre-line font-medium">
                            {article.content}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
