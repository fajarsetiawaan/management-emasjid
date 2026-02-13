'use client';

import { ArrowLeft, CreditCard, Plus, Trash2, Edit2, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { MOCK_BANK_ACCOUNTS } from '@/lib/mock-data';
import { BankAccount } from '@/types';

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

    const [isAddOpen, setIsAddOpen] = useState(false);

    const handleDelete = (id: string, bank: string) => {
        if (confirm(`Hapus rekening ${bank}?`)) {
            setAccounts(accounts.filter(a => a.id !== id));
        }
    };

    const handleAddMock = () => {
        const newAccount: BankAccount = {
            id: Math.random().toString(),
            bankName: 'BRI',
            accountNumber: '1234567890',
            holderName: 'Masjid Raya Bogor',
            color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        };
        setAccounts([...accounts, newAccount]);
        setIsAddOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24 relative">
            {/* Header */}
            <header className="bg-white px-4 h-16 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 text-lg">Rekening Donasi</h1>
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
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl shadow-slate-900/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                    <Plus size={28} />
                </button>
            </div>

            {/* Mock Bottom Sheet / Modal for Adding */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="bg-white w-full max-w-md rounded-t-3xl p-6 relative z-10"
                    >
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Tambah Rekening Baru</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="bankName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Bank</label>
                                <select id="bankName" name="bankName" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium">
                                    <option>Bank Syariah Indonesia (BSI)</option>
                                    <option>Bank Mandiri</option>
                                    <option>Bank BCA</option>
                                    <option>Bank BRI</option>
                                    <option>Bank Muamalat</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="accountNumber" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor Rekening</label>
                                <input id="accountNumber" name="accountNumber" type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium" placeholder="Contoh: 7712345678" />
                            </div>
                            <div>
                                <label htmlFor="holderName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Atas Nama</label>
                                <input id="holderName" name="holderName" type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium" placeholder="Contoh: DKM Masjid Raya" />
                            </div>

                            <button
                                onClick={handleAddMock}
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
