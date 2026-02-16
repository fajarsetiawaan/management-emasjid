'use client';

import { useState, useEffect } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    Calendar,
    Wallet,
    Landmark,
    Smartphone,
    AlignLeft,
    X,
    Check,
    ArrowRightLeft,
    Tags,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TransactionType,
    AssetAccount,
    Fund
} from '@/types';
import { getAssetAccounts, getFunds, saveTransaction } from '@/lib/api';
import { FUND_CATEGORIES } from '@/lib/constants/finance';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ListRow } from '@/components/ui/ListRow';
import SingleDatePicker from './SingleDatePicker';
import { CalculatorInput } from '@/components/ui/CalculatorInput';

const EXPENSE_PURPOSES = [
    'Honor Ustadz/Petugas',
    'Listrik & Air',
    'Kebersihan & Keamanan',
    'Maintenance Aset',
    'Santunan',
    'Operasional Lainnya'
];

const INCOME_CATEGORIES = [
    'Dari (Donatur/Sumber)',
    'Informasi'
];

export default function TransactionForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialType = (searchParams.get('type') as TransactionType) || 'INCOME';

    const [type, setType] = useState<TransactionType>(initialType);
    const [amount, setAmount] = useState<string>(''); // String for easier input handling
    const [date, setDate] = useState<Date>(new Date());
    const [description, setDescription] = useState('');

    // 2D Accounting State
    const [accountId, setAccountId] = useState('');
    const [targetAccountId, setTargetAccountId] = useState(''); // For Transfer
    const [fundId, setFundId] = useState('');

    // UI State
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isTargetAccountOpen, setIsTargetAccountOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const [expenseCategory, setExpenseCategory] = useState('');
    const [isExpenseCategoryOpen, setIsExpenseCategoryOpen] = useState(false);

    // Income Specific
    const [incomeCategory, setIncomeCategory] = useState('Dari (Donatur/Sumber)'); // Default
    const [incomeDetail, setIncomeDetail] = useState('');
    const [isIncomeCategoryOpen, setIsIncomeCategoryOpen] = useState(false);

    // Data Source
    const [accounts, setAccounts] = useState<AssetAccount[]>([]);
    const [funds, setFunds] = useState<Fund[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [accData, fundData] = await Promise.all([
                    getAssetAccounts(),
                    getFunds()
                ]);
                setAccounts(accData);
                setFunds(fundData);

                if (accData.length > 0) setAccountId(accData[0].id);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const typeParam = searchParams.get('type') as TransactionType;
        if (typeParam) setType(typeParam);
    }, [searchParams]);

    const handleSubmit = async () => {
        if (submitting) return;

        const numAmount = parseInt(amount.replace(/\./g, '') || '0');

        if (numAmount <= 0) {
            alert('Nominal harus lebih dari 0.');
            return;
        }

        if (!accountId) {
            alert('Harap pilih akun sumber.');
            return;
        }

        if (type === 'TRANSFER' && !targetAccountId) {
            alert('Harap pilih akun tujuan untuk mutasi.');
            return;
        }

        if (type === 'EXPENSE' && !expenseCategory) {
            alert('Harap pilih keperluan (kategori) pengeluaran.');
            return;
        }

        const selectedFund = funds.find(f => f.id === fundId);
        const category = type === 'EXPENSE'
            ? expenseCategory
            : (type === 'INCOME' ? (selectedFund?.type || 'INCOME') : 'TRANSFER');

        const finalDescription = (type === 'INCOME' && incomeDetail)
            ? `${incomeCategory.split(' ')[0]}: ${incomeDetail}. ${description}`
            : (description || (type === 'TRANSFER' ? 'Mutasi Saldo' : '-'));

        const payload = {
            amount: numAmount,
            type,
            accountId,
            fundId: fundId || (type === 'TRANSFER' ? (funds[0]?.id || 'transfer-fund') : ''),
            transferTargetAccountId: type === 'TRANSFER' ? targetAccountId : undefined,
            date,
            description: finalDescription.trim(),
            category
        };

        try {
            setSubmitting(true);
            await saveTransaction(payload);
            const updatedAccounts = await getAssetAccounts();
            setAccounts(updatedAccounts);
            alert('Transaksi berhasil disimpan!');

            // Reset
            setAmount('');
            setDescription('');
            setFundId('');
            setExpenseCategory('');
            setIncomeCategory('Dari (Donatur/Sumber)');
            setIncomeDetail('');
            if (type === 'TRANSFER') setTargetAccountId('');

            // Close all drawers
            setIsAccountOpen(false);
            setIsTargetAccountOpen(false);
            setIsCategoryOpen(false);
            setIsNoteOpen(false);
            setIsExpenseCategoryOpen(false);
            setIsIncomeCategoryOpen(false);

        } catch (error) {
            console.error('Failed to save transaction', error);
            alert('Gagal menyimpan transaksi.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val) {
            setAmount(parseInt(val).toLocaleString('id-ID'));
        } else {
            setAmount('');
        }
    };

    const getSelectedAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Pilih Akun';
    const getSelectedFundName = (id: string) => funds.find(f => f.id === id)?.name || 'Pilih Kategori';

    // Helper to get Icon
    const getAccountIcon = (type: string) => {
        switch (type) {
            case 'BANK': return <Landmark size={18} />;
            case 'EWALLET': return <Smartphone size={18} />;
            default: return <Wallet size={18} />;
        }
    };

    // Helper to get Fund Color
    const getFundColor = (id: string) => {
        const fund = funds.find(f => f.id === id);
        if (!fund) return 'bg-slate-200';
        switch (fund.type) {
            case 'OPERASIONAL': return 'bg-blue-500';
            case 'ZAKAT': return 'bg-emerald-500';
            case 'WAKAF': return 'bg-purple-500';
            case 'SOSIAL': return 'bg-orange-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white pb-32">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-slate-50/80 dark:bg-black/80 backdrop-blur-xl z-50 relative">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold absolute left-1/2 -translate-x-1/2">Tambah Transaksi</h1>
                <div className="w-8" />
            </div>

            {/* Segmented Control */}
            <div className="px-4 mb-6">
                <div className="bg-slate-200 dark:bg-slate-900 p-1 rounded-[14px] flex">
                    {(['EXPENSE', 'INCOME', 'TRANSFER'] as TransactionType[]).map((t) => {
                        const isActive = type === t;
                        let label = '';
                        if (t === 'EXPENSE') label = 'Pengeluaran';
                        if (t === 'INCOME') label = 'Pemasukan';
                        if (t === 'TRANSFER') label = 'Mutasi';

                        return (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[10px] transition-all duration-200 ${isActive
                                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Form Group */}
            <div className="px-4 space-y-6">

                {/* 1. Source Account & Amount Group */}
                <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Account Selector */}
                    <ListRow
                        icon={accountId ? getAccountIcon(accounts.find(a => a.id === accountId)?.type || 'CASH') : <Wallet size={18} />}
                        label={getSelectedAccountName(accountId)}
                        isOpen={isAccountOpen}
                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                        iconClassName={accountId ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : undefined}
                    >
                        {accounts.map(acc => (
                            <button
                                key={acc.id}
                                onClick={() => { setAccountId(acc.id); setIsAccountOpen(false); }}
                                className="w-full flex items-center justify-between p-4 pl-[60px] hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors"
                            >
                                <span className="text-[15px]">{acc.name}</span>
                                {accountId === acc.id && <Check size={16} className="text-blue-500" />}
                            </button>
                        ))}
                    </ListRow>

                    {/* Amount Input */}
                    <div className="px-4 py-3 flex items-center gap-4">
                        <span className="text-slate-500 font-medium text-[17px]">IDR</span>
                        <CalculatorInput
                            value={amount ? parseInt(amount.replace(/\./g, '')) : 0}
                            onChange={(val) => setAmount(val === 0 ? '' : val.toLocaleString('id-ID'))}
                            placeholder="0"
                            inputClassName="w-full bg-transparent text-3xl font-semibold placeholder:text-slate-600 focus:outline-none text-slate-900 dark:text-white text-left"
                            className="w-full"
                        />
                    </div>
                </div>

                {/* 3. Category / Fund Source (Renamed 'Pilih Akun Sumber' for Transfer) */}
                <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden">
                    <ListRow
                        icon={
                            fundId ? (
                                <span className="text-white text-xs font-bold">{getSelectedFundName(fundId).substring(0, 2).toUpperCase()}</span>
                            ) : (
                                <Wallet size={20} />
                            )
                        }
                        label={fundId ? getSelectedFundName(fundId) : (type === 'TRANSFER' ? 'Pilih Akun Sumber' : (type === 'INCOME' ? 'Pilih Kategori' : 'Sumber Dana'))}
                        isOpen={isCategoryOpen}
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        iconClassName={fundId ? getFundColor(fundId) : 'bg-slate-200 dark:bg-slate-700'}
                        className={!fundId ? 'text-slate-400' : ''}
                    >
                        <div className="p-2 space-y-4">
                            {FUND_CATEGORIES.map(cat => {
                                const catFunds = funds.filter(f => f.type === cat.id);
                                if (catFunds.length === 0) return null;
                                return (
                                    <div key={cat.id}>
                                        <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-widest">{cat.label}</div>
                                        {catFunds.map(fund => (
                                            <button
                                                key={fund.id}
                                                onClick={() => { setFundId(fund.id); setIsCategoryOpen(false); }}
                                                className="w-full flex items-center justify-between p-3 pl-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full bg-${cat.color}-500`} />
                                                    <span className="text-[15px]">{fund.name}</span>
                                                </div>
                                                {fundId === fund.id && <Check size={16} className="text-blue-500" />}
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </ListRow>
                </div>

                {/* 2. Target Account (Only for Transfer) */}
                {type === 'TRANSFER' && (
                    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden">
                        <ListRow
                            icon={<ArrowRightLeft size={18} />}
                            label={targetAccountId ? getSelectedAccountName(targetAccountId) : 'Pilih Akun Tujuan'}
                            isOpen={isTargetAccountOpen}
                            onClick={() => setIsTargetAccountOpen(!isTargetAccountOpen)}
                            iconClassName={targetAccountId ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : undefined}
                            className={!targetAccountId ? 'text-slate-400' : ''}
                        >
                            {accounts.filter(a => a.id !== accountId).length === 0 ? (
                                <div className="p-4 text-center text-slate-500 text-sm">Tidak ada akun lain tersedia</div>
                            ) : (
                                accounts.filter(a => a.id !== accountId).map(acc => (
                                    <button
                                        key={acc.id}
                                        onClick={() => { setTargetAccountId(acc.id); setIsTargetAccountOpen(false); }}
                                        className="w-full flex items-center justify-between p-4 pl-[60px] hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors"
                                    >
                                        <span className="text-[15px]">{acc.name}</span>
                                        {targetAccountId === acc.id && <Check size={16} className="text-blue-500" />}
                                    </button>
                                ))
                            )}
                        </ListRow>
                    </div>
                )}

                {/* 3b. Expense Purpose (Only for Expense) */}
                {type === 'EXPENSE' && (
                    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden">
                        <ListRow
                            icon={<Tags size={20} />}
                            label={expenseCategory || 'Untuk Keperluan'}
                            isOpen={isExpenseCategoryOpen}
                            onClick={() => setIsExpenseCategoryOpen(!isExpenseCategoryOpen)}
                            className={!expenseCategory ? 'text-slate-400' : ''}
                        >
                            {EXPENSE_PURPOSES.map((purpose) => (
                                <button
                                    key={purpose}
                                    onClick={() => { setExpenseCategory(purpose); setIsExpenseCategoryOpen(false); }}
                                    className="w-full flex items-center justify-between p-4 pl-[60px] hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors"
                                >
                                    <span className="text-[15px]">{purpose}</span>
                                    {expenseCategory === purpose && <Check size={16} className="text-blue-500" />}
                                </button>
                            ))}
                        </ListRow>
                    </div>
                )}

                {/* 4. Details Group */}
                <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">

                    {/* Income Category & Detail Input */}
                    {type === 'INCOME' && (
                        <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden">
                            <div className="flex items-center p-4">
                                <div className="text-slate-400 mr-3">
                                    <Tags size={20} />
                                </div>

                                {/* Dropdown Trigger */}
                                <button
                                    onClick={() => setIsIncomeCategoryOpen(!isIncomeCategoryOpen)}
                                    className="flex items-center font-medium text-slate-700 dark:text-slate-200 mr-2 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors whitespace-nowrap"
                                >
                                    <span className="mr-1">{incomeCategory.split(' ')[0]}</span>
                                    <ChevronRight size={14} className={`transition-transform ${isIncomeCategoryOpen ? 'rotate-90' : ''}`} />
                                </button>

                                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />

                                {/* Detail Input */}
                                <input
                                    type="text"
                                    value={incomeDetail}
                                    onChange={(e) => setIncomeDetail(e.target.value)}
                                    placeholder={incomeCategory.includes('Informasi') ? "Isi keterangan..." : "Nama Donatur..."}
                                    className="flex-1 bg-transparent font-medium text-[17px] focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 min-w-0"
                                />
                            </div>

                            {/* Dropdown Options */}
                            <AnimatePresence>
                                {isIncomeCategoryOpen && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="border-t border-slate-100 dark:border-slate-800"
                                    >
                                        {INCOME_CATEGORIES.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => { setIncomeCategory(cat); setIsIncomeCategoryOpen(false); }}
                                                className="w-full flex items-center justify-between p-4 pl-[60px] hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 text-left"
                                            >
                                                <span className="text-[15px]">{cat}</span>
                                                {incomeCategory === cat && <Check size={16} className="text-blue-500" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Note */}
                    <ListRow
                        icon={<AlignLeft size={20} />}
                        label={
                            isNoteOpen ? (
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tambah catatan"
                                    className="w-full bg-transparent font-medium text-[17px] focus:outline-none text-slate-900 dark:text-white"
                                    autoFocus
                                    onBlur={() => !description && setIsNoteOpen(false)}
                                />
                            ) : (
                                <span className={!description ? 'text-slate-400' : ''}>
                                    {description || 'Catatan'}
                                </span>
                            )
                        }
                        onClick={() => setIsNoteOpen(true)}
                        showChevron={!isNoteOpen && !description}
                    />

                    {/* Date */}
                    <ListRow
                        icon={<Calendar size={20} />}
                        label={format(date, 'EEEE, dd MMMM yyyy', { locale: id })}
                        isOpen={isDatePickerOpen}
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    >
                        <SingleDatePicker
                            date={date}
                            onChange={(newDate) => {
                                setDate(newDate);
                                setIsDatePickerOpen(false);
                            }}
                        />
                    </ListRow>
                </div>

                <button className="w-full py-4 rounded-[14px] bg-[#1C1C1E] dark:bg-slate-800 border border-slate-800 dark:border-slate-700 text-emerald-500 font-medium text-[17px]">
                    Tambah Detail Lainnya
                </button>
            </div>

            {/* Sticky Save Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-50/90 dark:bg-black/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleSubmit}
                        className="w-full py-3.5 rounded-full bg-slate-400/20 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold text-[17px] hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: (amount && accountId && (type !== 'TRANSFER' || targetAccountId) && (type !== 'EXPENSE' || expenseCategory)) ? '#10B981' : undefined,
                            color: (amount && accountId && (type !== 'TRANSFER' || targetAccountId) && (type !== 'EXPENSE' || expenseCategory)) ? 'white' : undefined,
                        }}
                    >
                        Simpan
                    </button>
                </div>
            </div>

        </div>
    );
}
