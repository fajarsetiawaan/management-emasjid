'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, Plus, Search, MapPin, Target, Users, ArrowRight, Activity, CalendarDays, SlidersHorizontal, Check } from 'lucide-react';
import Link from 'next/link';
import { FilterDropdown, FilterTrigger, FilterContent, FilterItem } from '@/components/shared/FilterDropdown';

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
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    // Filter campaigns
    const filteredCampaigns = DONATIONS_MOCK.campaigns.filter(camp => {
        const matchesSearch = camp.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || camp.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
            case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
            case 'DRAFT': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const StatusLabel = ({ status }: { status: string }) => {
        let label = status;
        if (status === 'ACTIVE') label = 'Berjalan';
        if (status === 'COMPLETED') label = 'Selesai';
        if (status === 'DRAFT') label = 'Draft';

        return (
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(status)}`}>
                {label}
            </div>
        );
    };

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
                    <Link href="#" className="flex flex-col items-center gap-2 group opacity-60">
                        <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Activity size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">Laporan</span>
                    </Link>
                    <Link href="#" className="flex flex-col items-center gap-2 group opacity-60">
                        <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Users size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">Data Donatur</span>
                    </Link>
                    <Link href="#" className="flex flex-col items-center gap-2 group opacity-60">
                        <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <Target size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">Target & Goal</span>
                    </Link>
                </section>

                <div className="space-y-4">
                    {filteredCampaigns.map((camp, index) => {
                        const progress = Math.min(100, Math.floor((camp.current_amount / camp.target_amount) * 100));

                        return (
                            <motion.div
                                key={camp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                            >
                                {/* Flyer Banner (Small) */}
                                <div className="h-32 w-full relative bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                    {camp.flyer_url ? (
                                        <img src={camp.flyer_url} alt={camp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <HeartHandshake className="text-slate-400 opacity-50" size={32} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-3 right-3">
                                        <StatusLabel status={camp.status} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                        <Link href={`/admin/donations/${camp.slug}`}>{camp.title}</Link>
                                    </h3>

                                    {/* Progress Stats */}
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">Terkumpul</p>
                                                <p className="text-sm font-bold text-pink-600 dark:text-pink-400">{formatRupiah(camp.current_amount)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">Target</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatRupiah(camp.target_amount)}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            <CalendarDays size={14} />
                                            <span>{new Date(camp.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                        <Link href={`/admin/donations/${camp.slug}`} className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors">
                                            Kelola <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}

                    {filteredCampaigns.length === 0 && (
                        <div className="text-center py-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/40 dark:border-white/10 border-dashed">
                            <HeartHandshake className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Tidak Ada Program</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Belum ada program donasi yang dibuat.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
