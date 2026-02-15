import { Trash2 } from 'lucide-react';
import { BankAccount } from '@/types';

interface BankItemProps {
    account: BankAccount;
    onDelete: (id: string, bank: string) => void;
}

export function BankItem({ account, onDelete }: BankItemProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start justify-between group relative overflow-hidden transition-all hover:border-slate-700">
            <div className="relative z-10 w-full">
                <div className="flex justify-between items-start w-full">
                    <div>
                        <h3 className="text-white font-bold text-base mb-1">{account.bankName}</h3>
                        <p className="text-2xl font-bold text-slate-200 tracking-wider font-mono mb-1">
                            {account.accountNumber}
                        </p>
                        <p className="text-sm text-slate-500">{account.holderName}</p>
                    </div>
                    <button
                        onClick={() => onDelete(account.id, account.bankName)}
                        className="text-slate-500 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-white/5"
                        title="Hapus Rekening"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Subtle background glow/gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-transparent pointer-events-none" />
        </div>
    );
}
