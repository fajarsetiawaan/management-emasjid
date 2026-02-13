'use client';

import { useState } from 'react';
import { MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { ArrowDownLeft, ArrowUpRight, ListFilter, Search, SlidersHorizontal } from 'lucide-react';
import { TransactionType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<TransactionType>('INCOME');

    const filteredTransactions = MOCK_TRANSACTIONS.filter(
        (t) => t.type === activeTab
    ).sort((a, b) => b.date.getTime() - a.date.getTime());

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
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between px-1 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Keuangan</h1>
                    <p className="text-slate-500 text-xs font-medium">Laporan kas masuk & keluar</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 group">
                    <SlidersHorizontal size={20} className="stroke-[1.5] group-hover:stroke-emerald-600 transition-colors" />
                </button>
            </div>

            {/* Premium Segmented Control */}
            <div className="bg-slate-100 p-1 rounded-2xl flex relative z-0 shadow-inner">
                <button
                    onClick={() => setActiveTab('INCOME')}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative z-10
            ${activeTab === 'INCOME' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {activeTab === 'INCOME' && (
                        <motion.div
                            layoutId="tab-bg"
                            className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-xl -z-10 border border-black/5"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${activeTab === 'INCOME' ? 'bg-emerald-100/50 text-emerald-600' : 'bg-transparent text-slate-400'}`}>
                        <ArrowDownLeft size={16} className="stroke-[2.5]" />
                    </span>
                    Pemasukan
                </button>
                <button
                    onClick={() => setActiveTab('EXPENSE')}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative z-10
            ${activeTab === 'EXPENSE' ? 'text-rose-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {activeTab === 'EXPENSE' && (
                        <motion.div
                            layoutId="tab-bg"
                            className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-xl -z-10 border border-black/5"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${activeTab === 'EXPENSE' ? 'bg-rose-100/50 text-rose-600' : 'bg-transparent text-slate-400'}`}>
                        <ArrowUpRight size={16} className="stroke-[2.5]" />
                    </span>
                    Pengeluaran
                </button>
            </div>

            {/* Transaction List */}
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
                            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] flex items-center justify-between group active:scale-[0.98] transition-all hover:border-emerald-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-300
                                ${t.type === 'INCOME'
                                        ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                                        : 'bg-rose-50 text-rose-600 group-hover:bg-rose-100'
                                    }`}>
                                    {t.type === 'INCOME' ? <ArrowDownLeft size={20} className="stroke-[2.5]" /> : <ArrowUpRight size={20} className="stroke-[2.5]" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1">{t.description}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-medium text-slate-400">
                                            {formatDate(t.date)}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                                            {t.category.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={`text-sm font-bold tracking-tight ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
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
        </div>
    );
}
