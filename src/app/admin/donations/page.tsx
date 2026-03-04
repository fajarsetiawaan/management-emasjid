'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Plus, Search, MapPin, Target, Users, ArrowRight, Activity, CalendarDays } from 'lucide-react';
import Link from 'next/link';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL'); // ALL, ACTIVE, DRAFT, COMPLETED

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
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none fixed">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-400/10 dark:bg-pink-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-400/10 dark:bg-rose-600/5 rounded-full blur-[100px]" />
            </div>

            {/* Header / Sticky Top */}
            <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-5 py-6 sticky top-0 z-40 border-b border-white/20 dark:border-white/5 shadow-sm transition-colors">
                <div className="flex justify-between items-center mb-6 mt-2">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard" className="w-10 h-10 rounded-full bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <ArrowRight className="rotate-180" size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Program Donasi</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Kelola penggalangan dana masjid</p>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex gap-3">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-pink-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari program donasi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 text-sm rounded-2xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all appearance-none"
                    >
                        <option value="ALL">Semua</option>
                        <option value="ACTIVE">Berjalan</option>
                        <option value="COMPLETED">Selesai</option>
                        <option value="DRAFT">Draft</option>
                    </select>
                </div>
            </header>

            {/* Campaign List */}
            <main className="p-5 relative z-10 space-y-4">
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
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Link href="/admin/donations/new">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 ring-4 ring-slate-50 dark:ring-slate-950"
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
