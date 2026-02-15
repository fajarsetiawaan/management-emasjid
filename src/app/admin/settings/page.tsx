'use client';

import { MOCK_USER } from '@/lib/mock-data';
import {
    Building2,
    CreditCard,
    QrCode,
    Users,
    UserPlus,
    RefreshCw,
    Bell,
    Shield,
    Moon,
    HelpCircle,
    Info,
    LogOut,
    ChevronRight,
    Edit2,
    Crown,
    User,
    Wallet
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    // Mock Logout Logic
    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            alert('Anda berhasil logout');
            window.location.href = '/login';
        }
    };

    const [showThemeModal, setShowThemeModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleNavigate = (page: string) => {
        console.log(`Navigasi ke ${page}`);
    };

    const handleLogoutConfirm = () => {
        setShowLogoutModal(false);
        // Simulate logout
        alert('Anda berhasil logout');
        window.location.href = '/login';
    };

    const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'system') => {
        setTheme(selectedTheme);
        setTimeout(() => setShowThemeModal(false), 300);
    };

    const SettingsGroup = ({ title, children }: { title?: string, children: React.ReactNode }) => (
        <div className="mb-6">
            {title && <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-4">{title}</h3>}
            <div className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 sm:border sm:rounded-2xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800 transition-colors duration-300">
                {children}
            </div>
        </div>
    );

    const SettingsItem = ({
        icon: Icon,
        label,
        onClick,
        isDestructive = false,
        value
    }: {
        icon: any,
        label: string,
        onClick: () => void,
        isDestructive?: boolean,
        value?: string
    }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700
                ${isDestructive ? 'hover:bg-rose-50 dark:hover:bg-rose-900/10' : ''}
            `}
        >
            <div className="flex items-center gap-3.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${isDestructive ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}
                `}>
                    <Icon size={18} />
                </div>
                <span className={`text-sm font-medium ${isDestructive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {label}
                </span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{value}</span>}
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
            </div>
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300">

            {/* A. Profile Header */}
            <header className="bg-white dark:bg-slate-900 px-6 pt-8 pb-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md overflow-hidden flex items-center justify-center text-slate-400 dark:text-slate-500">
                            <User size={32} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white dark:border-slate-900 flex items-center gap-0.5 shadow-sm">
                            <Crown size={10} fill="currentColor" />
                            {MOCK_USER.role === 'OWNER' ? 'Ketua DKM' : 'Pengurus'}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">{MOCK_USER.name}</h1>
                        <p className="text-sm text-slate-400 dark:text-slate-500">{MOCK_USER.email}</p>
                    </div>
                </div>
                <button
                    onClick={() => handleNavigate('Edit Profil')}
                    className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                >
                    <Edit2 size={16} />
                </button>
            </header>

            <div className="px-4 -mt-4 relative z-10 space-y-6">

                {/* B. Subscription Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 flex flex-col gap-4 relative overflow-hidden ring-1 ring-white/10">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <div className="text-emerald-100 text-xs font-medium mb-1">Paket Langganan</div>
                            <div className="flex items-center gap-2">
                                <Crown size={20} className="text-yellow-300" fill="currentColor" />
                                <h2 className="text-xl font-bold tracking-tight">Premium Plan</h2>
                            </div>
                        </div>
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold border border-white/20">
                            Aktif
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
                        <span className="text-xs text-emerald-100">Berlaku s.d: 31 Des 2026</span>
                        <button className="text-xs font-bold bg-white text-emerald-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-emerald-50 active:scale-95 transition-all">
                            Perpanjang
                        </button>
                    </div>
                </div>

                {/* C. Settings Groups */}

                {/* Group 1: Manajemen Masjid */}
                <SettingsGroup title="Manajemen Masjid">
                    <Link href="/admin/settings/profile" className="w-full">
                        <SettingsItem
                            icon={Building2}
                            label="Profil Masjid"
                            value={MOCK_USER.mosqueName}
                            onClick={() => { }}
                        />
                    </Link>
                    <Link href="/admin/settings/bank" className="w-full">
                        <SettingsItem
                            icon={CreditCard}
                            label="Rekening Bank"
                            onClick={() => { }}
                        />
                    </Link>
                    <Link href="/admin/settings/qrcode" className="w-full">
                        <SettingsItem
                            icon={QrCode}
                            label="Kode QR Masjid"
                            onClick={() => { }}
                        />
                    </Link>
                    <Link href="/admin/settings/funds" className="w-full">
                        <SettingsItem
                            icon={Wallet}
                            label="Pos Keuangan & Anggaran"
                            onClick={() => { }}
                        />
                    </Link>
                </SettingsGroup>

                {/* Group 2: Tim & Organisasi */}
                <SettingsGroup title="Tim & Organisasi">
                    <Link href="/admin/settings/team" className="w-full">
                        <SettingsItem
                            icon={Users}
                            label="Daftar Pengurus"
                            onClick={() => { }}
                            value="4 Org"
                        />
                    </Link>
                    <Link href="/admin/settings/team" className="w-full">
                        <SettingsItem
                            icon={UserPlus}
                            label="Undang Anggota"
                            onClick={() => { }}
                        />
                    </Link>
                    <Link href="/admin/settings/handover" className="w-full">
                        <SettingsItem
                            icon={RefreshCw}
                            label="Serah Terima Jabatan"
                            onClick={() => { }}
                            isDestructive
                        />
                    </Link>
                </SettingsGroup>

                {/* Group 3: Preferensi */}
                <SettingsGroup title="Preferensi Aplikasi">
                    <Link href="/admin/settings/notifications" className="w-full">
                        <SettingsItem
                            icon={Bell}
                            label="Notifikasi"
                            onClick={() => { }}
                            value="ON"
                        />
                    </Link>
                    <Link href="/admin/settings/security" className="w-full">
                        <SettingsItem
                            icon={Shield}
                            label="Keamanan Akun"
                            onClick={() => { }}
                        />
                    </Link>
                    <SettingsItem
                        icon={Moon}
                        label="Tampilan"
                        onClick={() => setShowThemeModal(true)}
                        value={theme === 'system' ? 'Otomatis' : theme === 'dark' ? 'Gelap' : 'Terang'}
                    />
                </SettingsGroup>

                {/* Group 4: Lainnya */}
                <SettingsGroup title="Lainnya">
                    <Link href="/admin/settings/support" className="w-full">
                        <SettingsItem
                            icon={HelpCircle}
                            label="Bantuan & CS"
                            onClick={() => { }}
                        />
                    </Link>
                    <Link href="/admin/settings/about" className="w-full">
                        <SettingsItem
                            icon={Info}
                            label="Tentang Aplikasi"
                            onClick={() => { }}
                            value="v1.0.0"
                        />
                    </Link>
                </SettingsGroup>

                {/* Logout Button */}
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full bg-rose-50 text-rose-600 font-bold py-3.5 rounded-xl border border-rose-100 flex items-center justify-center gap-2 hover:bg-rose-100 active:scale-[0.98] transition-all"
                >
                    <LogOut size={18} />
                    Keluar Aplikasi
                </button>

                <div className="text-center text-[10px] text-slate-300 pb-4">
                    Fase E-Masjid • Built with ❤️ for Ummah
                </div>

            </div>
            {/* Theme Selector Modal */}
            <AnimatePresence>
                {showThemeModal && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowThemeModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl ring-1 ring-slate-900/5 dark:ring-slate-700"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Pilih Tampilan</h3>
                                <button onClick={() => setShowThemeModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'light', label: 'Terang (Light)', icon: '☀️' },
                                    { id: 'dark', label: 'Gelap (Dark)', icon: '🌙' },
                                    { id: 'system', label: 'Otomatis (System)', icon: '⚙️' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleThemeSelect(item.id as any)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${theme === item.id
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="font-bold">{item.label}</span>
                                        </div>
                                        {theme === item.id && (
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                <Check size={14} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowLogoutModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 relative z-10 text-center shadow-2xl ring-1 ring-slate-900/5 dark:ring-slate-700"
                        >
                            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 dark:text-rose-400">
                                <LogOut size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Konfirmasi Keluar</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                Apakah Anda yakin ingin keluar dari akun ini?
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleLogoutConfirm}
                                    className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-lg shadow-rose-200 dark:shadow-rose-900/20 transition-colors"
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
