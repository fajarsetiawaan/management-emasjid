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
import { FilterDropdown, FilterTrigger, FilterContent, FilterItem, FilterActionButton } from '@/components/shared/FilterDropdown';

export type DateFilterType = 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM';

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
    const [showCustomPicker, setShowCustomPicker] = useState(false);

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

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
            <div className="px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Keuangan</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{mosqueName}</p>
                </div>

                <div className="flex gap-2">
                    {/* Date Filter */}
                    <FilterDropdown onOpenChange={(isOpen) => !isOpen && setTimeout(() => setShowCustomPicker(false), 300)}>
                        <FilterTrigger
                            icon={<Calendar size={18} />}
                            isActive={dateFilter !== 'ALL'}
                            indicator={dateFilter !== 'ALL' && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                            )}
                        >
                            <FilterContent>
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
                                            <FilterItem onClick={() => setDateFilter('ALL')} isSelected={dateFilter === 'ALL'} icon={<Layers size={14} />}>Semua</FilterItem>
                                            <FilterItem onClick={() => setDateFilter('TODAY')} isSelected={dateFilter === 'TODAY'} icon={<Calendar size={14} />}>Hari Ini</FilterItem>
                                            <FilterItem onClick={() => setDateFilter('WEEK')} isSelected={dateFilter === 'WEEK'} icon={<Calendar size={14} />}>Pekan Ini</FilterItem>
                                            <FilterItem onClick={() => setDateFilter('MONTH')} isSelected={dateFilter === 'MONTH'} icon={<Calendar size={14} />}>Bulan Ini</FilterItem>
                                            <FilterItem onClick={() => setDateFilter('YEAR')} isSelected={dateFilter === 'YEAR'} icon={<Calendar size={14} />}>Tahun Ini</FilterItem>

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

                                            <FilterActionButton
                                                onClick={() => { setDateFilter('CUSTOM'); }}
                                                className="w-full mt-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-lg"
                                            >
                                                Terapkan Filter
                                            </FilterActionButton>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </FilterContent>
                        </FilterTrigger>
                    </FilterDropdown>

                    {/* Program Filter */}
                    <FilterDropdown>
                        <FilterTrigger
                            icon={<SlidersHorizontal size={18} />}
                            isActive={selectedProgramId !== 'ALL'}
                            indicator={selectedProgramId !== 'ALL' && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full"></span>
                            )}
                        >
                            <FilterContent width="w-64">
                                <h4 className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Filter Dompet</h4>
                                <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <FilterItem
                                        onClick={() => setSelectedProgramId('ALL')}
                                        isSelected={selectedProgramId === 'ALL'}
                                        icon={<Check size={14} className={selectedProgramId === 'ALL' ? '' : 'invisible'} />}
                                    >
                                        Semua Dompet
                                    </FilterItem>

                                    {programs.map((program) => (
                                        <FilterItem
                                            key={program.id}
                                            onClick={() => setSelectedProgramId(program.id)}
                                            isSelected={selectedProgramId === program.id}
                                            icon={<Layers size={14} />}
                                        >
                                            <span>{program.name}</span>
                                            {selectedProgramId === program.id && <Check size={14} />}
                                        </FilterItem>
                                    ))}
                                </div>
                            </FilterContent>
                        </FilterTrigger>
                    </FilterDropdown>
                </div>
            </div>
        </header>
    );
}
