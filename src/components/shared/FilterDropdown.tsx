import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownContextType {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    close: () => void;
}

const FilterDropdownContext = createContext<FilterDropdownContextType | undefined>(undefined);

export function useFilterDropdown() {
    const context = useContext(FilterDropdownContext);
    if (!context) {
        throw new Error('useFilterDropdown must be used within a FilterDropdown');
    }
    return context;
}

interface FilterDropdownProps {
    children: React.ReactNode;
    className?: string;
}

export function FilterDropdown({ children, className = '' }: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const close = () => setIsOpen(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                close();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <FilterDropdownContext.Provider value={{ isOpen, setIsOpen, close }}>
            <div className={`relative ${className}`} ref={containerRef}>
                {children}
            </div>
        </FilterDropdownContext.Provider>
    );
}

interface FilterTriggerProps {
    icon: React.ReactNode;
    label?: string; // Optional text label if needed alongside icon
    isActive: boolean;
    activeColorClass?: string; // e.g., 'bg-emerald-500'
    children?: React.ReactNode; // For custom trigger content if needed
    className?: string;
    showChevron?: boolean;
    indicator?: React.ReactNode; // e.g. red dot
}

export function FilterTrigger({
    icon,
    isActive,
    className = '',
    showChevron = true,
    indicator
}: FilterTriggerProps) {
    const { isOpen, setIsOpen } = useFilterDropdown();

    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`h-10 pl-3 pr-2 rounded-full backdrop-blur-md border flex items-center justify-center gap-1 shadow-sm transition-all ring-1 ring-inset relative
            ${isActive
                    ? 'bg-emerald-500 text-white border-emerald-400 ring-emerald-300/30 shadow-emerald-500/20'
                    : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 ring-transparent'}
            ${className}`}
        >
            {icon}
            {showChevron && (
                <ChevronDown size={14} className={`opacity-70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            )}
            {indicator}
        </button>
    );
}

interface FilterContentProps {
    children: React.ReactNode;
    className?: string;
    width?: string; // e.g. 'w-72'
}

export function FilterContent({ children, className = '', width = 'w-72' }: FilterContentProps) {
    const { isOpen } = useFilterDropdown();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 top-12 ${width} bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-2 z-50 origin-top-right ring-1 ring-black/5 overflow-hidden ${className}`}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface FilterItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    isSelected?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

export function FilterItem({ children, onClick, isSelected, className = '', icon }: FilterItemProps) {
    const { close } = useFilterDropdown();

    const handleClick = () => {
        if (onClick) onClick();
        close();
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full px-4 py-2.5 text-left text-sm font-semibold rounded-xl transition-all flex items-center gap-3
            ${isSelected
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}
            ${className}`}
        >
            {icon && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {icon}
                </div>
            )}
            <div className="flex-1 flex items-center justify-between">
                {children}
            </div>
        </button>
    );
}

export function FilterSeparator() {
    return <div className="border-t border-slate-200 dark:border-slate-700 my-1 pt-2 px-1" />;
}

export function FilterLabel({ children }: { children: React.ReactNode }) {
    return <h4 className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">{children}</h4>;
}
