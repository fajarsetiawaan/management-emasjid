'use client';

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Edit2, Share2, Target, Users, TrendingUp, CheckCircle2, MessageSquare, Image as ImageIcon, Send } from 'lucide-react';
import Link from 'next/link';

// Mock Data
import DONATIONS_MOCK from '@/mocks/donations.json';

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function CampaignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [activeTab, setActiveTab] = useState<'overview' | 'donors' | 'updates'>('overview');

    // Find campaign data (mock)
    const campaign = DONATIONS_MOCK.campaigns.find(c => c.slug === slug) || DONATIONS_MOCK.campaigns[0];
    const donations = DONATIONS_MOCK.campaign_donations.filter(d => d.campaign_id === campaign.id);
    const updates = DONATIONS_MOCK.campaign_updates.filter(u => u.campaign_id === campaign.id);

    const progress = Math.min(100, Math.floor((campaign.current_amount / campaign.target_amount) * 100));

    // Stats
    const totalDonors = donations.length;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 pb-24 relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-transparent pointer-events-none"></div>

            {/* Header Sticky */}
            <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-5 py-5 sticky top-0 z-40 border-b border-white/20 dark:border-white/5 transition-colors">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/donations" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Detail Program</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-pink-600 transition-colors">
                            <Share2 size={18} />
                        </button>
                        <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 transition-colors">
                            <Edit2 size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="px-5 mt-6 relative z-10 space-y-6">
                {/* Hero / Flyer */}
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/40 dark:border-white/10 shadow-sm">
                    {campaign.flyer_url && (
                        <div className="h-48 w-full relative">
                            <img src={campaign.flyer_url} alt={campaign.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-5">
                                <h2 className="text-xl font-bold text-white leading-tight drop-shadow-md">{campaign.title}</h2>
                            </div>
                            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-lg">
                                {campaign.status === 'ACTIVE' ? 'Berjalan' : campaign.status}
                            </div>
                        </div>
                    )}

                    {/* Quick Stats Grid */}
                    <div className="p-5 grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Terkumpul</p>
                            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{formatRupiah(campaign.current_amount)}</p>
                            <p className="text-xs text-slate-400 mt-1">dari {formatRupiah(campaign.target_amount)}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Donatur</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{totalDonors} <span className="text-sm font-medium text-slate-400">Orang</span></p>
                            <p className="text-xs text-slate-400 mt-1 text-emerald-500 flex items-center gap-1 font-medium">
                                <TrendingUp size={12} /> Sedang tren
                            </p>
                        </div>
                    </div>

                    <div className="px-5 pb-5">
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            />
                        </div>
                        <p className="text-right text-xs font-bold text-slate-500 mt-2">{progress}% Tercapai</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('donors')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'donors' ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Donatur ({totalDonors})
                    </button>
                    <button
                        onClick={() => setActiveTab('updates')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'updates' ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Updates
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/40 dark:border-white/10 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
                                        <Target size={16} className="text-pink-500" />
                                        Tujuan & Narasi
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {campaign.description}
                                    </p>
                                </div>

                                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/40 dark:border-white/10 shadow-sm grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Mulai</p>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {new Date(campaign.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Selesai</p>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {new Date(campaign.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* DONORS TAB */}
                        {activeTab === 'donors' && (
                            <motion.div key="donors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                {donations.map(don => (
                                    <div key={don.id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-white/40 dark:border-white/10 shadow-sm flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-900/40 dark:to-rose-800/40 flex items-center justify-center flex-shrink-0 border border-pink-200 dark:border-pink-800/50">
                                            <Users size={18} className="text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate">{don.donor_name}</h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(don.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} • Via {don.payment_method}</p>
                                                </div>
                                                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 whitespace-nowrap ml-2">
                                                    {formatRupiah(don.amount)}
                                                </span>
                                            </div>
                                            {don.message && (
                                                <div className="mt-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-300 italic flex gap-2">
                                                    <MessageSquare size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                                    "{don.message}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {donations.length === 0 && (
                                    <div className="text-center py-10">
                                        <Users className="mx-auto text-slate-300 dark:text-slate-600 mb-2" size={32} />
                                        <p className="text-sm text-slate-500">Belum ada donatur untuk program ini.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* UPDATES TAB */}
                        {activeTab === 'updates' && (
                            <motion.div key="updates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                                {/* Post Update Area */}
                                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-white/40 dark:border-white/10 shadow-sm">
                                    <textarea
                                        placeholder="Berikan kabar terbaru tentang progres program ini..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30 resize-none h-24 text-slate-800 dark:text-slate-200"
                                    ></textarea>
                                    <div className="flex justify-between items-center mt-3">
                                        <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                            <ImageIcon size={20} />
                                        </button>
                                        <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-all active:scale-95">
                                            <Send size={14} /> Posting
                                        </button>
                                    </div>
                                </div>

                                {/* List Updates */}
                                <div className="space-y-4">
                                    {updates.map(upd => (
                                        <div key={upd.id} className="relative pl-6 pb-6 border-l-2 border-slate-200 dark:border-slate-800 last:border-transparent last:pb-0">
                                            <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-pink-500 border-4 border-slate-50 dark:border-slate-950"></div>
                                            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 border border-white/40 dark:border-white/10 shadow-sm ml-2">
                                                <p className="text-[10px] items-center text-slate-500 font-bold uppercase tracking-wider mb-2 flex gap-1">
                                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                                    {new Date(upd.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                                                    {upd.content}
                                                </p>
                                                {upd.image_url && (
                                                    <img src={upd.image_url} alt="Update" className="w-full h-40 object-cover rounded-xl mt-3 border border-slate-100 dark:border-slate-800" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
