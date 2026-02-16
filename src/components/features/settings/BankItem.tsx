
import { Trash2, CreditCard, Copy, MoreVertical, Edit3 } from 'lucide-react';
import { BankAccount } from '@/types';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BankItemProps {
    bank: BankAccount;
    onDelete: (id: string, bankName: string) => void;
    onEdit: (bank: BankAccount) => void;
}

export default function BankItem({ bank, onDelete, onEdit }: BankItemProps) {
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(bank.accountNumber);
        toast.success('Nomor rekening disalin!', { position: 'bottom-center' });
    };

    return (
        <div
            onClick={() => onEdit(bank)}
            className="group relative bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:shadow-emerald-900/10 hover:border-emerald-500/30 transition-all cursor-pointer overflow-hidden"
        >
            {/* Top Section */}
            <div className="flex items-start gap-4 mb-6">
                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate leading-tight mb-2">
                        {bank.bankName}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs text-slate-500 font-medium truncate">
                            a.n {bank.holderName}
                        </p>
                        {bank.allocation && (
                            <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-600 uppercase tracking-wide">
                                {bank.allocation}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 -mr-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(bank.id, bank.bankName);
                        }}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Bottom Info Card */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between group-hover:bg-emerald-50/30 dark:group-hover:bg-emerald-900/10 transition-colors">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Nomor Rekening
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-slate-700 dark:text-slate-200 tracking-tight tabular-nums">
                            {bank.accountNumber}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 transition-all shadow-sm active:scale-95"
                >
                    <Copy size={12} />
                    Salin
                </button>
            </div>
        </div>
    );
}
