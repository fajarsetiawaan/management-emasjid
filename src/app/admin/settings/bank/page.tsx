'use client';

import { ArrowLeft, CreditCard, Plus, Trash2, Edit2, Wallet, X, QrCode, Download, Printer, Share2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

import { MOCK_BANK_ACCOUNTS, MOCK_MOSQUE } from '@/lib/mock-data';
import { BankAccount } from '@/types';

const CARD_GRADIENTS = [
    'bg-gradient-to-br from-blue-500 to-cyan-600',
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-indigo-500 to-purple-600',
    'bg-gradient-to-br from-rose-500 to-orange-600',
    'bg-gradient-to-br from-slate-700 to-slate-800',
];

function QrisSection({ slug }: { slug: string }) {
    const [qrisUrl, setQrisUrl] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedQris = localStorage.getItem('sim_qris_url');
            if (savedQris) setQrisUrl(savedQris);
        }
    }, []);

    return (
        <div className="flex flex-col items-center">
            {/* Poster Preview (A6/A5 Aspect Ratio) */}
            <div className="w-full max-w-[320px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative group cursor-default select-none mb-6">
                {/* Top Branding Pattern */}
                <div className="h-4 bg-emerald-600 w-full" />

                <div className="p-8 flex flex-col items-center text-center">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                        <Building2 size={32} />
                    </div>

                    {/* Mosque Name */}
                    <h2 className="font-bold text-xl text-slate-900 leading-tight mb-1">{MOCK_MOSQUE.name}</h2>
                    <p className="text-xs text-slate-500 max-w-[80%] mx-auto">{MOCK_MOSQUE.address}</p>

                    {/* QR Area */}
                    <div className="my-8 p-4 bg-white border-2 border-slate-900 rounded-xl relative">
                        {/* Corner Accents */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-600" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-600" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-600" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-600" />

                        {qrisUrl ? (
                            <img src={qrisUrl} alt="QRIS Masjid" className="w-full h-auto object-contain" />
                        ) : (
                            <QRCode
                                value={`https://app.fase.id/m/${slug}`}
                                size={180}
                                level="H"
                                className="w-full h-auto"
                            />
                        )}
                    </div>

                    {/* Footer Call to Action */}
                    <h3 className="font-bold text-slate-800 mb-1">Scan untuk Infaq</h3>
                    <p className="text-xs text-slate-500">Laporan transparan & update kegiatan terkini.</p>
                </div>

                {/* Bottom Branding */}
                <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">Powered by Fase E-Masjid</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-[320px] grid grid-cols-2 gap-3 mb-3">
                <button className="col-span-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Share2 size={18} />
                    Share
                </button>
                <button className="col-span-1 bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm shadow-emerald-200 dark:shadow-emerald-900/20 shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all">
                    <Download size={18} />
                    PNG
                </button>
            </div>
            <button className="w-full max-w-[320px] text-xs font-bold text-slate-400 py-2 flex items-center justify-center gap-2 hover:text-slate-600 dark:hover:text-slate-300">
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
            alert('Mohon lengkapi semua data rekening.');
            return;
        }

        const randomColor = CARD_GRADIENTS[Math.floor(Math.random() * CARD_GRADIENTS.length)];

        const newAccount: BankAccount = {
            id: Math.random().toString(36).substr(2, 9),
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            holderName: formData.holderName,
            color: randomColor,
        };

        const newAccounts = [...accounts, newAccount];
        setAccounts(newAccounts);

        if (typeof window !== 'undefined') {
            localStorage.setItem('sim_bank_accounts', JSON.stringify(newAccounts));
        }

        setIsAddOpen(false);
        setFormData({
            bankName: 'Bank Syariah Indonesia (BSI)',
            accountNumber: '',
            holderName: ''
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 relative">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 h-16 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Rekening & QRIS</h1>
            </header>

            {/* Tab Switcher */}
            <div className="px-5 pt-6 pb-2">
                <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex relative">
                    {/* Active Indicator */}
                    <motion.div
                        layoutId="activeTab"
                        className="absolute h-[calc(100%-8px)] top-1 bottom-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{
                            width: 'calc(50% - 4px)',
                            left: activeTab === 'BANK' ? '4px' : 'calc(50%)'
                        }}
                    />

                    <button
                        onClick={() => setActiveTab('BANK')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg relative z-10 transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === 'BANK' ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'}`}
                    >
                        <Wallet size={16} />
                        Rekening
                    </button>
                    <button
                        onClick={() => setActiveTab('QRIS')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg relative z-10 transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === 'QRIS' ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'}`}
                    >
                        <QrCode size={16} />
                        QRIS
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5">
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
                                            className={`w-full aspect-[1.586/1] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group ${acc.color}`}
                                        >
                                            {/* Decorative Circles */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                                            <div className="relative z-10 flex flex-col justify-between h-full">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-bold text-lg tracking-wider opacity-90">{acc.bankName}</div>
                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(acc.id, acc.bankName)}
                                                            className="w-8 h-8 rounded-full bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md flex items-center justify-center transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="font-mono text-2xl tracking-widest font-medium drop-shadow-md mb-2">
                                                        {acc.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <div className="text-[10px] uppercase opacity-70 font-medium tracking-wider">Account Holder</div>
                                                            <div className="font-bold text-sm tracking-wide truncate max-w-[200px]">{acc.holderName}</div>
                                                        </div>
                                                        <Wallet size={24} className="opacity-50" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {accounts.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-12 px-6"
                                    >
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                                            <CreditCard size={32} />
                                        </div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Belum ada rekening</h3>
                                        <p className="text-sm text-slate-400 dark:text-slate-500">Tambahkan rekening bank untuk menerima donasi transfer.</p>
                                    </motion.div>
                                )}
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

            {/* FAB (Only for Bank Tab) */}
            <AnimatePresence>
                {activeTab === 'BANK' && (
                    <motion.div
                        initial={{ scale: 0, rotate: 90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        className="fixed bottom-32 right-6 z-[60]"
                    >
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="w-14 h-14 bg-slate-900 dark:bg-emerald-600 text-white rounded-full shadow-xl shadow-slate-900/40 dark:shadow-emerald-900/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-slate-50 dark:border-slate-950"
                        >
                            <Plus size={28} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mock Bottom Sheet / Modal for Adding */}
            <AnimatePresence>
                {isAddOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsAddOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="absolute top-4 right-4">
                                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 mt-2">Tambah Rekening Baru</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="bankName" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nama Bank</label>
                                    <select
                                        id="bankName"
                                        value={formData.bankName}
                                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                                    >
                                        <option>Bank Syariah Indonesia (BSI)</option>
                                        <option>Bank Mandiri</option>
                                        <option>Bank BCA</option>
                                        <option>Bank BRI</option>
                                        <option>Bank Muamalat</option>
                                        <option>Bank Jago Syariah</option>
                                        <option>Bank Raya</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="accountNumber" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nomor Rekening</label>
                                    <input
                                        id="accountNumber"
                                        type="number"
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium placeholder:text-slate-400"
                                        placeholder="Contoh: 7712345678"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="holderName" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Atas Nama</label>
                                    <input
                                        id="holderName"
                                        type="text"
                                        value={formData.holderName}
                                        onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium placeholder:text-slate-400"
                                        placeholder="Contoh: DKM Masjid Raya"
                                    />
                                </div>

                                <button
                                    onClick={handleAddAccount}
                                    className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 hover:bg-emerald-700 active:scale-95 transition-all mt-4"
                                >
                                    Simpan Rekening
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
