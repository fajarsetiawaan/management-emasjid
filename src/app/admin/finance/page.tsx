'use client';

import { useState, useEffect, useRef } from 'react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Search,
    SlidersHorizontal,
    Layers,
    Wallet,
    TrendingUp,
    MoreHorizontal,
    CreditCard,
    Plus,
    Send,
    Download,
    PieChart,
    Activity,
    Calendar,
    ChevronDown,
    X,
    Filter
} from 'lucide-react';
import { TransactionType, Transaction, AssetAccount, Program, TransactionCategory } from '@/types';
import { getTransactions, getAssetAccounts, getPrograms, getTotalBalance, getMosque } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

type DateFilterType = 'ALL' | 'WEEK' | 'MONTH' | 'CUSTOM';

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<TransactionType>('INCOME');

    // Filters State
    const [dateFilter, setDateFilter] = useState<DateFilterType>('MONTH');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

    const [selectedProgramId, setSelectedProgramId] = useState<string>('ALL');
    const [showProgramMenu, setShowProgramMenu] = useState(false);

    // Refs for click outside
    const dateFilterRef = useRef<HTMLDivElement>(null);
    const programFilterRef = useRef<HTMLDivElement>(null);

    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<AssetAccount[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [mosqueName, setMosqueName] = useState('Masjid');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ... (data loading) ...
        const loadData = async () => {
            // ...
            try {
                const [txData, accData, progData, mosqueData] = await Promise.all([
                    getTransactions(),
                    getAssetAccounts(),
                    getPrograms(),
                    getMosque()
                ]);
                setTransactions(txData);
                setAccounts(accData);
                setPrograms(progData);
                setTotalBalance(getTotalBalance());
                setMosqueName(mosqueData.name);
            } catch (error) {
                console.error('Failed to load finance data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Click Outside Handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
                setShowFilterMenu(false);
            }
            if (programFilterRef.current && !programFilterRef.current.contains(event.target as Node)) {
                setShowProgramMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Filter Logic
    const getFilteredTransactions = () => {
        let filtered = transactions.filter(t => t.type === activeTab);

        // Date Filter
        const now = new Date();
        const startOfDay = (d: Date) => new Date(d.setHours(0, 0, 0, 0));

        switch (dateFilter) {
            case 'WEEK':
                const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                filtered = filtered.filter(t => t.date >= startOfDay(firstDayOfWeek));
                break;
            case 'MONTH':
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = filtered.filter(t => t.date >= firstDayOfMonth);
                break;
            case 'CUSTOM':
                if (customDateRange.start) {
                    filtered = filtered.filter(t => t.date >= new Date(customDateRange.start));
                }
                if (customDateRange.end) {
                    const endDate = new Date(customDateRange.end);
                    endDate.setHours(23, 59, 59, 999);
                    filtered = filtered.filter(t => t.date <= endDate);
                }
                break;
            case 'ALL':
            default:
                break;
        }

        // Program/Wallet Filter
        if (selectedProgramId !== 'ALL') {
            filtered = filtered.filter(t => t.programId === selectedProgramId);
        }

        return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
    };

    const filteredTransactions = getFilteredTransactions();

    // Calculate Monthly Stats (Always current month for consistency in "Month" view, or specific to filter?)
    // Let's make the bar chart reflect the *Filtered* view for better context.
    const chartIncome = filteredTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const chartExpense = filteredTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

    // If we want the bar chart to show Income vs Expense regardless of current tab:
    // We need to calculate ALL transactions in the current filter range, not just the active tab.
    const getAllFilteredTransactions = () => {
        let all = transactions;

        // Date Filter
        const now = new Date();
        const startOfDay = (d: Date) => new Date(d.setHours(0, 0, 0, 0));

        if (dateFilter === 'WEEK') {
            const first = new Date(now.setDate(now.getDate() - now.getDay()));
            all = all.filter(t => t.date >= startOfDay(first));
        } else if (dateFilter === 'MONTH') {
            const first = new Date(now.getFullYear(), now.getMonth(), 1);
            all = all.filter(t => t.date >= first);
        } else if (dateFilter === 'CUSTOM' && (customDateRange.start || customDateRange.end)) {
            if (customDateRange.start) all = all.filter(t => t.date >= new Date(customDateRange.start));
            if (customDateRange.end) {
                const endDate = new Date(customDateRange.end);
                endDate.setHours(23, 59, 59, 999);
                all = all.filter(t => t.date <= endDate);
            }
        }

        // Program Filter
        if (selectedProgramId !== 'ALL') {
            all = all.filter(t => t.programId === selectedProgramId);
        }

        return all;
    };

    const allFiltered = getAllFilteredTransactions();
    const totalFilteredIncome = allFiltered.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalFilteredExpense = allFiltered.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

    const totalFlow = totalFilteredIncome + totalFilteredExpense;
    const incomeGenerosity = totalFlow === 0 ? 0 : (totalFilteredIncome / totalFlow) * 100;
    const expenseBurn = totalFlow === 0 ? 0 : (totalFilteredExpense / totalFlow) * 100;

    // Group Transactions by Date
    const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
        const date = transaction.date;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let key = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

        if (date.toDateString() === today.toDateString()) {
            key = 'Hari Ini';
        } else if (date.toDateString() === yesterday.toDateString()) {
            key = 'Kemarin';
        }

        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(transaction);
        return groups;
    }, {} as Record<string, Transaction[]>);

    // Helpers
    const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Unknown Account';
    const getProgramName = (id: string) => programs.find(p => p.id === id)?.name || 'Unknown Program';

    // Category Helper to Replace Underscores
    const formatCategory = (cat?: string) => {
        if (!cat) return 'Uncategorized';
        return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 relative overflow-x-hidden font-sans tracking-tight selection:bg-emerald-500/30">
            {/* Ambient Background Mesh - Enhanced */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" />
                <div className="absolute top-[10%] right-[-20%] w-[60%] h-[60%] bg-emerald-500/20 dark:bg-emerald-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow delay-1000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-violet-500/20 dark:bg-violet-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
            </div>

            <div className="relative z-10 px-4 pt-4 md:max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Keuangan</h1>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Overview Kas & Neraca</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Date Filter Button */}
                        <div className="relative" ref={dateFilterRef}>
                            <button
                                onClick={() => {
                                    setShowFilterMenu(!showFilterMenu);
                                    setShowProgramMenu(false); // Exclusive open
                                }}
                                className={`h-10 px-3 rounded-full backdrop-blur-md border flex items-center justify-center gap-2 shadow-sm transition-all text-xs font-bold
                                ${dateFilter !== 'ALL'
                                        ? 'bg-emerald-500 text-white border-emerald-400'
                                        : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-white/40 dark:border-white/10'}`}
                            >
                                <Calendar size={14} />
                                <span>
                                    {dateFilter === 'ALL' ? 'Semua' :
                                        dateFilter === 'WEEK' ? 'Pekan Ini' :
                                            dateFilter === 'MONTH' ? 'Bulan Ini' : 'Custom'}
                                </span>
                                <ChevronDown size={14} />
                            </button>

                            <AnimatePresence>
                                {showFilterMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 origin-top-right overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-1">
                                            {[
                                                { id: 'ALL', label: 'Semua Transaksi' },
                                                { id: 'WEEK', label: 'Pekan Ini' },
                                                { id: 'MONTH', label: 'Bulan Ini' },
                                                { id: 'CUSTOM', label: 'Pilih Tanggal...' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => {
                                                        setDateFilter(opt.id as DateFilterType);
                                                        if (opt.id !== 'CUSTOM') setShowFilterMenu(false);
                                                    }}
                                                    className={`px-4 py-2.5 text-left text-xs font-bold rounded-xl transition-colors flex items-center justify-between
                                                    ${dateFilter === opt.id
                                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                                                >
                                                    {opt.label}
                                                    {dateFilter === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                                                </button>
                                            ))}

                                            {/* Custom Date Inputs */}
                                            {dateFilter === 'CUSTOM' && (
                                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mt-1 space-y-2 border border-slate-100 dark:border-slate-700">
                                                    <div>
                                                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Mulai</label>
                                                        <input
                                                            type="date"
                                                            value={customDateRange.start}
                                                            onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Selesai</label>
                                                        <input
                                                            type="date"
                                                            value={customDateRange.end}
                                                            onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => setShowFilterMenu(false)}
                                                        className="w-full py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold mt-2 hover:bg-emerald-600 transition-colors"
                                                    >
                                                        Terapkan
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button className="w-10 h-10 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm hover:scale-110 transition-transform active:scale-95">
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                {/* Holographic Credit Card - Visual Upgrade */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="relative w-full aspect-[1.586] rounded-[2rem] p-6 text-white overflow-hidden shadow-2xl shadow-emerald-500/30 dark:shadow-emerald-900/40 group cursor-pointer mb-8 border border-white/10"
                >
                    {/* Dark Modern Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] z-0"></div>

                    {/* Mesh Gradient Overlay */}
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-50 blur-3xl group-hover:opacity-70 transition-opacity duration-1000"></div>

                    {/* Noise Texture */}
                    <div className="absolute inset-0 opacity-[0.2] z-0 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                    {/* Holographic Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10"></div>

                    {/* Content */}
                    <div className="relative z-20 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <Wallet size={16} className="text-emerald-400" />
                                </div>
                                <span className="text-xs font-medium text-emerald-400 tracking-wider uppercase">Utama</span>
                            </div>
                            <div className="opacity-80">
                                <span className="text-xs font-mono tracking-widest">**** 8899</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Total Saldo</p>
                            <h2 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-md">
                                {formatRupiah(totalBalance).replace(/,00$/, '')}
                            </h2>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">HOLDER</p>
                                <p className="text-sm font-bold tracking-wide uppercase truncate max-w-[200px] text-slate-200">{mosqueName}</p>
                            </div>

                            {/* Visual Visa/Mastercard-like logo replacement */}
                            <div className="flex -space-x-3 opacity-90">
                                <div className="w-8 h-8 rounded-full bg-red-500/80 blur-[1px]"></div>
                                <div className="w-8 h-8 rounded-full bg-orange-500/80 blur-[1px]"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Monthly Insight Bar - Dynamic based on Filter */}
                <div className="mb-8 p-1">
                    <div className="flex justify-between items-end mb-2 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {dateFilter === 'ALL' ? 'Total Summary' :
                                dateFilter === 'WEEK' ? 'Weekly Summary' :
                                    dateFilter === 'MONTH' ? 'Monthly Summary' : 'Custom Period'}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 px-1">
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <ArrowDownLeft size={12} /> {formatRupiah(totalFilteredIncome).replace(/,00$/, '')}
                        </span>
                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            {formatRupiah(totalFilteredExpense).replace(/,00$/, '')} <ArrowUpRight size={12} />
                        </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${incomeGenerosity}%` }}
                            transition={{ duration: 1, ease: 'circOut' }}
                            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        />
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${expenseBurn}%` }}
                            transition={{ duration: 1, ease: 'circOut', delay: 0.2 }}
                            className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: Plus, label: 'Top Up', color: 'emerald' },
                        { icon: Send, label: 'Transfer', color: 'blue' },
                        { icon: Download, label: 'Report', color: 'violet' },
                        { icon: SlidersHorizontal, label: 'More', color: 'slate' }
                    ].map((btn, i) => (
                        <button key={btn.label} className="flex flex-col items-center gap-2 group">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ y: -5 }}
                                className={`w-14 h-14 rounded-[1.2rem] bg-${btn.color}-500 dark:bg-${btn.color}-600 text-white flex items-center justify-center shadow-lg shadow-${btn.color}-500/30 dark:shadow-${btn.color}-900/50 transition-all`}
                            >
                                <btn.icon size={24} strokeWidth={2.5} />
                            </motion.div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{btn.label}</span>
                        </button>
                    ))}
                </div>

                {/* Wallet Cards (Pos Keuangan) */}
                <div className="mb-8">
                    <div className="flex items-center justify-between px-2 mb-4">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <Layers size={16} className="text-emerald-500" />
                            Pos Keuangan
                        </h3>
                        <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Lihat Semua</button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-6 px-2 -mx-2 scrollbar-hide snap-x perspective-1000">
                        {programs.map((program, index) => (
                            <motion.div
                                key={program.id}
                                initial={{ opacity: 0, x: 50, rotateY: -10 }}
                                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                                whileHover={{ scale: 1.05, rotateY: 0, y: -5 }}
                                className="min-w-[150px] aspect-[4/5] p-5 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 snap-start relative overflow-hidden flex flex-col justify-between group cursor-pointer"
                            >
                                {/* Dynamic Background based on Program Color */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${program.color}-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-${program.color}-500/20 transition-colors`}></div>

                                <div className="relative z-10">
                                    <div className={`w-10 h-10 rounded-2xl bg-${program.color}-50 dark:bg-${program.color}-900/20 flex items-center justify-center mb-3 text-${program.color}-600 dark:text-${program.color}-400`}>
                                        <Layers size={20} className="drop-shadow-sm" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">DOMPET</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2 min-h-[2.5em]">
                                        {program.name}
                                    </p>
                                </div>

                                <div className="relative z-10">
                                    <p className="text-xs text-slate-400 mb-0.5 font-medium">Sisa Saldo</p>
                                    <h4 className={`text-base font-extrabold text-${program.color}-600 dark:text-${program.color}-400 tracking-tight`}>
                                        {formatRupiah(program.balance).replace(/,00$/, '').replace('Rp', '').trim()}
                                    </h4>
                                </div>
                            </motion.div>
                        ))}

                        {/* Add New Program Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="min-w-[80px] flex items-center justify-center rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 snap-start cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Filter & Tabs Control Row */}
                <div className="flex items-center gap-3 mb-6 px-4">
                    {/* Tabs - Glass Pill */}
                    <div className="flex-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-full flex relative z-0 shadow-inner">
                        {['INCOME', 'EXPENSE'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as TransactionType)}
                                className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 relative z-10
                                ${activeTab === tab
                                        ? (tab === 'INCOME' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400')
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="tab-bg"
                                        className="absolute inset-0 bg-white dark:bg-slate-800 shadow-lg shadow-black/5 dark:shadow-none rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {tab === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                            </button>
                        ))}
                    </div>

                    {/* Program/Wallet Filter Dropdown */}
                    <div className="relative shrink-0" ref={programFilterRef}>
                        <button
                            onClick={() => {
                                setShowProgramMenu(!showProgramMenu);
                                setShowFilterMenu(false); // Exclusive open
                            }}
                            className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg border transition-all relative z-10
                             ${selectedProgramId !== 'ALL'
                                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30'
                                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <Filter size={20} />
                            {selectedProgramId !== 'ALL' && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-slate-950">1</span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showProgramMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-14 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 origin-top-right overflow-hidden"
                                >
                                    <h4 className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400">Filter Dompet</h4>
                                    <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                                        <button
                                            onClick={() => {
                                                setSelectedProgramId('ALL');
                                                setShowProgramMenu(false);
                                            }}
                                            className={`px-3 py-2 text-left text-xs font-bold rounded-xl transition-colors flex items-center justify-between
                                            ${selectedProgramId === 'ALL'
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                                        >
                                            Semua Dompet
                                            {selectedProgramId === 'ALL' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                                        </button>

                                        {programs.map((program) => (
                                            <button
                                                key={program.id}
                                                onClick={() => {
                                                    setSelectedProgramId(program.id);
                                                    setShowProgramMenu(false);
                                                }}
                                                className={`px-3 py-2 text-left text-xs font-bold rounded-xl transition-colors flex items-center justify-between
                                                ${selectedProgramId === program.id
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                                            >
                                                {program.name}
                                                {selectedProgramId === program.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Transactions List */}
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-slate-400 text-xs">Syncing available...</p>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        key={activeTab}
                        className="space-y-6 pb-20"
                    >
                        {/* Empty State */}
                        {Object.keys(groupedTransactions).length === 0 && (
                            <motion.div variants={item} className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                                    <Filter size={24} />
                                </div>
                                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Belum ada transaksi di periode ini.</p>
                                <button
                                    onClick={() => setDateFilter('ALL')}
                                    className="text-xs text-emerald-500 font-bold mt-2"
                                >
                                    Tampilkan Semua
                                </button>
                            </motion.div>
                        )}

                        {Object.entries(groupedTransactions).map(([dateLabel, txs]) => (
                            <div key={dateLabel}>
                                <div className="sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-2 px-1 mb-2">
                                    <h3 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{dateLabel}</h3>
                                </div>
                                <div className="space-y-3">
                                    {txs.map((t) => (
                                        <motion.div
                                            key={t.id}
                                            variants={item}
                                            layout
                                            className="group relative bg-white dark:bg-slate-900 p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:shadow-emerald-900/10 transition-all active:scale-[0.98] cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0
                                                        ${t.type === 'INCOME'
                                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                        }`}>
                                                        {t.type === 'INCOME' ? <ArrowDownLeft size={20} strokeWidth={2.5} /> : <ArrowUpRight size={20} strokeWidth={2.5} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1 leading-snug">{t.description}</h4>

                                                        {/* Category & Program Tags */}
                                                        <div className="flex flex-wrap items-center gap-1.5">

                                                            {/* Actual Category Badge */}
                                                            {t.category && (
                                                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border tracking-wide uppercase
                                                                ${t.type === 'INCOME'
                                                                        ? 'bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                                        : 'bg-rose-100/50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                                                    }`}>
                                                                    {formatCategory(t.category)}
                                                                </span>
                                                            )}

                                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                                {getProgramName(t.programId)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`text-sm font-extrabold tracking-tight whitespace-nowrap mt-1 ${t.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {t.type === 'INCOME' ? '+' : '-'} {formatRupiah(t.amount).replace(/,00$/, '').replace('Rp', '')}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
