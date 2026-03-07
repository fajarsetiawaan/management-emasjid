'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, Plus, Search, MapPin, Target, Users, ArrowRight, Activity, CalendarDays, SlidersHorizontal, Check, X } from 'lucide-react';
import Link from 'next/link';
import { FilterDropdown, FilterTrigger, FilterContent, FilterItem } from '@/components/shared/FilterDropdown';
import AdminCampaignCard from '@/components/features/donations/AdminCampaignCard';

// Use mock data directly until Supabase is integrated
import DONATIONS_MOCK from '@/mocks/donations.json';

// Helper to format currency
const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function AdminDonationsPage() {
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [activeDrawer, setActiveDrawer] = useState<'NONE' | 'STATS'>('NONE');
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    // Calculate aggregated stats
    const totalTarget = DONATIONS_MOCK.campaigns.reduce((acc, c) => acc + c.target_amount, 0);
    const totalCollected = DONATIONS_MOCK.campaigns.reduce((acc, c) => acc + c.current_amount, 0);
    const totalDonors = DONATIONS_MOCK.campaign_donations.length;
    const completionRate = (totalCollected / totalTarget) * 100;

    // Filter campaigns
    const filteredCampaigns = DONATIONS_MOCK.campaigns.filter(camp => {
        const matchesSearch = camp.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || camp.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 relative pb-24">
            {/* Abstract Ambient Backgrounds (Matching Finance) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-pink-500/10 animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-rose-500/20 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-rose-500/10 animate-blob animation-delay-2000" />
            </div>

            {/* Header matching FinanceHeader styling */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
                <div className="px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Program Donasi</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Penggalangan dana masjid</p>
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
                                            placeholder="Cari program..."
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

                        <FilterDropdown>
                            <FilterTrigger
                                icon={<SlidersHorizontal size={18} strokeWidth={2.5} />}
                                isActive={filterStatus !== 'ALL'}
                                activeColorClass="text-blue-600 border-blue-500 ring-2 ring-blue-500/20 bg-blue-50"
                                showChevron={true}
                                className="!px-3 !h-10 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
                                indicator={filterStatus !== 'ALL' && (
                                    <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
                                )}
                            >
                                <FilterContent width="w-48">
                                    <h4 className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Program</h4>
                                    <div className="flex flex-col gap-1">
                                        <FilterItem
                                            onClick={() => setFilterStatus('ALL')}
                                            isSelected={filterStatus === 'ALL'}
                                            icon={<Check size={14} className={filterStatus === 'ALL' ? '' : 'invisible'} />}
                                        >
                                            Semua
                                        </FilterItem>
                                        <FilterItem
                                            onClick={() => setFilterStatus('ACTIVE')}
                                            isSelected={filterStatus === 'ACTIVE'}
                                            icon={<Check size={14} className={filterStatus === 'ACTIVE' ? '' : 'invisible'} />}
                                        >
                                            Berjalan
                                        </FilterItem>
                                        <FilterItem
                                            onClick={() => setFilterStatus('COMPLETED')}
                                            isSelected={filterStatus === 'COMPLETED'}
                                            icon={<Check size={14} className={filterStatus === 'COMPLETED' ? '' : 'invisible'} />}
                                        >
                                            Selesai
                                        </FilterItem>
                                        <FilterItem
                                            onClick={() => setFilterStatus('DRAFT')}
                                            isSelected={filterStatus === 'DRAFT'}
                                            icon={<Check size={14} className={filterStatus === 'DRAFT' ? '' : 'invisible'} />}
                                        >
                                            Draft
                                        </FilterItem>
                                    </div>
                                </FilterContent>
                            </FilterTrigger>
                        </FilterDropdown>
                    </div>
                </div>
            </header>

            <main className="relative z-10 px-6 pt-6 flex flex-col gap-6">

                {/* Actions Grid matching FinanceQuickActions matching */}
                <section className="grid grid-cols-4 gap-4 mb-2">
                    <Link href="/admin/donations/new" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                            <Plus size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">Buat Program</span>
                    </Link>
                    <button onClick={() => setActiveDrawer('STATS')} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Activity size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center text-blue-700/80">Laporan</span>
                    </button>
                    <Link href="/admin/donations/donors" className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Users size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center text-emerald-700/80">Donatur</span>
                    </Link>
                    <button onClick={() => setFilterStatus(filterStatus === 'COMPLETED' ? 'ALL' : 'COMPLETED')} className="flex flex-col items-center gap-2 group">
                        <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${filterStatus === 'COMPLETED' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            <Target size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center text-amber-700/80">Arsip</span>
                    </button>
                </section>

                <div className="mb-2 flex items-center justify-between mt-2">
                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Program Anda</h2>
                    <Link href="#" className="text-sm font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 transition-colors">
                        Lihat Semua
                    </Link>
                </div>

                <div className="flex overflow-x-auto gap-4 pb-8 pt-2 snap-x snap-mandatory -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredCampaigns.map((camp, index) => (
                        <AdminCampaignCard key={camp.id} campaign={camp} index={index} />
                    ))}

                    {filteredCampaigns.length === 0 && (
                        <div className="text-center py-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/40 dark:border-white/10 border-dashed w-full max-w-sm mx-auto">
                            <HeartHandshake className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Tidak Ada Program</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Belum ada program donasi yang dibuat.</p>
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
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                                        Analisis & Laporan
                                    </h2>
                                    <button
                                        onClick={() => setActiveDrawer('NONE')}
                                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Financial Summary */}
                                    <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-[10px] font-black text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-widest leading-none mb-1">Total Terkumpul</p>
                                                <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100 leading-none">{formatRupiah(totalCollected)}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                                <HeartHandshake size={20} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[11px] font-bold text-emerald-700/70 dark:text-emerald-400/70">
                                                <span>Progress Target</span>
                                                <span>{completionRate.toFixed(1)}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-emerald-200 dark:bg-emerald-800/40 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${completionRate}%` }}
                                                    className="h-full bg-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                            <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-4">
                                                <Users size={20} />
                                            </div>
                                            <p className="text-[10px] font-black text-blue-600/60 dark:text-blue-400/60 uppercase tracking-widest leading-none mb-1">Total Donatur</p>
                                            <p className="text-xl font-black text-blue-900 dark:text-blue-100 leading-none">{totalDonors}</p>
                                        </div>
                                        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                                            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 mb-4">
                                                <Target size={20} />
                                            </div>
                                            <p className="text-[10px] font-black text-amber-600/60 dark:text-amber-400/60 uppercase tracking-widest leading-none mb-1">Target Dana</p>
                                            <p className="text-sm font-black text-amber-900 dark:text-amber-100 leading-none">{(totalTarget / 1000000).toFixed(0)} Juta</p>
                                        </div>
                                    </div>

                                    {/* Campaign Breakdown */}
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Status Kampanye</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { label: 'Berjalan', count: DONATIONS_MOCK.campaigns.filter(c => c.status === 'ACTIVE').length, color: 'bg-emerald-500' },
                                                { label: 'Selesai', count: DONATIONS_MOCK.campaigns.filter(c => c.status === 'COMPLETED').length, color: 'bg-blue-500' },
                                                { label: 'Draft', count: DONATIONS_MOCK.campaigns.filter(c => c.status === 'DRAFT').length, color: 'bg-slate-400' },
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                                    <span className="flex-1 font-bold text-slate-700 dark:text-slate-300 text-xs">{item.label}</span>
                                                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-[11px] font-black text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                                                        {item.count}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
