'use client';

import {
    ArrowDownLeft,
    ArrowUpRight,
    Filter,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { TransactionType, Program } from '@/types';

interface FinanceTabsProps {
    activeTab: TransactionType;
    setActiveTab: (tab: TransactionType) => void;
    programs: Program[];
    selectedProgramId: string;
    setSelectedProgramId: (id: string) => void;
}

export default function FinanceTabs({
    activeTab,
    setActiveTab,
    programs,
    selectedProgramId,
    setSelectedProgramId
}: FinanceTabsProps) {
    const [showProgramMenu, setShowProgramMenu] = useState(false);
    const programFilterRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (programFilterRef.current && !programFilterRef.current.contains(event.target as Node)) {
                setShowProgramMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center gap-3 mb-6">
            {/* Tabs - Glass Pill */}
            <div className="flex-1 bg-slate-100/80 dark:bg-black/40 p-1.5 rounded-full flex relative z-0 shadow-inner backdrop-blur-md">
                {['INCOME', 'EXPENSE'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as TransactionType)}
                        className={`flex-1 py-3 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 relative z-10
                        ${activeTab === tab
                                ? (tab === 'INCOME' ? 'text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-rose-700 dark:text-rose-400 shadow-sm')
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="tab-bg"
                                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {tab === 'INCOME' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        {tab === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                    </button>
                ))}
            </div>

            {/* Program/Wallet Filter Dropdown */}
            <div className="relative shrink-0" ref={programFilterRef}>
                <button
                    onClick={() => setShowProgramMenu(!showProgramMenu)}
                    className={`h-12 w-12 rounded-full flex items-center justify-center border transition-all relative z-10
                    ${selectedProgramId !== 'ALL'
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    <Filter size={18} />
                    {selectedProgramId !== 'ALL' && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-slate-900 shadow-sm animate-bounce-short">1</span>
                    )}
                </button>

                <AnimatePresence>
                    {showProgramMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-14 w-60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-2 z-50 origin-top-right ring-1 ring-black/5"
                        >
                            <h4 className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Filter Dompet</h4>
                            <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                                <button
                                    onClick={() => { setSelectedProgramId('ALL'); setShowProgramMenu(false); }}
                                    className={`px-3 py-2.5 text-left text-xs font-bold rounded-xl transition-all flex items-center justify-between
                                ${selectedProgramId === 'ALL'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                                >
                                    Semua Dompet
                                    {selectedProgramId === 'ALL' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>}
                                </button>

                                {programs.map((program) => (
                                    <button
                                        key={program.id}
                                        onClick={() => { setSelectedProgramId(program.id); setShowProgramMenu(false); }}
                                        className={`px-3 py-2.5 text-left text-xs font-bold rounded-xl transition-all flex items-center justify-between
                                    ${selectedProgramId === program.id
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                                    >
                                        {program.name}
                                        {selectedProgramId === program.id && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
