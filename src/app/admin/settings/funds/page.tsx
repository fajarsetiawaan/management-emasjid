'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Building2, HeartHandshake, Coins, ShieldCheck, Gift, CheckCircle2, Wallet, Plus, Banknote, Landmark, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CalculatorInput } from '@/components/ui/CalculatorInput';
import { MOCK_BANK_ACCOUNTS } from '@/lib/mock-data';
import { BankAccount } from '@/types';

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
    balance: number;
    allocation: FundAllocation;
};

// Map string icon names back to Lucide components if needed (for custom funds loaded from JSON)
// Though here we'll keep it simple and assume standard icons for defaults, and Wallet for custom.

export default function ManageFundsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Data State
    const [funds, setFunds] = useState<Fund[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [customFundName, setCustomFundName] = useState('');

    // Load Data
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Load Banks
            const savedBanks = localStorage.getItem('sim_bank_accounts');
            if (savedBanks) {
                setBankAccounts(JSON.parse(savedBanks));
            } else {
                setBankAccounts(MOCK_BANK_ACCOUNTS);
            }

            // Load Funds Config
            const savedConfig = localStorage.getItem('sim_fund_config');
            if (savedConfig) {
                // We need to restore icons because JSON doesn't store functions
                const parsed = JSON.parse(savedConfig);
                const restored = parsed.map((f: any) => ({
                    ...f,
                    icon: getIconForType(f.id, f.type)
                }));

                // Merge in any new default funds not present in saved config
                const defaultFunds = [
                    { id: 'kas_masjid', name: 'Kas Masjid (Operasional)', type: 'OPERASIONAL' as const, active: true, locked: true, icon: Building2, desc: 'Dana operasional umum masjid.', balance: 0, allocation: { type: 'CASH' } },
                    { id: 'kas_yatim', name: 'Kas Santunan Yatim', type: 'SOCIAL' as const, active: false, locked: false, icon: HeartHandshake, desc: 'Dana khusus untuk anak yatim.', balance: 0, allocation: { type: 'CASH' } },
                    { id: 'kas_zakat_fitrah', name: 'Kas Zakat Fitrah', type: 'ZAKAT' as const, active: false, locked: false, icon: Coins, desc: 'Dana zakat fitrah Ramadhan.', balance: 0, allocation: { type: 'CASH' } },
                    { id: 'kas_zakat_maal', name: 'Kas Zakat Maal', type: 'ZAKAT' as const, active: false, locked: false, icon: ShieldCheck, desc: 'Dana zakat harta (2.5%).', balance: 0, allocation: { type: 'CASH' } },
                    { id: 'kas_infaq', name: 'Kas Infaq & Sedekah', type: 'SOCIAL' as const, active: false, locked: false, icon: Gift, desc: 'Dana infaq dan sedekah umum.', balance: 0, allocation: { type: 'CASH' } },
                    { id: 'kas_wakaf', name: 'Kas Wakaf', type: 'WAKAF' as const, active: false, locked: false, icon: Landmark, desc: 'Dana wakaf untuk pembangunan & aset masjid.', balance: 0, allocation: { type: 'CASH' } },
                ];
                const savedIds = new Set(restored.map((f: any) => f.id));
                const missing = defaultFunds.filter(d => !savedIds.has(d.id));
                setFunds([...restored, ...missing]);
            } else {
                // Default Initial State (Same as Onboarding)
                setFunds([
                    { id: 'kas_masjid', name: 'Kas Masjid (Operasional)', type: 'OPERASIONAL', active: true, locked: true, icon: Building2, desc: 'Dana operasional umum masjid.', balance: 0, allocation: { type: 'CASH' } },
                    { id: 'kas_yatim', name: 'Kas Santunan Yatim', type: 'SOCIAL', active: false, locked: false, icon: HeartHandshake, desc: 'Dana khusus untuk anak yatim.', balance: 0, allocation: { type: 'CASH' } },
                    { id: 'kas_zakat_fitrah', name: 'Kas Zakat Fitrah', type: 'ZAKAT', active: false, locked: false, icon: Coins, desc: 'Dana zakat fitrah Ramadhan.', balance: 0, allocation: { type: 'CASH' } },
                    { id: 'kas_zakat_maal', name: 'Kas Zakat Maal', type: 'ZAKAT', active: false, locked: false, icon: ShieldCheck, desc: 'Dana zakat harta (2.5%).', balance: 0, allocation: { type: 'CASH' } },
                    { id: 'kas_infaq', name: 'Kas Infaq & Sedekah', type: 'SOCIAL', active: false, locked: false, icon: Gift, desc: 'Dana infaq dan sedekah umum.', balance: 0, allocation: { type: 'CASH' } },
                    { id: 'kas_wakaf', name: 'Kas Wakaf', type: 'WAKAF', active: false, locked: false, icon: Landmark, desc: 'Dana wakaf untuk pembangunan & aset masjid.', balance: 0, allocation: { type: 'CASH' } },
                ]);
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

    // Derived State: Total Cash
    const totalCash = funds
        .filter(f => f.active)
        .reduce((sum, f) => sum + (f.balance || 0), 0);

    // Handlers
    const toggleFund = (id: string) => {
        setFunds(funds.map(f => f.locked ? f : f.id === id ? { ...f, active: !f.active } : f));
    };

    const updateFundData = (id: string, updates: Partial<Fund>) => {
        setFunds(funds.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const updateFundAllocation = (id: string, type: 'CASH' | 'BANK', bankId?: string) => {
        let newAllocation: FundAllocation = { type };
        if (type === 'BANK') {
            newAllocation.bankId = bankId || bankAccounts[0]?.id;
        }
        setFunds(funds.map(f => f.id === id ? { ...f, allocation: newAllocation } : f));
    };

    const addCustomFund = () => {
        if (!customFundName) return;
        setFunds([
            ...funds,
            {
                id: `custom_${Date.now()}`,
                name: customFundName,
                type: 'CUSTOM',
                active: true,
                locked: false,
                icon: Wallet,
                desc: 'Kategori dana khusus.',
                balance: 0,
                allocation: { type: 'CASH' }
            }
        ]);
        setCustomFundName('');
    };

    const handleSave = () => {
        setIsSaving(true);
        if (typeof window !== 'undefined') {
            const activeFunds = funds.filter(f => f.active);

            // 1. Re-Process Assets (Sync with Onboarding Logic)
            const assets = [];

            // Cash Asset
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

            // Bank Assets
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
                    color: (bank as any).color?.replace('bg-', '') || 'blue-600' // Fallback color
                });
            });

            localStorage.setItem('sim_assets', JSON.stringify(assets));

            // 2. Re-Process Programs
            const newPrograms = activeFunds.map(f => ({
                id: f.id,
                name: f.name,
                type: f.type === 'OPERASIONAL' ? 'UNRESTRICTED' : 'RESTRICTED',
                balance: f.balance || 0,
                description: f.desc,
                color: f.type === 'OPERASIONAL' ? 'blue' : f.type === 'ZAKAT' ? 'purple' : 'amber'
            }));

            localStorage.setItem('sim_programs', JSON.stringify(newPrograms));

            // 3. Save Logic Config itself
            // We need to strip icons before saving to JSON to avoid circular refs if any (Lucide icons are functions)
            // But we reconstruct them on load anyway.
            const configToSave = funds.map(({ icon, ...rest }) => rest);
            localStorage.setItem('sim_fund_config', JSON.stringify(configToSave));

            setTimeout(() => {
                setIsSaving(false);
                alert('Perubahan berhasil disimpan!');
            }, 800);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-slate-500">Memuat data...</div>;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
            {/* Fixed Header */}
            <header className="flex-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 h-16 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 z-50">
                <div className="flex items-center gap-3">
                    <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Manajemen Keuangan</h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isSaving ? <span className="animate-spin">⏳</span> : <Save size={18} />}
                    Simpan
                </button>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-5 space-y-6 pb-8">
                    {/* Total Cash Summary Card */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/20">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="relative z-10">
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Estimasi Total Kas</p>
                            <div className="text-4xl font-bold tracking-tight font-mono">
                                Rp {totalCash.toLocaleString('id-ID')}
                            </div>
                            <p className="text-slate-500 text-xs mt-2">
                                Total dari {funds.filter(f => f.active).length} pos keuangan aktif.
                            </p>
                        </div>
                    </div>

                    {/* Funds List */}
                    <div className="space-y-4">
                        {funds.map((fund) => {
                            const isAllocationBank = fund.allocation.type === 'BANK';
                            const Icon = fund.icon || Wallet;

                            return (
                                <motion.div
                                    layout
                                    key={fund.id}
                                    className={`
                                    relative rounded-3xl border transition-all overflow-visible group
                                    ${fund.active
                                            ? 'bg-white dark:bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg shadow-emerald-500/5'
                                            : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                        }
                                `}
                                >
                                    {/* Card Header (Toggle) */}
                                    <div
                                        onClick={() => toggleFund(fund.id)}
                                        className="p-5 flex items-center gap-4 cursor-pointer"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${fund.active ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 text-emerald-600 dark:text-emerald-400 shadow-inner' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 grayscale'}`}>
                                            <Icon size={22} strokeWidth={2} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className={`text-base font-bold truncate ${fund.active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                                    {fund.name}
                                                </h4>
                                                {fund.locked && <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-600">Wajib</span>}
                                            </div>
                                            <p className="text-xs text-slate-400 truncate">{fund.desc}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${fund.active ? 'border-emerald-500 bg-emerald-500 scale-110' : 'border-slate-300 dark:border-slate-600 group-hover:border-emerald-300'}`}>
                                            {fund.active && <CheckCircle2 size={14} className="text-white" strokeWidth={3} />}
                                        </div>
                                    </div>

                                    {/* Expanded Content (Inputs) */}
                                    <AnimatePresence>
                                        {fund.active && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="bg-slate-50/50 dark:bg-slate-900/30 border-t border-dashed border-emerald-100/50 dark:border-slate-700 overflow-hidden"
                                            >
                                                <div className="p-5 pt-3 grid grid-cols-1 gap-4">
                                                    {/* Row 1: Amount */}
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Saldo Saat Ini</label>
                                                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                            <CalculatorInput
                                                                value={fund.balance || 0}
                                                                onChange={(val) => updateFundData(fund.id, { balance: val })}
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Row 2: Location Switcher + Bank Select */}
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Disimpan Di</label>

                                                        <div className="flex gap-2">
                                                            <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl flex-shrink-0">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); updateFundAllocation(fund.id, 'CASH'); }}
                                                                    className={`w-20 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-all ${!isAllocationBank ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700'}`}
                                                                >
                                                                    <Banknote size={14} /> Tunai
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); updateFundAllocation(fund.id, 'BANK'); }}
                                                                    className={`w-20 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-all ${isAllocationBank ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
                                                                >
                                                                    <Landmark size={14} /> Bank
                                                                </button>
                                                            </div>

                                                            {/* If Bank Selected, show Dropdown of Available Banks */}
                                                            {isAllocationBank && (
                                                                <div className="flex-1">
                                                                    {bankAccounts.length > 0 ? (
                                                                        <select
                                                                            className="w-full h-full min-h-[40px] px-3 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500"
                                                                            value={fund.allocation.bankId}
                                                                            onChange={(e) => updateFundAllocation(fund.id, 'BANK', e.target.value)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            {bankAccounts.map(b => (
                                                                                <option key={b.id} value={b.id}>{b.bankName} - {b.accountNumber}</option>
                                                                            ))}
                                                                        </select>
                                                                    ) : (
                                                                        <div className="h-full flex items-center px-3 text-[10px] text-red-500 bg-red-50 rounded-xl border border-red-100">
                                                                            Belum ada rekening!
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}

                        {/* Add Custom Fund */}
                        <div className="p-1 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors mt-6 group">
                            <div className="flex items-center gap-2 p-2">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                    <Plus size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buat nama pos keuangan baru..."
                                    className="flex-1 bg-transparent text-sm outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-bold"
                                    value={customFundName}
                                    onChange={(e) => setCustomFundName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addCustomFund()}
                                />
                                <button
                                    onClick={addCustomFund}
                                    disabled={!customFundName}
                                    className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold disabled:opacity-20 hover:bg-emerald-600 transition-colors"
                                >
                                    Tambah
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
