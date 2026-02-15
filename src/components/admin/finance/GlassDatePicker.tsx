'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlassDatePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onChange: (start: Date | null, end: Date | null) => void;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function GlassDatePicker({ startDate, endDate, onChange }: GlassDatePickerProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        // Reset if both are selected or if clicking before start
        if (startDate && endDate) {
            onChange(clickedDate, null);
        } else if (startDate && !endDate) {
            if (clickedDate < startDate) {
                onChange(clickedDate, null); // New start date
            } else {
                onChange(startDate, clickedDate); // Set end date
            }
        } else {
            onChange(clickedDate, null); // Set start date
        }
    };

    const isSelected = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (startDate && date.toDateString() === startDate.toDateString()) return true;
        if (endDate && date.toDateString() === endDate.toDateString()) return true;
        return false;
    };

    const isInRange = (day: number) => {
        if (!startDate || !endDate) return false;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return date > startDate && date < endDate;
    };
    const renderDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const dayElements = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            dayElements.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            // Create a date object at NOON to avoid timezone offsets shifting the date
            const date = new Date(year, month, day, 12, 0, 0, 0);

            const isSelStart = startDate && date.toDateString() === startDate.toDateString();
            const isSelEnd = endDate && date.toDateString() === endDate.toDateString();
            const isSel = isSelStart || isSelEnd;

            const inRange = startDate && endDate && date > startDate && date < endDate;
            const isToday = new Date().toDateString() === date.toDateString();

            // Range Styling
            let bgClass = '';
            let roundedClass = 'rounded-full';

            if (isSelStart && endDate) {
                bgClass = 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30';
                roundedClass = 'rounded-l-full rounded-r-none';
            } else if (isSelEnd && startDate) {
                bgClass = 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30';
                roundedClass = 'rounded-r-full rounded-l-none';
            } else if (isSel) {
                bgClass = 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30';
                roundedClass = 'rounded-full';
            } else if (inRange) {
                bgClass = 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
                roundedClass = 'rounded-none';
            } else {
                bgClass = 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
            }

            dayElements.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-8 w-8 text-xs font-bold transition-all relative z-10 flex items-center justify-center
                    ${bgClass} ${roundedClass}
                    ${!isSel && !inRange && isToday ? 'text-emerald-600 ring-1 ring-emerald-500 border border-emerald-100' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }

        return dayElements;
    };

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-inner">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronLeft size={16} className="text-slate-600 dark:text-slate-400" />
                </button>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronRight size={16} className="text-slate-600 dark:text-slate-400" />
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

            <div className="mt-4 flex justify-between items-center text-[10px] font-medium text-slate-400 px-1 border-t border-slate-100 dark:border-slate-800 pt-3">
                <span>
                    {startDate ? startDate.toLocaleDateString() : 'Start'}
                    {' - '}
                    {endDate ? endDate.toLocaleDateString() : 'End'}
                </span>
                <button
                    onClick={() => onChange(null, null)}
                    className="text-rose-500 hover:text-rose-600 hover:underline"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
