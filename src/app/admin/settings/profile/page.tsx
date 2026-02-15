'use client';

import { MOCK_MOSQUE } from '@/lib/mock-data';
import { ArrowLeft, Camera, MapPin, Save, Copy, Building2, Globe, Calendar, CheckCircle2, Shield, Users, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
};

export default function EditProfilePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLogo = localStorage.getItem('sim_logo_url');
            if (savedLogo) setLogoUrl(savedLogo);
        }
    }, []);

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert('Profil berhasil diperbarui!');
        }, 1000);
    };

    const handleCopySlug = () => {
        navigator.clipboard.writeText(`app.com/m/${MOCK_MOSQUE.slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Profile completion
    const completionItems = [
        { label: 'Nama Masjid', done: true },
        { label: 'Alamat', done: true },
        { label: 'Foto Sampul', done: false },
        { label: 'Logo Masjid', done: !!logoUrl },
        { label: 'Lokasi Peta', done: false },
    ];
    const completedCount = completionItems.filter(i => i.done).length;
    const completionPercent = Math.round((completedCount / completionItems.length) * 100);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">

            {/* ── Hero Cover + Avatar ── */}
            <div className="flex-none relative">
                {/* Cover Gradient */}
                <div className="relative w-full h-44 overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 dark:from-emerald-700 dark:via-teal-800 dark:to-cyan-900" />
                    {/* Mesh effect */}
                    <div className="absolute inset-0 opacity-30 dark:opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, transparent 60%)' }} />
                    {/* Floating particles */}
                    <motion.div animate={{ y: [0, -15, 0], x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }} className="absolute top-6 right-10 w-16 h-16 rounded-full bg-white/10 blur-xl" />
                    <motion.div animate={{ y: [0, 10, 0], x: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }} className="absolute bottom-4 left-8 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} className="absolute top-10 left-1/3 w-10 h-10 rounded-full bg-white/15 blur-lg" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 text-slate-700 dark:text-slate-200">
                            <Camera size={14} /> Ganti Sampul
                        </div>
                    </div>
                    {/* Back + Save buttons on cover */}
                    <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between">
                        <Link href="/admin/settings" className="w-9 h-9 flex items-center justify-center bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all">
                            <ArrowLeft size={18} />
                        </Link>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-md active:scale-95 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 border border-white/20"
                        >
                            {isLoading ? <span className="animate-spin text-sm">⏳</span> : <Save size={14} />}
                            {isLoading ? 'Saving...' : 'Simpan'}
                        </button>
                    </div>
                </div>

                {/* Avatar + Title overlay */}
                <div className="px-5 -mt-10 relative z-10 flex items-end gap-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border-[3px] border-white dark:border-slate-900 shadow-xl overflow-hidden flex items-center justify-center text-slate-200 dark:text-slate-700 ring-2 ring-emerald-500/20">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo Masjid" className="w-full h-full object-cover" />
                            ) : (
                                <Building2 size={28} />
                            )}
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md hover:bg-emerald-600 active:scale-90 transition-all">
                            <Camera size={12} />
                        </button>
                    </div>
                    <div className="pb-1 min-w-0 flex-1">
                        <h2 className="font-bold text-slate-800 dark:text-white text-base truncate leading-snug">{MOCK_MOSQUE.name}</h2>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{MOCK_MOSQUE.address}</p>
                    </div>
                </div>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-5 pt-5 space-y-4 pb-8">

                    {/* ── Profile Completion Card ── */}
                    <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg shadow-emerald-500/15">
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Shield size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-90">Kelengkapan Profil</span>
                                </div>
                                <span className="text-lg font-bold">{completionPercent}%</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercent}%` }}
                                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                                    className="h-full bg-white rounded-full"
                                />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {completionItems.map((item) => (
                                    <span key={item.label} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.done ? 'bg-white/25 text-white' : 'bg-white/10 text-white/50 line-through'}`}>
                                        {item.done && '✓ '}{item.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Quick Stats ── */}
                    <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-2">
                        {[
                            { icon: Users, label: 'Jamaah', value: '~500', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
                            { icon: Clock, label: 'Aktif Sejak', value: 'Jan 2025', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
                            { icon: Shield, label: 'Status', value: 'Verified', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/5 p-3 text-center shadow-sm">
                                <div className={`w-9 h-9 rounded-xl mx-auto mb-1.5 flex items-center justify-center ${stat.color}`}>
                                    <stat.icon size={16} />
                                </div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white">{stat.value}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* ── Identity Section ── */}
                    <motion.section {...fadeUp} transition={{ delay: 0.15 }} className="bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-white/5 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100/80 dark:border-slate-700/30 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                                <Building2 size={12} className="text-emerald-500" />
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
                                Identitas Masjid
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Mosque Name */}
                            <div>
                                <label htmlFor="mosqueName" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                                    Nama Masjid <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    id="mosqueName"
                                    name="mosqueName"
                                    type="text"
                                    autoComplete="organization"
                                    defaultValue={MOCK_MOSQUE.name}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-bold text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                    placeholder="Contoh: Masjid Raya Bintaro"
                                />
                            </div>

                            {/* Slug URL */}
                            <div>
                                <label htmlFor="slug" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                                    Slug URL Public
                                </label>
                                <div className="flex rounded-xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden bg-slate-50/80 dark:bg-slate-900/40">
                                    <span className="px-3 py-3 text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/60 border-r border-slate-200/80 dark:border-slate-700/50 text-xs font-medium flex items-center gap-1">
                                        <Globe size={11} className="text-slate-400" />
                                        app.com/m/
                                    </span>
                                    <input
                                        id="slug"
                                        name="slug"
                                        type="text"
                                        autoComplete="off"
                                        defaultValue={MOCK_MOSQUE.slug}
                                        disabled
                                        className="flex-1 px-3 py-3 bg-transparent text-slate-500 dark:text-slate-400 font-mono text-xs focus:outline-none"
                                    />
                                    <button
                                        onClick={handleCopySlug}
                                        className={`px-3 text-xs font-bold transition-all flex items-center gap-1 ${copied ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500 active:scale-95'}`}
                                    >
                                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1.5 ml-1">Hubungi admin untuk mengubah permalink ini.</p>
                            </div>

                            {/* Year Established */}
                            <div>
                                <label htmlFor="establishedYear" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                                    Tahun Berdiri
                                </label>
                                <input
                                    id="establishedYear"
                                    name="establishedYear"
                                    type="number"
                                    autoComplete="off"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                    placeholder="Contoh: 1998"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* ── Location Section ── */}
                    <motion.section {...fadeUp} transition={{ delay: 0.2 }} className="bg-white/70 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-white/5 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100/80 dark:border-slate-700/30 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                <MapPin size={12} className="text-blue-500" />
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
                                Lokasi & Peta
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    autoComplete="street-address"
                                    defaultValue={MOCK_MOSQUE.address}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium text-slate-800 dark:text-white resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                    placeholder="Jalan, Nomor, RT/RW, Kelurahan..."
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label htmlFor="city" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Kota / Kabupaten</label>
                                <select
                                    id="city"
                                    name="city"
                                    autoComplete="address-level2"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium text-slate-800 dark:text-white appearance-none"
                                >
                                    <option>Kota Bogor</option>
                                    <option>Kab. Bogor</option>
                                    <option>DKI Jakarta</option>
                                    <option>Depok</option>
                                </select>
                            </div>

                            {/* Map Placeholder */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Titik Peta</label>
                                <div className="w-full aspect-[2/1] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 rounded-2xl border-2 border-dashed border-emerald-200/60 dark:border-emerald-800/30 flex flex-col items-center justify-center gap-2.5 relative overflow-hidden group hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer">
                                    {/* Grid lines effect */}
                                    <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                                    {/* Pin with pulse */}
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 rounded-full bg-emerald-400/30"
                                        />
                                        <motion.div
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                            className="relative w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/10"
                                        >
                                            <MapPin size={22} fill="currentColor" />
                                        </motion.div>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Atur Lokasi di Peta</span>
                                        <span className="text-[10px] text-emerald-500/60 dark:text-emerald-500/40">Tap untuk membuka peta</span>
                                    </div>
                                    {/* Arrow indicator */}
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={20} className="text-emerald-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5 mt-3">
                                    <div>
                                        <label htmlFor="latitude" className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-1">Latitude</label>
                                        <input id="latitude" name="latitude" type="text" disabled defaultValue="-6.5971469" className="w-full px-3 py-2.5 bg-slate-50/80 dark:bg-slate-900/40 rounded-xl text-xs font-mono text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/50" />
                                    </div>
                                    <div>
                                        <label htmlFor="longitude" className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-1">Longitude</label>
                                        <input id="longitude" name="longitude" type="text" disabled defaultValue="106.8060388" className="w-full px-3 py-2.5 bg-slate-50/80 dark:bg-slate-900/40 rounded-xl text-xs font-mono text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
}
