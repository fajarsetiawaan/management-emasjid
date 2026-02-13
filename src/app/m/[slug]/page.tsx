'use client';

import { useState, use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { interpolate, useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Building2, Calendar, FileText, User, Copy, ChevronRight, TrendingUp, TrendingDown, PieChart, Wallet, ShoppingBag, Zap, HeartHandshake, CircleDollarSign, Wrench } from 'lucide-react';
import { MOCK_MOSQUES, MOCK_TRANSACTIONS, MOCK_EVENTS } from '@/lib/mock-data';
import PrayerWidget from '@/components/public/PrayerWidget';
import { getPrayerTimes, PrayerTimes } from '@/lib/prayer-service';
import { Mosque } from '@/types';

export default function PublicMosquePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    // Validate Slug & Get Data
    const mosqueData = MOCK_MOSQUES.find(m => m.slug === slug);

    if (!mosqueData) {
        notFound();
    }

    // Rename for usage
    const mosque: Mosque = mosqueData;

    const [activeTab, setActiveTab] = useState<'LAPORAN' | 'AGENDA' | 'PROFIL'>('LAPORAN');
    const [reportType, setReportType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
    const [prayerTimings, setPrayerTimings] = useState<PrayerTimes | null>(null);

    useEffect(() => {
        // Fetch Prayer Times
        const fetchPrayers = async () => {
            const coords = mosque.latitude && mosque.longitude
                ? { lat: mosque.latitude, lng: mosque.longitude }
                : undefined;
            const data = await getPrayerTimes(mosque.city, coords);
            setPrayerTimings(data);
        };
        fetchPrayers();
    }, [mosque.city, mosque.latitude, mosque.longitude]);

    // Helpers
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    // Category Icons Helper
    const getCategoryIcon = (category: string) => {
        const cat = category.toUpperCase();
        if (cat.includes('INFAQ') || cat.includes('JUMAT')) return Wallet;
        if (cat.includes('OPERASIONAL')) return Zap;
        if (cat.includes('MAINTENANCE') || cat.includes('PERBAIKAN')) return Wrench;
        if (cat.includes('ZAKAT') || cat.includes('SOSIAL')) return HeartHandshake;
        if (cat.includes('KEGIATAN') || cat.includes('ACARA')) return Calendar;
        if (cat.includes('BELANJA') || cat.includes('KEBUTUHAN')) return ShoppingBag;
        return CircleDollarSign;
    };

    // Content Generators
    const renderLaporan = () => {
        // Calculate Monthly Stats
        const currentMonth = new Date().getMonth();
        const monthlyTransactions = MOCK_TRANSACTIONS.filter(t => t.date.getMonth() === currentMonth);

        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'INCOME')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const monthlyExpense = monthlyTransactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, curr) => acc + curr.amount, 0);

        // Group by Category
        const incomeByCategory = monthlyTransactions
            .filter(t => t.type === 'INCOME')
            .reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
                return acc;
            }, {} as Record<string, number>);

        const expenseByCategory = monthlyTransactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
                return acc;
            }, {} as Record<string, number>);

        // Sort Categories
        const sortedIncomeCategories = Object.entries(incomeByCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, amount]) => ({ cat, amount, percentage: (amount / monthlyIncome) * 100 }));

        const sortedExpenseCategories = Object.entries(expenseByCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, amount]) => ({ cat, amount, percentage: (amount / monthlyExpense) * 100 }));

        const activeData = reportType === 'INCOME' ? sortedIncomeCategories : sortedExpenseCategories;
        const activeColor = reportType === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500';
        const activeGradient = reportType === 'INCOME' ? 'from-emerald-500 to-emerald-600' : 'from-rose-500 to-rose-600';
        const activeShadow = reportType === 'INCOME' ? 'shadow-emerald-500/20' : 'shadow-rose-500/20';
        const activeTextColor = reportType === 'INCOME' ? 'text-emerald-600' : 'text-rose-600';
        const activeLabel = reportType === 'INCOME' ? 'Pemasukan' : 'Pengeluaran';

        return (
            <div className="space-y-8 pb-32">
                {/* Hero Balance (Apple Style) */}
                <div className="pt-6 pb-2 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block"
                    >
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Saldo Kas Aktif
                        </p>
                        <h2 className="text-[3.5rem] leading-none font-black text-slate-800 tracking-tighter drop-shadow-sm">
                            <span className="text-xl align-top text-slate-400 font-bold mr-1 relative top-2">Rp</span>
                            {formatRupiah(mosque.balance).replace('Rp', '').split(',')[0]}
                        </h2>
                    </motion.div>
                </div>

                {/* Monthly Summary (Interactive Cards - Premium Gradients) */}
                <div className="grid grid-cols-2 gap-4 px-1">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ y: -2 }}
                        onClick={() => setReportType('INCOME')}
                        className={`p-6 rounded-[2rem] text-left relative overflow-hidden transition-all duration-300 group border ${reportType === 'INCOME'
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/30 border-emerald-400'
                            : 'bg-white text-slate-400 border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-md'
                            }`}
                    >
                        {/* Pattern Overlay */}
                        {reportType === 'INCOME' && (
                            <>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
                            </>
                        )}

                        <div className="relative z-10">
                            <div className={`flex items-center gap-2 mb-8 transition-opacity duration-300 ${reportType === 'INCOME' ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                <div className={`p-2 rounded-full transition-colors duration-300 ${reportType === 'INCOME' ? 'bg-white/20 backdrop-blur-md text-white' : 'bg-emerald-50 text-emerald-500'
                                    }`}>
                                    <ArrowDownLeft size={16} strokeWidth={3} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Masuk</span>
                            </div>
                            <p className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${reportType === 'INCOME' ? 'text-white' : 'text-slate-800'}`}>
                                {formatRupiah(monthlyIncome).replace(',00', '')}
                            </p>
                            <div className={`flex items-center gap-1 mt-1.5 transition-opacity ${reportType === 'INCOME' ? 'opacity-80' : 'opacity-0'}`}>
                                <TrendingUp size={12} strokeWidth={3} />
                                <span className="text-[10px] font-bold">+12% vs lalu</span>
                            </div>
                        </div>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ y: -2 }}
                        onClick={() => setReportType('EXPENSE')}
                        className={`p-6 rounded-[2rem] text-left relative overflow-hidden transition-all duration-300 group border ${reportType === 'EXPENSE'
                            ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-xl shadow-rose-500/30 border-rose-400'
                            : 'bg-white text-slate-400 border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-md'
                            }`}
                    >
                        {/* Pattern Overlay */}
                        {reportType === 'EXPENSE' && (
                            <>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
                            </>
                        )}

                        <div className="relative z-10">
                            <div className={`flex items-center gap-2 mb-8 transition-opacity duration-300 ${reportType === 'EXPENSE' ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                <div className={`p-2 rounded-full transition-colors duration-300 ${reportType === 'EXPENSE' ? 'bg-white/20 backdrop-blur-md text-white' : 'bg-rose-50 text-rose-500'
                                    }`}>
                                    <ArrowUpRight size={16} strokeWidth={3} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Keluar</span>
                            </div>
                            <p className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${reportType === 'EXPENSE' ? 'text-white' : 'text-slate-800'}`}>
                                {formatRupiah(monthlyExpense).replace(',00', '')}
                            </p>
                            <div className={`flex items-center gap-1 mt-1.5 transition-opacity ${reportType === 'EXPENSE' ? 'opacity-80' : 'opacity-0'}`}>
                                <TrendingDown size={12} strokeWidth={3} />
                                <span className="text-[10px] font-bold">+5% vs lalu</span>
                            </div>
                        </div>
                    </motion.button>
                </div>

                {/* Dynamic Analysis Section (Muted Background Container) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            Analisa {activeLabel}
                            <span className={`text-[10px] px-2.5 py-1 rounded-full bg-slate-100 uppercase tracking-wider font-bold ${activeTextColor}`}>
                                {reportType === 'INCOME' ? 'Detail Sumber' : 'Detail Alokasi'}
                            </span>
                        </h3>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={reportType}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="bg-white p-6 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80 relative overflow-hidden"
                        >
                            {/* Subtle Background Pattern */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />

                            <div className="space-y-6">
                                {activeData.slice(0, 4).map((item, idx) => {
                                    const Icon = getCategoryIcon(item.cat);
                                    return (
                                        <div key={idx} className="group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-sm border border-slate-100 transition-colors duration-300 ${reportType === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                        }`}>
                                                        <Icon size={20} strokeWidth={2} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm mb-0.5">{item.cat.replace(/_/g, ' ')}</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">{item.percentage.toFixed(1)}%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-slate-800 text-sm mt-1">{formatRupiah(item.amount).replace(',00', '')}</p>
                                            </div>
                                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.percentage}%` }}
                                                    transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                                    className={`h-full rounded-full shadow-sm bg-gradient-to-r ${activeGradient}`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                {activeData.length === 0 && (
                                    <div className="text-center py-12 flex flex-col items-center justify-center opacity-50">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                            <PieChart size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400">Belum ada data {activeLabel.toLowerCase()}.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Recent Transactions List (Glassy List) */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">Mutasi Terbaru</h3>
                        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1 transition-colors">
                            Lihat Semua <ChevronRight size={12} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="space-y-3 relative">
                        {/* Connecting Line (Timeline Style) */}
                        <div className="absolute left-[29px] top-6 bottom-6 w-[2px] bg-slate-100 -z-10 rounded-full"></div>

                        {MOCK_TRANSACTIONS.slice(0, 5).map((t, idx) => {
                            const Icon = getCategoryIcon(t.category);
                            return (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (idx * 0.05) }}
                                    className="flex items-center justify-between py-3 px-3 bg-white hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group"
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-4 ring-white z-10 ${t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                            }`}>
                                            <Icon size={18} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{t.description}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{formatDate(t.date)} • {t.category.replace(/_/g, ' ')}</p>
                                        </div>
                                    </div>
                                    <div className={`font-bold text-sm ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'
                                        }`}>
                                        {t.type === 'INCOME' ? '+' : '-'} {formatRupiah(t.amount).replace(',00', '')}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderAgenda = () => {
        const publicEvents = MOCK_EVENTS.filter(e => e.status === 'UPCOMING');
        return (
            <div className="space-y-4">
                <h3 className="font-bold text-slate-800">Agenda Mendatang</h3>
                {publicEvents.map((event) => (
                    <div key={event.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4">
                        <div className="bg-blue-50 text-blue-600 w-16 flex-shrink-0 flex flex-col items-center justify-center rounded-lg border border-blue-100">
                            <span className="text-xs font-bold uppercase">{event.date.toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-2xl font-bold leading-none">{event.date.getDate()}</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{event.title}</h4>
                            <p className="text-sm text-slate-500">{event.ustadz}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                                <Calendar size={12} /> {event.time} WIB
                            </div>
                        </div>
                    </div>
                ))}
                {publicEvents.length === 0 && (
                    <div className="text-center py-12 text-slate-400">Belum ada agenda publik.</div>
                )}
            </div>
        );
    };

    const renderProfil = () => {
        return (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                        <Building2 size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{mosque.name}</h2>
                    <p className="text-sm text-slate-500 mt-2">{mosque.address}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">Rekening Donasi</h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Bank Syariah Indonesia (BSI)</p>
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-mono font-bold text-slate-800">7700 8800 99</p>
                            <button className="text-emerald-600 hover:text-emerald-700">
                                <Copy size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">a.n. DKM Masjid Raya Bogor</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex justify-center">
            <div className="w-full max-w-[480px] bg-white min-h-screen shadow-xl flex flex-col relative">
                {/* Header (Transparent & Absolute) */}
                <header className="absolute top-0 left-0 w-full p-6 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-white leading-tight drop-shadow-sm">{mosque.name}</h1>
                            <p className="text-xs text-emerald-50 opacity-90">Public Access</p>
                        </div>
                    </div>
                </header>

                {/* Prayer Times Widget (Hero) */}
                <PrayerWidget city={mosque.city} timings={prayerTimings} />

                {/* Tab Navigation (Sticky Segmented Control) */}
                <div className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur-xl py-3 px-4 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                    <div className="bg-slate-200/50 p-1 rounded-2xl flex relative">
                        {[
                            { id: 'LAPORAN', label: 'Keuangan', icon: PieChart },
                            { id: 'AGENDA', label: 'Agenda', icon: Calendar },
                            { id: 'PROFIL', label: 'Profil', icon: Building2 },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all relative z-10
                    ${activeTab === tab.id
                                        ? 'text-slate-800'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }
                  `}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="active-tab-segment"
                                        className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] -z-10"
                                    />
                                )}
                                <tab.icon size={16} strokeWidth={2.5} className={activeTab === tab.id ? "text-emerald-600" : ""} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <main className="flex-1 p-5 bg-slate-50 min-h-screen">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {activeTab === 'LAPORAN' && renderLaporan()}
                            {activeTab === 'AGENDA' && renderAgenda()}
                            {activeTab === 'PROFIL' && renderProfil()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
