'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="relative w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-400">
                <Sun size={20} />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-amber-500 dark:hover:text-sky-400 transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
        >
            {theme === 'dark' ? (
                <Moon size={20} className="fill-sky-400/20 text-sky-400" />
            ) : (
                <Sun size={20} className="fill-amber-400/20 text-amber-500" />
            )}
        </button>
    );
}
