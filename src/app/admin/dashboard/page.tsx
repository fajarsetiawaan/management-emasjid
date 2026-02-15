'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { motion } from 'framer-motion';

import {
    Wallet,
    Calendar,
    FileText,
    Box,
    Users,
    BarChart3,
    ChevronRight,
    Clock,
    MapPin,
    ArrowUpRight
} from 'lucide-react';
import { MOCK_MOSQUE, MOCK_EVENTS } from '@/lib/mock-data';
import { getTotalBalance } from '@/lib/api';

export default function AdminDashboardPage() {
    const [displayBalance, setDisplayBalance] = useState(MOCK_MOSQUE.balance);
    const isNewUser = displayBalance === 0;
    const nextEvent = isNewUser ? null : MOCK_EVENTS.find(e => e.status === 'UPCOMING');

    // Load balance from localStorage (onboarding data) on client
    useEffect(() => {
        setDisplayBalance(getTotalBalance());
    }, []);

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const menuItems = [
        { name: 'Keuangan', href: '/admin/finance', icon: Wallet, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800/50' },
        { name: 'Agenda', href: '/admin/events', icon: Calendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800/50' },
        { name: 'Surat', href: '/admin/letters', icon: FileText, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-800/50' },
        { name: 'Aset', href: '/admin/inventory', icon: Box, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800/50' },
        { name: 'Jamaah', href: '/admin/donors', icon: Users, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-100 dark:border-cyan-800/50' },
        { name: 'Laporan', href: '/admin/reports', icon: BarChart3, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800/50' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 relative">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[80%] bg-emerald-400/10 dark:bg-emerald-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[70%] h-[70%] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            {/* Hero Section (Finance) */}
            <div className="relative overflow-hidden rounded-b-[2.5rem] shadow-2xl shadow-emerald-900/20 z-10 mx-2 mt-2">
                {/* Mesh Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-b-[2.5rem] rounded-t-[2rem]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 p-6 pt-8 pb-14 text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-emerald-100 text-sm font-medium mb-1 tracking-wide opacity-80">Total Saldo Kas</div>
                            <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-sm">
                                {formatRupiah(displayBalance)}
                            </h2>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                            <Wallet className="text-emerald-300" size={20} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-500/20 backdrop-blur-sm text-emerald-50 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-400/30 flex items-center gap-1.5 shadow-lg shadow-emerald-900/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Aman & Stabil
                        </span>
                        <span className="text-emerald-200/90 text-xs font-medium">+5% dari bulan lalu</span>
                    </div>
                </div>
            </div>

            {/* Grid Menu System */}
            <div className="px-5 -mt-10 relative z-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 dark:border-white/5 p-5 grid grid-cols-4 gap-y-6 gap-x-2"
                >
                    {menuItems.map((item) => (
                        <motion.div key={item.name} variants={itemVariants} className="w-full">
                            <Link href={item.href} className="flex flex-col items-center gap-2 group w-full">
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-active:scale-95 shadow-sm`}>
                                    <item.icon className={item.color} size={26} strokeWidth={2} />
                                </div>
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight tracking-tight group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                    {item.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Widgets Area */}
            <div className="p-5 space-y-6 mt-2 relative z-10">

                {/* Agenda Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">Agenda Terdekat</h3>
                        <Link href="/admin/events" className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                            Lihat Semua <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    {
                        nextEvent ? (
                            <Link href="/admin/events" className="block group">
                                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/40 dark:border-white/10 flex items-center gap-5 transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:-translate-y-1">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-800/50 shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 dark:text-blue-500">{nextEvent.date.toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-xl font-bold leading-none">{nextEvent.date.getDate()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{nextEvent.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate font-medium">{nextEvent.ustadz || 'Agenda Internal DKM'}</p>
                                        <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                <Clock size={12} className="text-slate-500 dark:text-slate-400" />
                                                <span>{nextEvent.time} WIB</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={12} />
                                                <span>Masjid Utama</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-white" />
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-white/10 border-dashed">
                                Belum ada agenda terdekat
                            </div>
                        )
                    }
                </div>

            </div>
        </div>
    );
}
