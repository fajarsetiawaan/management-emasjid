'use client';

import { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Calendar, Check, Save, Wallet, Layers } from 'lucide-react';
import {
    TransactionType,
    AssetAccount,
    Program
} from '@/types';
import { getAssetAccounts, getPrograms } from '@/lib/api';

export default function TransactionForm() {
    const [type, setType] = useState<TransactionType>('INCOME');
    const [amountStr, setAmountStr] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    // 2D Accounting State
    const [accountId, setAccountId] = useState('');
    const [programId, setProgramId] = useState('');

    // Data Source
    const [accounts, setAccounts] = useState<AssetAccount[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const [accData, progData] = await Promise.all([
                getAssetAccounts(),
                getPrograms()
            ]);
            setAccounts(accData);
            setPrograms(progData);

            // Set defaults if available
            if (accData.length > 0) setAccountId(accData[0].id);
            if (progData.length > 0) setProgramId(progData[0].id);
        };
        loadData();
    }, []);

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
            accountId,   // Dimension 1: Where
            programId,   // Dimension 2: What for
            date: new Date(date),
            description,
        };

        console.log('Transaction Submitted:', JSON.stringify(payload, null, 2));
        alert(`Data transaksi berhasil disimpan!\n\n${type === 'INCOME' ? 'Masuk ke' : 'Keluar dari'}: ${accounts.find(a => a.id === accountId)?.name}\nUntuk Program: ${programs.find(p => p.id === programId)?.name}`);

        // Reset form
        setAmountStr('');
        setDescription('');
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-lg mx-auto">
            {/* Type Switcher */}
            <div className="grid grid-cols-2">
                <button
                    type="button"
                    onClick={() => setType('INCOME')}
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
                    onClick={() => setType('EXPENSE')}
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

                {/* 2D Accounting Inputs */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">

                    {/* Dimension 1: Asset Account */}
                    <div>
                        <label htmlFor="account" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Wallet size={16} className="text-slate-400" />
                            {type === 'INCOME' ? 'Masuk ke Akun (Fisik)' : 'Sumber Dana (Fisik)'}
                        </label>
                        <select
                            id="account"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-400 focus:outline-none bg-white"
                            required
                        >
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name} ({acc.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dimension 2: Program */}
                    <div>
                        <label htmlFor="program" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Layers size={16} className="text-slate-400" />
                            {type === 'INCOME' ? 'Alokasi Program' : 'Beban Program'}
                        </label>
                        <select
                            id="program"
                            value={programId}
                            onChange={(e) => setProgramId(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-400 focus:outline-none bg-white"
                            required
                        >
                            {programs.map((prog) => (
                                <option key={prog.id} value={prog.id}>
                                    {prog.name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                {/* Date & Description */}
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
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                        Keterangan
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Contoh: Kotak Amal Jumat, Bayar Listrik..."
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
