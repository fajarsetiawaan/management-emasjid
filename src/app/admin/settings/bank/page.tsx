'use client';

import { ArrowLeft, CreditCard, Plus, Wallet, X, QrCode, Download, Printer, Share2, Building2, Trash2, Upload, Edit3, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

import { MOCK_BANK_ACCOUNTS, MOCK_MOSQUE } from '@/lib/mock-data';
import { BankAccount } from '@/types';
import { BankItem } from '@/components/admin/settings/BankItem';
import { toast } from 'sonner';

function QrisSection({ slug }: { slug: string }) {
    const [qrisData, setQrisData] = useState<{ url: string | null; name: string }>({ url: null, name: '' });
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedQris = localStorage.getItem('sim_qris_data');
            if (savedQris) {
                setQrisData(JSON.parse(savedQris));
            } else {
                setIsEditing(true); // Default to edit mode if no data
            }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrisData(prev => ({ ...prev, url: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!qrisData.url) {
            toast.error('Mohon upload gambar QRIS terlebih dahulu.');
            return;
        }
        if (!qrisData.name.trim()) {
            toast.error('Mohon masukkan nama metode pembayaran.');
            return;
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem('sim_qris_data', JSON.stringify(qrisData));
        }
        setIsEditing(false);
        toast.success('QRIS berhasil disimpan!', { position: 'bottom-center' });
    };

    if (isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center max-w-sm mx-auto w-full"
            >
                <div className="w-full bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">Setup QRIS Masjid</h3>

                    {/* Upload Area */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-[4/3] border-2 border-dashed border-emerald-500/30 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group mb-6 relative overflow-hidden"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {qrisData.url ? (
                            <img src={qrisData.url} alt="Preview" className="w-full h-full object-contain p-4" />
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Upload size={20} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-1">Upload QRIS</p>
                                <p className="text-[10px] text-slate-400">JPG, PNG (Max 2MB)</p>
                            </>
                        )}

                        {/* Overlay when hovering with image */}
                        {qrisData.url && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <p className="text-white font-bold flex items-center gap-2 text-sm"><Edit3 size={14} /> Ganti Gambar</p>
                            </div>
                        )}
                    </div>

                    {/* Name Input */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Metode (Cth: QRIS BSI)</label>
                            <input
                                type="text"
                                value={qrisData.name}
                                onChange={(e) => setQrisData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                placeholder="Masukkan nama..."
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => {
                                    const saved = localStorage.getItem('sim_qris_data');
                                    if (saved) {
                                        setQrisData(JSON.parse(saved));
                                        setIsEditing(false);
                                    } else {
                                        if (confirm('Batalkan setup?')) {
                                            setQrisData({ url: null, name: '' });
                                        }
                                    }
                                }}
                                className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-[2] bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all text-sm"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col items-center pb-10">
            {/* Poster Preview (A6/A5 Aspect Ratio) */}
            <div className="w-full max-w-[300px] bg-white rounded-[1.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden border border-slate-100 dark:border-slate-800 relative group cursor-default select-none mb-6">
                {/* Top Branding Pattern */}
                <div className="h-3 bg-gradient-to-r from-emerald-500 to-teal-500 w-full" />

                <div className="p-8 flex flex-col items-center text-center">
                    {/* Logo */}
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                        <Building2 size={24} />
                    </div>

                    {/* Mosque Name */}
                    <h2 className="font-bold text-lg text-slate-900 leading-tight mb-1">{MOCK_MOSQUE.name}</h2>
                    <p className="text-[10px] text-slate-400 max-w-[80%] mx-auto font-medium">{MOCK_MOSQUE.address}</p>

                    {/* QR Area */}
                    <div className="my-6 p-3 bg-white border border-slate-200 rounded-2xl relative shadow-sm">
                        {qrisData.url ? (
                            <img src={qrisData.url} alt="QRIS Masjid" className="w-full h-auto object-contain max-h-[160px] rounded-lg" />
                        ) : (
                            <QRCode
                                value={`https://app.fase.id/m/${slug}`}
                                size={160}
                                level="H"
                                className="w-full h-auto rounded-lg"
                            />
                        )}
                    </div>

                    {/* Payment Method Name */}
                    {qrisData.name && (
                        <div className="mb-4 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wide border border-slate-200">
                            {qrisData.name}
                        </div>
                    )}


                    {/* Footer Call to Action */}
                    <h3 className="font-bold text-slate-800 text-sm mb-1">Scan untuk Infaq</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Laporan transparan & update kegiatan terkini.</p>
                </div>

                {/* Bottom Branding */}
                <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
                    <p className="text-[9px] text-slate-400 font-bold tracking-wide uppercase">Powered by Fase E-Masjid</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-[300px] grid grid-cols-2 gap-3 mb-3">
                <button
                    onClick={() => setIsEditing(true)}
                    className="col-span-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 transition-colors text-sm"
                >
                    <Edit3 size={16} />
                    Ubah QRIS
                </button>
            </div>

            <div className="w-full max-w-[300px] grid grid-cols-2 gap-3 mb-3">
                <button
                    onClick={() => toast.success('Link QRIS disalin!')}
                    className="col-span-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                >
                    <Share2 size={16} />
                    Share
                </button>
                <button
                    onClick={() => toast.success('QRIS didownload!')}
                    className="col-span-1 bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all"
                >
                    <Download size={16} />
                    PNG
                </button>
            </div>

            <button className="w-full max-w-[300px] text-xs font-bold text-slate-400 py-2 flex items-center justify-center gap-2 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <Printer size={14} />
                Cetak Poster (PDF)
            </button>
        </div>
    );
}

export default function BankAccountsPage() {
    // Tab State: 'BANK' | 'QRIS'
    const [activeTab, setActiveTab] = useState<'BANK' | 'QRIS'>('BANK');

    // Mock State for Accounts
    const [accounts, setAccounts] = useState<BankAccount[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedAccounts = localStorage.getItem('sim_bank_accounts');
            if (savedAccounts) {
                setAccounts(JSON.parse(savedAccounts));
            } else {
                setAccounts(MOCK_BANK_ACCOUNTS);
            }
        }
    }, []);

    // Form State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        bankName: 'Bank Syariah Indonesia (BSI)',
        accountNumber: '',
        holderName: ''
    });

    const handleDelete = (id: string, bank: string) => {
        if (confirm(`Hapus rekening ${bank}?`)) {
            const newAccounts = accounts.filter(a => a.id !== id);
            setAccounts(newAccounts);
            if (typeof window !== 'undefined') {
                localStorage.setItem('sim_bank_accounts', JSON.stringify(newAccounts));
            }
        }
    };

    const handleAddAccount = () => {
        if (!formData.bankName || !formData.accountNumber || !formData.holderName) {
            toast.error('Mohon lengkapi semua data rekening.');
            return;
        }

        let newAccounts;

        if (editingId) {
            // Edit Mode
            newAccounts = accounts.map(acc =>
                acc.id === editingId
                    ? { ...acc, bankName: formData.bankName, accountNumber: formData.accountNumber, holderName: formData.holderName }
                    : acc
            );
        } else {
            // Add Mode
            const newAccount: BankAccount = {
                id: Math.random().toString(36).substr(2, 9),
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                holderName: formData.holderName,
                color: 'bg-slate-900', // Default color, unused by BankItem
            };
            newAccounts = [...accounts, newAccount];
        }

        setAccounts(newAccounts);

        if (typeof window !== 'undefined') {
            localStorage.setItem('sim_bank_accounts', JSON.stringify(newAccounts));
        }

        setIsAddOpen(false);
        setEditingId(null);
        setFormData({
            bankName: 'Bank Syariah Indonesia (BSI)',
            accountNumber: '',
            holderName: ''
        });
        toast.success(editingId ? 'Rekening berhasil diupdate!' : 'Rekening baru ditambahkan!');
    };

    const handleEditAccount = (account: BankAccount) => {
        setEditingId(account.id);
        setFormData({
            bankName: account.bankName,
            accountNumber: account.accountNumber,
            holderName: account.holderName
        });
        setIsAddOpen(true);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative font-sans text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Glassy Header */}
            <header className="flex-none px-6 py-5 flex items-center gap-4 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 sticky top-0 shadow-sm transition-all">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-white/20 dark:border-white/5 shadow-sm transition-all group">
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">Rekening & QRIS</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">Kelola metode penerimaan dana</p>
                </div>
            </header>

            {/* Tab Switcher */}
            <div className="px-6 pt-6 pb-2 z-10">
                <div className="bg-white/40 dark:bg-slate-800/40 p-1.5 rounded-2xl flex relative border border-white/20 dark:border-white/5 backdrop-blur-md">
                    {/* Active Indicator */}
                    <motion.div
                        layoutId="activeTab"
                        className="absolute h-[calc(100%-12px)] top-1.5 bottom-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{
                            width: 'calc(50% - 6px)',
                            left: activeTab === 'BANK' ? '6px' : 'calc(50%)'
                        }}
                    />

                    <button
                        onClick={() => setActiveTab('BANK')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl relative z-10 transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === 'BANK' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                        <Wallet size={16} />
                        Rekening Bank
                    </button>
                    <button
                        onClick={() => setActiveTab('QRIS')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl relative z-10 transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === 'QRIS' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                        <QrCode size={16} />
                        QRIS Code
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 z-10 scrollbar-hide pb-24">
                <div className="max-w-md mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'BANK' ? (
                            <motion.div
                                key="bank-content"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                {/* Account List Header */}
                                {accounts.length > 0 && (
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Daftar Rekening</h3>
                                )}

                                {/* Account List */}
                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {accounts.map((acc) => (
                                            <motion.div
                                                key={acc.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                            >
                                                <BankItem account={acc} onDelete={handleDelete} onEdit={handleEditAccount} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {/* Dashed Add Button */}
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setFormData({
                                                bankName: 'Bank Syariah Indonesia (BSI)',
                                                accountNumber: '',
                                                holderName: ''
                                            });
                                            setIsAddOpen(true);
                                        }}
                                        className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-400/50 dark:hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-800/30 rounded-[1.5rem] p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all group active:scale-95"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Plus size={24} />
                                        </div>
                                        <span className="font-bold text-sm">Tambah Rekening Baru</span>
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="qris-content"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                                <QrisSection slug={MOCK_MOSQUE.slug} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Glass Modal for Adding */}
            <AnimatePresence>
                {isAddOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setIsAddOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-6 relative z-10 shadow-2xl shadow-black/20 border border-white/20 dark:border-white/10"
                        >
                            <div className="absolute top-5 right-5">
                                <button onClick={() => setIsAddOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                    <Wallet size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    {editingId ? 'Edit Rekening' : 'Rekening Baru'}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="bankName" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Nama Bank</label>
                                    <div className="relative">
                                        <select
                                            id="bankName"
                                            value={formData.bankName}
                                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                            className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        >
                                            <option>Bank Syariah Indonesia (BSI)</option>
                                            <option>Bank Mandiri</option>
                                            <option>Bank BCA</option>
                                            <option>Bank BRI</option>
                                            <option>Bank Muamalat</option>
                                            <option>Bank Jago Syariah</option>
                                            <option>Bank Raya</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Building2 size={16} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="accountNumber" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Nomor Rekening</label>
                                    <input
                                        id="accountNumber"
                                        type="number"
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        placeholder="Contoh: 7712345678"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="holderName" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Atas Nama</label>
                                    <input
                                        id="holderName"
                                        type="text"
                                        value={formData.holderName}
                                        onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        placeholder="Contoh: DKM Masjid Raya"
                                    />
                                </div>

                                <button
                                    onClick={handleAddAccount}
                                    className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={18} />
                                    <span>{editingId ? 'Simpan Perubahan' : 'Simpan Rekening'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
