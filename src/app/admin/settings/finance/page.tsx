'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Building2, HeartHandshake, Coins, ShieldCheck, Gift, CheckCircle2, Wallet, Plus, Banknote, Landmark, Save, Edit3, X, CreditCard, PieChart, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CalculatorInput } from '@/components/ui/CalculatorInput';
import { MOCK_BANK_ACCOUNTS, MOCK_PROGRAMS } from '@/lib/mock-data';
import { BankAccount } from '@/types';
import { toast } from 'sonner';

// Define Fund Structure
type FundAllocation = {
    type: 'CASH' | 'BANK';
    bankId?: string;
};

type Fund = {
    id: string;
    name: string;
    type: 'OPERASIONAL' | 'SOCIAL' | 'ZAKAT' | 'WAKAF' | 'CUSTOM';
    active: boolean;
    locked: boolean;
    icon: any; // Lucide Icon
    desc: string;
    balance?: number;
    allocation: FundAllocation;
};

export default function ManageFinancePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // Data State
    const [funds, setFunds] = useState<Fund[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [customFundName, setCustomFundName] = useState('');

    // UI State
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [showMenuId, setShowMenuId] = useState<string | null>(null);

    // Edit State
    const [editingFundId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: '', desc: '' });

    /** Build default fund list */
    const getDefaultFunds = (): Fund[] => {
        const defs: Omit<Fund, 'balance'>[] = [
            { id: 'kas_masjid', name: 'Kas Masjid (Operasional)', type: 'OPERASIONAL', active: true, locked: true, icon: Building2, desc: 'Dana operasional umum masjid.', allocation: { type: 'CASH' } },
            { id: 'kas_yatim', name: 'Kas Santunan Yatim', type: 'SOCIAL', active: false, locked: false, icon: HeartHandshake, desc: 'Dana khusus untuk anak yatim.', allocation: { type: 'CASH' } },
            { id: 'kas_zakat_fitrah', name: 'Kas Zakat Fitrah', type: 'ZAKAT', active: false, locked: false, icon: Coins, desc: 'Dana zakat fitrah Ramadhan.', allocation: { type: 'CASH' } },
            { id: 'kas_zakat_maal', name: 'Kas Zakat Maal', type: 'ZAKAT', active: false, locked: false, icon: ShieldCheck, desc: 'Dana zakat harta (2.5%).', allocation: { type: 'CASH' } },
            { id: 'kas_infaq', name: 'Kas Infaq & Sedekah', type: 'SOCIAL', active: false, locked: false, icon: Gift, desc: 'Dana infaq dan sedekah umum.', allocation: { type: 'CASH' } },
            { id: 'kas_wakaf', name: 'Kas Wakaf', type: 'WAKAF', active: false, locked: false, icon: Landmark, desc: 'Dana wakaf untuk pembangunan & aset masjid.', allocation: { type: 'CASH' } },
        ];
        return defs.map(d => {
            const mock = MOCK_PROGRAMS.find(p => p.id === d.id);
            return { ...d, balance: mock?.balance ?? 0, active: mock ? true : d.active } as Fund;
        });
    };

    // Load Data
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Load Banks
            const savedBanks = localStorage.getItem('sim_bank_accounts');
            if (savedBanks) setBankAccounts(JSON.parse(savedBanks));
            else setBankAccounts(MOCK_BANK_ACCOUNTS);

            // Load Funds Config
            const savedConfig = localStorage.getItem('sim_fund_config');
            if (savedConfig) {
                const parsed = JSON.parse(savedConfig);
                const restored = parsed.map((f: any) => ({
                    ...f,
                    icon: getIconForType(f.id, f.type)
                }));

                const defaultFunds = getDefaultFunds();
                const savedIds = new Set(restored.map((f: any) => f.id));
                const missing = defaultFunds.filter(d => !savedIds.has(d.id));
                const merged = [...restored, ...missing];

                const totalBalance = merged.reduce((s: number, f: any) => s + (f.balance || 0), 0);
                const MOCK_TOTAL = 47500000;

                if (totalBalance < MOCK_TOTAL) {
                    const enriched = merged.map((f: any) => {
                        const mockProg = MOCK_PROGRAMS.find(p => p.id === f.id);
                        if (mockProg && (f.balance === 0 || f.balance === undefined)) {
                            return { ...f, balance: mockProg.balance, active: true };
                        }
                        return f;
                    });
                    setFunds(enriched);
                } else {
                    setFunds(merged);
                }
            } else {
                setFunds(getDefaultFunds());
            }
            setIsLoading(false);
        }
    }, []);

    const getIconForType = (id: string, type: string) => {
        if (id === 'kas_masjid') return Building2;
        if (id === 'kas_yatim') return HeartHandshake;
        if (id === 'kas_zakat_fitrah') return Coins;
        if (id === 'kas_zakat_maal') return ShieldCheck;
        if (id === 'kas_infaq') return Gift;
        if (id === 'kas_wakaf') return Landmark;
        return Wallet;
    };

    const totalCash = funds.filter(f => f.active).reduce((sum, f) => sum + (f.balance || 0), 0);

    // Auto-Save Logic
    const saveChanges = (updatedFunds: Fund[]) => {
        if (typeof window !== 'undefined') {
            const activeFunds = updatedFunds.filter(f => f.active);
            const assets = [];

            // Cash
            const totalPhysicalCash = activeFunds
                .filter(f => f.allocation.type === 'CASH')
                .reduce((acc, curr) => acc + (curr.balance || 0), 0);
            assets.push({
                id: 'asset_cash',
                name: 'Kas Tunai',
                type: 'CASH',
                balance: totalPhysicalCash,
                description: 'Uang tunai di brankas',
                color: 'emerald'
            });

            // Banks
            bankAccounts.forEach(bank => {
                const totalAllocated = activeFunds
                    .filter(f => f.allocation.type === 'BANK' && f.allocation.bankId === bank.id)
                    .reduce((acc, curr) => acc + (curr.balance || 0), 0);
                assets.push({
                    id: `asset_${bank.id}`,
                    name: bank.bankName,
                    type: 'BANK',
                    balance: totalAllocated,
                    accountNumber: bank.accountNumber,
                    description: `A.n ${bank.holderName}`,
                    color: (bank as any).color?.replace('bg-', '') || 'blue-600'
                });
            });

            localStorage.setItem('sim_assets', JSON.stringify(assets));

            // Programs
            const newPrograms = activeFunds.map(f => ({
                id: f.id,
                name: f.name,
                type: f.type === 'OPERASIONAL' ? 'UNRESTRICTED' : 'RESTRICTED',
                balance: f.balance || 0,
                description: f.desc,
                color: f.type === 'OPERASIONAL' ? 'blue' : f.type === 'ZAKAT' ? 'purple' : 'amber'
            }));
            localStorage.setItem('sim_programs', JSON.stringify(newPrograms));

            // Config
            const configToSave = updatedFunds.map(({ icon, ...rest }) => rest);
            localStorage.setItem('sim_fund_config', JSON.stringify(configToSave));

            // Optional: Show toast only for deliberate actions like save/add/delete, not every keystroke
        }
    };

    // Handlers
    const toggleFund = (id: string) => {
        const updated = funds.map(f => f.locked ? f : f.id === id ? { ...f, active: !f.active } : f);
        setFunds(updated);
        saveChanges(updated);
        toast.success(updated.find(f => f.id === id)?.active ? 'Pos diaktifkan' : 'Pos dinonaktifkan', { position: 'bottom-center' });
    };

    const updateFundData = (id: string, updates: Partial<Fund>) => {
        const updated = funds.map(f => f.id === id ? { ...f, ...updates } : f);
        setFunds(updated);
        saveChanges(updated); // Save on balance update
    };

    const updateFundAllocation = (id: string, type: 'CASH' | 'BANK', bankId?: string) => {
        let newAllocation: FundAllocation = { type };
        if (type === 'BANK') newAllocation.bankId = bankId || bankAccounts[0]?.id;

        const updated = funds.map(f => f.id === id ? { ...f, allocation: newAllocation } : f);
        setFunds(updated);
        saveChanges(updated);
        toast.success('Alokasi dana diperbarui', { position: 'bottom-center' });
    };

    const handleEditDetails = (fund: Fund) => {
        setEditingId(fund.id);
        setEditForm({ name: fund.name, desc: fund.desc || '' });
        setShowMenuId(null); // Close menu
    };

    const handleDeleteFund = (id: string) => {
        if (confirm('Hapus kategori dana ini? Saldo dan riwayat akan hilang.')) {
            const updated = funds.filter(f => f.id !== id);
            setFunds(updated);
            saveChanges(updated);
            setShowMenuId(null);
            toast.success('Kategori berhasil dihapus', { position: 'bottom-center' });
        }
    };

    const handleSaveFund = () => {
        if (!editingFundId) return;
        if (editForm.name) {
            const updated = funds.map(f =>
                f.id === editingFundId
                    ? { ...f, name: editForm.name, desc: editForm.desc }
                    : f
            );
            setFunds(updated);
            saveChanges(updated);
            toast.success('Detail pos diperbarui', { position: 'bottom-center' });
        }
        setEditingId(null);
    };

    const addCustomFund = () => {
        if (!customFundName) return;
        const newFunds = [
            ...funds,
            {
                id: `custom_${Date.now()}`,
                name: customFundName,
                type: 'CUSTOM', // Explicitly cast as the union type
                active: true,
                locked: false,
                icon: Wallet,
                desc: 'Kategori dana khusus.',
                balance: 0,
                allocation: { type: 'CASH' }
            }
        ] as Fund[]; // Force cast to match Fund[] type because 'CUSTOM' is valid

        setFunds(newFunds);
        saveChanges(newFunds);
        setCustomFundName('');
        setIsAddingNew(false);
        toast.success(`Kategori "${customFundName}" ditambahkan`, { position: 'bottom-center' });
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative font-sans text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Glassy Header */}
            <header className="flex-none px-6 py-5 flex items-center justify-between z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 sticky top-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-white/20 dark:border-white/5 shadow-sm transition-all group">
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">Finance</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">Pengaturan Pos & Saldo Keuangan</p>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-24 space-y-8 relative z-10 scrollbar-hide">
                <div className="max-w-xl mx-auto space-y-8">

                    {/* Total Balance Hero Card */}
                    <div className="relative p-6 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-2xl shadow-slate-900/20 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:bg-emerald-500/30 transition-colors duration-700" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] -ml-12 -mb-12" />

                        <div className="relative z-10 flex flex-col items-center justify-center py-4">
                            <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                                <PieChart size={12} className="text-emerald-300" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Total Alokasi Dana</span>
                            </div>
                            <h2 className="text-5xl font-extrabold tracking-tight mb-2 tabular-nums">
                                <span className="text-emerald-400 text-3xl align-top mr-1">Rp</span>
                                {totalCash.toLocaleString('id-ID')}
                            </h2>
                            <p className="text-slate-300 text-sm font-medium">dari {funds.filter(f => f.active).length} pos aktif</p>
                        </div>
                    </div>

                    {/* Funds List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Wallet size={16} className="text-slate-400" />
                                Daftar Pos Keuangan
                            </h3>
                            <button
                                onClick={() => setIsAddingNew(true)}
                                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1 active:scale-95"
                            >
                                <Plus size={14} />
                                Tambah Baru
                            </button>
                        </div>

                        {funds.map((fund) => {
                            const Icon = fund.icon || Wallet;
                            const isEditing = editingFundId === fund.id;
                            const isAllocationBank = fund.allocation.type === 'BANK';

                            return (
                                <motion.div
                                    layout
                                    key={fund.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`
                                        relative group overflow-visible transition-all duration-500
                                        ${fund.active
                                            ? 'rounded-[2rem] bg-white dark:bg-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5'
                                            : 'rounded-[1.5rem] bg-white/40 dark:bg-slate-800/30 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}
                                    `}
                                >
                                    {/* Glass Highlight */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    {/* Header Section */}
                                    <div
                                        onClick={() => !fund.active && toggleFund(fund.id)}
                                        className={`p-5 flex items-center gap-5 ${!fund.active ? 'cursor-pointer' : ''}`}
                                    >
                                        <div className={`
                                            relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500
                                            ${fund.active
                                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 rotate-3'
                                                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 grayscale scale-90'}
                                        `}>
                                            <Icon size={24} strokeWidth={2} />
                                            {fund.active && <div className="absolute inset-0 bg-white/20 rounded-2xl" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`text-lg font-bold truncate transition-colors ${fund.active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                                    {fund.name}
                                                </h4>
                                                {fund.locked && (
                                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                                        Wajib
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate font-medium">{fund.desc}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center z-20">
                                            {!fund.active ? (
                                                <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:border-emerald-400 group-hover:text-emerald-400 transition-all">
                                                    <Plus size={16} />
                                                </div>
                                            ) : (
                                                !isEditing ? (
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowMenuId(showMenuId === fund.id ? null : fund.id);
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-active transition-all"
                                                        >
                                                            <MoreVertical size={18} />
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        <AnimatePresence>
                                                            {showMenuId === fund.id && (
                                                                <>
                                                                    <div
                                                                        className="fixed inset-0 z-[60]"
                                                                        onClick={() => setShowMenuId(null)}
                                                                    />
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                                                        transition={{ duration: 0.1 }}
                                                                        className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 p-1.5 z-[70] overflow-hidden origin-top-right"
                                                                    >
                                                                        <button
                                                                            onClick={() => handleEditDetails(fund)}
                                                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                                                        >
                                                                            <Edit3 size={14} className="text-slate-400" />
                                                                            Edit Detail
                                                                        </button>
                                                                        {!fund.locked && (
                                                                            <button
                                                                                onClick={() => handleDeleteFund(fund.id)}
                                                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                                Hapus
                                                                            </button>
                                                                        )}
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleSaveFund(); }}
                                                        className="w-10 h-10 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                                    >
                                                        <CheckCircle2 size={20} />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Content Helper */}
                                    <AnimatePresence>
                                        {fund.active && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                            >
                                                {isEditing ? (
                                                    /* ----- EDIT MODE : Modern Form ----- */
                                                    <div className="mx-5 mb-5 p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                                                        <div className="space-y-5">
                                                            {/* Name & Desc */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Detail Pos</label>
                                                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-2 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                                                                    <input
                                                                        value={editForm.name}
                                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                                        className="w-full px-3 py-2 text-sm font-bold bg-transparent text-slate-900 dark:text-white placeholder:text-slate-300 focus:outline-none border-b border-slate-100 dark:border-slate-700 mb-1"
                                                                        placeholder="Nama Pos"
                                                                    />
                                                                    <input
                                                                        value={editForm.desc}
                                                                        onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                                                                        className="w-full px-3 py-1 text-xs font-medium bg-transparent text-slate-500 dark:text-slate-400 placeholder:text-slate-300 focus:outline-none"
                                                                        placeholder="Deskripsi singkat..."
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Amount */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Saldo Saat Ini</label>
                                                                <CalculatorInput
                                                                    value={fund.balance || 0}
                                                                    onChange={(val) => updateFundData(fund.id, { balance: val })}
                                                                    placeholder="0"
                                                                />
                                                            </div>

                                                            {/* Storage */}
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Lokasi Penyimpanan</label>
                                                                <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                                                    <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl flex-shrink-0">
                                                                        <button
                                                                            onClick={() => updateFundAllocation(fund.id, 'CASH')}
                                                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${!isAllocationBank ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600'}`}
                                                                        >
                                                                            <Banknote size={14} /> Tunai
                                                                        </button>
                                                                        <button
                                                                            onClick={() => updateFundAllocation(fund.id, 'BANK')}
                                                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${isAllocationBank ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                                                                        >
                                                                            <Landmark size={14} /> Bank
                                                                        </button>
                                                                    </div>

                                                                    {isAllocationBank && (
                                                                        <div className="flex-1 ml-2">
                                                                            {bankAccounts.length > 0 ? (
                                                                                <div className="relative h-full">
                                                                                    <select
                                                                                        className="w-full h-full appearance-none bg-transparent pl-3 pr-8 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                                                                                        value={fund.allocation.bankId}
                                                                                        onChange={(e) => updateFundAllocation(fund.id, 'BANK', e.target.value)}
                                                                                    >
                                                                                        {bankAccounts.map(b => (
                                                                                            <option key={b.id} value={b.id}>{b.bankName} - {b.accountNumber}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                    <CreditCard size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                                                </div>
                                                                            ) : (
                                                                                <div className="h-full flex items-center px-3 text-[10px] text-red-500 font-bold bg-red-50 rounded-lg">
                                                                                    Belum ada rekening
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* ----- VIEW MODE : Modern Card ----- */
                                                    <div className="px-5 pb-5 mt-[-5px]">
                                                        <div
                                                            onClick={() => handleEditDetails(fund)}
                                                            className="relative overflow-hidden p-0.5 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800"
                                                        >
                                                            <div className="relative bg-white dark:bg-slate-800 rounded-[14px] p-4 flex justify-between items-center group/card cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                        Saldo Saat Ini
                                                                    </p>
                                                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight font-mono">
                                                                        Rp {(fund.balance || 0).toLocaleString('id-ID')}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Disimpan Di</p>
                                                                    <div className="flex items-center justify-end gap-2 text-xs font-bold bg-slate-100 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                                        {isAllocationBank ? <Landmark size={14} className="text-blue-500" /> : <Banknote size={14} className="text-emerald-500" />}
                                                                        {isAllocationBank
                                                                            ? (bankAccounts.find(b => b.id === fund.allocation.bankId)?.bankName || 'Bank')
                                                                            : 'Tunai'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}

                        {/* Add Custom Fund - Toggleable Section */}
                        <AnimatePresence>
                            {isAddingNew && (
                                <>
                                    <div
                                        className="fixed inset-0 z-[60] bg-black/20 dark:bg-black/50 backdrop-blur-sm"
                                        onClick={() => setIsAddingNew(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="fixed inset-0 z-[61] flex items-center justify-center p-4"
                                    >
                                        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 p-6 relative overflow-hidden">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Buat Kategori Baru</h3>
                                                <button
                                                    onClick={() => setIsAddingNew(false)}
                                                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            {/* Input Area */}
                                            <div className="space-y-4">
                                                <div className="p-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 transition-colors group focus-within:border-emerald-500/50 dark:focus-within:border-emerald-500/50 focus-within:bg-emerald-50/10 dark:focus-within:bg-emerald-500/5">
                                                    <div className="flex items-center gap-3 p-1">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                                            <Plus size={20} />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Nama Kategori..."
                                                            className="flex-1 bg-transparent text-sm font-bold outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                                                            value={customFundName}
                                                            onChange={(e) => setCustomFundName(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && addCustomFund()}
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={addCustomFund}
                                                    disabled={!customFundName}
                                                    className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white text-sm font-bold disabled:opacity-50 hover:bg-slate-800 dark:hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-slate-900/20 dark:shadow-emerald-500/20"
                                                >
                                                    Tambahkan Sekarang
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
