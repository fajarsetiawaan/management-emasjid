'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SingleDateGlassPickerProps {
    date: Date;
    onChange: (date: Date) => void;
    label?: string;
}

const DAYS = ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb']; // Indonesian days
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function SingleDateGlassPicker({ date, onChange, label = 'Tanggal Transaksi' }: SingleDateGlassPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentMonth, setCurrentMonth] = useState(date || new Date());

    // Helper Functions (Native Date Logic)
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onChange(newDate);
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Formatter
    const formatDate = (d: Date) => {
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(d);
    };

    // Animation variants
    const popoverVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }
    };

    const renderDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const dayElements = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            dayElements.push(<div key={`empty-${i}`} className="h-9 w-9" />);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(year, month, day);
            const isSelected = date && d.toDateString() === date.toDateString();
            const isToday = new Date().toDateString() === d.toDateString();

            dayElements.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={`
                        h-9 w-9 text-sm font-bold rounded-full transition-all flex items-center justify-center relative
                        ${isSelected
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }
                        ${!isSelected && isToday ? 'text-indigo-600 ring-2 ring-indigo-100 dark:ring-indigo-900' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }

        return dayElements;
    };

    return (
        <div className="relative" ref={containerRef}>
            {label && <label className="block text-xs font-bold uppercase text-slate-400 mb-2">{label}</label>}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 group
                    ${isOpen
                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-700 dark:bg-slate-800 dark:border-indigo-400 dark:text-indigo-300'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>
                        <Calendar size={18} />
                    </div>
                    <span className="font-bold text-base truncate">
                        {date ? formatDate(date) : 'Pilih Tanggal'}
                    </span>
                </div>
            </button>

            {/* Popover Calendar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={popoverVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute bottom-full left-0 mb-2 w-[320px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl rounded-3xl overflow-hidden z-[60]"
                    >
                        {/* Header Decoration */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />

                        <div className="relative p-5">
                            <div className="flex justify-between items-center mb-6">
                                <button onClick={handlePrevMonth} className="p-2 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <ChevronLeft size={18} className="text-slate-600 dark:text-slate-400" />
                                </button>
                                <h4 className="font-bold text-lg text-slate-800 dark:text-white capitalize">
                                    {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h4>
                                <button onClick={handleNextMonth} className="p-2 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <ChevronRight size={18} className="text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                {DAYS.map(day => (
                                    <div key={day} className="text-[10px] uppercase font-bold text-slate-400">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 place-items-center">
                                {renderDays()}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                                <button
                                    onClick={() => {
                                        onChange(new Date());
                                        setIsOpen(false);
                                    }}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    Hari Ini
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
