
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Banknote, Landmark, Calculator, AlertCircle, ChevronDown, Coins } from 'lucide-react';
import { CalculatorInput } from '@/components/ui/CalculatorInput';
import { FUND_CATEGORIES } from '@/lib/constants/finance';
import { Fund, BankAccount } from '@/types/finance';

interface FundAllocationSetupProps {
    funds: Fund[];
    bankAccounts: BankAccount[];
    onToggleFund: (id: string) => void;
    onUpdateFundData: (id: string, updates: Partial<Fund>) => void;
    onUpdateFundAllocation: (id: string, type: 'CASH' | 'BANK', bankId?: string) => void;
}

export default function FundAllocationSetup({
    funds,
    bankAccounts,
    onToggleFund,
    onUpdateFundData,
    onUpdateFundAllocation
}: FundAllocationSetupProps) {

    return (
        <div className="space-y-8">
            {FUND_CATEGORIES.map((category) => {
                const categoryFunds = funds.filter(f => f.type === category.id);
                if (categoryFunds.length === 0) return null;

                // Color mapping for category badges/accents
                const getColorClass = (color: string) => {
                    switch (color) {
                        case 'emerald': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800';
                        case 'indigo': return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800';
                        case 'blue': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800';
                        case 'rose': return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800';
                        default: return 'text-slate-500 bg-slate-50 border-slate-100';
                    }
                };

                return (
                    <div key={category.id} className="space-y-4">
                        {/* Category Header */}
                        <div className="flex items-center gap-3 px-2">
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getColorClass(category.color)}`}>
                                {category.id}
                            </div>
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {category.label}
                            </h3>
                        </div>

                        {/* List of Funds in this Category */}
                        <div className="grid gap-4">
                            {categoryFunds.map((fund) => {
                                const isAllocationBank = fund.allocation.type === 'BANK';
                                const Icon = fund.icon;

                                return (
                                    <motion.div
                                        layout
                                        key={fund.id}
                                        className={`
                                            relative rounded-3xl border transition-all overflow-visible group
                                            ${fund.active
                                                ? 'bg-white dark:bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg shadow-emerald-500/5'
                                                : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                            }
                                        `}
                                    >
                                        {/* Card Header (Toggle) */}
                                        <div
                                            onClick={() => onToggleFund(fund.id)}
                                            className="p-5 flex items-center gap-4 cursor-pointer"
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${fund.active ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 text-emerald-600 dark:text-emerald-400 shadow-inner' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 grayscale'}`}>
                                                <Icon size={22} strokeWidth={2} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h4 className={`text-base font-bold truncate ${fund.active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                                        {fund.name}
                                                    </h4>
                                                    {fund.locked && <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-600">Wajib</span>}
                                                </div>
                                                <p className="text-xs text-slate-400 truncate">{fund.desc}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${fund.active ? 'border-emerald-500 bg-emerald-500 scale-110' : 'border-slate-300 dark:border-slate-600 group-hover:border-emerald-300'}`}>
                                                {fund.active && <CheckCircle2 size={14} className="text-white" strokeWidth={3} />}
                                            </div>
                                        </div>

                                        {/* Expanded Content (Inputs) */}
                                        <AnimatePresence>
                                            {fund.active && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="bg-slate-50/50 dark:bg-slate-900/30 border-t border-dashed border-emerald-100/50 dark:border-slate-700"
                                                >
                                                    <div className="p-5 pt-3 grid grid-cols-1 gap-4">
                                                        {/* Row 1: Amount */}
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Saldo Awal</label>
                                                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                                <CalculatorInput
                                                                    value={fund.balance || 0}
                                                                    onChange={(val) => onUpdateFundData(fund.id, { balance: val })}
                                                                    placeholder="0"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Row 2: Location Switcher + Bank Select */}
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Disimpan Di</label>

                                                            <div className="flex gap-2">
                                                                <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl flex-shrink-0">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); onUpdateFundAllocation(fund.id, 'CASH'); }}
                                                                        className={`w-20 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-all ${!isAllocationBank ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700'}`}
                                                                    >
                                                                        <Banknote size={14} /> Tunai
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); onUpdateFundAllocation(fund.id, 'BANK'); }}
                                                                        className={`w-20 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-all ${isAllocationBank ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
                                                                    >
                                                                        <Landmark size={14} /> Bank
                                                                    </button>
                                                                </div>

                                                                {/* If Bank Selected, show Dropdown of Available Banks */}
                                                                {isAllocationBank && (
                                                                    <div className="flex-1">
                                                                        {bankAccounts.length > 0 ? (
                                                                            <select
                                                                                className="w-full h-full min-h-[40px] px-3 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500"
                                                                                value={fund.allocation.bankId}
                                                                                onChange={(e) => onUpdateFundAllocation(fund.id, 'BANK', e.target.value)}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                {bankAccounts.map(b => (
                                                                                    <option key={b.id} value={b.id}>{b.bankName} - {b.accountNumber}</option>
                                                                                ))}
                                                                            </select>
                                                                        ) : (
                                                                            <div className="h-full flex items-center px-3 text-[10px] text-red-500 bg-red-50 rounded-xl border border-red-100">
                                                                                Belum ada rekening!
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
