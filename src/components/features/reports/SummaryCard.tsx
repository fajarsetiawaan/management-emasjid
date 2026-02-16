'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface SummaryCardProps {
    title: string;
    amount: number;
    type: 'NET' | 'INCOME' | 'EXPENSE';
    percentageChange?: number; // Optional: for future implementation
}

export default function SummaryCard({ title, amount, type }: SummaryCardProps) {
    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const isNet = type === 'NET';
    const isIncome = type === 'INCOME';

    // Config based on type
    const config = {
        NET: {
            bg: 'bg-white/70 dark:bg-slate-900/70',
            border: 'border-white/50 dark:border-slate-800/50',
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            valueColor: 'text-slate-900 dark:text-white',
            shadow: 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
            icon: <Wallet size={20} />
        },
        INCOME: {
            bg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
            border: 'border-emerald-100/50 dark:border-emerald-800/30',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            valueColor: 'text-emerald-700 dark:text-emerald-400',
            shadow: 'shadow-sm',
            icon: <ArrowUpRight size={18} />
        },
        EXPENSE: {
            bg: 'bg-rose-50/50 dark:bg-rose-900/10',
            border: 'border-rose-100/50 dark:border-rose-800/30',
            iconBg: 'bg-rose-100 dark:bg-rose-900/30',
            iconColor: 'text-rose-600 dark:text-rose-400',
            valueColor: 'text-rose-700 dark:text-rose-400',
            shadow: 'shadow-sm',
            icon: <ArrowDownRight size={18} />
        }
    };

    const style = config[type];

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`
                relative overflow-hidden rounded-2xl p-5 backdrop-blur-xl transition-all duration-300
                ${style.bg} ${style.border} ${style.shadow} border
            `}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {title}
                    </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${style.iconBg} ${style.iconColor}`}>
                    {style.icon}
                </div>
            </div>

            <div>
                <h3 className={`text-2xl font-bold tracking-tight ${style.valueColor}`}>
                    {formatRupiah(amount)}
                </h3>
            </div>

            {/* Decorative Bloom */}
            {isNet && (
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            )}
        </motion.div>
    );
}
