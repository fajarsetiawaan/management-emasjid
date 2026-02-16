'use client';

import { useState, useEffect } from 'react';
import { TransactionType, Transaction, AssetAccount, Program } from '@/types';
import { getTransactions, getAssetAccounts, getPrograms, getTotalBalance, getMosque } from '@/lib/api';
import FinanceHeader, { DateFilterType } from '@/components/features/finance/FinanceHeader';
import FinanceHeroCard from '@/components/features/finance/FinanceHeroCard';
import FinanceQuickActions from '@/components/features/finance/FinanceQuickActions';
import FundCards from '@/components/features/finance/FundCards';
import FinanceTabs from '@/components/features/finance/FinanceTabs';
import TransactionList from '@/components/features/finance/TransactionList';

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<TransactionType>('INCOME');

    // Filters State
    const [dateFilter, setDateFilter] = useState<DateFilterType>('MONTH');
    const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [selectedProgramId, setSelectedProgramId] = useState<string>('ALL');

    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<AssetAccount[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [mosqueName, setMosqueName] = useState('Masjid');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [txData, accData, progData, mosqueData] = await Promise.all([
                    getTransactions(),
                    getAssetAccounts(),
                    getPrograms(),
                    getMosque()
                ]);
                setTransactions(txData);
                setAccounts(accData);
                setPrograms(progData);
                setTotalBalance(getTotalBalance());
                setMosqueName(mosqueData.name);
            } catch (error) {
                console.error('Failed to load finance data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter Logic
    const getFilteredTransactions = () => {
        let filtered = transactions.filter(t => t.type === activeTab);

        // Date Filter
        const now = new Date();
        const startOfDay = (d: Date) => new Date(d.setHours(0, 0, 0, 0));

        switch (dateFilter) {
            case 'WEEK':
                const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                filtered = filtered.filter(t => t.date >= startOfDay(firstDayOfWeek));
                break;
            case 'MONTH':
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = filtered.filter(t => t.date >= firstDayOfMonth);
                break;
            case 'CUSTOM':
                if (customDateRange.start) {
                    filtered = filtered.filter(t => t.date >= new Date(customDateRange.start));
                }
                if (customDateRange.end) {
                    const endDate = new Date(customDateRange.end);
                    endDate.setHours(23, 59, 59, 999);
                    filtered = filtered.filter(t => t.date <= endDate);
                }
                break;
            case 'ALL':
            default:
                break;
        }

        // Program/Wallet Filter
        if (selectedProgramId !== 'ALL') {
            filtered = filtered.filter(t => t.programId === selectedProgramId);
        }

        return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
    };

    const filteredTransactions = getFilteredTransactions();

    // Calculate Filtered Stats for Hero Card
    const getAllFilteredTransactions = () => {
        let all = transactions;

        // Date Filter (Reuse logic if possible, simplified copy here)
        const now = new Date();
        const startOfDay = (d: Date) => new Date(d.setHours(0, 0, 0, 0));

        if (dateFilter === 'WEEK') {
            const first = new Date(now.setDate(now.getDate() - now.getDay()));
            all = all.filter(t => t.date >= startOfDay(first));
        } else if (dateFilter === 'MONTH') {
            const first = new Date(now.getFullYear(), now.getMonth(), 1);
            all = all.filter(t => t.date >= first);
        } else if (dateFilter === 'CUSTOM' && (customDateRange.start || customDateRange.end)) {
            if (customDateRange.start) all = all.filter(t => t.date >= new Date(customDateRange.start));
            if (customDateRange.end) {
                const endDate = new Date(customDateRange.end);
                endDate.setHours(23, 59, 59, 999);
                all = all.filter(t => t.date <= endDate);
            }
        }

        // Program Filter
        if (selectedProgramId !== 'ALL') {
            all = all.filter(t => t.programId === selectedProgramId);
        }

        return all;
    };

    const allFiltered = getAllFilteredTransactions();
    const totalFilteredIncome = allFiltered.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalFilteredExpense = allFiltered.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

    // For Hero Card percentage (Simple placeholder logic: Income vs Total Flow)
    const totalFlow = totalFilteredIncome + totalFilteredExpense;
    const incomePercentage = totalFlow === 0 ? 0 : Math.round((totalFilteredIncome / totalFlow) * 100);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 relative overflow-hidden font-sans">
            {/* Deep Ambient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-emerald-500/10 animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-blue-500/10 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-purple-500/10 animate-blob animation-delay-4000" />
            </div>

            <FinanceHeader
                mosqueName={mosqueName}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                customDateRange={customDateRange}
                setCustomDateRange={setCustomDateRange}
                programs={programs}
                selectedProgramId={selectedProgramId}
                setSelectedProgramId={setSelectedProgramId}
            />

            <main className="px-4 pt-4 relative z-10">
                <FinanceHeroCard
                    balance={totalBalance}
                    incomePercentage={incomePercentage}
                />

                <FinanceQuickActions />

                <FundCards programs={programs} />

                {/* Sticky Tabs & Full Width List */}
                <FinanceTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className="min-h-[400px]">
                    <TransactionList
                        transactions={filteredTransactions}
                        programs={programs}
                    />
                </div>
            </main>
        </div>
    );
}
