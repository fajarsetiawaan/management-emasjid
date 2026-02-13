'use client';

import { ArrowLeft, Lock, Key, Smartphone, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecurityPage() {
    const [isPinEnabled, setIsPinEnabled] = useState(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [pinDisplay, setPinDisplay] = useState('');

    const handlePinToggle = () => {
        if (!isPinEnabled) {
            setShowPinModal(true);
        } else {
            setIsPinEnabled(false);
        }
    };

    const handlePinSubmit = () => {
        if (pinDisplay.length === 6) {
            setIsPinEnabled(true);
            setShowPinModal(false);
            setPinDisplay('');
            alert('PIN Aplikasi berhasil diaktifkan');
        }
    };

    const handlePinInput = (num: number) => {
        if (pinDisplay.length < 6) {
            setPinDisplay(prev => prev + num);
        }
    };

    const handlePinBackspace = () => {
        setPinDisplay(prev => prev.slice(0, -1));
    };

    const Toggle = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
        <button
            onClick={onClick}
            aria-label={label}
            aria-pressed={active}
            className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${active ? 'bg-emerald-500' : 'bg-slate-200'}`}
        >
            <motion.div
                layout
                className="w-5 h-5 bg-white rounded-full shadow-sm"
                animate={{ x: active ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24 relative">
            {/* Header */}
            <header className="bg-white px-4 h-16 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 text-lg">Keamanan Akun</h1>
            </header>

            <div className="p-5 space-y-6">

                {/* Change Password */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kata Sandi</h3>
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                        <div className="relative">
                            <Key size={16} className="absolute top-3.5 left-4 text-slate-400" />
                            <label htmlFor="oldPassword" className="sr-only">Kata Sandi Lama</label>
                            <input id="oldPassword" name="oldPassword" type="password" placeholder="Kata Sandi Lama" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="relative">
                            <Lock size={16} className="absolute top-3.5 left-4 text-slate-400" />
                            <label htmlFor="newPassword" className="sr-only">Kata Sandi Baru</label>
                            <input id="newPassword" name="newPassword" type="password" placeholder="Kata Sandi Baru" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-emerald-500" />
                        </div>
                        <button className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors shadow-lg shadow-slate-200/50">
                            Update Password
                        </button>
                    </div>
                </div>

                {/* App Security */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">PIN & Biometrik</h3>
                    <div className="bg-white rounded-2xl border border-slate-100 px-5 divide-y divide-slate-50 shadow-sm">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">PIN Aplikasi</div>
                                    <div className={`text-xs font-medium ${isPinEnabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {isPinEnabled ? 'Aktif' : 'Nonaktif'}
                                    </div>
                                </div>
                            </div>
                            <Toggle active={isPinEnabled} onClick={handlePinToggle} label="Toggle PIN Aplikasi" />
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">Login Biometrik</div>
                                    <div className="text-xs text-slate-400">FaceID / TouchID</div>
                                </div>
                            </div>
                            <Toggle active={isBiometricEnabled} onClick={() => setIsBiometricEnabled(!isBiometricEnabled)} label="Toggle Login Biometrik" />
                        </div>
                    </div>
                </div>
            </div>

            {/* PIN INPUT MODAL */}
            <AnimatePresence>
                {showPinModal && (
                    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="bg-slate-50 w-full max-w-md h-[80vh] rounded-t-3xl relative flex flex-col"
                        >
                            <button onClick={() => setShowPinModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>

                            <div className="flex-1 flex flex-col items-center justify-center pt-8">
                                <h3 className="text-xl font-bold text-slate-800 mb-8">Buat PIN Baru</h3>

                                {/* PIN Dots */}
                                <div className="flex gap-4 mb-12">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-4 h-4 rounded-full border-2 transition-all ${i < pinDisplay.length
                                                ? 'bg-emerald-600 border-emerald-600 scale-110'
                                                : 'border-slate-300 bg-white'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Keypad */}
                                <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full max-w-xs px-6">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handlePinInput(num)}
                                            className="w-16 h-16 rounded-full bg-white shadow-sm border-b-4 border-slate-200 text-2xl font-bold text-slate-700 active:translate-y-1 active:border-b-0 active:bg-slate-100 transition-all flex items-center justify-center"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <div className="col-start-2">
                                        <button
                                            onClick={() => handlePinInput(0)}
                                            className="w-16 h-16 rounded-full bg-white shadow-sm border-b-4 border-slate-200 text-2xl font-bold text-slate-700 active:translate-y-1 active:border-b-0 active:bg-slate-100 transition-all flex items-center justify-center"
                                        >
                                            0
                                        </button>
                                    </div>
                                    <div className="col-start-3 flex justify-center items-center">
                                        <button
                                            onClick={handlePinBackspace}
                                            className="w-16 h-16 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePinSubmit}
                                    disabled={pinDisplay.length !== 6}
                                    className="mt-8 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    Simpan PIN
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
