'use client';

import { ArrowLeft, Bell, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { MOCK_USER } from '@/lib/mock-data';

export default function NotificationsPage() {
    const [settings, setSettings] = useState(MOCK_USER.preferences || {
        whatsapp: true,
        email: false,
        incoming: true,
        outgoing: true,
        schedule: false,
    });

    const [showToast, setShowToast] = useState(false);

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        setShowToast(true);
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

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

    const SettingRow = ({ label, desc, settingKey }: { label: string, desc?: string, settingKey: keyof typeof settings }) => (
        <div className="flex items-center justify-between py-4">
            <div className="pr-4">
                <div className="font-bold text-slate-800 text-sm">{label}</div>
                {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
            </div>
            <Toggle active={settings[settingKey]} onClick={() => handleToggle(settingKey)} label={`Toggle ${label}`} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24 relative">
            {/* Header */}
            <header className="bg-white px-4 h-16 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-50">
                <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-slate-800 text-lg">Notifikasi & Alert</h1>
            </header>

            <div className="p-5 space-y-6">

                {/* Section 1: Channels */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Saluran (Channels)</h3>
                    <div className="bg-white rounded-2xl border border-slate-100 px-5 divide-y divide-slate-50 shadow-sm">
                        <SettingRow
                            label="WhatsApp Pribadi"
                            desc="Kirim notifikasi ke nomor WA Anda"
                            settingKey="whatsapp"
                        />
                        <SettingRow
                            label="Email Laporan"
                            desc="Kirim rekap bulanan ke email"
                            settingKey="email"
                        />
                    </div>
                </div>

                {/* Section 2: Triggers */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Jenis Peringatan</h3>
                    <div className="bg-white rounded-2xl border border-slate-100 px-5 divide-y divide-slate-50 shadow-sm">
                        <SettingRow
                            label="Transaksi Masuk"
                            desc="Saat ada donasi online / QRIS masuk"
                            settingKey="incoming"
                        />
                        <SettingRow
                            label="Transaksi Keluar Besar"
                            desc="Saat pengeluaran > Rp 500.000"
                            settingKey="outgoing"
                        />
                        <SettingRow
                            label="Pengingat Jadwal"
                            desc="H-1 sebelum Kajian/Rapat dimulai"
                            settingKey="schedule"
                        />
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.9 }}
                            className="bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium"
                        >
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            Pengaturan disimpan
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
