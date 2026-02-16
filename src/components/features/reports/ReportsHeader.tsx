'use client';

import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { FilterDropdown, FilterTrigger, FilterContent, FilterItem } from '@/components/shared/FilterDropdown';
import { motion } from 'framer-motion';

interface ReportsHeaderProps {
    currentMonth: number;
    currentYear: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
    onExport: () => void;
    viewMode?: 'MONTHLY' | 'YEARLY';
}

export default function ReportsHeader({
    currentMonth,
    currentYear,
    onMonthChange,
    onYearChange,
    onExport,
    viewMode = 'MONTHLY'
}: ReportsHeaderProps) {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            onMonthChange(11);
            onYearChange(currentYear - 1);
        } else {
            onMonthChange(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            onMonthChange(0);
            onYearChange(currentYear + 1);
        } else {
            onMonthChange(currentMonth + 1);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
            <div className="px-6 py-4 flex justify-between items-center">
                {/* Left: Title */}
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Laporan</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Rekapitulasi Keuangan Masjid
                    </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Month Picker Control */}
                    <div className="flex items-center bg-white/50 dark:bg-slate-900/50 rounded-full border border-slate-200/50 dark:border-slate-700/50 p-1 shadow-sm">
                        {viewMode === 'MONTHLY' && (
                            <button
                                onClick={() => {
                                    if (currentMonth === 0) {
                                        onMonthChange(11);
                                        onYearChange(currentYear - 1);
                                    } else {
                                        onMonthChange(currentMonth - 1);
                                    }
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                        )}

                        {viewMode === 'YEARLY' && (
                            <button
                                onClick={() => onYearChange(currentYear - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                        )}

                        <div className="px-3 min-w-[100px] text-center">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                {viewMode === 'MONTHLY' ? months[currentMonth] : ''} {currentYear}
                            </span>
                        </div>

                        {viewMode === 'MONTHLY' && (
                            <button
                                onClick={() => {
                                    if (currentMonth === 11) {
                                        onMonthChange(0);
                                        onYearChange(currentYear + 1);
                                    } else {
                                        onMonthChange(currentMonth + 1);
                                    }
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        )}

                        {viewMode === 'YEARLY' && (
                            <button
                                onClick={() => onYearChange(currentYear + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        )}
                    </div>

                    {/* Export Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onExport}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-slate-800 hover:opacity-90 transition-opacity"
                    >
                        <Download size={18} />
                    </motion.button>
                </div>
            </div>
        </header>
    );
}
