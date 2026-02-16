
import { ArrowDownLeft, ArrowUpRight, Repeat, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function FinanceQuickActions() {
    const actions = [
        {
            label: 'Pemasukan',
            icon: ArrowDownLeft,
            color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
            href: '/admin/finance/new?type=INCOME'
        },
        {
            label: 'Pengeluaran',
            icon: ArrowUpRight,
            color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
            href: '/admin/finance/new?type=EXPENSE'
        },
        {
            label: 'Transfer',
            icon: Repeat,
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            href: '/admin/finance/transfer'
        },
        {
            label: 'Lainnya',
            icon: MoreHorizontal,
            color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
            href: '#'
        }
    ];

    return (
        <section className="grid grid-cols-4 gap-4 mb-8">
            {actions.map((action, index) => (
                <Link key={index} href={action.href} className="flex flex-col items-center gap-2 group">
                    <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${action.color}`}>
                        <action.icon size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center">{action.label}</span>
                </Link>
            ))}
        </section>
    );
}
