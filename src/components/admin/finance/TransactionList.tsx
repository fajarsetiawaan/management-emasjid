'use client';

import {
    Search,
    TrendingUp,
    Activity,
    Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction, Program } from '@/types';
import { formatRupiah, formatCategory } from '@/lib/formatter';

interface TransactionListProps {
    transactions: Transaction[];
    programs: Program[];
}

export default function TransactionList({ transactions, programs }: TransactionListProps) {
    // Group transactions by date for sticky headers
    // Group transactions by date for sticky headers
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const dateObj = new Date(transaction.date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let dateKey = '';

        if (dateObj.toDateString() === today.toDateString()) {
            dateKey = 'Hari Ini';
        } else if (dateObj.toDateString() === yesterday.toDateString()) {
            dateKey = 'Kemarin';
        } else {
            dateKey = dateObj.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(transaction);
        return groups;
    }, {} as Record<string, Transaction[]>);

    const getProgramName = (id: string) => programs.find(p => p.id === id)?.name || 'Unknown Program';

    if (transactions.length === 0) {
        return (
            <div className="py-20 text-center flex flex-col items-center opacity-60">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Search size={32} />
                </div>
                <p className="text-slate-500 font-medium">Belum ada transaksi</p>
                <p className="text-xs text-slate-400">Coba ubah filter tanggal atau kategori</p>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {Object.entries(groupedTransactions).map(([date, items], groupIndex) => (
                <div key={date} className="relative">
                    {/* Sticky Date Header */}
                    <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-2 border-b border-slate-100 dark:border-slate-800/50 shadow-sm flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{date}</h3>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{items.length} Transaksi</span>
                    </div>

                    {/* Items */}
                    <div className="px-4 py-2 space-y-3">
                        {items.map((t, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={t.id}
                                className="group bg-white dark:bg-slate-800/40 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-sm border border-slate-100 dark:border-slate-700 
                                        ${t.type === 'INCOME'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                                            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'}`}>

                                        {/* Income Icons */}
                                        {(t.category === 'INFAQ_JUMAT' || t.category === 'INFAQ_UMUM') && <TrendingUp size={20} />}
                                        {(t.category === 'ZAKAT_FITRAH' || t.category === 'ZAKAT_MAL') && <Activity size={20} />}
                                        {t.category === 'WAKAF' && <Wallet size={20} />}
                                        {t.category === 'DONASI' && <Wallet size={20} />}

                                        {/* Expense Icons */}
                                        {t.category === 'OPERASIONAL' && <Activity size={20} />}
                                        {t.category === 'PEMBANGUNAN' && <Activity size={20} />}
                                        {(t.category === 'HONOR_PETUGAS' || t.category === 'SANTUNAN' || t.category === 'SOSIAL_YATIM') && <Wallet size={20} />}

                                        {/* Fallback */}
                                        {!t.category && <Wallet size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                                            {t.description || 'Transaksi Tanpa Nama'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border tracking-wide uppercase
                                                ${t.type === 'INCOME'
                                                    ? 'bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                    : 'bg-rose-100/50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                                }`}>
                                                {formatCategory(t.category)}
                                            </span>

                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                {getProgramName(t.programId)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-sm font-extrabold tracking-tight whitespace-nowrap mt-1 ${t.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'} {formatRupiah(t.amount).replace(/,00$/, '').replace('Rp', '')}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
