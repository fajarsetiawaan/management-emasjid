'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Calendar, Check, Save } from 'lucide-react';
import {
    TransactionType,
    IncomeCategory,
    ExpenseCategory,
    TransactionCategory
} from '@/types';

export default function TransactionForm() {
    const [type, setType] = useState<TransactionType>('INCOME');
    const [amountStr, setAmountStr] = useState('');
    const [category, setCategory] = useState<TransactionCategory | ''>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    const incomeCategories: { value: IncomeCategory; label: string }[] = [
        { value: 'INFAQ_JUMAT', label: 'Infaq Jumat' },
        { value: 'ZAKAT_FITRAH', label: 'Zakat Fitrah' },
        { value: 'ZAKAT_MAL', label: 'Zakat Mal' },
        { value: 'WAKAF', label: 'Wakaf' },
        { value: 'DONASI', label: 'Donasi' },
    ];

    const expenseCategories: { value: ExpenseCategory; label: string }[] = [
        { value: 'OPERASIONAL', label: 'Operasional' },
        { value: 'PEMBANGUNAN', label: 'Pembangunan' },
        { value: 'HONOR_PETUGAS', label: 'Honor Petugas' },
        { value: 'SOSIAL_YATIM', label: 'Sosial / Yatim' },
    ];

    const categories = type === 'INCOME' ? incomeCategories : expenseCategories;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove non-digit characters
        const value = e.target.value.replace(/\D/g, '');

        if (value === '') {
            setAmountStr('');
            return;
        }

        // Format as IDR for display
        const formatted = new Intl.NumberFormat('id-ID').format(parseInt(value));
        setAmountStr(formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            amount: parseInt(amountStr.replace(/\./g, '')),
            type,
            category,
            date: new Date(date),
            description,
        };

        console.log('Transaction Submitted:', JSON.stringify(payload, null, 2));
        alert('Data transaksi berhasil disimpan! (Cek Console)');

        // Reset form
        setAmountStr('');
        setDescription('');
        setCategory('');
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-lg mx-auto">
            {/* Type Switcher */}
            <div className="grid grid-cols-2">
                <button
                    type="button"
                    onClick={() => { setType('INCOME'); setCategory(''); }}
                    className={`
            p-4 flex items-center justify-center gap-2 font-bold transition-colors
            ${type === 'INCOME'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }
          `}
                >
                    <ArrowDown size={20} />
                    Pemasukan
                </button>
                <button
                    type="button"
                    onClick={() => { setType('EXPENSE'); setCategory(''); }}
                    className={`
            p-4 flex items-center justify-center gap-2 font-bold transition-colors
            ${type === 'EXPENSE'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }
          `}
                >
                    <ArrowUp size={20} />
                    Pengeluaran
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

                {/* Amount Input */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                        Nominal (Rp)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                            Rp
                        </span>
                        <input
                            id="amount"
                            name="amount"
                            type="text"
                            value={amountStr}
                            onChange={handleAmountChange}
                            placeholder="0"
                            className={`
                w-full pl-12 pr-4 py-4 text-3xl font-bold rounded-xl border border-slate-200 
                focus:ring-2 focus:outline-none transition-all
                ${type === 'INCOME' ? 'focus:ring-emerald-500 text-emerald-600' : 'focus:ring-rose-500 text-rose-600'}
              `}
                            required
                        />
                    </div>
                </div>

                {/* Date & Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                            Tanggal
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                id="date"
                                name="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-400 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                            Kategori
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-400 focus:outline-none bg-white"
                            required
                        >
                            <option value="" disabled>Pilih Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                        Keterangan
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Contoh: Kotak Amal Jumat"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-400 focus:outline-none resize-none"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`
            w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]
            ${type === 'INCOME'
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                            : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                        }
          `}
                >
                    <Save size={20} />
                    Simpan Transaksi
                </button>

            </form>
        </div>
    );
}
