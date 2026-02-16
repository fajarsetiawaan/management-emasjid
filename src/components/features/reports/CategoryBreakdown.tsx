'use client';

import { motion } from 'framer-motion';

interface CategoryData {
    name: string;
    amount: number;
    percentage: number;
    color: string; // Tailwind color class prefix e.g. 'emerald', 'blue'
}

interface CategoryBreakdownProps {
    title: string;
    data: CategoryData[];
    type: 'INCOME' | 'EXPENSE';
}

export default function CategoryBreakdown({ title, data, type }: CategoryBreakdownProps) {
    const isIncome = type === 'INCOME';

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className={`w-1.5 h-4 rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {title}
            </h3>

            <div className="space-y-5">
                {data.map((item, index) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                            <div className="text-right">
                                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                                    {formatRupiah(item.amount)}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                style={{ opacity: 0.5 + (item.percentage / 200) }} // Subtle opacity variance based on percentage
                            />
                        </div>

                        <div className="mt-1 text-right">
                            <span className="text-[10px] font-bold text-slate-400">
                                {item.percentage.toFixed(1)}%
                            </span>
                        </div>
                    </motion.div>
                ))}

                {data.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm italic">
                        Belum ada data {isIncome ? 'pemasukan' : 'pengeluaran'}.
                    </div>
                )}
            </div>
        </div>
    );
}
