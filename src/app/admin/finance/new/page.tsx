'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TransactionForm from '@/components/features/finance/TransactionForm';

export default function NewTransactionPage() {
    return (
        <div className="p-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 mb-6 hover:text-emerald-600 transition-colors">
                <ArrowLeft size={20} />
                <span className="font-bold">Kembali</span>
            </Link>

            <TransactionForm />
        </div >
    );
}
