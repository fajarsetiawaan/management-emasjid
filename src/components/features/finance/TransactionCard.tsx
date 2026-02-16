
import { Transaction, TransactionCategory } from '@/types';
import { formatRupiah, formatCategory } from '@/lib/formatter';
import {
    TrendingUp,
    TrendingDown,
    Heart,
    HandHeart,
    Gift,
    Coins,
    Zap,
    Briefcase,
    Hammer,
    Users,
    HeartHandshake,
    Wallet
} from 'lucide-react';

interface TransactionCardProps {
    transaction: Transaction;
    programName: string;
}

// Icon Helper
const getCategoryIcon = (category?: TransactionCategory) => {
    switch (category) {
        case 'INFAQ_JUMAT':
        case 'INFAQ_UMUM':
        case 'DONASI':
            return <Coins size={20} className="text-emerald-600 dark:text-emerald-400" />;
        case 'ZAKAT_FITRAH':
        case 'ZAKAT_MAL':
            return <Gift size={20} className="text-emerald-600 dark:text-emerald-400" />;
        case 'WAKAF':
            return <Heart size={20} className="text-emerald-600 dark:text-emerald-400" />;

        case 'OPERASIONAL':
            return <Zap size={20} className="text-amber-600 dark:text-amber-400" />;
        case 'PEMBANGUNAN':
            return <Hammer size={20} className="text-blue-600 dark:text-blue-400" />;
        case 'HONOR_PETUGAS':
            return <Users size={20} className="text-indigo-600 dark:text-indigo-400" />;
        case 'SOSIAL_YATIM':
        case 'SANTUNAN':
            return <HeartHandshake size={20} className="text-rose-600 dark:text-rose-400" />;

        default:
            return <Wallet size={20} className="text-slate-600 dark:text-slate-400" />;
    }
};

const getCategoryColor = (category?: TransactionCategory) => {
    switch (category) {
        case 'INFAQ_JUMAT':
        case 'INFAQ_UMUM':
        case 'DONASI':
        case 'ZAKAT_FITRAH':
        case 'ZAKAT_MAL':
        case 'WAKAF':
            return 'bg-emerald-100 dark:bg-emerald-500/20';

        case 'OPERASIONAL':
            return 'bg-amber-100 dark:bg-amber-500/20';
        case 'PEMBANGUNAN':
            return 'bg-blue-100 dark:bg-blue-500/20';
        case 'HONOR_PETUGAS':
            return 'bg-indigo-100 dark:bg-indigo-500/20';
        case 'SOSIAL_YATIM':
        case 'SANTUNAN':
            return 'bg-rose-100 dark:bg-rose-500/20';

        default:
            return 'bg-slate-100 dark:bg-slate-800';
    }
};

export default function TransactionCard({ transaction, programName }: TransactionCardProps) {
    const isIncome = transaction.type === 'INCOME';
    const formattedCategory = formatCategory(transaction.category);

    const getCleanDescription = (desc: string) => {
        if (!desc) return 'Transaksi Tanpa Nama';
        const descLower = desc.toLowerCase();
        const catLower = formattedCategory.toLowerCase();
        if (descLower.includes(` - ${catLower}`)) return desc.replace(new RegExp(` - ${formattedCategory}`, 'i'), '');
        if (descLower.includes(`-${catLower}`)) return desc.replace(new RegExp(`-${formattedCategory}`, 'i'), '');
        if (descLower === catLower) return 'Hamba Allah';
        return desc;
    };

    const cleanDescription = getCleanDescription(transaction.description);

    return (
        <div className="group flex items-center gap-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-white/50 dark:border-slate-800/50 hover:bg-white/90 dark:hover:bg-slate-800/80">

            {/* 1. Icon Box */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getCategoryColor(transaction.category)}`}>
                {getCategoryIcon(transaction.category)}
            </div>

            {/* 2. Middle Info */}
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[15px] truncate">
                    {cleanDescription}
                </h4>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {formattedCategory}
                </p>
            </div>

            {/* 3. Right Info (Amount) */}
            <div className="text-right flex-shrink-0">
                <p className={`font-extrabold text-[15px] tracking-tight ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-200'}`}>
                    {isIncome ? '+' : '-'} {formatRupiah(transaction.amount).replace(/,00$/, '').replace('Rp', '')}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md inline-block">
                    {programName}
                </p>
            </div>
        </div>
    );
}
