'use client';

import { useMemo } from 'react';
import { Transaction } from '@/types';
import { motion } from 'framer-motion';
import SummaryCard from './SummaryCard';
import TrendChart from './TrendChart';
import { Download } from 'lucide-react';

interface YearlyReportsViewProps {
    year: number;
    transactions: Transaction[];
}

export default function YearlyReportsView({ year, transactions }: YearlyReportsViewProps) {
    // Aggregate Data by Month (0-11)
    const monthlyData = useMemo(() => {
        const data = Array(12).fill(0).map((_, i) => ({
            monthIndex: i,
            label: new Date(year, i, 1).toLocaleString('id-ID', { month: 'short' }),
            income: 0,
            expense: 0,
            net: 0
        }));

        transactions.forEach(t => {
            const d = new Date(t.date);
            if (d.getFullYear() === year) {
                const m = d.getMonth();
                if (t.type === 'INCOME') {
                    data[m].income += t.amount;
                } else if (t.type === 'EXPENSE') {
                    data[m].expense += t.amount;
                }
            }
        });

        // Calculate Net
        data.forEach(d => d.net = d.income - d.expense);

        return data;
    }, [year, transactions]);

    const annualIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
    const annualExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);
    const annualNet = annualIncome - annualExpense;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Annual Summary Cards */}
            <motion.section
                variants={item}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <SummaryCard title="Surplus/Defisit Tahunan" amount={annualNet} type="NET" />
                <SummaryCard title="Total Pemasukan Tahun Ini" amount={annualIncome} type="INCOME" />
                <SummaryCard title="Total Pengeluaran Tahun Ini" amount={annualExpense} type="EXPENSE" />
            </motion.section>

            {/* Trend Analysis Chart */}
            <motion.section
                variants={item}
                className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 dark:border-slate-800/50 shadow-sm"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Tren Keuangan {year}</h3>
                        <p className="text-sm text-slate-500">Analisis Pemasukan vs Pengeluaran</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-slate-600 dark:text-slate-300">Pemasukan</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span className="text-slate-600 dark:text-slate-300">Pengeluaran</span>
                        </div>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <TrendChart
                        data={monthlyData.map(d => ({ label: d.label, income: d.income, expense: d.expense }))}
                        height={240}
                    />
                </div>
            </motion.section>

            {/* Monthly Breakdown Table (Optional or List) */}
            <motion.section variants={item} className="space-y-3">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-2">Rincian Bulanan</h3>
                <div className="space-y-2">
                    {monthlyData.map((m) => (
                        <div key={m.label} className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between border border-white/20 dark:border-slate-700/30 hover:bg-white/80 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-sm">
                                    {m.label}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Net Flow</p>
                                    <p className={`font-bold ${m.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(m.net)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-xs text-emerald-600 font-medium">
                                    + {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(m.income)}
                                </p>
                                <p className="text-xs text-rose-600 font-medium opacity-80">
                                    - {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(m.expense)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* PDF Export Action */}
            <div className="pt-4">
                <button className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 active:scale-[0.98] transition-all shadow-xl">
                    <Download size={20} />
                    Download Laporan Tahunan {year}
                </button>
            </div>
        </motion.div>
    );
}
