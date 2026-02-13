'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutGrid,
    Calendar,
    Plus,
    Folder,
    User,
    Bell,
    LogOut,
    Building2,
    Wallet,
    CalendarPlus,
    FilePlus,
    X
} from 'lucide-react';
import { MOCK_USER, MOCK_MOSQUE } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileAppShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isFabOpen, setIsFabOpen] = useState(false);

    const menuItems = [
        { name: 'Beranda', href: '/admin/dashboard', icon: LayoutGrid },
        { name: 'Transaksi', href: '/admin/finance', icon: Wallet },
        { name: 'Input', href: '#', icon: Plus, isFab: true },
        { name: 'Agenda', href: '/admin/events', icon: Calendar },
        { name: 'Akun', href: '/admin/settings', icon: User },
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex justify-center font-sans tracking-tight">
            {/* Mobile Constraint Container */}
            <div className="w-full max-w-[480px] bg-slate-50 min-h-screen shadow-2xl relative flex flex-col overflow-hidden">

                {/* Decorative Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

                {/* Sticky Top Bar (Glassmorphism Premium) */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 h-16 flex items-center justify-between px-5 transition-all duration-300">

                    {/* Left: Branding */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200/50">
                            <Building2 size={20} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold text-slate-800 leading-tight">
                                {MOCK_MOSQUE.name}
                            </h1>
                            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                                ADMIN DASHBOARD
                            </span>
                        </div>
                    </div>

                    {/* Right: User Actions */}
                    <div className="flex items-center gap-3">
                        <button className="relative w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:shadow-md transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 pb-24 relative z-0 px-1 overflow-x-hidden">
                    {children}
                </main>

                {/* Overlay for Smart FAB */}
                {isFabOpen && (
                    <div
                        className="absolute inset-0 bg-slate-900/60 z-40 backdrop-blur-sm transition-all duration-300"
                        onClick={() => setIsFabOpen(false)}
                    />
                )}

                {/* Smart FAB Menu Items (Radial/Semi-Circle) */}
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-[480px] pointer-events-none flex justify-center h-48 items-end">
                    <AnimatePresence>
                        {isFabOpen && (
                            <>
                                {/* Item 2: Surat (Right - 20deg) */}
                                <motion.div
                                    initial={{ opacity: 0, x: 0, y: 50, scale: 0.5 }}
                                    animate={{ opacity: 1, x: 70, y: -20, scale: 1 }}
                                    exit={{ opacity: 0, x: 0, y: 50, scale: 0.5 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                                    className="absolute bottom-24 pointer-events-auto"
                                >
                                    <Link href="/admin/letters/new" onClick={() => setIsFabOpen(false)}>
                                        <div className="flex flex-col items-center gap-1 group">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center shadow-xl shadow-orange-200/50 hover:scale-110 transition-transform">
                                                <FilePlus size={24} />
                                            </div>
                                            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                                Surat
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* Item 3: Agenda (Left - 20deg) */}
                                <motion.div
                                    initial={{ opacity: 0, x: 0, y: 50, scale: 0.5 }}
                                    animate={{ opacity: 1, x: -70, y: -20, scale: 1 }}
                                    exit={{ opacity: 0, x: 0, y: 50, scale: 0.5 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                                    className="absolute bottom-24 pointer-events-auto"
                                >
                                    <Link href="/admin/events/new" onClick={() => setIsFabOpen(false)}>
                                        <div className="flex flex-col items-center gap-1 group">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-blue-200/50 hover:scale-110 transition-transform">
                                                <CalendarPlus size={24} />
                                            </div>
                                            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                                Agenda
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* Item 1: Finance (Center Top - 90deg) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 50, scale: 0.5 }}
                                    animate={{ opacity: 1, y: -90, scale: 1 }}
                                    exit={{ opacity: 0, y: 50, scale: 0.5 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0 }}
                                    className="absolute bottom-16 pointer-events-auto"
                                >
                                    <Link href="/admin/finance/new" onClick={() => setIsFabOpen(false)}>
                                        <div className="flex flex-col items-center gap-1 group">
                                            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-200/50 hover:scale-110 transition-transform border-4 border-slate-50">
                                                <Wallet size={30} />
                                            </div>
                                            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                                                Catat Kas
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Navigation Dock (Floating Island) */}
                <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[420px] z-50 bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-1.5">
                    <div className="grid grid-cols-5 h-16 items-center px-1 relative">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;

                            if (item.isFab) {
                                return (
                                    <div key={item.name} className="relative flex justify-center h-full items-center -mt-6">
                                        <button
                                            onClick={() => setIsFabOpen(!isFabOpen)}
                                            className={`h-16 w-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) border-4 border-slate-50
                        ${isFabOpen
                                                    ? 'bg-slate-800 rotate-45 scale-90'
                                                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/40 hover:scale-110 hover:-translate-y-1'
                                                }
                      `}
                                        >
                                            <Plus size={32} strokeWidth={3} />
                                        </button>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group flex flex-col items-center justify-center gap-1 h-full w-full relative"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute -bottom-1 w-1 h-1 bg-emerald-500 rounded-full mb-2"
                                        />
                                    )}
                                    <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'text-emerald-600 bg-emerald-50/0 -translate-y-1' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                        <item.icon
                                            size={24}
                                            className={isActive ? 'stroke-[2.5px] drop-shadow-sm' : 'stroke-[1.5px]'}
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

            </div>
        </div>
    );
}
