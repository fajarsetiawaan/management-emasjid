'use client';

import { MOCK_TEAM_MEMBERS } from '@/lib/mock-data';
import { ArrowLeft, AlertTriangle, Check, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HandoverPage() {
    const [step, setStep] = useState(1);
    const [selectedId, setSelectedId] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Only active members can receive ownership
    const candidates = MOCK_TEAM_MEMBERS.filter(m => m.status === 'ACTIVE' && m.role !== 'ADMIN');

    const handleTransfer = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            alert('Kepemilikan berhasil dipindahkan. Anda akan logout.');
            window.location.href = '/login';
        }, 2000);
    };

    const selectedMember = candidates.find(m => m.id === selectedId);

    return (
        <div className="min-h-screen bg-slate-50 pb-24 relative">
            {/* Header */}
            <header className="bg-white px-4 h-16 flex items-center gap-3 border-b border-slate-100">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 text-lg">Serah Terima Jabatan</h1>
            </header>

            <div className="p-5 max-w-lg mx-auto">
                {/* Warning Banner */}
                <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg mb-8 shadow-sm flex gap-3">
                    <AlertTriangle className="text-rose-600 shrink-0" size={24} />
                    <div>
                        <h3 className="font-bold text-rose-800 text-sm uppercase tracking-wide mb-1">Perhatian!</h3>
                        <p className="text-sm text-rose-700 leading-relaxed">
                            Tindakan ini akan <strong>memindahkan hak akses Ketua DKM (Owner)</strong> ke akun lain secara permanen. Akun Anda akan turun status menjadi Alumni (View Only).
                        </p>
                    </div>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center justify-center mb-8 gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 1 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                    <div className={`h-1 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-rose-600' : 'bg-slate-200'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
                        >
                            <h2 className="font-bold text-lg text-slate-800 mb-4">Pilih Penerus (Ketua Baru)</h2>

                            <div className="space-y-4 mb-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kandidat Pengurus</label>
                                <div className="space-y-2">
                                    {candidates.map(candidate => (
                                        <div
                                            key={candidate.id}
                                            onClick={() => setSelectedId(candidate.id)}
                                            className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${selectedId === candidate.id
                                                ? 'border-rose-500 bg-rose-50'
                                                : 'border-slate-100 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${candidate.avatarColor}`}>
                                                {candidate.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-slate-800 text-sm">{candidate.name}</div>
                                                <div className="text-xs text-slate-500">{candidate.role}</div>
                                            </div>
                                            {selectedId === candidate.id && <Check size={20} className="text-rose-600" />}
                                        </div>
                                    ))}
                                    {candidates.length === 0 && (
                                        <p className="text-sm text-slate-400 italic">Tidak ada kandidat aktif yang tersedia.</p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedId}
                                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Lanjut <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
                        >
                            <h2 className="font-bold text-lg text-slate-800 mb-4">Konfirmasi Keamanan</h2>

                            {selectedMember && (
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-6 border border-slate-100">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${selectedMember.avatarColor}`}>
                                        {selectedMember.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-bold uppercase">Penerus Terpilih</div>
                                        <div className="font-bold text-slate-800 text-sm">{selectedMember.name}</div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kata Sandi Anda</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                                        placeholder="Konfirmasi password..."
                                    />
                                </div>

                                <label htmlFor="agreement" className="flex items-start gap-3 cursor-pointer group">
                                    <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isChecked ? 'bg-rose-600 border-rose-600' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                        {isChecked && <Check size={14} className="text-white" />}
                                    </div>
                                    <input id="agreement" name="agreement" type="checkbox" className="hidden" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
                                    <span className="text-xs text-slate-600 font-medium leading-relaxed select-none">
                                        Saya sadar bahwa tindakan ini tidak dapat dibatalkan dan saya bertanggung jawab penuh atas pemindahan aset digital ini.
                                    </span>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-4 py-3.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Kembali
                                </button>
                                <button
                                    onClick={handleTransfer}
                                    disabled={!password || !isChecked || isSubmitting}
                                    className="flex-1 bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 hover:bg-rose-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <ShieldAlert size={18} />}
                                    {isSubmitting ? 'Memproses...' : 'Transfer Sekarang'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
