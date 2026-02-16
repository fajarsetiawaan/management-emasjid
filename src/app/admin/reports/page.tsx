'use client';

import { useState, useEffect } from 'react';
import { Transaction, Fund } from '@/types';
import { getTransactions, getFunds, getTotalBalance, getAssetAccounts } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import ReportsHeader from '@/components/features/reports/ReportsHeader';
import SummaryCard from '@/components/features/reports/SummaryCard';
import CategoryBreakdown from '@/components/features/reports/CategoryBreakdown';
import YearlyReportsView from '@/components/features/reports/YearlyReportsView';
import WeeklyReportsView from '@/components/features/reports/WeeklyReportsView';
import { Layers, Calendar } from 'lucide-react';

export default function ReportsPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [viewMode, setViewMode] = useState<'WEEKLY' | 'MONTHLY' | 'YEARLY'>('WEEKLY'); // Default to Weekly for easier access? Or Monthly. Let's keep Monthly as default for now, then change if user wants. Actually Weekly is high value for DKM. let's stick to Monthly default for consistency.

    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [funds, setFunds] = useState<Fund[]>([]);
    const [netBalance, setNetBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [txData, progData] = await Promise.all([
                    getTransactions(),
                    getFunds(),
                    getAssetAccounts() // Ensure assets are loaded for total balance
                ]);
                setTransactions(txData);
                setFunds(progData);
                // Calculate Net Balance (Total Assets)
                setNetBalance(getTotalBalance());
            } catch (error) {
                console.error("Failed to load report data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter Transactions for Selected Month
    const monthlyTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Calculate Totals (Monthly)
    const incomeTotal = monthlyTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenseTotal = monthlyTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

    // Group by Category Logic
    const groupByCategory = (type: 'INCOME' | 'EXPENSE') => {
        const filtered = monthlyTransactions.filter(t => t.type === type);
        const grouped: Record<string, number> = {};

        filtered.forEach(t => {
            const category = t.category || 'Lainnya';
            grouped[category] = (grouped[category] || 0) + t.amount;
        });

        const total = type === 'INCOME' ? incomeTotal : expenseTotal;

        return Object.entries(grouped)
            .map(([name, amount]) => ({
                name,
                amount,
                percentage: total === 0 ? 0 : (amount / total) * 100,
                color: type === 'INCOME' ? 'emerald' : 'rose'
            }))
            .sort((a, b) => b.amount - a.amount); // Sort by highest amount
    };

    const incomeBreakdown = groupByCategory('INCOME');
    const expenseBreakdown = groupByCategory('EXPENSE');

    const handleExport = () => {
        alert("Fitur Download PDF akan segera hadir!");
    };

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 relative overflow-hidden font-sans">
            {/* Deep Ambient Backgrounds (Shared with Finance/Events) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
                <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            {/* Header: Hide navigation unless needed (Weekly handles its own nav, Yearly handles its own nav, Monthly uses header nav) */}
            <ReportsHeader
                currentMonth={currentMonth}
                currentYear={currentYear}
                onMonthChange={setCurrentMonth}
                onYearChange={setCurrentYear}
                onExport={handleExport}
                viewMode={viewMode === 'MONTHLY' ? 'MONTHLY' : 'YEARLY'} // Hack: hide nav if not monthly. We need to update ReportsHeader prop type or logic if we want strictly 'WEEKLY' there too. For now let's reuse logic: if not monthly, header hides nav.
            />

            <main className="px-4 pt-6 relative z-10 space-y-6">

                {/* View Switcher (Mingguan / Bulanan / Tahunan) */}
                <div className="flex justify-center mb-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex items-center relative w-full max-w-md">
                        {/* Sliding Background */}
                        <motion.div
                            className="absolute bg-white dark:bg-slate-700 shadow-sm rounded-full h-8 top-1 left-1"
                            initial={false}
                            animate={{
                                x: viewMode === 'WEEKLY' ? '0%' : viewMode === 'MONTHLY' ? '100%' : '200%',
                            }}
                            style={{ width: 'calc(33.33% - 4px)' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            onClick={() => setViewMode('WEEKLY')}
                            className={`relative z-10 w-1/3 px-2 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors text-center ${viewMode === 'WEEKLY' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}
                        >
                            Jumat
                        </button>
                        <button
                            onClick={() => setViewMode('MONTHLY')}
                            className={`relative z-10 w-1/3 px-2 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors text-center ${viewMode === 'MONTHLY' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}
                        >
                            Bulanan
                        </button>
                        <button
                            onClick={() => setViewMode('YEARLY')}
                            className={`relative z-10 w-1/3 px-2 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors text-center ${viewMode === 'YEARLY' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}
                        >
                            Tahunan
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {viewMode === 'WEEKLY' && (
                        <motion.div
                            key="weekly-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <WeeklyReportsView transactions={transactions} netBalance={netBalance} />
                        </motion.div>
                    )}

                    {viewMode === 'MONTHLY' && (
                        <motion.div
                            key="monthly-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Summary Cards Section */}
                            <motion.section
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                <motion.div variants={item} className="md:col-span-2 lg:col-span-1">
                                    <SummaryCard
                                        title="Saldo Bersih Saat Ini"
                                        amount={netBalance}
                                        type="NET"
                                    />
                                </motion.div>
                                <motion.div variants={item}>
                                    <SummaryCard
                                        title="Total Pemasukan"
                                        amount={incomeTotal}
                                        type="INCOME"
                                    />
                                </motion.div>
                                <motion.div variants={item}>
                                    <SummaryCard
                                        title="Total Pengeluaran"
                                        amount={expenseTotal}
                                        type="EXPENSE"
                                    />
                                </motion.div>
                            </motion.section>

                            {/* Breakdown Section */}
                            <motion.section
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <motion.div variants={item}>
                                    <CategoryBreakdown
                                        title="Rincian Pemasukan"
                                        data={incomeBreakdown}
                                        type="INCOME"
                                    />
                                </motion.div>

                                <motion.div variants={item}>
                                    <CategoryBreakdown
                                        title="Rincian Pengeluaran"
                                        data={expenseBreakdown}
                                        type="EXPENSE"
                                    />
                                </motion.div>
                            </motion.section>
                        </motion.div>
                    )}

                    {viewMode === 'YEARLY' && (
                        <motion.div
                            key="yearly-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <YearlyReportsView year={currentYear} transactions={transactions} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
