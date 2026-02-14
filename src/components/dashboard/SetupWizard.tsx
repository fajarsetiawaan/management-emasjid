'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Wallet, Users, CheckCircle2, Circle, ChevronRight, X, ArrowRight } from 'lucide-react';
import { MOCK_MOSQUE, MOCK_TEAM_MEMBERS } from '@/lib/mock-data';

// Simple CSS Confetti Implementation
const Particle = ({ color, x, y }: { color: string; x: number; y: number }) => (
    <motion.div
        initial={{ opacity: 1, x, y }}
        animate={{
            opacity: 0,
            y: y + 200,
            x: x + (Math.random() - 0.5) * 100,
            rotate: 360
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-2 h-2 rounded-full z-50 pointer-events-none"
        style={{ backgroundColor: color }}
    />
);

export default function SetupWizard() {
    const [isVisible, setIsVisible] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);

    // Quick Setup States
    const [isLogoUploaded, setIsLogoUploaded] = useState(false);
    const [isBankAdded, setIsBankAdded] = useState(false);
    const [isQrisUploaded, setIsQrisUploaded] = useState(false);
    const [isTeamInvited, setIsTeamInvited] = useState(false);

    // Modals State
    const [activeModal, setActiveModal] = useState<string | null>(null); // 'logo', 'bank', 'qris', 'team'

    // Form States
    const [bankForm, setBankForm] = useState({ bank: '', number: '', name: '' });
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        // Check simulation state on mount
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('sim_logo_done')) setIsLogoUploaded(true);
            if (localStorage.getItem('sim_bank_done')) setIsBankAdded(true);
            if (localStorage.getItem('sim_qris_done')) setIsQrisUploaded(true);
            if (localStorage.getItem('sim_team_done')) setIsTeamInvited(true);
        }
    }, []);

    const markAsDone = (key: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, 'true');
        }
    };

    const steps = [
        {
            id: 'logo',
            label: "Logo Masjid",
            sublabel: "Agar tampilan halaman publik terlihat resmi.",
            icon: ArrowRight, // Placeholder, will override in map
            iconComponent: Building2, // Using Building2 as generic if Image is not imported yet, but widely available icons
            action: () => setActiveModal('logo'),
            isDone: isLogoUploaded,
            actionLabel: "Upload Logo"
        },
        {
            id: 'bank',
            label: "Rekening Bank",
            sublabel: "Nomor rekening untuk menerima Infaq/Sedekah.",
            icon: Wallet,
            action: () => setActiveModal('bank'),
            isDone: isBankAdded,
            actionLabel: "Input Rekening"
        },
        {
            id: 'qris',
            label: "Scan QRIS",
            sublabel: "Upload foto QRIS agar jamaah bisa scan donasi.",
            icon: CheckCircle2, // Placeholder
            action: () => setActiveModal('qris'),
            isDone: isQrisUploaded,
            actionLabel: "Upload QRIS"
        },
        {
            id: 'team',
            label: "Tim Masjid",
            sublabel: "Ajak Bendahara/Sekretaris untuk bantu kelola.",
            icon: Users,
            action: () => setActiveModal('team'),
            isDone: isTeamInvited,
            actionLabel: "Undang Tim"
        }
    ];

    const completedSteps = steps.filter(s => s.isDone).length;
    const progress = (completedSteps / steps.length) * 100;
    const isAllDone = progress === 100;

    useEffect(() => {
        if (isAllDone) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isAllDone]);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative"
        >
            {/* Confetti */}
            {showConfetti && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-50 flex justify-center">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <Particle
                            key={i}
                            color={['#34d399', '#f472b6', '#60a5fa', '#fbbf24'][Math.floor(Math.random() * 4)]}
                            x={(Math.random() - 0.5) * 300}
                            y={-50}
                        />
                    ))}
                </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-emerald-900/5 border border-emerald-100 relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-600"></div>

                {/* Header */}
                <div className="relative z-10 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                Lengkapi Data Donasi & Identitas 🚀
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Setup cepat agar masjid siap menerima donasi digital.
                            </p>
                        </div>
                        {isAllDone && (
                            <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full rounded-full bg-emerald-500"
                            />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">
                            {Math.round(progress)}% Selesai
                        </span>
                    </div>
                </div>

                {/* Steps List */}
                <div className="space-y-3 relative z-10">
                    {steps.map((step) => (
                        <div key={step.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${step.isDone ? 'bg-emerald-50/50 border-emerald-100/50' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                    {/* Icons mapped manually if needed or dynamic */}
                                    {step.id === 'logo' && <Building2 size={20} />}
                                    {step.id === 'bank' && <Wallet size={20} />}
                                    {step.id === 'qris' && <CheckCircle2 size={20} />}
                                    {step.id === 'team' && <Users size={20} />}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold ${step.isDone ? 'text-emerald-800' : 'text-slate-800'}`}>{step.label}</h4>
                                    <p className="text-xs text-slate-400 mt-0.5">{step.sublabel}</p>
                                </div>
                            </div>
                            <div>
                                {step.isDone ? (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full">
                                        <CheckCircle2 size={14} /> Selesai
                                    </span>
                                ) : (
                                    <button onClick={step.action} className="text-xs font-bold text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors">
                                        {step.actionLabel}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl">
                            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>

                            {activeModal === 'logo' && (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
                                        <Building2 size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Logo Masjid</h3>
                                    <p className="text-sm text-slate-500 mb-6">Format PNG/JPG. Maksimal 2MB.</p>
                                    <button onClick={() => {
                                        setIsLogoUploaded(true);
                                        markAsDone('sim_logo_done');
                                        if (typeof window !== 'undefined') localStorage.setItem('sim_logo_url', 'https://via.placeholder.com/150/10b981/ffffff?text=LOGO');
                                        setActiveModal(null);
                                    }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl">
                                        Pilih File & Upload
                                    </button>
                                </div>
                            )}

                            {activeModal === 'bank' && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Wallet className="text-emerald-500" size={24} /> Rekening Bank</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Nama Bank</label>
                                            <input
                                                className="w-full p-2 border rounded-lg"
                                                placeholder="Contoh: BSI, BRI"
                                                value={bankForm.bank}
                                                onChange={(e) => setBankForm({ ...bankForm, bank: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Nomor Rekening</label>
                                            <input
                                                type="number"
                                                className="w-full p-2 border rounded-lg"
                                                placeholder="Contoh: 7123456789"
                                                value={bankForm.number}
                                                onChange={(e) => setBankForm({ ...bankForm, number: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Atas Nama</label>
                                            <input
                                                className="w-full p-2 border rounded-lg"
                                                placeholder="Nama Masjid/Yayasan"
                                                value={bankForm.name}
                                                onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })}
                                            />
                                        </div>
                                        <button onClick={() => {
                                            if (bankForm.bank && bankForm.number && bankForm.name) {
                                                setIsBankAdded(true);
                                                markAsDone('sim_bank_done');
                                                if (typeof window !== 'undefined') {
                                                    const newAccount = {
                                                        id: Date.now().toString(),
                                                        bankName: bankForm.bank,
                                                        accountNumber: bankForm.number,
                                                        holderName: bankForm.name,
                                                        color: 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                                    };
                                                    const existing = JSON.parse(localStorage.getItem('sim_bank_accounts') || '[]');
                                                    localStorage.setItem('sim_bank_accounts', JSON.stringify([...existing, newAccount]));
                                                }
                                                setActiveModal(null);
                                                setBankForm({ bank: '', number: '', name: '' });
                                            }
                                        }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-2">Simpan Rekening</button>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'qris' && (
                                <div className="text-center">
                                    <div className="w-40 h-40 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
                                        <div className="text-center"><span className="text-2xl font-bold block mb-1">QRIS</span><span className="text-xs">Upload Here</span></div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Upload QRIS Masjid</h3>
                                    <p className="text-sm text-slate-500 mb-6">Pastikan gambar QR terlihat jelas.</p>
                                    <button onClick={() => {
                                        setIsQrisUploaded(true);
                                        markAsDone('sim_qris_done');
                                        if (typeof window !== 'undefined') localStorage.setItem('sim_qris_url', 'https://via.placeholder.com/300x300?text=QRIS+CODE');
                                        setActiveModal(null);
                                    }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl">
                                        Upload QRIS
                                    </button>
                                </div>
                            )}

                            {activeModal === 'team' && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="text-emerald-500" size={24} /> Undang Pengurus</h3>
                                    <p className="text-sm text-slate-500 mb-4">Kirim undangan akses ke email pengurus baru.</p>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Email Pengurus</label>
                                            <input
                                                type="email"
                                                className="w-full p-2 border rounded-lg"
                                                placeholder="nama@email.com"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                            />
                                        </div>
                                        <button onClick={() => {
                                            if (inviteEmail) {
                                                setIsTeamInvited(true);
                                                markAsDone('sim_team_done');
                                                if (typeof window !== 'undefined') {
                                                    const newMember = {
                                                        id: Date.now().toString(),
                                                        name: inviteEmail.split('@')[0],
                                                        email: inviteEmail,
                                                        role: 'BENDAHARA',
                                                        status: 'PENDING',
                                                        avatarColor: 'bg-emerald-500'
                                                    };
                                                    const existing = JSON.parse(localStorage.getItem('sim_team_members') || '[]');
                                                    localStorage.setItem('sim_team_members', JSON.stringify([...existing, newMember]));
                                                }
                                                setActiveModal(null);
                                                setInviteEmail('');
                                            }
                                        }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-2">Kirim Undangan</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
