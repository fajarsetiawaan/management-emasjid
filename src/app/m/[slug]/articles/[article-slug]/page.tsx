'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { getArticleBySlug, type Article } from '@/services/articles';

export default function PublicArticleDetailPage({ params }: { params: Promise<{ slug: string; 'article-slug': string }> }) {
    const resolvedParams = use(params);
    const mosqueSlug = resolvedParams.slug;
    const articleSlug = resolvedParams['article-slug'];

    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getArticleBySlug(articleSlug).then(data => {
            setArticle(data);
            setIsLoading(false);
        });
    }, [articleSlug]);

    // Simplified getCategoryStyle since we are mimicking a cleaner design
    // The design doesn't prominently feature categories in the same way, 
    // but if needed we can keep it subtle.
    const _getCategoryStyle = (category: string): string => {
        switch (category) {
            case 'PENGUMUMAN': return 'bg-blue-100 text-blue-700';
            case 'KAJIAN': return 'bg-purple-100 text-purple-700';
            case 'KEGIATAN': return 'bg-orange-100 text-orange-700';
            case 'EDUKASI': return 'bg-emerald-100 text-emerald-700';
            case 'INFAQ': return 'bg-pink-100 text-pink-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: article?.title || 'Artikel Masjid',
                url: window.location.href,
            });
        } catch {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link berhasil disalin!');
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4 px-6">
                <Newspaper className="text-slate-300 dark:text-slate-600" size={64} />
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 text-center">Artikel Tidak Ditemukan</h2>
                <Link href={`/m/${mosqueSlug}/articles`} className="text-sm font-bold text-blue-600 hover:text-blue-700">
                    ← Kembali ke Daftar Artikel
                </Link>
            </div>
        );
    }

    const formattedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '10 Jan, 2020';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex justify-center transition-colors duration-300">
            {/* Mobile Layout Container */}
            <div className="w-full max-w-[480px] bg-white dark:bg-[#0B1120] min-h-screen shadow-2xl relative flex flex-col overflow-hidden">

                {/* Subtle Ambient Top Background (matches the reference image's gradient) */}
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-100/40 via-blue-50/20 to-transparent dark:from-blue-900/20 dark:via-blue-900/10 z-0 pointer-events-none" />

                {/* Floating Header Actions (Absolute positioned over content) */}
                <header className="absolute top-0 left-0 w-full z-50 px-5 py-6 flex items-center justify-between">
                    <Link href={`/m/${mosqueSlug}/articles`} className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-[0_4px_16px_rgba(30,58,138,0.08)] border border-white dark:border-slate-800 flex items-center justify-center transition-transform active:scale-95">
                        <ArrowLeft size={18} className="text-slate-700 dark:text-slate-300" />
                    </Link>
                    <button
                        onClick={handleShare}
                        className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-[0_4px_16px_rgba(30,58,138,0.08)] border border-white dark:border-slate-800 flex items-center justify-center transition-transform active:scale-95"
                    >
                        <Share2 size={16} className="text-slate-700 dark:text-slate-300" />
                    </button>
                </header>

                <main className="flex-1 relative z-10 px-5 pt-[88px] pb-10">
                    {/* Banner Image */}
                    {article.flyer_url && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full aspect-[4/3] sm:aspect-[16/10] relative rounded-[28px] overflow-hidden mb-8 shadow-[0_12px_32px_rgba(0,0,0,0.08)] bg-slate-100 dark:bg-slate-800"
                        >
                            <img src={article.flyer_url} alt={article.title} className="w-full h-full object-cover" />
                        </motion.div>
                    )}

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-[24px] sm:text-[28px] font-extrabold text-[#1e293b] dark:text-white leading-[1.3] mb-6 tracking-tight pr-2"
                    >
                        {article.title}
                    </motion.h1>

                    {/* Meta Info (Author & Date) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100 dark:border-slate-800/60"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-50 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center shrink-0">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.author_name)}&background=eff6ff&color=3b82f6&bold=true`} alt={article.author_name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold text-slate-500 dark:text-slate-400 text-[13px] tracking-wide">{article.author_name}</span>
                        </div>
                        <span className="text-[13px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide uppercase">{formattedDate}</span>
                    </motion.div>

                    {/* Article Body */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-[16px] text-[#64748b] dark:text-slate-400 leading-[1.8] whitespace-pre-line tracking-wide font-medium"
                    >
                        {article.content}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
