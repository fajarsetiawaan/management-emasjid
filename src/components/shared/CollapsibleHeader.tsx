'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CollapsibleHeaderProps {
    title: string;
    subtitle?: string;
    headerRight?: React.ReactNode;
    children: React.ReactNode;
}

export default function CollapsibleHeader({
    title,
    subtitle,
    headerRight,
    children,
}: CollapsibleHeaderProps) {
    const { scrollY } = useScroll();

    // Header background opacity (0 to 1 as we scroll 0 to 80px)
    const headerBgOpacity = useTransform(scrollY, [0, 80], [0, 1]);

    // Large title collapses and fades out
    const bigTitleOpacity = useTransform(scrollY, [0, 60], [1, 0]);
    const bigTitleY = useTransform(scrollY, [0, 80], [0, -20]);
    const bigTitleScale = useTransform(scrollY, [0, 80], [1, 0.95]);

    // Small title in sticky header fades in and slides up
    const smallTitleOpacity = useTransform(scrollY, [40, 80], [0, 1]);
    const smallTitleY = useTransform(scrollY, [40, 80], [10, 0]);

    // Parallax background blobs
    const bgY = useTransform(scrollY, [0, 300], [0, 150]);

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Parallax Abstract Background */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[350px] z-0 overflow-hidden pointer-events-none"
                style={{ y: bgY }}
            >
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-pink-500/10 animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-rose-500/20 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen dark:bg-rose-500/10 animate-blob" style={{ animationDelay: '2s' }} />

                {/* Gradient to smooth out the bottom transition into the main background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 dark:to-slate-950" />
            </motion.div>

            {/* Sticky Header */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <motion.div
                    className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300 pointer-events-none"
                    style={{ opacity: headerBgOpacity }}
                />
                <div className="relative z-10 px-6 py-4 flex justify-between items-center min-h-[72px]">
                    <motion.div
                        style={{ opacity: smallTitleOpacity, y: smallTitleY }}
                        className="flex-1"
                    >
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate pr-4">{title}</h1>
                    </motion.div>

                    {/* Actions (always visible and interactive) */}
                    <div className="flex items-center gap-2">
                        {headerRight}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 pt-[100px] px-6 pb-24 min-h-screen flex flex-col">
                {/* Hero / Big Title Area */}
                <motion.div
                    style={{ opacity: bigTitleOpacity, y: bigTitleY, scale: bigTitleScale }}
                    className="mb-8 px-2 origin-left"
                >
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm mb-1 leading-tight">{title}</h1>
                    {subtitle && (
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">{subtitle}</p>
                    )}
                </motion.div>

                {/* Children Content */}
                <div className="flex-1 w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
