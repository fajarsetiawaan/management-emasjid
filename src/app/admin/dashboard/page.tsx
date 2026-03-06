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
    const upcomingEvents = isNewUser ? [] : MOCK_EVENTS.filter(e => e.status === 'UPCOMING');
    const activeCampaign = MOCK_DONATIONS.campaigns.find(c => c.status === 'ACTIVE') || null;
    const [latestArticle, setLatestArticle] = useState<Article | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Load balance from localStorage (onboarding data) on client
    useEffect(() => {
        setDisplayBalance(getTotalBalance());
        getPublishedArticles().then(articles => {
            if (articles.length > 0) {
                setLatestArticle(articles[0]);
            }
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
        { name: 'Artikel', href: '/admin/articles', icon: Newspaper, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-100 dark:border-sky-800/50' },
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
                        <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 pb-2 px-1 -mx-1">
                            <div
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className="w-[85vw] max-w-[300px] flex-shrink-0 snap-center cursor-pointer group"
                            >
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-full transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:-translate-y-1">

                                    {/* Image Header */}
                                    <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 relative">
                                        {event.flyer_url ? (
                                            <img src={event.flyer_url} alt="Flyer" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                                                <Calendar size={32} className="text-blue-300 dark:text-blue-700/50" />
                                            </div>
                                        )}
                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
                                            BUKA
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[15px] line-clamp-2 leading-snug">{event.title}</h4>
                                        {event.ustadz && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate font-medium">{event.ustadz}</p>
                                        )}

                                        <div className="mt-auto pt-6">
                                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-4">
                                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                                                    <Calendar size={14} />
                                                    <span>{event.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                </div>

                                                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-bold bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40">
                                                    Lihat <ChevronRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

                    {
                        activeCampaign ? (
                            <Link href="/admin/donations" className="block group">
                                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/40 dark:border-white/10 flex items-center gap-5 transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:-translate-y-1">
                                    <div className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-pink-100 dark:border-pink-800/50 shadow-sm relative overflow-hidden">
                                        {activeCampaign.flyer_url ? (
                                            <img src={activeCampaign.flyer_url} alt="Campaign" className="w-full h-full object-cover rounded-2xl absolute inset-0 opacity-80" />
                                        ) : (
                                            <HeartHandshake size={24} className="relative z-10" />
                                        )}
                                        <div className="absolute inset-0 bg-pink-500/20 dark:bg-pink-500/40 mix-blend-overlay"></div>
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{activeCampaign.title}</h4>
                                        <div className="mt-2">
                                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                                <span className="font-medium text-pink-600">{formatRupiah(activeCampaign.current_amount)}</span>
                                                <span>dari {formatRupiah(activeCampaign.target_amount)}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (activeCampaign.current_amount / activeCampaign.target_amount) * 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all">
                                        <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-white" />
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-white/10 border-dashed">
                                Belum ada program penggalangan dana aktif
                            </div>
                        )
                    }
                </div>

                {/* Artikel Terbaru Section */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">Artikel & Publikasi</h3>
                        <Link href="/admin/articles" className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline">
                            Lihat Semua <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    {
                        latestArticle ? (
                            <Link href={`/admin/articles/${latestArticle.slug}`} className="block group">
                                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/40 dark:border-white/10 flex items-center gap-5 transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:-translate-y-1">
                                    <div className="bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-sky-100 dark:border-sky-800/50 shadow-sm relative overflow-hidden">
                                        {latestArticle.flyer_url ? (
                                            <img src={latestArticle.flyer_url} alt="Article Thumbnail" className="w-full h-full object-cover rounded-2xl absolute inset-0 opacity-80" />
                                        ) : (
                                            <Newspaper size={24} className="relative z-10" />
                                        )}
                                        <div className="absolute inset-0 bg-sky-500/10 dark:bg-sky-500/30 mix-blend-overlay"></div>
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{latestArticle.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate font-medium">{latestArticle.excerpt}</p>
                                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                                            <span className="bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-md">{latestArticle.category}</span>
                                            {latestArticle.published_at && (
                                                <span>{new Date(latestArticle.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all">
                                        <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-white" />
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-white/10 border-dashed">
                                Belum ada artikel dipublikasikan
                            </div>
                        )
                    }
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
                        <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center">
                            {selectedEvent.flyer_url ? (
                                <img src={selectedEvent.flyer_url} alt="Flyer" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="text-slate-400 dark:text-slate-500 flex flex-col items-center gap-3 relative z-10 w-32 h-32 rounded-3xl bg-white/50 dark:bg-slate-900/50 shadow-sm border border-white dark:border-slate-700 justify-center backdrop-blur-sm">
                                    <Calendar size={48} className="text-blue-500/50" />
                                    <span className="text-xs font-medium">Brosur Kosong</span>
                                </div>
                            )}

                            {/* Gradient Overlay for text readability */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                            >
                                <X size={16} strokeWidth={3} />
                            </button>

                            {/* Date Badge */}
                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                                <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg w-8 h-8 flex flex-col items-center justify-center leading-none">
                                    <span className="text-[8px] font-bold uppercase">{selectedEvent.date.toLocaleString('default', { month: 'short' })}</span>
                                    <span className="font-bold">{selectedEvent.date.getDate()}</span>
                                </div>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    {selectedEvent.time} WIB
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wide uppercase ${selectedEvent.category === 'KAJIAN' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' :
                                    selectedEvent.category === 'RAPAT' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
                                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                    {selectedEvent.category}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2">
                                {selectedEvent.title}
                            </h2>

                            <div className="space-y-4 mt-6">
                                {selectedEvent.ustadz && (
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/30">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">Pemateri / Ustadz</p>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedEvent.ustadz}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 shadow-sm border border-slate-200/50 dark:border-slate-700">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Lokasi</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Masjid Utama</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
