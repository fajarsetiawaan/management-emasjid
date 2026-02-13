'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TransactionForm from '@/components/TransactionForm';

export default function NewTransactionPage() {
    return (
        <div className="p-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 mb-6 hover:text-emerald-600 transition-colors">
                <ArrowLeft size={20} />
                <span className="font-bold">Kembali</span>
            </Link>

            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">Catat Transaksi Baru</h1>
                <p className="text-slate-500 text-sm">Masukkan detail pemasukan atau pengeluaran kas masjid.</p>
            </div>

            <TransactionForm />
        </div>
    );
}
