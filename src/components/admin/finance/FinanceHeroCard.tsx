'use client';

import {
    Wallet,
    ArrowDownLeft,
    Plus,
    Send,
    Download,
    MoreHorizontal
} from 'lucide-react';
import { formatRupiah } from '@/lib/formatter';

interface FinanceHeroCardProps {
    balance: number;
    incomePercentage?: number; // Optional, can be calculated or passed
}

export default function FinanceHeroCard({ balance, incomePercentage = 12 }: FinanceHeroCardProps) {
    return (
        <section className="relative group perspective-1000 mb-8">
            {/* Ambient Glow behind the card */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse-slow"></div>

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-800 p-8 text-white shadow-2xl shadow-emerald-900/20 border border-white/10 backdrop-blur-3xl transform transition-transform duration-500 hover:scale-[1.005]">

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-20"></div>

                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-10 pattern-dots pattern-white pattern-opacity-100 pattern-size-4"></div>
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-400/30 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-teal-300/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-emerald-50 text-xs font-semibold uppercase tracking-wider shadow-inner">
                        <Wallet size={12} className="text-emerald-200" />
                        Total Saldo Kas
                    </span>

                    <h2 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-100 drop-shadow-sm leading-tight pb-2">
                        {formatRupiah(balance)}
                    </h2>

                    <div className="flex gap-3 mt-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/30 border border-emerald-400/30 backdrop-blur-sm">
                            <ArrowDownLeft size={14} className="text-emerald-100" />
                            <span className="text-sm font-bold text-white">Masuk +{incomePercentage}%</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                    {[
                        { icon: Plus, label: 'Income', color: 'bg-white/20 hover:bg-white/30 text-white' },
                        { icon: Send, label: 'Transfer', color: 'bg-white/10 hover:bg-white/20 text-emerald-100' },
                        { icon: Download, label: 'Expor', color: 'bg-white/10 hover:bg-white/20 text-emerald-100' },
                        { icon: MoreHorizontal, label: 'Lainnya', color: 'bg-white/10 hover:bg-white/20 text-emerald-100' }
                    ].map((action, i) => (
                        <button key={i} className="flex flex-col items-center gap-2 group/btn">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-lg group-hover/btn:scale-110 group-active/btn:scale-95 border border-white/10 ${action.color}`}>
                                <action.icon size={20} />
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-50/80">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
