import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Check, X } from 'lucide-react';

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

    const formatNumber = (numStr: string) => {
        if (!numStr) return '';
        const num = parseInt(numStr.replace(/\D/g, ''), 10);
        return isNaN(num) ? '' : num.toLocaleString('id-ID');
    };

    const handleInput = (input: string) => {
        let newValue = displayValue === '0' ? '' : displayValue;

        switch (input) {
            case 'C':
                newValue = '0';
                break;
            case 'DEL':
                newValue = newValue.slice(0, -1) || '0';
                break;
            case '000':
                if (newValue !== '0') newValue += '000';
                break;
            default:
                newValue += input;
                break;
        }

        // Limit length to prevent overflow/issues
        if (newValue.length > 15) return;

        setDisplayValue(newValue);
        const num = parseInt(newValue.replace(/\D/g, ''), 10);
        onChange(isNaN(num) ? 0 : num);
    };

    const keys = [
        '1', '2', '3', 'DEL',
        '4', '5', '6', 'C',
        '7', '8', '9', 'DONE',
        '0', '000' // Custom layout for speed
    ];

    return (
        <div className={className}>
            {label && (
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">
                    {label}
                </label>
            )}

            <div
                onClick={() => setIsOpen(true)}
                className="relative w-full cursor-pointer group"
            >
                <input
                    type="text"
                    readOnly
                    value={value ? formatNumber(value.toString()) : ''}
                    placeholder={placeholder || "0"}
                    className="w-full py-3.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-lg font-bold font-mono text-slate-800 dark:text-slate-200 focus:border-emerald-500 hover:border-emerald-300 transition-all placeholder:text-slate-300 cursor-pointer caret-transparent"
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                        />

                        {/* Calculator Modal */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-2xl overflow-hidden border-t border-white/20"
                        >
                            {/* Header / Display */}
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Input Nominal</span>
                                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>
                                <div className="text-4xl font-mono font-bold text-slate-800 dark:text-white text-right tracking-tight break-all">
                                    <span className="text-slate-300 dark:text-slate-600 text-2xl mr-1">Rp</span>
                                    {formatNumber(displayValue)}
                                </div>
                            </div>

                            {/* Keypad */}
                            <div className="grid grid-cols-4 gap-1 p-2 bg-slate-100 dark:bg-slate-950 pb-8 safe-area-bottom">
                                {keys.map((key) => {
                                    const isAction = ['C', 'DEL', 'DONE'].includes(key);
                                    let content: React.ReactNode = key;

                                    if (key === 'DEL') content = <Delete size={24} />;
                                    if (key === 'DONE') content = <Check size={28} />;

                                    // Specific styling for Check/Done
                                    if (key === 'DONE') {
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setIsOpen(false)}
                                                className="row-span-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-emerald-500/30"
                                            >
                                                {content}
                                            </button>
                                        );
                                    }

                                    return (
                                        <button
                                            key={key}
                                            onClick={() => handleInput(key)}
                                            className={`
                                                h-20 rounded-2xl text-2xl font-bold flex items-center justify-center transition-all active:scale-95
                                                ${isAction
                                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                                                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm border-b-4 border-slate-200 dark:border-slate-800 active:border-b-0 active:translate-y-1'
                                                }
                                                ${key === '0' ? 'col-span-2' : ''}
                                            `}
                                        >
                                            {content}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
