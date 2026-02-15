'use client';

import {
    Calendar,
    ChevronDown,
    Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import GlassDatePicker from '@/components/features/finance/GlassDatePicker';

export type DateFilterType = 'ALL' | 'WEEK' | 'MONTH' | 'CUSTOM';

interface FinanceHeaderProps {
    mosqueName: string;
    dateFilter: DateFilterType;
    setDateFilter: (filter: DateFilterType) => void;
    customDateRange: { start: string; end: string };
    setCustomDateRange: (range: { start: string; end: string }) => void;
}

export default function FinanceHeader({
    mosqueName,
    dateFilter,
    setDateFilter,
    customDateRange,
    setCustomDateRange
}: FinanceHeaderProps) {
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const dateFilterRef = useRef<HTMLDivElement>(null);

    // Helpers to convert string dates to Date objects for the picker
    const startDateObj = customDateRange.start ? new Date(customDateRange.start) : null;
    const endDateObj = customDateRange.end ? new Date(customDateRange.end) : null;

    const handleDateChange = (start: Date | null, end: Date | null) => {
        // Convert Date objects back to YYYY-MM-DD strings for parent state
        const formatDate = (d: Date) => {
            // Adjust for timezone to ensure the date string is accurate to what the user clicked
            const offset = d.getTimezoneOffset();
            const localDate = new Date(d.getTime() - (offset * 60 * 1000));
            return localDate.toISOString().split('T')[0];
        };

        setCustomDateRange({
            start: start ? formatDate(start) : '',
            end: end ? formatDate(end) : ''
        });
    };

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
                setShowFilterMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
            <div className="px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Keuangan</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{mosqueName}</p>
                </div>
                <div className="flex gap-2">
                    {/* Date Filter Button */}
                    <div className="relative" ref={dateFilterRef}>
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`h-10 px-4 rounded-full backdrop-blur-md border flex items-center justify-center gap-2 shadow-sm transition-all text-xs font-bold ring-1 ring-inset
                            ${dateFilter !== 'ALL'
                                    ? 'bg-emerald-500 text-white border-emerald-400 ring-emerald-300/30 shadow-emerald-500/20'
                                    : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 ring-transparent'}`}
                        >
                            <Calendar size={14} className={dateFilter !== 'ALL' ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'} />
                            <span>
                                {dateFilter === 'ALL' && 'Semua Tanggal'}
                                {dateFilter === 'WEEK' && 'Pekan Ini'}
                                {dateFilter === 'MONTH' && 'Bulan Ini'}
                                {dateFilter === 'CUSTOM' && 'Custom'}
                            </span>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${showFilterMenu ? 'rotate-180' : ''} ${dateFilter !== 'ALL' ? 'text-emerald-100' : 'text-slate-400'}`} />
                        </button>

                        <AnimatePresence>
                            {showFilterMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-12 w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-2 z-50 origin-top-right ring-1 ring-black/5"
                                >
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => { setDateFilter('WEEK'); setShowFilterMenu(false); }} className={`px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-all flex items-center gap-3 ${dateFilter === 'WEEK' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dateFilter === 'WEEK' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}><Calendar size={14} /></div>
                                            Pekan Ini
                                        </button>
                                        <button onClick={() => { setDateFilter('MONTH'); setShowFilterMenu(false); }} className={`px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-all flex items-center gap-3 ${dateFilter === 'MONTH' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dateFilter === 'MONTH' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}><Calendar size={14} /></div>
                                            Bulan Ini
                                        </button>
                                        <button onClick={() => { setDateFilter('ALL'); setShowFilterMenu(false); }} className={`px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-all flex items-center gap-3 ${dateFilter === 'ALL' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dateFilter === 'ALL' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}><Layers size={14} /></div>
                                            Semua
                                        </button>

                                        <div className="border-t border-slate-200 dark:border-slate-700 my-1 pt-2 px-2">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Custom Range</p>

                                            {/* Custom Glass Date Picker */}
                                            <GlassDatePicker
                                                startDate={startDateObj}
                                                endDate={endDateObj}
                                                onChange={handleDateChange}
                                            />

                                            <button
                                                onClick={() => { setDateFilter('CUSTOM'); setShowFilterMenu(false); }}
                                                className="w-full mt-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-lg"
                                            >
                                                Terapkan Filter
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
