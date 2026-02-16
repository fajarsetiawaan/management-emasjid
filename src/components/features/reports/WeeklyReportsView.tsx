'use client';

import { useMemo, useState } from 'react';
import { Transaction } from '@/types';
import { motion } from 'framer-motion';
import SummaryCard from './SummaryCard';
import { ChevronLeft, ChevronRight, Mic, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface WeeklyReportsViewProps {
    transactions: Transaction[];
    netBalance: number; // Current total balance
}

export default function WeeklyReportsView({ transactions, netBalance }: WeeklyReportsViewProps) {
    // State for "End Friday" (Default to today/upcoming Friday)
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Helper: Get the Friday of the week for a given date
    const getFriday = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -2 : 5); // Adjust to Friday
        return new Date(date.setDate(diff));
    };

    // Calculate Period
    const currentFriday = useMemo(() => getFriday(selectedDate), [selectedDate]);
    const prevFriday = useMemo(() => {
        const d = new Date(currentFriday);
        d.setDate(d.getDate() - 7);
        return d;
    }, [currentFriday]);

    // Filter Logic
    const weeklyData = useMemo(() => {
        // Transactions strictly AFTER previous Friday 12:00 PM (ish) until current Friday 12:00 PM
        // For simplicity: From Prev Friday (exclusive) to Current Friday (inclusive)

        // Normalize dates to end of day for easy comparison or specific timestamps
        // Let's assume period is: Last Friday (after report) to This Friday (before report)
        const start = new Date(prevFriday);
        start.setHours(23, 59, 59, 999); // Start counting from Saturday 00:00 basically? 
        // Or actually common practice: Friday after Jumatan until Next Friday right before Jumatan.
        // Let's use: Date > PrevFriday AND Date <= CurrentFriday

        const end = new Date(currentFriday);
        end.setHours(23, 59, 59, 999);

        const txs = transactions.filter(t => {
            const d = new Date(t.date);
            // Check if date strictly greater than prev friday (ignoring time for now, just date based)
            // Actually, simpler: Any transaction ON or AFTER (PrevFriday + 1 day) AND ON or BEFORE CurrentFriday
            // Common usage: Laporan Jumatan includes transactions UP TO the moment of reporting.

            // To exclude last week's transactions from this week's count:
            const dTime = d.getTime();
            const prevTime = prevFriday.setHours(23, 59, 59, 999); // End of last Friday
            const currTime = end.getTime();

            return dTime > prevTime && dTime <= currTime;
        });

        const income = txs.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
        const expense = txs.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

        return { income, expense, txs };
    }, [currentFriday, prevFriday, transactions]);

    // Calculate "Opening Balance" (Saldo Awal Jumat Lalu)
    // Formula: Current Real Balance - (IncomeDiff - ExpenseDiff) from NOW backwards?
    // OR: Current Real Balance - (All Income since PrevFriday) + (All Expense since PrevFriday)
    // Wait, transactions might be in future? No.
    // Let's assume netBalance passed in is the TOTAL balance RIGHT NOW (including everything).
    // If selectedDate is NOT this week, we need to calculate rolling balance.
    // Rolling Balance Logic:
    // Balance at End of CurrentFriday = Total Balance - (Transactions AFTER CurrentFriday)

    const balanceAtEndOfWeek = useMemo(() => {
        // Find all transactions AFTER this period
        const periodEnd = new Date(currentFriday);
        periodEnd.setHours(23, 59, 59, 999);

        const futureTxs = transactions.filter(t => new Date(t.date).getTime() > periodEnd.getTime());
        const futureIncome = futureTxs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
        const futureExpense = futureTxs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

        // Backtrack from current total real balance
        return netBalance - futureIncome + futureExpense;
    }, [currentFriday, transactions, netBalance]);

    const openingBalance = balanceAtEndOfWeek - weeklyData.income + weeklyData.expense;

    // Navigation Handlers
    const handlePrevWeek = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 7);
        setSelectedDate(d);
    };

    const handleNextWeek = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 7);
        setSelectedDate(d);
    };

    const formatDate = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const formatRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    // Copy to Clipboard Support
    const announcementText = `Laporan Keuangan Masjid\n${formatDate(prevFriday)} s.d. ${formatDate(currentFriday)}\n\nSaldo Awal: ${formatRp(openingBalance)}\nPemasukan: ${formatRp(weeklyData.income)}\nPengeluaran: ${formatRp(weeklyData.expense)}\n\nSaldo Akhir: ${formatRp(balanceAtEndOfWeek)}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(announcementText);
        toast.success("Naskah laporan disalin!");
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            {/* Week Navigation */}
            <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-white/50 dark:border-slate-800/50 backdrop-blur-xl">
                <button onClick={handlePrevWeek} className="p-2 hover:bg-white/50 rounded-full transition-colors"><ChevronLeft /></button>
                <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Periode Laporan</p>
                    <p className="font-bold text-slate-800 dark:text-white">
                        {formatDate(prevFriday)} - {formatDate(currentFriday)}
                    </p>
                </div>
                <button onClick={handleNextWeek} className="p-2 hover:bg-white/50 rounded-full transition-colors"><ChevronRight /></button>
            </div>

            {/* Announcement Script Card */}
            <motion.div
                variants={item}
                className="relative overflow-hidden rounded-[2.5rem] p-1 shadow-2xl"
            >
                {/* Animated Gradient Border/Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-fuchsia-500 to-indigo-600 opacity-100 dark:opacity-80"></div>

                <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[2.3rem] p-6 sm:p-8 overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                                    <Mic size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                                        Laporan Jumat
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">
                                        {formatDate(prevFriday)} - {formatDate(currentFriday)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all font-semibold text-sm"
                            >
                                <Copy size={16} className="group-hover:scale-110 transition-transform" />
                                <span>Salin Teks</span>
                            </button>
                        </div>

                        {/* Main Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Saldo Awal */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                                <p className="text-sm font-medium text-slate-500 mb-1">Saldo Jumat Lalu</p>
                                <p className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300 tracking-tight">
                                    {formatRp(openingBalance)}
                                </p>
                            </div>

                            {/* Mutasi */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-500">Pemasukan</span>
                                    <span className="text-base font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-lg">
                                        + {formatRp(weeklyData.income)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-500">Pengeluaran</span>
                                    <span className="text-base font-bold text-rose-600 bg-rose-100 dark:bg-rose-500/20 px-2 py-0.5 rounded-lg">
                                        - {formatRp(weeklyData.expense)}
                                    </span>
                                </div>
                            </div>

                            {/* Saldo Akhir - Highlighted */}
                            <div className="md:col-span-1 bg-gradient-to-br from-violet-600 to-indigo-700 p-5 rounded-3xl text-white shadow-lg shadow-indigo-500/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>
                                <p className="text-indigo-100 text-sm font-medium mb-1 relative z-10">Saldo Akhir Saat Ini</p>
                                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight relative z-10">
                                    {formatRp(balanceAtEndOfWeek)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Transaction List for this Week */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Section */}
                <motion.div variants={item} className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-lg">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            Pemasukan
                        </h3>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 px-2.5 py-1 rounded-full">
                            {weeklyData.txs.filter(t => t.type === 'INCOME').length} Transaksi
                        </span>
                    </div>

                    {weeklyData.txs.filter(t => t.type === 'INCOME').length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 text-center bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-400">
                                <Check size={20} />
                            </div>
                            <p className="text-sm font-medium text-slate-500">Belum ada pemasukan minggu ini</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {weeklyData.txs.filter(t => t.type === 'INCOME').map((t, i) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative bg-white/80 dark:bg-slate-900/80 p-5 rounded-3xl flex justify-between items-center shadow-sm hover:shadow-md border border-white/50 dark:border-slate-700/50 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-600 shadow-inner">
                                            ↓
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-0.5 text-[0.95rem] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                                {t.description}
                                            </p>
                                            <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                                {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base tracking-tight whitespace-nowrap">
                                        + {formatRp(t.amount)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Expense Section */}
                <motion.div variants={item} className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-lg">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                            Pengeluaran
                        </h3>
                        <span className="text-xs font-semibold text-rose-600 bg-rose-100 dark:bg-rose-500/20 px-2.5 py-1 rounded-full">
                            {weeklyData.txs.filter(t => t.type === 'EXPENSE').length} Transaksi
                        </span>
                    </div>

                    {weeklyData.txs.filter(t => t.type === 'EXPENSE').length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 text-center bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-400">
                                <Check size={20} />
                            </div>
                            <p className="text-sm font-medium text-slate-500">Belum ada pengeluaran minggu ini</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {weeklyData.txs.filter(t => t.type === 'EXPENSE').map((t, i) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative bg-white/80 dark:bg-slate-900/80 p-5 rounded-3xl flex justify-between items-center shadow-sm hover:shadow-md border border-white/50 dark:border-slate-700/50 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold bg-rose-100/80 dark:bg-rose-500/20 text-rose-600 shadow-inner">
                                            ↑
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-0.5 text-[0.95rem] group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
                                                {t.description}
                                            </p>
                                            <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                                {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-rose-600 dark:text-rose-400 text-base tracking-tight whitespace-nowrap">
                                        - {formatRp(t.amount)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
