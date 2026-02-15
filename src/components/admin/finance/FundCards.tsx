'use client';

import { Layers, Plus } from 'lucide-react';
import { Program } from '@/types';
import { formatRupiah } from '@/lib/formatter';

interface FundCardsProps {
    programs: Program[];
}

export default function FundCards({ programs }: FundCardsProps) {
    return (
        <section>
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pos Keuangan</h3>
                <button className="text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:underline">Lihat Semua</button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x hide-scrollbar">
                {/* Always show "All Funds" card first or aggregate? Or just existing programs */}
                {programs.map((program) => (
                    <div key={program.id} className="snap-center shrink-0 w-[240px] group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-5 shadow-lg flex flex-col justify-between hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <Layers size={18} />
                                </div>
                                <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">{program.type === 'RESTRICTED' ? 'TERIKAT' : 'BEBAS'}</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 line-clamp-1">{program.name}</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {formatRupiah(program.balance)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Fund Card (Visual only for now) */}
                <button className="snap-center shrink-0 w-[80px] flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-500 transition-colors bg-white/50 dark:bg-slate-900/50 min-h-[140px]">
                    <Plus size={24} />
                    <span className="text-[10px] font-bold mt-2">Add</span>
                </button>
            </div>
        </section>
    );
}
