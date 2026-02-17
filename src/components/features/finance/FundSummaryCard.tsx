import { Calculator } from 'lucide-react';
import { FUND_CATEGORIES } from '@/lib/constants/finance';
import { Fund } from '@/types';

interface FundSummaryCardProps {
    funds: Fund[];
    className?: string;
}

export default function FundSummaryCard({ funds, className = "" }: FundSummaryCardProps) {
    return (
        <div className={`bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calculator size={16} className="text-emerald-500" />
                Ringkasan Saldo
            </h3>
            <div className="space-y-3">
                {FUND_CATEGORIES.filter(c => c.id !== 'CUSTOM').map(category => {
                    const total = funds
                        .filter(f => f.type === category.id && f.active)
                        .reduce((sum, f) => sum + (f.balance || 0), 0);

                    if (total === 0) return null;

                    const getColorClass = (color: string) => {
                        switch (color) {
                            case 'emerald': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30';
                            case 'indigo': return 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30';
                            case 'blue': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
                            case 'rose': return 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30';
                            default: return 'text-slate-600 bg-slate-100';
                        }
                    };

                    return (
                        <div key={category.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${getColorClass(category.color)}`}>
                                    {category.id.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{category.label}</div>
                                    <div className="text-[10px] text-slate-400">Total dari {funds.filter(f => f.type === category.id && f.active).length} akun</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-slate-400 mr-1">Rp</div>
                                <div className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                                    {total.toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {funds.filter(f => f.active).reduce((sum, f) => sum + (f.balance || 0), 0) === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400 italic">
                        Belum ada saldo yang dimasukkan.
                    </div>
                )}
            </div>
        </div>
    );
}
