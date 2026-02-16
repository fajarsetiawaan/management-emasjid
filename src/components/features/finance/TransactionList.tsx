import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction, Program } from '@/types';
import TransactionCard from './TransactionCard';

interface TransactionListProps {
    transactions: Transaction[];
    programs: Program[];
}

export default function TransactionList({ transactions, programs }: TransactionListProps) {
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

    const getProgramName = (id: string) => programs.find(p => p.id === id)?.name || 'Umum';

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
                    {/* Sticky Date Header - Clean Text Only */}
                    <div className="sticky top-[140px] z-30 px-4 py-2 flex items-center justify-between mx-2 mb-2">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{date}</h3>
                        <span className="text-[10px] font-bold text-slate-400 opacity-80">
                            {items.length} Transaksi
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
                                    programName={getProgramName(t.programId)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
