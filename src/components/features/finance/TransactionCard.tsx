
import { Transaction } from '@/types';
import { formatRupiah, formatCategory } from '@/lib/formatter';
import { TrendingUp, Activity, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionCardProps {
    transaction: Transaction;
    programName: string;
}

export default function TransactionCard({ transaction, programName }: TransactionCardProps) {
    const isIncome = transaction.type === 'INCOME';
    const formattedCategory = formatCategory(transaction.category);

    // Clean Description Logic: Remove Category if it appears in the description
    // e.g. "Hamba Allah - Zakat Mal" -> "Hamba Allah"
    const getCleanDescription = (desc: string) => {
        if (!desc) return 'Transaksi Tanpa Nama';

        // Case insensitive check
        const descLower = desc.toLowerCase();
        const catLower = formattedCategory.toLowerCase();

        // Check for " - Category" pattern
        if (descLower.includes(` - ${catLower}`)) {
            return desc.replace(new RegExp(` - ${formattedCategory}`, 'i'), '');
        }

        // Check for "- Category" (no space)
        if (descLower.includes(`-${catLower}`)) {
            return desc.replace(new RegExp(`-${formattedCategory}`, 'i'), '');
        }

        // Check if description IS the category
        if (descLower === catLower) {
            return 'Hamba Allah'; // Default if name is missing and only category was used
        }

        return desc;
    };

    const cleanDescription = getCleanDescription(transaction.description);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-slate-100 dark:border-slate-800/50 flex items-start justify-between group relative overflow-hidden">

            {/* Discrete Type Indicator Bar */}
            <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${isIncome ? 'bg-emerald-500' : 'bg-rose-500'}`} />

            <div className="flex flex-col justify-center pl-4 gap-2">
                {/* Description / Name */}
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[15px] leading-tight">
                    {cleanDescription}
                </h4>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Category Badge - Pill Style */}
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide
                        ${isIncome
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                        }`}>
                        {formattedCategory}
                    </span>

                    {/* Program Badge - Soft Gray Pill */}
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                        {programName}
                    </span>
                </div>
            </div>

            {/* Amount */}
            <div className={`text-right ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                <div className="flex items-center justify-end gap-1 mb-1 opacity-0 hover:opacity-100 transition-opacity">
                    {/* Hidden arrow helper, only shows if needed or keep layout stable */}
                </div>
                <p className="font-black text-lg tracking-tight">
                    {formatRupiah(transaction.amount).replace(/,00$/, '').replace('Rp', '')}
                </p>
            </div>
        </div>
    );
}
