// @ts-nocheck
'use client';

import { ArrowLeft, CreditCard, Plus, Wallet, X, QrCode, Download, Printer, Share2, Building2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

import { MOCK_BANK_ACCOUNTS, MOCK_MOSQUE } from '@/lib/mock-data';
import { BankAccount } from '@/types';
import { BankItem } from '@/components/admin/settings/BankItem'; // Adjust import path if needed

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

        const newAccount: BankAccount = {
            id: Math.random().toString(36).substr(2, 9),
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            holderName: formData.holderName,
            color: 'bg-slate-900', // Default color, unused by BankItem
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
                            {/* Account List Header */}
                            {accounts.length > 0 && (
                                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Rekening Tersimpan</h3>
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
                                            <BankItem account={acc} onDelete={handleDelete} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Dashed Add Button */}
                                <button
                                    onClick={() => setIsAddOpen(true)}
                                    className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-2xl p-4 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-all group active:scale-95"
                                >
                                    <Plus size={20} className="group-hover:scale-110 transition-transform" />
                                    <span className="font-bold">Tambah Rekening Lain</span>
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
