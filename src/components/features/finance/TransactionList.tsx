import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction, Fund } from '@/types';
import TransactionCard from './TransactionCard';

interface TransactionListProps {
    transactions: Transaction[];
    funds: Fund[];
}

export default function TransactionList({ transactions, funds }: TransactionListProps) {
    // Group transactions by date for sticky headers
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const dateObj = new Date(transaction.date);
        const dateKey = dateObj.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).toUpperCase();

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(transaction);
        return groups;
    }, {} as Record<string, Transaction[]>);

    const getFundName = (id: string) => funds.find(f => f.id === id)?.name || 'Umum';

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
        <div className="pb-32 space-y-6">
            {Object.entries(groupedTransactions).map(([date, items], groupIndex) => (
                <div key={date} className="relative">
                    {/* Sticky Date Header - Glass Pill */}
                    <div className="sticky top-[130px] z-30 px-4 py-2 flex items-center justify-between mx-4 mb-3 mt-2 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 dark:border-white/5 transition-all">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{date}</h3>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {items.length}
                        </span>
                    </div>

                    {/* Items List */}
                    <div className="px-2 space-y-3">
                        {items.map((t, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                key={t.id}
                            >
                                <TransactionCard
                                    transaction={t}
                                    programName={getFundName(t.fundId)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
