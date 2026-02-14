'use client';

import { ArrowLeft, CreditCard, Plus, Trash2, Edit2, Wallet, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { MOCK_BANK_ACCOUNTS } from '@/lib/mock-data';
import { BankAccount } from '@/types';

const CARD_GRADIENTS = [
    'bg-gradient-to-br from-blue-500 to-cyan-600',
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-indigo-500 to-purple-600',
    'bg-gradient-to-br from-rose-500 to-orange-600',
    'bg-gradient-to-br from-slate-700 to-slate-800',
];

export default function BankAccountsPage() {
    // Mock State for Accounts
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    // Initialize with empty array to avoid hydration mismatch, then populate in useEffect

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
            <header className="bg-white dark:bg-slate-900 px-4 h-16 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Rekening Bank</h1>
            </header>

            <div className="p-5 space-y-6">

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
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <CreditCard size={32} />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1">Belum ada rekening</h3>
                            <p className="text-sm text-slate-400">Tambahkan rekening bank untuk menerima donasi transfer.</p>
                        </motion.div>
                    )}
                </div>

            </div>

            {/* FAB */}
            <div className="fixed bottom-32 right-6 z-[60]">
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="w-14 h-14 bg-slate-900 dark:bg-emerald-600 text-white rounded-full shadow-xl shadow-slate-900/40 dark:shadow-emerald-900/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-slate-50 dark:border-slate-950"
                >
                    <Plus size={28} />
                </button>
            </div>

            {/* Mock Bottom Sheet / Modal for Adding */}
            {isAddOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800"
                    >
                        <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-6 opacity-0" /> {/* Hidden visual anchor or just remove */}
                        <div className="absolute top-4 right-4">
                            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-6 mt-2">Tambah Rekening Baru</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="bankName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Bank</label>
                                <select
                                    id="bankName"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium"
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
                                <label htmlFor="accountNumber" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor Rekening</label>
                                <input
                                    id="accountNumber"
                                    type="number"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium"
                                    placeholder="Contoh: 7712345678"
                                />
                            </div>
                            <div>
                                <label htmlFor="holderName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Atas Nama</label>
                                <input
                                    id="holderName"
                                    type="text"
                                    value={formData.holderName}
                                    onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium"
                                    placeholder="Contoh: DKM Masjid Raya"
                                />
                            </div>

                            <button
                                onClick={handleAddAccount}
                                className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all mt-4"
                            >
                                Simpan Rekening
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
