'use client';

import { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, ListFilter, Search, SlidersHorizontal, Layers, Wallet } from 'lucide-react';
import { TransactionType, Transaction, AssetAccount, Program } from '@/types';
import { getTransactions, getAssetAccounts, getPrograms } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<TransactionType>('INCOME');

    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<AssetAccount[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [txData, accData, progData] = await Promise.all([
                    getTransactions(),
                    getAssetAccounts(),
                    getPrograms()
                ]);
                setTransactions(txData);
                setAccounts(accData);
                setPrograms(progData);
            } catch (error) {
                console.error('Failed to load finance data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter Logic
    const filteredTransactions = transactions.filter(
        (t) => t.type === activeTab
    ).sort((a, b) => b.date.getTime() - a.date.getTime());

    // Helpers to find names
    const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Unknown Account';
    const getProgramName = (id: string) => programs.find(p => p.id === id)?.name || 'Unknown Program';
    const getProgramColor = (id: string) => programs.find(p => p.id === id)?.color || 'slate';

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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6 p-1 min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300">
            <div className="flex items-center justify-between px-1 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Keuangan</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Laporan kas masuk & keluar</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 group">
                    <SlidersHorizontal size={20} className="stroke-[1.5] group-hover:stroke-emerald-600 dark:group-hover:stroke-emerald-400 transition-colors" />
                </button>
            </div>

            {/* Premium Segmented Control */}
            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl flex relative z-0 shadow-inner">
                <button
                    onClick={() => setActiveTab('INCOME')}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative z-10
            ${activeTab === 'INCOME' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    {activeTab === 'INCOME' && (
                        <motion.div
                            layoutId="tab-bg"
                            className="absolute inset-0 bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-none rounded-xl -z-10 border border-black/5 dark:border-slate-700"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${activeTab === 'INCOME' ? 'bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-transparent text-slate-400 dark:text-slate-600'}`}>
                        <ArrowDownLeft size={16} className="stroke-[2.5]" />
                    </span>
                    Pemasukan
                </button>
                <button
                    onClick={() => setActiveTab('EXPENSE')}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative z-10
            ${activeTab === 'EXPENSE' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    {activeTab === 'EXPENSE' && (
                        <motion.div
                            layoutId="tab-bg"
                            className="absolute inset-0 bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-none rounded-xl -z-10 border border-black/5 dark:border-slate-700"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${activeTab === 'EXPENSE' ? 'bg-rose-100/50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-transparent text-slate-400 dark:text-slate-600'}`}>
                        <ArrowUpRight size={16} className="stroke-[2.5]" />
                    </span>
                    Pengeluaran
                </button>
            </div>

            {/* Transaction List */}
            {loading ? (
                <div className="py-10 text-center text-slate-400">Loading data...</div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    key={activeTab} // Retrigger animation on tab change
                    className="space-y-3"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredTransactions.map((t) => (
                            <motion.div
                                key={t.id}
                                variants={item}
                                className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_15px_rgb(0,0,0,0.03)] flex items-center justify-between group active:scale-[0.98] transition-all hover:border-emerald-100 dark:hover:border-emerald-900 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300
                                    ${t.type === 'INCOME'
                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30'
                                            : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30'
                                        }`}>
                                        {t.type === 'INCOME' ? <ArrowDownLeft size={20} className="stroke-[2.5]" /> : <ArrowUpRight size={20} className="stroke-[2.5]" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight mb-1">{t.description}</h4>
                                        <div className="flex items-center gap-3 mt-1">

                                            {/* Date */}
                                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                                {formatDate(t.date)}
                                            </span>

                                            {/* Program Badge */}
                                            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide border border-slate-100 dark:border-slate-700">
                                                <Layers size={10} className="text-slate-400 dark:text-slate-500" />
                                                {getProgramName(t.programId)}
                                            </div>

                                            {/* Account Badge */}
                                            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                                                <Wallet size={10} className="text-slate-400 dark:text-slate-500" />
                                                {getAccountName(t.accountId)}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className={`text-sm font-bold tracking-tight ${t.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'} {formatRupiah(t.amount)}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredTransactions.length === 0 && (
                        <motion.div variants={item} className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                                <Search size={24} />
                            </div>
                            <p className="text-slate-400 text-sm font-medium">Belum ada transaksi catat.</p>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
