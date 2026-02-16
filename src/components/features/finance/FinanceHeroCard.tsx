'use client';

import {
    Wallet,
    ArrowDownLeft,
    ArrowUpRight,
    TrendingUp
} from 'lucide-react';
import { formatRupiah } from '@/lib/formatter';

interface FinanceHeroCardProps {
    balance: number;
    incomePercentage?: number; // Optional, can be calculated or passed
}

export default function FinanceHeroCard({ balance, incomePercentage = 12 }: FinanceHeroCardProps) {
    return (
        <section className="relative group perspective-1000 mb-6">
            {/* Ambient Glow behind the card */}
            <div className="absolute top-4 left-4 right-4 bottom-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse-slow"></div>

            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 p-8 text-white shadow-2xl shadow-emerald-900/30 border border-white/10 backdrop-blur-3xl">

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-20"></div>

                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                </div>
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl mix-blend-screen"></div>
                <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-teal-400/10 rounded-full blur-3xl mix-blend-screen"></div>

                <div className="relative z-10 flex flex-col items-start justify-between h-full min-h-[140px]">
                    <div className="flex justify-between w-full items-start">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                            <Wallet size={14} className="text-emerald-300" />
                            <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Total Saldo</span>
                        </div>
                        {/* Status / Trend Indicator */}
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                            <TrendingUp size={12} className="text-emerald-300" />
                            <span className="text-[10px] font-bold text-emerald-300">Sehat</span>
                        </div>
                    </div>

                    <div className="mt-6 mb-4">
                        <h2 className="text-4xl font-black tracking-tight text-white mb-1">
                            {formatRupiah(balance)}
                        </h2>
                        <p className="text-xs text-slate-400 font-medium tracking-wide">Update terakhir: Barusan</p>
                    </div>

                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-400 w-[75%] shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                    </div>
                    <div className="flex justify-between w-full mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Pemasukan bulan ini</span>
                        <span className="text-emerald-300">+12%</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
