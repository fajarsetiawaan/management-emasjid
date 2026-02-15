'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    Building2,
    CheckCircle2,
    ChevronRight,
    HeartHandshake,
    Coins,
    ShieldCheck,
    Gift,
    Plus,
    Landmark,
    Banknote,
    LayoutGrid,
    ArrowLeft,
    QrCode,
    Trash2,
    Upload,
    CreditCard,
    Image as ImageIcon,

    X
} from 'lucide-react';
import { MOCK_MOSQUE } from '@/lib/mock-data';
import { CalculatorInput } from '@/components/ui/CalculatorInput';

// Helper for Bank Options
const BANK_OPTIONS = [
    { id: 'bsi', name: 'Bank Syariah Indonesia (BSI)', color: 'bg-emerald-500' },
    { id: 'bri', name: 'Bank Rakyat Indonesia (BRI)', color: 'bg-blue-600' },
    { id: 'mandiri', name: 'Bank Mandiri', color: 'bg-indigo-600' },
    { id: 'bca', name: 'Bank BCA', color: 'bg-blue-700' },
    { id: 'muamalat', name: 'Bank Muamalat', color: 'bg-purple-600' },
    { id: 'other', name: 'Bank Lainnya', color: 'bg-slate-500' },
];

type BankAccount = {
    id: string;
    bankName: string;
    accountNumber: string;
    holderName: string;
    // initialBalance removed, calculated from funds
};

type FundAllocation = {
    type: 'CASH' | 'BANK';
    bankId?: string; // If type is BANK
};

export default function OnboardingSetupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // ─── Step 1 State ────────────────────────────────────────────────

    // Bank Accounts List
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

    // Form State for Adding New Bank
    const [isAddingBank, setIsAddingBank] = useState(true); // Start with form open if empty
    const [currentBank, setCurrentBank] = useState<Omit<BankAccount, 'id' | 'initialBalance'>>({
        bankName: '',
        accountNumber: '',
        holderName: MOCK_MOSQUE.name,
    });

    // QRIS State
    const [qrisImage, setQrisImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ─── Step 2 State ────────────────────────────────────────────────

    const [funds, setFunds] = useState([
        { id: 'kas_masjid', name: 'Kas Masjid (Operasional)', type: 'OPERASIONAL', active: true, locked: true, icon: Building2, desc: 'Dana operasional umum masjid.', balance: 0, allocation: { type: 'CASH' } as FundAllocation },
        { id: 'kas_yatim', name: 'Kas Santunan Yatim', type: 'SOCIAL', active: false, locked: false, icon: HeartHandshake, desc: 'Dana khusus untuk anak yatim.', balance: 0, allocation: { type: 'CASH' } as FundAllocation },
        { id: 'kas_zakat_fitrah', name: 'Kas Zakat Fitrah', type: 'ZAKAT', active: false, locked: false, icon: Coins, desc: 'Dana zakat fitrah Ramadhan.', balance: 0, allocation: { type: 'CASH' } as FundAllocation },
        { id: 'kas_zakat_maal', name: 'Kas Zakat Maal', type: 'ZAKAT', active: false, locked: false, icon: ShieldCheck, desc: 'Dana zakat harta (2.5%).', balance: 0, allocation: { type: 'CASH' } as FundAllocation },
        { id: 'kas_infaq', name: 'Kas Infaq & Sedekah', type: 'SOCIAL', active: false, locked: false, icon: Gift, desc: 'Dana infaq dan sedekah umum.', balance: 0, allocation: { type: 'CASH' } as FundAllocation },
        { id: 'kas_wakaf', name: 'Kas Wakaf', type: 'WAKAF', active: false, locked: false, icon: Landmark, desc: 'Dana wakaf untuk pembangunan & aset masjid.', balance: 0, allocation: { type: 'CASH' } as FundAllocation },
    ]);
    const [customFund, setCustomFund] = useState('');

    // ─── Handlers: Step 1 ────────────────────────────────────────────

    const handleAddBank = () => {
        if (!currentBank.bankName || !currentBank.accountNumber || !currentBank.holderName) return;

        const newBank: BankAccount = {
            id: `bank_${Date.now()}`,
            ...currentBank
        };

        setBankAccounts([...bankAccounts, newBank]);
        // Reset form but keep holder name for convenience
        setCurrentBank({ bankName: '', accountNumber: '', holderName: currentBank.holderName });
        setIsAddingBank(false);
    };

    const handleRemoveBank = (id: string) => {
        setBankAccounts(bankAccounts.filter(b => b.id !== id));
    };

    const handleQrisUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrisImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // ─── Handlers: Step 2 ────────────────────────────────────────────

    const toggleFund = (id: string) => {
        setFunds(funds.map(f => f.locked ? f : f.id === id ? { ...f, active: !f.active } : f));
    };

    const updateFundData = (id: string, updates: Partial<typeof funds[0]>) => {
        setFunds(funds.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const updateFundAllocation = (id: string, type: 'CASH' | 'BANK', bankId?: string) => {
        // If switching to BANK but no bank accounts exist, force CASH or alert? 
        // For now user should have added banks in step 1.

        let newAllocation: FundAllocation = { type };
        if (type === 'BANK') {
            // Default to first bank if available, or specific one
            newAllocation.bankId = bankId || bankAccounts[0]?.id;
        }

        setFunds(funds.map(f => f.id === id ? { ...f, allocation: newAllocation } : f));
    };

    const addCustomFund = () => {
        if (!customFund) return;
        setFunds([
            ...funds,
            {
                id: `custom_${Date.now()}`,
                name: customFund,
                type: 'CUSTOM',
                active: true,
                locked: false,
                icon: Wallet,
                desc: 'Kategori dana khusus.',
                balance: 0,
                allocation: { type: 'CASH' }
            }
        ]);
        setCustomFund('');
    };

    // ─── Navigation ──────────────────────────────────────────────────

    const handleNext = async () => {
        if (step === 1) {
            // Allow proceeding even if empty (Cash Only mode), but confirm
            if (bankAccounts.length === 0 && !qrisImage) {
                const confirmed = window.confirm("Belum ada rekening atau QRIS. Lanjutkan setup hanya dengan Kas Tunai?");
                if (!confirmed) return;
            }
            setIsAddingBank(false); // Close form if open
            setStep(2);
        } else {
            // Validation: Kas Masjid (Operasional) must have balance > 0
            const kasMasjid = funds.find(f => f.id === 'kas_masjid');
            if (!kasMasjid || (kasMasjid.balance || 0) <= 0) {
                alert('⚠️ Nominal Kas Masjid (Operasional) wajib diisi sebelum menyelesaikan setup.');
                return;
            }

            // Finish
            setIsLoading(true);

            if (typeof window !== 'undefined') {
                const activeFunds = funds.filter(f => f.active);

                // 1. Create Physical Asset Accounts
                const assets = [];

                // Cash Asset (Sum of all funds allocated to CASH)
                const totalCash = activeFunds
                    .filter(f => f.allocation.type === 'CASH')
                    .reduce((acc, curr) => acc + (curr.balance || 0), 0);

                assets.push({
                    id: 'asset_cash',
                    name: 'Kas Tunai',
                    type: 'CASH',
                    balance: totalCash,
                    description: 'Uang tunai di brankas',
                    color: 'emerald'
                });

                // Bank Assets
                bankAccounts.forEach(bank => {
                    // Check if sum of funds matches declared balance
                    const totalAllocated = activeFunds
                        .filter(f => f.allocation.type === 'BANK' && f.allocation.bankId === bank.id)
                        .reduce((acc, curr) => acc + (curr.balance || 0), 0);

                    // Balance is purely sum of allocations
                    const finalBalance = totalAllocated;

                    assets.push({
                        id: `asset_${bank.id}`, // asset_bank_123
                        name: bank.bankName,
                        type: 'BANK',
                        balance: finalBalance,
                        accountNumber: bank.accountNumber,
                        description: `A.n ${bank.holderName}`,
                        color: BANK_OPTIONS.find(opt => opt.name === bank.bankName)?.color?.replace('bg-', '') || 'blue-600'
                    });
                });

                // Save Assets
                localStorage.setItem('sim_assets', JSON.stringify(assets));

                // Save QSIS (Legacy & Modern)
                if (qrisImage) {
                    localStorage.setItem('sim_qris', qrisImage);
                    localStorage.setItem('sim_qris_data', JSON.stringify({
                        url: qrisImage,
                        name: 'QRIS MASJID'
                    }));
                }

                // Save Legacy Bank Format (for other components compatibility)
                const legacyBanks = bankAccounts.map(b => ({
                    id: b.id,
                    bankName: b.bankName,
                    accountNumber: b.accountNumber,
                    holderName: b.holderName,
                    color: BANK_OPTIONS.find(opt => opt.name === b.bankName)?.color || 'bg-slate-500'
                }));
                localStorage.setItem('sim_bank_accounts', JSON.stringify(legacyBanks));

                // 2. Create Logical Programs (Funds)
                const newPrograms = activeFunds.map(f => ({
                    id: f.id,
                    name: f.name,
                    type: f.type === 'OPERASIONAL' ? 'UNRESTRICTED' : 'RESTRICTED',
                    balance: f.balance || 0,
                    description: f.desc,
                    color: f.type === 'OPERASIONAL' ? 'blue' : f.type === 'ZAKAT' ? 'purple' : 'amber'
                }));



                localStorage.setItem('sim_programs', JSON.stringify(newPrograms));

                // Save Fund Config for Re-editing in Settings (Save ALL funds)
                localStorage.setItem('sim_fund_config', JSON.stringify(funds));

                // Mark Setup as Done
                localStorage.setItem('setup_completed', 'true');
            }

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                layout
                className="w-full max-w-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
                {/* Header with Steps */}
                <div className="bg-white/50 dark:bg-slate-800/50 pt-8 pb-6 px-6 border-b border-white/10 relative z-20 flex-shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        {step > 1 ? (
                            <button onClick={() => setStep(step - 1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        ) : (
                            <div className="w-9" />
                        )}
                        <h1 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Setup Masjid</h1>
                        <div className="w-9" />
                    </div>

                    {/* Visual Stepper */}
                    <div className="flex items-center gap-2">
                        <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'bg-emerald-500' : 'bg-emerald-200 dark:bg-emerald-900/40'}`} />
                        <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto customize-scrollbar relative scroll-smooth">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-6 pb-32 space-y-8"
                            >
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-emerald-500 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800/50 rotate-3">
                                        <Wallet size={40} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">Rekening & QRIS</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 px-4 leading-relaxed">
                                        Tambahkan rekening bank masjid dan kode QRIS untuk memudahkan donasi digital.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {/* List Added Accounts */}
                                    {bankAccounts.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Rekening Tersimpan</h3>
                                            {bankAccounts.map((acc, idx) => (
                                                <div key={acc.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative group flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{acc.bankName}</div>
                                                        </div>
                                                        <div className="text-lg font-mono font-bold text-slate-600 dark:text-slate-400">{acc.accountNumber}</div>
                                                        <div className="text-xs text-slate-400 mt-1">{acc.holderName}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveBank(acc.id)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Bank Form */}
                                    {isAddingBank ? (
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                                            {bankAccounts.length > 0 && (
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Tambah Rekening Baru</h3>
                                                    <button onClick={() => setIsAddingBank(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Bank</label>
                                                    <select
                                                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-sm font-bold text-slate-800 dark:text-slate-200 focus:border-emerald-500 transition-colors"
                                                        value={currentBank.bankName}
                                                        onChange={(e) => setCurrentBank({ ...currentBank, bankName: e.target.value })}
                                                    >
                                                        <option value="" disabled>Pilih Bank</option>
                                                        {BANK_OPTIONS.map(opt => (
                                                            <option key={opt.id} value={opt.name}>{opt.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nomor Rekening</label>
                                                    <input
                                                        type="number"
                                                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-sm font-bold font-mono text-slate-800 dark:text-slate-200 focus:border-emerald-500 transition-colors"
                                                        placeholder="0000 0000 0000"
                                                        value={currentBank.accountNumber}
                                                        onChange={(e) => setCurrentBank({ ...currentBank, accountNumber: e.target.value })}
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Atas Nama</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-sm font-bold text-slate-800 dark:text-slate-200 focus:border-emerald-500 transition-colors"
                                                        placeholder="Nama Masjid"
                                                        value={currentBank.holderName}
                                                        onChange={(e) => setCurrentBank({ ...currentBank, holderName: e.target.value })}
                                                    />
                                                </div>



                                                <button
                                                    onClick={handleAddBank}
                                                    disabled={!currentBank.bankName || !currentBank.accountNumber || !currentBank.holderName}
                                                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Simpan Rekening
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsAddingBank(true)}
                                            className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all font-bold text-sm"
                                        >
                                            <Plus size={18} /> Tambah Rekening Lain
                                        </button>
                                    )}

                                    {/* QRIS Upload */}
                                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <h3 className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider flex items-center gap-2">
                                            <QrCode size={14} /> Upload QRIS (Opsional)
                                        </h3>

                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative w-full aspect-[2/1] bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/10 transition-all overflow-hidden group"
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleQrisUpload}
                                            />

                                            {qrisImage ? (
                                                <>
                                                    <img src={qrisImage} alt="QRIS Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white font-bold text-sm flex items-center gap-2"><ImageIcon size={16} /> Ganti QRIS</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center p-4">
                                                    <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 shadow-sm">
                                                        <Upload size={20} />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-500">Klik untuk upload gambar QRIS</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG (Max 2MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-6 pb-32 space-y-6"
                            >
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-500 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50 rotate-3">
                                        <LayoutGrid size={40} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Kelola Dompet</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 px-4 leading-relaxed">
                                        Aktifkan dompet dan tentukan alokasi saldo awalnya.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {funds.map((fund) => {
                                        const isAllocationBank = fund.allocation.type === 'BANK';

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
                                                        <fund.icon size={22} strokeWidth={2} />
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
                                                            className="bg-slate-50/50 dark:bg-slate-900/30 border-t border-dashed border-emerald-100/50 dark:border-slate-700"
                                                        >
                                                            <div className="p-5 pt-3 grid grid-cols-1 gap-4">
                                                                {/* Row 1: Amount */}
                                                                <div>
                                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-wider">Saldo Awal</label>
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
                                                placeholder="Buat nama dompet baru..."
                                                className="flex-1 bg-transparent text-sm outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-bold"
                                                value={customFund}
                                                onChange={(e) => setCustomFund(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addCustomFund()}
                                            />
                                            <button
                                                onClick={addCustomFund}
                                                disabled={!customFund}
                                                className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold disabled:opacity-20 hover:bg-emerald-600 transition-colors"
                                            >
                                                Tambah
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sticky Footer */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-white/5 z-30">
                    <button
                        onClick={handleNext}
                        disabled={(step === 1 && bankAccounts.length === 0 && !qrisImage) || isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 text-lg"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Menyiapkan Dashboard...</span>
                        ) : (
                            <>
                                {step === 2 ? 'Selesai & Masuk' : 'Lanjut'} <ChevronRight size={20} className="opacity-80" strokeWidth={3} />
                            </>
                        )}
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
