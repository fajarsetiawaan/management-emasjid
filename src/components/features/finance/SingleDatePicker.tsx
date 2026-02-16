'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SingleDatePickerProps {
    date: Date;
    onChange: (date: Date) => void;
}

const DAYS = ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'];
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function SingleDatePicker({ date, onChange }: SingleDatePickerProps) {
    const [currentMonth, setCurrentMonth] = useState(date || new Date());

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onChange(selectedDate);
    };

    const renderDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const dayElements = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            dayElements.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            // Create a date object
            const currentDate = new Date(year, month, day);
            const isSelected = date && currentDate.toDateString() === date.toDateString();
            const isToday = new Date().toDateString() === currentDate.toDateString();

            let bgClass = 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full';

            if (isSelected) {
                bgClass = 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 rounded-full font-bold';
            } else if (isToday) {
                bgClass = 'text-emerald-600 ring-1 ring-emerald-500 border border-emerald-100 rounded-full font-bold';
            }

            dayElements.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-10 w-10 text-sm font-medium transition-all relative z-10 flex items-center justify-center ${bgClass}`}
                >
                    {day}
                </button>
            );
        }

        return dayElements;
    };

    return (
        <div className="w-full bg-slate-50 dark:bg-[#1C1C1E] rounded-xl p-4">
            <div className="flex justify-between items-center mb-6 px-2">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
                <h3 className="text-base font-bold text-slate-800 dark:text-white capitalize">
                    {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ChevronRight size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {DAYS.map(day => (
                    <div key={day} className="text-xs uppercase font-bold text-slate-400 py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 place-items-center">
                {renderDays()}
            </div>
        </div>
    );
}
