'use client';

import {
    Calendar,
    ChevronDown,
    Layers,
    ChevronRight,
    ArrowLeft,
    SlidersHorizontal,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import GlassDatePicker from '@/components/features/finance/GlassDatePicker';
import { Program } from '@/types';

export type DateFilterType = 'ALL' | 'WEEK' | 'MONTH' | 'CUSTOM';

interface FinanceHeaderProps {
    mosqueName: string;
    dateFilter: DateFilterType;
    setDateFilter: (filter: DateFilterType) => void;
    customDateRange: { start: string; end: string };
    setCustomDateRange: (range: { start: string; end: string }) => void;
    programs: Program[];
    selectedProgramId: string;
    setSelectedProgramId: (id: string) => void;
}

export default function FinanceHeader({
    mosqueName,
    dateFilter,
    setDateFilter,
    customDateRange,
    setCustomDateRange,
    programs,
    selectedProgramId,
    setSelectedProgramId
}: FinanceHeaderProps) {
    const [showDateMenu, setShowDateMenu] = useState(false);
    const [showProgramMenu, setShowProgramMenu] = useState(false);
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const dateFilterRef = useRef<HTMLDivElement>(null);
    const programFilterRef = useRef<HTMLDivElement>(null);

    // Helpers to convert string dates to Date objects for the picker
    const startDateObj = customDateRange.start ? new Date(customDateRange.start) : null;
    const endDateObj = customDateRange.end ? new Date(customDateRange.end) : null;

    const handleDateChange = (start: Date | null, end: Date | null) => {
        const formatDate = (d: Date) => {
            const offset = d.getTimezoneOffset();
            const localDate = new Date(d.getTime() - (offset * 60 * 1000));
            return localDate.toISOString().split('T')[0];
        };

        setCustomDateRange({
            start: start ? formatDate(start) : '',
            end: end ? formatDate(end) : ''
        });
    };

    // Reset sub-menu on close
    useEffect(() => {
        if (!showDateMenu) {
            setTimeout(() => setShowCustomPicker(false), 300);
        }
    }, [showDateMenu]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
                setShowDateMenu(false);
            }
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
                            onClick={() => setShowDateMenu(!showDateMenu)}
                            className={`h-10 pl-3 pr-2 rounded-full backdrop-blur-md border flex items-center justify-center gap-1 shadow-sm transition-all ring-1 ring-inset relative
                            ${dateFilter !== 'ALL'
                                    ? 'bg-emerald-500 text-white border-emerald-400 ring-emerald-300/30 shadow-emerald-500/20'
                                    : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 ring-transparent'}`}
                        >
                            <Calendar size={18} />
                            <ChevronDown size={14} className={`opacity-70 transition-transform duration-300 ${showDateMenu ? 'rotate-180' : ''}`} />
                            {dateFilter !== 'ALL' && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showDateMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-12 w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-2 z-50 origin-top-right ring-1 ring-black/5 overflow-hidden"
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {!showCustomPicker ? (
                                            <motion.div
                                                key="menu"
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: -20, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex flex-col gap-1"
                                            >
                                                <button onClick={() => { setDateFilter('WEEK'); setShowDateMenu(false); }} className={`px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-all flex items-center gap-3 ${dateFilter === 'WEEK' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dateFilter === 'WEEK' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}><Calendar size={14} /></div>
                                                    Pekan Ini
                                                </button>
                                                <button onClick={() => { setDateFilter('MONTH'); setShowDateMenu(false); }} className={`px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-all flex items-center gap-3 ${dateFilter === 'MONTH' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dateFilter === 'MONTH' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}><Calendar size={14} /></div>
                                                    Bulan Ini
                                                </button>
                                                <button onClick={() => { setDateFilter('ALL'); setShowDateMenu(false); }} className={`px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-all flex items-center gap-3 ${dateFilter === 'ALL' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dateFilter === 'ALL' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}><Layers size={14} /></div>
                                                    Semua
                                                </button>

                                                <div className="border-t border-slate-200 dark:border-slate-700 my-1 pt-2 px-1">
                                                    <button
                                                        onClick={() => setShowCustomPicker(true)}
                                                        className={`w-full px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-all flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 ${dateFilter === 'CUSTOM' ? 'bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm`}><Calendar size={14} /></div>
                                                            Custom Range
                                                        </div>
                                                        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="picker"
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: 20, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                                    <button
                                                        onClick={() => setShowCustomPicker(false)}
                                                        className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors"
                                                    >
                                                        <ArrowLeft size={16} />
                                                    </button>
                                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Pilih Tanggal</span>
                                                </div>

                                                <GlassDatePicker
                                                    startDate={startDateObj}
                                                    endDate={endDateObj}
                                                    onChange={handleDateChange}
                                                />

                                                <button
                                                    onClick={() => { setDateFilter('CUSTOM'); setShowDateMenu(false); }}
                                                    className="w-full mt-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-lg"
                                                >
                                                    Terapkan Filter
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Program Filter Button */}
                    <div className="relative" ref={programFilterRef}>
                        <button
                            onClick={() => setShowProgramMenu(!showProgramMenu)}
                            className={`h-10 w-10 rounded-xl flex items-center justify-center border shadow-sm transition-all
                            ${selectedProgramId !== 'ALL'
                                    ? 'bg-slate-900 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                                    : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'}`}
                        >
                            <SlidersHorizontal size={18} />
                            {selectedProgramId !== 'ALL' && (
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-sm border border-slate-900"></span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showProgramMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-12 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 origin-top-right ring-1 ring-black/5"
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
                                            {selectedProgramId === 'ALL' && <Check size={14} />}
                                        </button>

                                        {programs.map((program) => (
                                            <button
                                                key={program.id}
                                                onClick={() => { setSelectedProgramId(program.id); setShowProgramMenu(false); }}
                                                className={`px-3 py-2.5 text-left text-xs font-bold rounded-xl transition-all flex items-center justify-between group
                                                ${selectedProgramId === program.id
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 text-[10px]">
                                                        <Layers size={12} />
                                                    </div>
                                                    {program.name}
                                                </div>
                                                {selectedProgramId === program.id && <Check size={14} />}
                                            </button>
                                        ))}
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
