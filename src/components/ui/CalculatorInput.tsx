import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Check, X, RotateCcw } from 'lucide-react';

interface CalculatorInputProps {
    value: number;
    onChange: (value: number) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export function CalculatorInput({ value, onChange, label, placeholder, className }: CalculatorInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState(value.toString());

    useEffect(() => {
        if (!isOpen) {
            setDisplayValue(value.toString());
        }
    }, [value, isOpen]);

    const formatNumber = (numStr: string): string => {
        if (!numStr || numStr === '0') return '0';
        const num = parseInt(numStr.replace(/\D/g, ''), 10);
        return isNaN(num) ? '0' : num.toLocaleString('id-ID');
    };

    const handleInput = (input: string): void => {
        let newValue = displayValue === '0' ? '' : displayValue;

        switch (input) {
            case 'C':
                newValue = '0';
                break;
            case 'DEL':
                newValue = newValue.slice(0, -1) || '0';
                break;
            case '000':
                if (newValue !== '0' && newValue !== '') newValue += '000';
                break;
            default:
                newValue += input;
                break;
        }

        if (newValue.length > 15) return;

        setDisplayValue(newValue || '0');
        const num = parseInt((newValue || '0').replace(/\D/g, ''), 10);
        onChange(isNaN(num) ? 0 : num);
    };

    return (
        <div className={className}>
            {label && (
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                    {label}
                </label>
            )}

            {/* Trigger Input */}
            <div
                onClick={() => setIsOpen(true)}
                className="relative w-full cursor-pointer group"
            >
                <input
                    type="text"
                    readOnly
                    value={value ? formatNumber(value.toString()) : ''}
                    placeholder={placeholder || "0"}
                    className="w-full py-3.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-lg font-bold text-slate-800 dark:text-slate-200 focus:border-emerald-500 hover:border-emerald-300 transition-all placeholder:text-slate-300 cursor-pointer caret-transparent tabular-nums"
                />
            </div>

            {/* Bottom Sheet Calculator - Portal to body to render above navbar */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/50 backdrop-blur-md z-[60]"
                            />

                            {/* Calculator Bottom Sheet */}
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[60]"
                            >
                                <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-t-[2rem] shadow-[0_-10px_60px_rgba(0,0,0,0.15)] overflow-hidden">

                                    {/* ── Drag Handle ── */}
                                    <div className="flex justify-center pt-3 pb-1">
                                        <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                    </div>

                                    {/* ── Header ── */}
                                    <div className="flex justify-between items-center px-6 pt-2 pb-1">
                                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                                            Input Nominal
                                        </span>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="w-7 h-7 rounded-full bg-slate-200/80 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                                        >
                                            <X size={14} strokeWidth={3} />
                                        </button>
                                    </div>

                                    {/* ── Display Area ── */}
                                    <div className="px-6 py-5">
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-3 tracking-wide">Jumlah</p>
                                            <div className="flex items-baseline justify-center gap-1.5 min-h-[3.5rem]">
                                                <span className="text-2xl font-semibold text-slate-300 dark:text-slate-600 self-start mt-1">Rp</span>
                                                <span className={`text-[3rem] leading-none font-bold tracking-tight transition-colors ${displayValue === '0' || !displayValue
                                                    ? 'text-slate-200 dark:text-slate-800'
                                                    : 'text-slate-900 dark:text-white'
                                                    }`}>
                                                    {formatNumber(displayValue)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Keypad: 4 columns (3 digits + 1 action) ── */}
                                    <div className="px-3 pb-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
                                        <div className="grid grid-cols-4 gap-2">

                                            {/* Row 1: 1, 2, 3, DEL */}
                                            {['1', '2', '3'].map((k) => (
                                                <button key={k} onClick={() => handleInput(k)}
                                                    className="h-16 rounded-2xl text-xl font-semibold bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 shadow-sm shadow-slate-200/60 dark:shadow-black/20 active:scale-[0.94] transition-all duration-100 flex items-center justify-center">
                                                    {k}
                                                </button>
                                            ))}
                                            <button onClick={() => handleInput('DEL')}
                                                className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 active:scale-[0.94] active:bg-slate-200 dark:active:bg-slate-700 transition-all duration-100 flex items-center justify-center">
                                                <Delete size={22} />
                                            </button>

                                            {/* Row 2: 4, 5, 6, C */}
                                            {['4', '5', '6'].map((k) => (
                                                <button key={k} onClick={() => handleInput(k)}
                                                    className="h-16 rounded-2xl text-xl font-semibold bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 shadow-sm shadow-slate-200/60 dark:shadow-black/20 active:scale-[0.94] transition-all duration-100 flex items-center justify-center">
                                                    {k}
                                                </button>
                                            ))}
                                            <button onClick={() => handleInput('C')}
                                                className="h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 font-bold text-base active:scale-[0.94] active:bg-rose-100 dark:active:bg-rose-900/40 transition-all duration-100 flex items-center justify-center gap-1.5">
                                                <RotateCcw size={16} strokeWidth={2.5} />
                                                <span>C</span>
                                            </button>

                                            {/* Row 3: 7, 8, 9, ✓ Simpan (row-span-2) */}
                                            {['7', '8', '9'].map((k) => (
                                                <button key={k} onClick={() => handleInput(k)}
                                                    className="h-16 rounded-2xl text-xl font-semibold bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 shadow-sm shadow-slate-200/60 dark:shadow-black/20 active:scale-[0.94] transition-all duration-100 flex items-center justify-center">
                                                    {k}
                                                </button>
                                            ))}
                                            <button onClick={() => setIsOpen(false)}
                                                className="row-span-2 rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-600 text-white font-bold text-sm active:scale-[0.96] shadow-lg shadow-emerald-500/25 transition-all duration-100 flex flex-col items-center justify-center gap-1.5">
                                                <Check size={28} strokeWidth={3} />
                                                <span className="text-[11px] font-bold tracking-wide uppercase opacity-90">Simpan</span>
                                            </button>

                                            {/* Row 4: 000, 0 (Simpan continues from row-span-2) */}
                                            <button onClick={() => handleInput('000')}
                                                className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-base font-bold active:scale-[0.94] active:bg-slate-200 dark:active:bg-slate-700 transition-all duration-100 flex items-center justify-center">
                                                000
                                            </button>
                                            <button onClick={() => handleInput('0')}
                                                className="h-16 rounded-2xl col-span-2 text-xl font-semibold bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 shadow-sm shadow-slate-200/60 dark:shadow-black/20 active:scale-[0.94] transition-all duration-100 flex items-center justify-center">
                                                0
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
