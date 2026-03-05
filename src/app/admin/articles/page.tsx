'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Plus, Search, FileText, BarChart3, Archive, ArrowRight, SlidersHorizontal, Check } from 'lucide-react';
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
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getArticles().then(setArticles);
    }, []);

    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

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

                        {/* Filter */}
                        <FilterDropdown>
                            <FilterTrigger
                                icon={<SlidersHorizontal size={18} strokeWidth={2.5} />}
                                isActive={filterStatus !== 'ALL' || filterCategory !== 'ALL'}
                                activeColorClass="text-blue-600 border-blue-500 ring-2 ring-blue-500/20 bg-blue-50"
                                showChevron={true}
                                className="!px-3 !h-10 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
                                indicator={(filterStatus !== 'ALL' || filterCategory !== 'ALL') && (
                                    <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
                                )}
                            >
                                <FilterContent width="w-52">
                                    <h4 className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</h4>
                                    <div className="flex flex-col gap-1">
                                        <FilterItem onClick={() => setFilterStatus('ALL')} isSelected={filterStatus === 'ALL'} icon={<Check size={14} className={filterStatus === 'ALL' ? '' : 'invisible'} />}>Semua Status</FilterItem>
                                        <FilterItem onClick={() => setFilterStatus('PUBLISHED')} isSelected={filterStatus === 'PUBLISHED'} icon={<Check size={14} className={filterStatus === 'PUBLISHED' ? '' : 'invisible'} />}>Terbit</FilterItem>
                                        <FilterItem onClick={() => setFilterStatus('DRAFT')} isSelected={filterStatus === 'DRAFT'} icon={<Check size={14} className={filterStatus === 'DRAFT' ? '' : 'invisible'} />}>Draft</FilterItem>
                                        <FilterItem onClick={() => setFilterStatus('ARCHIVED')} isSelected={filterStatus === 'ARCHIVED'} icon={<Check size={14} className={filterStatus === 'ARCHIVED' ? '' : 'invisible'} />}>Arsip</FilterItem>
                                    </div>
                                    <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
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
                <section className="grid grid-cols-4 gap-4 mb-2">
                    <Link href="/admin/articles/new" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Plus size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">Buat Artikel</span>
                    </Link>
                    <Link href="#" className="flex flex-col items-center gap-2 group opacity-60">
                        <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <FileText size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">Kategori</span>
                    </Link>
                    <Link href="#" className="flex flex-col items-center gap-2 group opacity-60">
                        <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <BarChart3 size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">Statistik</span>
                    </Link>
                    <Link href="#" className="flex flex-col items-center gap-2 group opacity-60">
                        <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <Archive size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">Arsip</span>
                    </Link>
                </section>

                {/* Article Slider */}
                <div className="mb-2 flex items-center justify-between mt-2">
                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Artikel Anda</h2>
                    <Link href="#" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                        Lihat Semua
                    </Link>
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
        </div>
    );
}
