'use client';

import { useState, useEffect } from 'react';
import {
    ArrowDown,
    ArrowUp,
    Calendar,
    Check,
    Save,
    Wallet,
    Layers,
    PenLine,
    CreditCard,
    Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TransactionType,
    AssetAccount,
    Program
} from '@/types';
import { getAssetAccounts, getPrograms } from '@/lib/api';
import { CalculatorInput } from '@/components/ui/CalculatorInput';
import { useSearchParams } from 'next/navigation';
import SingleDateGlassPicker from './SingleDateGlassPicker';

export default function TransactionForm() {
    const searchParams = useSearchParams();
    const initialType = (searchParams.get('type') as TransactionType) || 'INCOME';

    const [type, setType] = useState<TransactionType>(initialType);
    const [amount, setAmount] = useState<number>(0);
    // Ensure date is kept as Date object internally if possible, or convert
    // The previous code used string 'YYYY-MM-DD'. Let's switch to Date object for better component compat
    const [date, setDate] = useState<Date>(new Date());
    const [description, setDescription] = useState('');

    // 2D Accounting State
    const [accountId, setAccountId] = useState('');
    const [programId, setProgramId] = useState('');

    // Data Source
    const [accounts, setAccounts] = useState<AssetAccount[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [accData, progData] = await Promise.all([
                    getAssetAccounts(),
                    getPrograms()
                ]);
                setAccounts(accData);
                setPrograms(progData);

                // Set defaults if available
                if (accData.length > 0) setAccountId(accData[0].id);
                if (progData.length > 0) setProgramId(progData[0].id);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Update type if URL param changes
    useEffect(() => {
        const typeParam = searchParams.get('type') as TransactionType;
        if (typeParam) setType(typeParam);
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            amount,
            type,
            accountId,   // Dimension 1: Where
            programId,   // Dimension 2: What for
            date,        // Already a Date object
            description,
        };

        console.log('Transaction Submitted:', JSON.stringify(payload, null, 2));
        alert(`Data transaksi berhasil disimpan!\n\n${type === 'INCOME' ? 'Masuk ke' : 'Keluar dari'}: ${accounts.find(a => a.id === accountId)?.name}\nUntuk Program: ${programs.find(p => p.id === programId)?.name}`);

        // Reset Logic could go here or redirect
        setAmount(0);
        setDescription('');
    };

    const formatRp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

    // Variants for animation
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-2xl mx-auto pb-32">
            {/* Header / Type Switcher */}
            <div className="flex justify-center mb-8">
                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full flex items-center relative">
                    <motion.div
                        className={`absolute h-[calc(100%-12px)] top-1.5 rounded-full shadow-sm transition-colors duration-300 ${type === 'INCOME' ? 'bg-white dark:bg-slate-700' : 'bg-white dark:bg-slate-700'}`}
                        initial={false}
                        animate={{
                            x: type === 'INCOME' ? '0%' : '100%',
                            width: '50%'
                        }}
                    />
                    <button
                        onClick={() => setType('INCOME')}
                        className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <ArrowDown size={16} strokeWidth={3} />
                        Pemasukan
                    </button>
                    <button
                        onClick={() => setType('EXPENSE')}
                        className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${type === 'EXPENSE' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <ArrowUp size={16} strokeWidth={3} />
                        Pengeluaran
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-8"
                >
                    {/* 1. Hero Amount Input */}
                    <motion.div variants={itemVariant} className="text-center relative">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                            Nominal {type === 'INCOME' ? 'Masuk' : 'Keluar'}
                        </label>
                        <div className="relative inline-block">
                            <CalculatorInput
                                label=""
                                value={amount}
                                onChange={setAmount}
                                placeholder="0"
                                className={`text-5xl sm:text-7xl font-bold bg-transparent border-none text-center p-0 focus:ring-0 w-full placeholder:text-slate-200 dark:placeholder:text-slate-700 ${type === 'INCOME' ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}
                            />
                            {/* Decorative Underline */}
                            <div className={`h-1.5 w-full rounded-full mt-2 mx-auto max-w-[200px] ${type === 'INCOME' ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`} />
                        </div>
                    </motion.div>

                    {/* 2. Account Selector (Rekening / Tunai) */}
                    <motion.div variants={itemVariant} className="space-y-4">
                        <div className="flex items-center gap-2 px-4">
                            <div className={`p-2 rounded-full ${type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                <Wallet size={18} />
                            </div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">
                                {type === 'INCOME' ? 'Masuk ke Rekening' : 'Ambil dari Sumber Dana'}
                            </h3>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x hide-scrollbar">
                            {accounts.map((acc) => {
                                const isSelected = accountId === acc.id;
                                const colors = type === 'INCOME'
                                    ? (isSelected ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 ring-2 ring-emerald-500 ring-offset-2' : 'border-slate-200 bg-white hover:border-emerald-300')
                                    : (isSelected ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/20 ring-2 ring-rose-500 ring-offset-2' : 'border-slate-200 bg-white hover:border-rose-300');

                                return (
                                    <button
                                        key={acc.id}
                                        type="button"
                                        onClick={() => setAccountId(acc.id)}
                                        className={`
                                            flex-shrink-0 w-48 p-5 rounded-2xl border transition-all duration-200 text-left relative group snap-center
                                            ${colors} dark:border-slate-800 dark:bg-slate-900/50
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${acc.type === 'BANK' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                                {acc.type === 'BANK' ? <Landmark size={20} /> : <Wallet size={20} />}
                                            </div>
                                            {isSelected && (
                                                <div className={`p-1 rounded-full ${type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
                                                    <Check size={12} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-bold text-slate-800 dark:text-white mb-0.5">{acc.name}</p>
                                        <p className="text-xs text-slate-500 font-medium">{acc.type === 'BANK' ? acc.accountNumber || 'Rekening Bank' : 'Kas Tunai'}</p>

                                        {/* Optional: Show Balance */}
                                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Saldo Saat Ini</p>
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{formatRp(acc.balance)}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* 3. Program Selector (Category Dompet) */}
                    <motion.div variants={itemVariant} className="space-y-4 px-4">
                        <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-full ${type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                <Layers size={18} />
                            </div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">
                                {type === 'INCOME' ? 'Kategori Dompet (Alokasi)' : 'Beban Dompet Program'}
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {programs.map((prog) => {
                                const isSelected = programId === prog.id;
                                const activeClass = type === 'INCOME'
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200'
                                    : 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-200';
                                const inactiveClass = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';

                                return (
                                    <button
                                        key={prog.id}
                                        type="button"
                                        onClick={() => setProgramId(prog.id)}
                                        className={`
                                            p-4 rounded-xl border text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center h-24
                                            ${isSelected ? activeClass : inactiveClass}
                                        `}
                                    >
                                        <Layers size={20} className={isSelected ? 'text-white' : 'text-slate-400'} />
                                        <span className="line-clamp-2">{prog.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* 4. Details (Date & Desc) */}
                    <motion.div variants={itemVariant} className="space-y-4 px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Date Picker - REPLACED */}
                            <div className="md:col-span-1 z-20 relative">
                                <SingleDateGlassPicker
                                    date={date}
                                    onChange={setDate}
                                    label="Tanggal Transaksi"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Keterangan</label>
                                <div className="relative group">
                                    <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                                        <PenLine size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Contoh: Kotak Amal Jumat, Bayar Listrik..."
                                        rows={2}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium text-slate-700 dark:text-white resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 5. Submit Button (Sticky Style to ensure visibility) */}
                    <motion.div
                        variants={itemVariant}
                        className="sticky bottom-4 px-4 z-40"
                    >
                        <div className="absolute inset-x-0 bottom-[-20px] h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none -z-10" />
                        <button
                            type="submit"
                            disabled={amount <= 0 || !accountId || !programId}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] ring-4 ring-white dark:ring-slate-950
                                ${amount <= 0 || !accountId || !programId
                                    ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'
                                    : (type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/30')
                                }
                            `}
                        >
                            <Save size={20} strokeWidth={3} />
                            {type === 'INCOME' ? 'Simpan Pemasukan' : 'Simpan Pengeluaran'}
                        </button>
                    </motion.div>
                </motion.div>
            </form>
        </div>
    );
}
