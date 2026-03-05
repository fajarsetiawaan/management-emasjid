'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, CalendarDays, User, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { getPublishedArticles, type Article } from '@/services/articles';

const CATEGORY_FILTERS = [
    { value: 'ALL', label: 'Semua' },
    { value: 'PENGUMUMAN', label: 'Pengumuman' },
    { value: 'KAJIAN', label: 'Kajian' },
    { value: 'KEGIATAN', label: 'Kegiatan' },
    { value: 'EDUKASI', label: 'Edukasi' },
    { value: 'INFAQ', label: 'Infaq' },
];

export default function PublicArticlesPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [articles, setArticles] = useState<Article[]>([]);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPublishedArticles().then(data => {
            setArticles(data);
            setLoading(false);
        });
    }, []);

    const filteredArticles = activeCategory === 'ALL'
        ? articles
        : articles.filter(a => a.category === activeCategory);

    // Assume the first article is the "Breaking News" / Featured article if we are on 'ALL' category
    // Or just the first of the filtered articles.
    const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
    const listArticles = filteredArticles.slice(1);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex justify-center transition-colors duration-300">
            {/* Mobile Layout Container */}
            <div className="w-full max-w-[480px] bg-[#F8FAFC] dark:bg-slate-950 min-h-screen relative flex flex-col overflow-hidden">

                {/* Header Navbar */}
                <header className="sticky top-0 z-50 bg-[#F8FAFC]/90 dark:bg-slate-950/90 backdrop-blur-xl">
                    <div className="px-5 py-4 flex items-center justify-between">
                        <Link href={`/m/${slug}`} className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 flex items-center justify-center transition-transform active:scale-95">
                            <ArrowLeft size={18} className="text-slate-700 dark:text-slate-300" />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 px-5 pt-2 pb-24">
                    {/* Header Title */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                        <h1 className="text-[28px] font-extrabold text-[#334155] dark:text-white tracking-tight">Kabar Masjid</h1>
                    </motion.div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="text-center py-16">
                            <Newspaper className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada artikel.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory} // Animate when category changes
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Featured Article */}
                                {featuredArticle && (
                                    <Link href={`/m/${slug}/articles/${featuredArticle.slug}`}>
                                        <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_8px_24px_rgba(148,163,184,0.15)] dark:shadow-none dark:border dark:border-slate-800 p-4 mb-8 transition-transform active:scale-[0.98]">
                                            <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                                                {featuredArticle.flyer_url ? (
                                                    <img src={featuredArticle.flyer_url} alt={featuredArticle.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Newspaper className="text-slate-300 dark:text-slate-600" size={40} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-1">
                                                <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-[1.3] mb-4 tracking-tight line-clamp-2">
                                                    {featuredArticle.title}
                                                </h2>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-50 dark:bg-slate-800 border border-white dark:border-slate-700 items-center justify-center shrink-0">
                                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(featuredArticle.author_name)}&background=eff6ff&color=3b82f6&bold=true`} alt={featuredArticle.author_name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">{featuredArticle.author_name}</span>
                                                    </div>
                                                    <span className="text-[12px] font-medium text-slate-400 tracking-wide">
                                                        {featuredArticle.published_at ? new Date(featuredArticle.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                {/* Category Tabs (Minimalist with dot indicator) */}
                                <div className="flex items-center gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden mb-6 px-1">
                                    {CATEGORY_FILTERS.map(cat => {
                                        const isActive = activeCategory === cat.value;
                                        return (
                                            <button
                                                key={cat.value}
                                                onClick={() => setActiveCategory(cat.value)}
                                                className={`relative py-2 flex flex-col items-center gap-1.5 transition-colors whitespace-nowrap
                                                    ${isActive ? 'text-[#334155] dark:text-blue-400 font-bold' : 'text-slate-400 dark:text-slate-500 font-medium'}
                                                `}
                                            >
                                                {/* Tiny active dot above the text as in reference */}
                                                <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-[#334155] dark:bg-blue-400' : 'bg-transparent'}`} />
                                                <span className="text-[14px]">{cat.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* List Articles (Vertical) */}
                                <div className="flex flex-col gap-5 px-1">
                                    {listArticles.map((article, index) => (
                                        <motion.div
                                            key={article.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link href={`/m/${slug}/articles/${article.slug}`}>
                                                <div className="flex gap-4 items-center group active:scale-[0.98] transition-transform">
                                                    {/* Thumbnail */}
                                                    <div className="w-[100px] h-[100px] rounded-[20px] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 shadow-sm border border-slate-100 dark:border-slate-800/50 relative">
                                                        {article.flyer_url ? (
                                                            <img src={article.flyer_url} alt={article.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Newspaper className="text-slate-300 dark:text-slate-600" size={24} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 py-1">
                                                        <h3 className="font-bold text-[#1e293b] dark:text-white text-[15px] leading-[1.3] mb-3 line-clamp-2">
                                                            {article.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-[12px] text-slate-400 dark:text-slate-500 font-medium">
                                                            <div className="flex items-center gap-1.5">
                                                                <CalendarDays size={13} />
                                                                <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock size={13} />
                                                                <span>3 min read</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </main>
            </div>
        </div>
    );
}
