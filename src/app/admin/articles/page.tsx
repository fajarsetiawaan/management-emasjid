'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Plus, Search, FileText, BarChart3, Archive, ArrowRight, SlidersHorizontal, Check, MessageSquare, X, Heart, Eye, Send } from 'lucide-react';
import Link from 'next/link';
import { FilterDropdown, FilterTrigger, FilterContent, FilterItem } from '@/components/shared/FilterDropdown';
import AdminArticleCard from '@/components/features/articles/AdminArticleCard';
import { getArticles, type Article } from '@/services/articles';

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [activeDrawer, setActiveDrawer] = useState<'NONE' | 'CATEGORY' | 'STATS'>('NONE');
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getArticles().then(setArticles);
    }, []);

    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    // Calculate statistics
    const stats = {
        totalViews: articles.reduce((acc, a) => acc + (a.views || 0), 0),
        totalLikes: articles.reduce((acc, a) => acc + (a.likes || 0), 0),
        totalShares: articles.reduce((acc, a) => acc + (a.shares || 0), 0),
    };

    const catStats = {
        PENGUMUMAN: articles.filter(a => a.category === 'PENGUMUMAN').length,
        KAJIAN: articles.filter(a => a.category === 'KAJIAN').length,
        KEGIATAN: articles.filter(a => a.category === 'KEGIATAN').length,
        EDUKASI: articles.filter(a => a.category === 'EDUKASI').length,
        INFAQ: articles.filter(a => a.category === 'INFAQ').length,
    };

    // Filter articles
    const filteredArticles = articles.filter(art => {
        const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || art.status === filterStatus;
        const matchesCategory = filterCategory === 'ALL' || art.category === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 relative pb-24">
            {/* Abstract Ambient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-blue-500/10 animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-indigo-500/10 animate-blob animation-delay-2000" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
                <div className="px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Artikel</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kelola berita & pengumuman masjid</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        {/* Expandable Search Bar */}
                        <div className="relative flex items-center justify-end h-10">
                            <AnimatePresence initial={false} mode="wait">
                                {!isSearchExpanded ? (
                                    <motion.button
                                        key="search-btn"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.15 }}
                                        onClick={() => setIsSearchExpanded(true)}
                                        className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm flex items-center justify-center bg-white dark:bg-slate-900 transition-colors"
                                    >
                                        <Search size={18} strokeWidth={2.5} className="text-slate-400 opacity-80" />
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        key="search-input"
                                        initial={{ width: 40, opacity: 0 }}
                                        animate={{ width: 220, opacity: 1 }}
                                        exit={{ width: 40, opacity: 0 }}
                                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                        className="relative origin-right"
                                    >
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 transition-colors">
                                            <Search size={18} strokeWidth={2.5} className="opacity-80" />
                                        </div>
                                        <input
                                            ref={searchInputRef}
                                            id="article-search"
                                            name="article-search"
                                            type="text"
                                            placeholder="Cari artikel..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onBlur={() => {
                                                if (!searchQuery) setIsSearchExpanded(false);
                                            }}
                                            className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-full pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Filter (Category Only) */}
                        <FilterDropdown>
                            <FilterTrigger
                                icon={<SlidersHorizontal size={18} strokeWidth={2.5} />}
                                isActive={filterCategory !== 'ALL'}
                                activeColorClass="text-blue-600 border-blue-500 ring-2 ring-blue-500/20 bg-blue-50"
                                showChevron={true}
                                className="!px-3 !h-10 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
                                indicator={filterCategory !== 'ALL' && (
                                    <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
                                )}
                            >
                                <FilterContent width="w-52">
                                    <h4 className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kategori</h4>
                                    <div className="flex flex-col gap-1">
                                        <FilterItem onClick={() => setFilterCategory('ALL')} isSelected={filterCategory === 'ALL'} icon={<Check size={14} className={filterCategory === 'ALL' ? '' : 'invisible'} />}>Semua Kategori</FilterItem>
                                        <FilterItem onClick={() => setFilterCategory('PENGUMUMAN')} isSelected={filterCategory === 'PENGUMUMAN'} icon={<Check size={14} className={filterCategory === 'PENGUMUMAN' ? '' : 'invisible'} />}>Pengumuman</FilterItem>
                                        <FilterItem onClick={() => setFilterCategory('KAJIAN')} isSelected={filterCategory === 'KAJIAN'} icon={<Check size={14} className={filterCategory === 'KAJIAN' ? '' : 'invisible'} />}>Kajian</FilterItem>
                                        <FilterItem onClick={() => setFilterCategory('KEGIATAN')} isSelected={filterCategory === 'KEGIATAN'} icon={<Check size={14} className={filterCategory === 'KEGIATAN' ? '' : 'invisible'} />}>Kegiatan</FilterItem>
                                        <FilterItem onClick={() => setFilterCategory('EDUKASI')} isSelected={filterCategory === 'EDUKASI'} icon={<Check size={14} className={filterCategory === 'EDUKASI' ? '' : 'invisible'} />}>Edukasi</FilterItem>
                                        <FilterItem onClick={() => setFilterCategory('INFAQ')} isSelected={filterCategory === 'INFAQ'} icon={<Check size={14} className={filterCategory === 'INFAQ' ? '' : 'invisible'} />}>Infaq</FilterItem>
                                    </div>
                                </FilterContent>
                            </FilterTrigger>
                        </FilterDropdown>
                    </div>
                </div>
            </header>

            <main className="relative z-10 px-6 pt-6 flex flex-col gap-6">

                {/* Quick Actions Grid */}
                <section className="grid grid-cols-5 gap-3 mb-2 px-1">
                    <Link href="/admin/articles/new" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-md transition-all group-hover:scale-110 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group-hover:border-blue-500 group-hover:bg-blue-50/50">
                            <Plus size={24} strokeWidth={2.5} className="text-blue-600" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">Baru</span>
                    </Link>
                    <button onClick={() => setActiveDrawer('CATEGORY')} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-md transition-all group-hover:scale-110 bg-[#F5F3FF] text-[#7C3AED] dark:bg-purple-900/30 dark:text-purple-400">
                            <FileText size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center text-purple-700/80">Kategori</span>
                    </button>
                    <button onClick={() => setActiveDrawer('STATS')} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-md transition-all group-hover:scale-110 bg-[#ECFDF5] text-[#10B981] dark:bg-emerald-900/30 dark:text-emerald-400">
                            <BarChart3 size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center text-emerald-700/80">Statistik</span>
                    </button>
                    <Link href="/admin/articles/comments" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-md transition-all group-hover:scale-110 bg-[#FFF1F2] text-[#E11D48] dark:bg-rose-900/30 dark:text-rose-400">
                            <MessageSquare size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center text-rose-700/80">Moderasi</span>
                    </Link>
                    <button onClick={() => setFilterStatus(filterStatus === 'ARCHIVED' ? 'ALL' : 'ARCHIVED')} className="flex flex-col items-center gap-2 group">
                        <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-md transition-all group-hover:scale-110 ${filterStatus === 'ARCHIVED' ? 'bg-amber-500 text-white' : 'bg-[#FFFBEB] text-[#F59E0B] dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            <Archive size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center text-amber-700/80">Arsip</span>
                    </button>
                </section>

                {/* Article Slider */}
                <div className="mb-2 flex items-center justify-between mt-2">
                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Artikel Anda</h2>
                    <Link href="#" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                        Lihat Semua
                    </Link>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {[
                        { key: 'ALL', label: 'Semua', count: articles.length },
                        { key: 'PUBLISHED', label: 'Terbit', count: articles.filter(a => a.status === 'PUBLISHED').length },
                        { key: 'DRAFT', label: 'Draft', count: articles.filter(a => a.status === 'DRAFT').length },
                        { key: 'ARCHIVED', label: 'Arsip', count: articles.filter(a => a.status === 'ARCHIVED').length },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilterStatus(tab.key)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${filterStatus === tab.key
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                        >
                            {tab.label}
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${filterStatus === tab.key
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex overflow-x-auto gap-4 pb-8 pt-2 snap-x snap-mandatory -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredArticles.map((article, index) => (
                        <AdminArticleCard key={article.id} article={article} index={index} />
                    ))}

                    {filteredArticles.length === 0 && (
                        <div className="w-full text-center py-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/40 dark:border-white/10 border-dashed">
                            <Newspaper className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Tidak Ada Artikel</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Belum ada artikel yang dibuat.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Feature Drawers Overlay */}
            <AnimatePresence>
                {activeDrawer !== 'NONE' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveDrawer('NONE')}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-white dark:bg-slate-950 rounded-t-[2.5rem] z-[70] shadow-2xl safe-area-bottom pb-8"
                        >
                            <div className="p-6">
                                {/* Drawer Handle */}
                                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6" />

                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {activeDrawer === 'CATEGORY' ? 'Distribusi Kategori' : 'Statistik Artikel'}
                                    </h2>
                                    <button
                                        onClick={() => setActiveDrawer('NONE')}
                                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {activeDrawer === 'CATEGORY' ? (
                                    <div className="space-y-3">
                                        {[
                                            { id: 'PENGUMUMAN', label: 'Pengumuman', color: 'bg-blue-500', count: catStats.PENGUMUMAN },
                                            { id: 'KAJIAN', label: 'Kajian', color: 'bg-purple-500', count: catStats.KAJIAN },
                                            { id: 'KEGIATAN', label: 'Kegiatan', color: 'bg-orange-500', count: catStats.KEGIATAN },
                                            { id: 'EDUKASI', label: 'Edukasi', color: 'bg-emerald-500', count: catStats.EDUKASI },
                                            { id: 'INFAQ', label: 'Infaq', color: 'bg-pink-500', count: catStats.INFAQ },
                                        ].map((cat) => (
                                            <div key={cat.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                                                <span className="flex-1 font-bold text-slate-700 dark:text-slate-300 text-sm">{cat.label}</span>
                                                <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-black text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                                                    {cat.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                                    <Eye size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-blue-600/60 dark:text-blue-400/60 uppercase tracking-widest leading-none mb-1">Total Tayangan</p>
                                                    <p className="text-2xl font-black text-blue-900 dark:text-blue-100 leading-none">{(stats.totalViews / 1000).toFixed(1)}K</p>
                                                </div>
                                            </div>
                                            <BarChart3 className="text-blue-200 dark:text-blue-800" size={48} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                                                <div className="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 mb-4">
                                                    <Heart size={20} fill="currentColor" />
                                                </div>
                                                <p className="text-[10px] font-black text-red-600/60 dark:text-red-400/60 uppercase tracking-widest leading-none mb-1">Total Suka</p>
                                                <p className="text-xl font-black text-red-900 dark:text-red-100 leading-none">{stats.totalLikes}</p>
                                            </div>
                                            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                                                <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-4">
                                                    <Send size={18} />
                                                </div>
                                                <p className="text-[10px] font-black text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-widest leading-none mb-1">Total Bagikan</p>
                                                <p className="text-xl font-black text-emerald-900 dark:text-emerald-100 leading-none">{stats.totalShares}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
