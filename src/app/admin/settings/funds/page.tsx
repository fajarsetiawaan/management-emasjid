'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    Wallet,
    Building2,
    Trash2,
    Edit2,
    Save,
    X,
    AlertCircle
} from 'lucide-react';
import { Program, BankAccount } from '@/types';
import { MOCK_PROGRAMS } from '@/lib/mock-data';

export default function FinancialSettingsPage() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<{
        name: string;
        type: 'CASH' | 'BANK';
        bankId?: string;
    }>({
        name: '',
        type: 'CASH'
    });

    // Load Data
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedPrograms = localStorage.getItem('sim_programs');
            const savedBanks = localStorage.getItem('sim_bank_accounts');

            if (savedPrograms) {
                setPrograms(JSON.parse(savedPrograms));
            } else {
                setPrograms(MOCK_PROGRAMS);
            }

            if (savedBanks) {
                setBankAccounts(JSON.parse(savedBanks));
            }
        }
    }, []);

    const handleSave = () => {
        if (!formData.name) return alert('Nama dana harus diisi');
        if (formData.type === 'BANK' && !formData.bankId) return alert('Pilih rekening bank');

        const newProgram: Program = {
            id: `prog_${Math.random().toString(36).substr(2, 9)}`,
            name: formData.name,
            type: 'UNRESTRICTED',
            balance: 0,
            color: 'bg-emerald-500', // Default color, ideally random
            allocation: {
                type: formData.type,
                bankId: formData.bankId
            }
        };

        const updatedPrograms = [...programs, newProgram];
        setPrograms(updatedPrograms);
        localStorage.setItem('sim_programs', JSON.stringify(updatedPrograms));

        setIsAddOpen(false);
        setFormData({ name: '', type: 'CASH' });
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Hapus data dana "${name}"? \n\nPERHATIAN: Pastikan tidak ada transaksi terkait dana ini sebelum menghapus.`)) {
            const updated = programs.filter(p => p.id !== id);
            setPrograms(updated);
            localStorage.setItem('sim_programs', JSON.stringify(updated));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 relative transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 px-4 h-16 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Pengaturan Keuangan</h1>
            </header>

            <div className="p-5 space-y-6">

                {/* Info Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-3 text-blue-700 dark:text-blue-300">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-bold mb-1">Manajemen Sumber Dana</p>
                        <p className="opacity-90">Atur pos-pos anggaran (Kas) masjid Anda. Setiap dana harus dialokasikan penyimpanannya (Tunai atau Bank).</p>
                    </div>
                </div>

                {/* Programs List */}
                <div className="space-y-3">
                    {programs.map((prog) => (
                        <motion.div
                            key={prog.id}
                            layout
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${prog.allocation?.type === 'CASH'
                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                    {prog.allocation?.type === 'CASH' ? <Wallet size={18} /> : <Building2 size={18} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{prog.name}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                            {prog.allocation?.type === 'CASH' ? 'Tunai' : 'Bank'}
                                        </span>
                                        {prog.allocation?.type === 'BANK' && prog.allocation.bankId && (
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                via {bankAccounts.find(b => b.id === prog.allocation?.bankId)?.bankName || 'Unknown Bank'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(prog.id, prog.name)}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* FAB */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="w-14 h-14 bg-slate-900 dark:bg-emerald-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                    <Plus size={28} />
                </button>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {isAddOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Tambah Dana Baru</h3>
                                <button onClick={() => setIsAddOpen(false)}><X size={20} className="text-slate-400" /></button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Dana (Kas)</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="Contoh: Kas Bedug, Kas Renovasi"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Lokasi Penyimpanan</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setFormData({ ...formData, type: 'CASH', bankId: undefined })}
                                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.type === 'CASH'
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                                : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <Wallet size={24} />
                                            <span className="text-xs font-bold">Tunai (Cash)</span>
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, type: 'BANK' })}
                                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.type === 'BANK'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                                : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <Building2 size={24} />
                                            <span className="text-xs font-bold">Rekening Bank</span>
                                        </button>
                                    </div>
                                </div>

                                {formData.type === 'BANK' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Rekening</label>
                                        <select
                                            value={formData.bankId || ''}
                                            onChange={e => setFormData({ ...formData, bankId: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white font-medium outline-none"
                                        >
                                            <option value="">-- Pilih Bank --</option>
                                            {bankAccounts.map(bank => (
                                                <option key={bank.id} value={bank.id}>
                                                    {bank.bankName} - {bank.holderName}
                                                </option>
                                            ))}
                                        </select>
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleSave}
                                    className="w-full bg-slate-900 dark:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 active:scale-95 transition-all"
                                >
                                    Simpan Dana
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
