'use client';

import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface ListRowProps {
    icon?: ReactNode;
    label: ReactNode;
    value?: string;
    onClick?: () => void;
    isOpen?: boolean;
    children?: ReactNode; // Expanded content
    className?: string;
    rightElement?: ReactNode; // Instead of Chevron if needed
    showChevron?: boolean;
    iconClassName?: string;
}

export function ListRow({
    icon,
    label,
    value,
    onClick,
    isOpen,
    children,
    className = '',
    rightElement,
    showChevron = true,
    iconClassName = 'bg-slate-100 text-slate-400 dark:bg-slate-800'
}: ListRowProps) {
    return (
        <div className={`bg-white dark:bg-[#1C1C1E] overflow-hidden ${className}`}>
            <button
                type="button"
                onClick={onClick}
                className="w-full flex items-center justify-between p-4 active:bg-slate-50 dark:active:bg-slate-800 transition-colors"
                disabled={!onClick}
            >
                <div className="flex items-center gap-3 w-full">
                    {icon && (
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${iconClassName}`}>
                            {icon}
                        </div>
                    )}

                    <div className="flex-1 text-left">
                        {typeof label === 'string' ? (
                            <span className={`font-medium text-[17px] ${!value && !children ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                                {label}
                            </span>
                        ) : label}
                    </div>

                    {value && (
                        <span className="text-[17px] text-slate-500 mr-2">{value}</span>
                    )}
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    {rightElement}
                    {showChevron && onClick && (
                        <ChevronRight
                            size={20}
                            className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                        />
                    )}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && children && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function ListGroup({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 ${className}`}>
            {children}
        </div>
    );
}
