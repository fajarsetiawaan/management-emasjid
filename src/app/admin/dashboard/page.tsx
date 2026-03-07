'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { motion } from 'framer-motion';

import {
    Wallet,
    Calendar,
    FileText,
    Box,
    Users,
    BarChart3,
    ChevronRight,
    Clock,
    MapPin,
    ArrowUpRight,
    HeartHandshake,
    Newspaper,
    X,
    ImageIcon,
    User
} from 'lucide-react';
import { MOCK_MOSQUE, MOCK_EVENTS } from '@/lib/mock-data';
import MOCK_DONATIONS from '@/mocks/donations.json';
import { getPublishedArticles } from '@/services/articles';
import { getTotalBalance } from '@/lib/api';
import { Article } from '@/services/articles';
import { Event } from '@/types';

export default function AdminDashboardPage() {
    const [displayBalance, setDisplayBalance] = useState(MOCK_MOSQUE.balance);
    const isNewUser = displayBalance === 0;
    const upcomingEvents = isNewUser ? [] : MOCK_EVENTS
        .filter(e => e.status === 'UPCOMING' && e.date >= new Date())
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    const activeCampaigns = MOCK_DONATIONS.campaigns.filter(c => c.status === 'ACTIVE');
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Load balance from localStorage (onboarding data) on client
    useEffect(() => {
        setDisplayBalance(getTotalBalance());
        getPublishedArticles().then(data => {
            setArticles(data.slice(0, 3));
        });
    }, []);

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const menuItems = [
        { name: 'Keuangan', href: '/admin/finance', icon: Wallet, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800/50' },
        { name: 'Agenda', href: '/admin/events', icon: Calendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800/50' },
        { name: 'Surat', href: '/admin/letters', icon: FileText, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-800/50' },
        { name: 'Aset', href: '/admin/inventory', icon: Box, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800/50' },
        { name: 'Jamaah', href: '/admin/donors', icon: Users, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-100 dark:border-cyan-800/50' },
        { name: 'Donasi', href: '/admin/donations', icon: HeartHandshake, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-100 dark:border-pink-800/50' },
        { name: 'Berita', href: '/admin/articles', icon: Newspaper, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-100 dark:border-sky-800/50' },
        { name: 'Laporan', href: '/admin/reports', icon: BarChart3, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800/50' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 relative">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[80%] bg-emerald-400/10 dark:bg-emerald-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[70%] h-[70%] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            {/* Hero Section (Finance) */}
            <div className="relative overflow-hidden rounded-b-[2.5rem] shadow-2xl shadow-emerald-900/20 z-10 mx-2 mt-2">
                {/* Mesh Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-b-[2.5rem] rounded-t-[2rem]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 p-6 pt-8 pb-14 text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-emerald-100 text-sm font-medium mb-1 tracking-wide opacity-80">Total Saldo Kas</div>
                            <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-sm">
                                {formatRupiah(displayBalance)}
                            </h2>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                            <Wallet className="text-emerald-300" size={20} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-500/20 backdrop-blur-sm text-emerald-50 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-400/30 flex items-center gap-1.5 shadow-lg shadow-emerald-900/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Aman & Stabil
                        </span>
                        <span className="text-emerald-200/90 text-xs font-medium">+5% dari bulan lalu</span>
                    </div>
                </div>
            </div>

            {/* Grid Menu System */}
            <div className="px-5 -mt-10 relative z-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 dark:border-white/5 p-5 grid grid-cols-4 gap-y-6 gap-x-2"
                >
                    {menuItems.map((item) => (
                        <motion.div key={item.name} variants={itemVariants} className="w-full">
                            <Link href={item.href} className="flex flex-col items-center gap-2 group w-full">
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-active:scale-95 shadow-sm`}>
                                    <item.icon className={item.color} size={26} strokeWidth={2} />
                                </div>
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight tracking-tight group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                    {item.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Widgets Area */}
            <div className="p-5 space-y-6 mt-2 relative z-10">

                {/* Agenda Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">Agenda Terdekat</h3>
                        <Link href="/admin/events" className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                            Lihat Semua <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    {upcomingEvents.length > 0 ? (
                        <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 pb-4 px-1 -mx-1">
                            {upcomingEvents.map((event) => (
                                <div
                                    key={event.id}
                                    onClick={() => setSelectedEvent(event)}
                                    className="w-[130px] flex-shrink-0 snap-center cursor-pointer group"
                                >
                                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">

                                        {/* Image Header */}
                                        <div className="h-20 w-full shrink-0 relative overflow-hidden">
                                            {event.flyer_url ? (
                                                <img src={event.flyer_url} alt="Flyer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                                    <Calendar size={20} className="text-white/50" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-2 flex flex-col flex-1">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[11px] line-clamp-2 leading-tight min-h-[2.5em]">{event.title}</h4>
                                            <div className="flex items-center justify-between mt-auto pt-1">
                                                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-[9px] font-semibold">
                                                    <Calendar size={9} />
                                                    <span>{event.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                </div>
                                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${event.category === 'KAJIAN' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' :
                                                    event.category === 'RAPAT' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400' :
                                                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}>
                                                    {event.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-white/10 border-dashed">
                            Belum ada agenda terdekat
                        </div>
                    )}
                </div>

                {/* Donasi Aktif Section */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">Donasi & Infaq Berjalan</h3>
                        <Link href="/admin/donations" className="flex items-center gap-1 text-xs text-pink-600 dark:text-pink-400 font-bold hover:underline">
                            Kelola <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    {activeCampaigns.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
                            {activeCampaigns.map((campaign) => {
                                const progress = Math.min(100, Math.floor((campaign.current_amount / campaign.target_amount) * 100));
                                return (
                                    <div key={campaign.id} className="w-[70vw] sm:w-[260px] shrink-0 snap-center group">
                                        <div className="bg-gradient-to-b from-[#fefbfd] to-[#fff5f8] dark:from-slate-900 dark:to-slate-900 border border-pink-100 dark:border-slate-800 rounded-[1.2rem] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                                            {/* Image Header */}
                                            <div className="h-36 w-full relative overflow-hidden shrink-0">
                                                {campaign.flyer_url ? (
                                                    <img src={campaign.flyer_url} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800">
                                                        <HeartHandshake className="text-white/40" size={48} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent"></div>
                                                <div className="absolute top-3 right-3 z-10">
                                                    <div className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border shadow-sm bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50">
                                                        BERJALAN
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-4 flex flex-col flex-1">
                                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug mb-3 min-h-[2.5rem]">
                                                    {campaign.title}
                                                </h3>

                                                <div className="mt-auto">
                                                    {/* Progress Stats */}
                                                    <div className="flex flex-wrap justify-between items-end gap-1 mb-1.5">
                                                        <div>
                                                            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5">TERKUMPUL</p>
                                                            <p className="text-xs font-bold text-[#E91E63] dark:text-pink-500">{formatRupiah(campaign.current_amount)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5">TARGET</p>
                                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{formatRupiah(campaign.target_amount)}</p>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="relative h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                                                        <div
                                                            className="absolute top-0 left-0 h-full bg-[#E91E63] rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                        {progress > 0 && progress < 100 && (
                                                            <div
                                                                className="absolute top-1/2 -mt-1 w-2 h-2 bg-[#E91E63] rounded-full shadow-[0_0_6px_rgba(233,30,99,0.6)]"
                                                                style={{ left: `calc(${progress}% - 4px)` }}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
                                                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                                            <Calendar size={13} />
                                                            <span>{new Date(campaign.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                        </div>
                                                        <Link href={`/admin/donations/${campaign.slug}`} className="text-[11px] font-bold text-[#E91E63] bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors">
                                                            Kelola <ChevronRight size={13} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-white/10 border-dashed">
                            Belum ada program penggalangan dana aktif
                        </div>
                    )}
                </div>

                {/* Berita Section */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">Berita Terbaru</h3>
                        <Link href="/admin/articles" className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline">
                            Lihat Semua <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    {articles.length > 0 ? (
                        <div className="space-y-3">
                            {articles.map((article) => (
                                <Link href={`/admin/articles/${article.slug}`} key={article.id} className="block group">
                                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-white/40 dark:border-white/5 shadow-sm flex gap-4 hover:shadow-md transition-shadow active:scale-[0.98]">
                                        {article.flyer_url ? (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={article.flyer_url} alt={article.title} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                <Newspaper className="text-slate-300 dark:text-slate-600" size={24} />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 text-sm mb-1 leading-tight">{article.title}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">{article.excerpt}</p>
                                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                                                <div className="flex items-center gap-1">
                                                    <User size={10} />
                                                    <span>{article.author_name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            <Link href="/admin/articles">
                                <button className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm mt-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Lihat Semua Berita
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-white/10 border-dashed">
                            Belum ada artikel dipublikasikan
                        </div>
                    )}
                </div>

            </div>

            {/* Event Detail Modal Overlay */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setSelectedEvent(null)}
                    ></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
                    >
                        {/* Modal Header & Flyer */}
                        <div className="relative aspect-[16/10] bg-gradient-to-br from-indigo-600 via-blue-700 to-slate-900 flex flex-col items-center justify-center">
                            {selectedEvent.flyer_url ? (
                                <img src={selectedEvent.flyer_url} alt="Flyer" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                                            <Calendar size={32} className="text-white/70" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Dark gradient overlay from bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-colors z-20"
                            >
                                <X size={16} strokeWidth={3} />
                            </button>

                            {/* Category Badge - Top Left */}
                            <span className={`absolute top-3 left-3 z-20 text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-widest uppercase backdrop-blur-sm ${selectedEvent.category === 'KAJIAN' ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30' :
                                selectedEvent.category === 'RAPAT' ? 'bg-orange-500/30 text-orange-200 border border-orange-400/30' :
                                    'bg-white/20 text-white/80 border border-white/20'
                                }`}>
                                {selectedEvent.category}
                            </span>

                            {/* Title overlaid at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                                <h2 className="text-xl font-bold text-white leading-tight drop-shadow-sm">
                                    {selectedEvent.title}
                                </h2>
                                <div className="flex items-center gap-1.5 mt-2 text-white/80 text-xs font-semibold">
                                    <Clock size={13} className="text-emerald-400" />
                                    <span>{selectedEvent.date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                    <span className="text-white/40">•</span>
                                    <span className="text-emerald-400 font-bold">{selectedEvent.time} WIB</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 space-y-3">
                            {/* Ustadz */}
                            {selectedEvent.ustadz && (
                                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-100/60 dark:border-blue-800/40">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-0.5">Pemateri / Ustadz</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedEvent.ustadz}</p>
                                    </div>
                                </div>
                            )}

                            {/* Lokasi */}
                            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/60 dark:border-slate-700/40">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-slate-500/20">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">Lokasi</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Masjid Utama</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
