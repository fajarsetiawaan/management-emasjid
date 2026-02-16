'use client';

import { motion } from 'framer-motion';
import { TransactionType } from '@/types';

interface FinanceTabsProps {
    activeTab: TransactionType;
    setActiveTab: (tab: TransactionType) => void;
}

export default function FinanceTabs({
    activeTab,
    setActiveTab,
}: FinanceTabsProps) {

    return (
        <div className="sticky top-[70px] z-40 px-4 py-2 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 mb-4 transition-all flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800/80 p-1.5 rounded-2xl flex relative z-0 shadow-sm border border-slate-200 dark:border-slate-700 w-full max-w-sm">

                {/* Background Slider */}
                <motion.div
                    className="absolute top-1.5 bottom-1.5 rounded-xl bg-slate-900 dark:bg-emerald-500 shadow-lg"
                    initial={false}
                    animate={{
                        left: activeTab === 'INCOME' ? '6px' : '50%',
                        width: 'calc(50% - 6px)',
                        x: activeTab === 'EXPENSE' ? 0 : 0
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />

                <button
                    onClick={() => setActiveTab('INCOME')}
                    className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors duration-200 rounded-xl ${activeTab === 'INCOME' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    Pemasukan
                </button>
                <button
                    onClick={() => setActiveTab('EXPENSE')}
                    className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors duration-200 rounded-xl ${activeTab === 'EXPENSE' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    Pengeluaran
                </button>
            </div>
        </div>
    );
}
