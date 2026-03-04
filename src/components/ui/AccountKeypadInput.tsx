import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete } from 'lucide-react';

interface AccountKeypadInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    maxLength?: number;
    onSubmit?: () => void;
}

export function AccountKeypadInput({
    value,
    onChange,
    label,
    placeholder,
    className,
    inputClassName,
    maxLength = 30,
    onSubmit
}: AccountKeypadInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState(value || '');

    useEffect(() => {
        if (!isOpen) {
            setDisplayValue(value || '');
        }
    }, [value, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setDisplayValue(value || '');
        }
    }, [isOpen]);

    const handleInput = (input: string): void => {
        let newValue = displayValue;

        switch (input) {
            case 'DEL':
                newValue = newValue.slice(0, -1);
                break;
            case 'NEXT':
                setIsOpen(false);
                if (onSubmit) onSubmit();
                return;
            case 'SPACE':
                if (newValue.length < maxLength) {
                    newValue += ' ';
                }
                break;
            default:
                if (newValue.length < maxLength) {
                    newValue += input;
                }
                break;
        }

        setDisplayValue(newValue);
        onChange(newValue);
    };

    const defaultInputClass = "w-full py-3.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-lg font-bold text-slate-800 dark:text-slate-200 focus:border-emerald-500 hover:border-emerald-300 transition-all placeholder:text-slate-300";

    const KeypadButton = ({
        main,
        sub,
        action,
        variant = 'default'
    }: {
        main: React.ReactNode;
        sub?: string;
        action: string;
        variant?: 'default' | 'gray' | 'dark'
    }) => {
        let bgClass = "bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50";
        if (variant === 'gray') {
            bgClass = "bg-[#D1D5DB] dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-gray-400";
        } else if (variant === 'dark') {
            bgClass = "bg-[#374151] dark:bg-slate-900 text-white hover:bg-gray-800";
        }

        return (
            <button
                onClick={() => handleInput(action)}
                className={`h-14 rounded-lg flex items-center justify-center shadow-sm active:scale-[0.96] transition-transform ${bgClass}`}
            >
                <div className="flex items-baseline justify-center gap-1.5">
                    <span className={`text-[28px] leading-none ${variant === 'dark' ? 'font-medium' : 'font-normal'}`}>
                        {main}
                    </span>
                    {sub && (
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest self-center mt-1">
                            {sub}
                        </span>
                    )}
                </div>
            </button>
        );
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
                    value={value}
                    placeholder={placeholder || "Nomor Rekening"}
                    className={`${inputClassName || defaultInputClass} cursor-pointer caret-transparent outline-none`}
                />
            </div>

            {/* Bottom Sheet Keypad */}
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
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                            />

                            {/* Keypad */}
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                                drag="y"
                                dragConstraints={{ top: 0 }}
                                dragElastic={0.2}
                                onDragEnd={(e, info) => {
                                    if (info.offset.y > 100 || info.velocity.y > 500) {
                                        setIsOpen(false);
                                    }
                                }}
                                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[60] pb-safe"
                            >
                                <div className="bg-[#E5E7EB] dark:bg-[#1C1C1E] p-2 pb-6 pt-3 shadow-[0_-10px_60px_rgba(0,0,0,0.15)]">
                                    {/* Drag Handle */}
                                    <div className="flex justify-center mb-3">
                                        <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                    </div>

                                    <div className="grid grid-cols-4 gap-2">
                                        {/* Row 1 */}
                                        <KeypadButton main="1" action="1" />
                                        <KeypadButton main="2" sub="ABC" action="2" />
                                        <KeypadButton main="3" sub="DEF" action="3" />
                                        <KeypadButton main="-" action="-" variant="gray" />

                                        {/* Row 2 */}
                                        <KeypadButton main="4" sub="GHI" action="4" />
                                        <KeypadButton main="5" sub="JKL" action="5" />
                                        <KeypadButton main="6" sub="MNO" action="6" />
                                        <KeypadButton main={<span className="text-xl">␣</span>} action="SPACE" variant="gray" />

                                        {/* Row 3 */}
                                        <KeypadButton main="7" sub="PQRS" action="7" />
                                        <KeypadButton main="8" sub="TUV" action="8" />
                                        <KeypadButton main="9" sub="WXYZ" action="9" />
                                        <KeypadButton main={<Delete size={20} strokeWidth={2.5} />} action="DEL" variant="gray" />

                                        {/* Row 4 */}
                                        <KeypadButton main={<span className="text-xl tracking-widest">* #</span>} action="* #" />
                                        <KeypadButton main="0" sub="+" action="0" />
                                        <KeypadButton main="." action="." />
                                        <KeypadButton main={<span className="text-2xl font-bold">→|</span>} action="NEXT" variant="dark" />
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
