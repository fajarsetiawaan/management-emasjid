import { Trash2, Edit3, Copy } from 'lucide-react';
import { BankAccount } from '@/types';
import { toast } from 'sonner';

interface BankItemProps {
    account: BankAccount;
    onDelete: (id: string, bank: string) => void;
    onEdit: (account: BankAccount) => void;
}

export function BankItem({ account, onDelete, onEdit }: BankItemProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(account.accountNumber);
        toast.success('Nomor rekening disalin!', { position: 'bottom-center' });
    };

    return (
        <div className="group relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5 transition-all hover:border-emerald-500/30 dark:hover:border-emerald-500/30">
            {/* Glass Highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-5 flex items-start justify-between relative z-10">
                <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
                            {account.bankName}
                        </h3>
                    </div>

                    <div
                        onClick={handleCopy}
                        className="group/number flex items-center gap-2 mb-1 cursor-pointer select-none active:scale-[0.98] transition-transform origin-left w-fit"
                    >
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight font-mono tabular-nums">
                            {account.accountNumber}
                        </p>
                        <Copy size={14} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover/number:opacity-100 transition-opacity" />
                    </div>

                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        A.n {account.holderName}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onEdit(account)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 transition-all active:scale-95"
                        title="Edit Rekening"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(account.id, account.bankName)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-all active:scale-95"
                        title="Hapus Rekening"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Subtle Gradient background */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>
    );
}
