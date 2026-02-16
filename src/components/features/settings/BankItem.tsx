
import { Landmark, Trash2 } from 'lucide-react';
import { BankAccount } from '@/types'; // Assuming BankAccount type exists or I need to define it locally if not

interface BankItemProps {
    bank: BankAccount;
    onDelete: (id: string, bankName: string) => void;
    onEdit: (bank: BankAccount) => void;
}

export default function BankItem({ bank, onDelete, onEdit }: BankItemProps) {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative group flex items-start justify-between hover:border-emerald-500/50 transition-colors">
            <div className="flex-1 cursor-pointer" onClick={() => onEdit(bank)}>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Landmark size={14} />
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{bank.bankName}</div>
                </div>
                <div className="text-lg font-mono font-bold text-slate-600 dark:text-slate-400 ml-10 tracking-widest">{bank.accountNumber}</div>
                <div className="text-xs text-slate-400 mt-1 ml-10 font-medium uppercase tracking-wider">{bank.holderName}</div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(bank.id, bank.bankName);
                }}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Hapus Rekening"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
