'use client';

import { MOCK_MOSQUE } from '@/lib/mock-data';
import { ArrowLeft, Camera, MapPin, Save, Copy, Building2, Globe, Calendar, CheckCircle2, Shield, Users, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
            toast.success('Profil berhasil diperbarui!');
        }, 1000);
    };

    const handleCopySlug = () => {
        navigator.clipboard.writeText(`app.com/m/${MOCK_MOSQUE.slug}`);
        setCopied(true);
        toast.success('Link profil disalin!');
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
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative font-sans text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto z-10 scrollbar-hide">
                {/* ── Hero Cover + Avatar ── */}
                <div className="flex-none relative">
                    {/* Cover Gradient */}
                    <div className="relative w-full h-44 overflow-hidden group cursor-pointer shadow-lg">
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
                        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
                            <Link href="/admin/settings" className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/30 transition-all border border-white/10">
                                <ArrowLeft size={20} />
                            </Link>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-md active:scale-95 text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 border border-white/20 shadow-lg shadow-black/10"
                            >
                                {isLoading ? <span className="animate-spin text-sm">⏳</span> : <Save size={16} />}
                                {isLoading ? 'Saving...' : 'Simpan'}
                            </button>
                        </div>
                    </div>

                    {/* Avatar + Title overlay */}
                    <div className="px-6 -mt-10 relative z-10 flex items-end gap-4">
                        <div className="relative flex-shrink-0 group">
                            <div className="w-24 h-24 rounded-[1.5rem] bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-950 shadow-2xl overflow-hidden flex items-center justify-center text-slate-200 dark:text-slate-700 ring-1 ring-black/5 dark:ring-white/10">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Logo Masjid" className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 size={32} />
                                )}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-lg hover:bg-emerald-600 active:scale-90 transition-all">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div className="pb-2 min-w-0 flex-1">
                            <h2 className="font-bold text-slate-900 dark:text-white text-xl truncate leading-tight tracking-tight">{MOCK_MOSQUE.name}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">{MOCK_MOSQUE.address}</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 pt-6 space-y-6 pb-24">

                    {/* ── Profile Completion Card ── */}
                    <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800 rounded-[2rem] p-5 text-white relative overflow-hidden shadow-xl shadow-emerald-500/20 group">
                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors" />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <Shield size={16} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-90">Kelengkapan Profil</span>
                                </div>
                                <span className="text-2xl font-bold tracking-tight">{completionPercent}%</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden mb-4 backdrop-blur-sm shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercent}%` }}
                                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                                    className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {completionItems.map((item) => (
                                    <span key={item.label} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${item.done ? 'bg-white/20 border-white/20 text-white' : 'bg-transparent border-white/10 text-white/40'}`}>
                                        {item.done && '✓ '}{item.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Quick Stats ── */}
                    <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
                        {[
                            { icon: Users, label: 'Jamaah', value: `~${MOCK_MOSQUE.jamaahCount?.toLocaleString('id-ID') || '0'}`, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
                            { icon: Clock, label: 'Aktif Sejak', value: MOCK_MOSQUE.activeSince || '-', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
                            { icon: Shield, label: 'Status', value: MOCK_MOSQUE.verificationStatus === 'verified' ? 'Verified' : MOCK_MOSQUE.verificationStatus === 'pending' ? 'Pending' : 'Unverified', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/5 p-4 text-center shadow-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-colors">
                                <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${stat.color}`}>
                                    <stat.icon size={18} />
                                </div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">{stat.value}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* ── Identity Section ── */}
                    <motion.section {...fadeUp} transition={{ delay: 0.15 }} className="bg-white/60 dark:bg-slate-800/30 backdrop-blur-lg rounded-[2rem] border border-white/40 dark:border-white/5 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100/80 dark:border-slate-700/30 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shadow-sm border border-emerald-100/50 dark:border-emerald-500/10">
                                <Building2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Identitas Masjid
                            </h3>
                        </div>
                        <div className="p-5 space-y-5">
                            {/* Mosque Name */}
                            <div>
                                <label htmlFor="mosqueName" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Nama Masjid <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="mosqueName"
                                    name="mosqueName"
                                    type="text"
                                    autoComplete="organization"
                                    defaultValue={MOCK_MOSQUE.name}
                                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-bold text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm"
                                    placeholder="Contoh: Masjid Raya Bintaro"
                                />
                            </div>

                            {/* Slug URL */}
                            <div>
                                <label htmlFor="slug" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Slug URL Public
                                </label>
                                <div className="flex rounded-2xl border border-slate-200/60 dark:border-slate-700/50 overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 shadow-sm">
                                    <span className="px-4 py-3.5 text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-800/40 border-r border-slate-200/60 dark:border-slate-700/50 text-xs font-bold flex items-center gap-1.5 selection:none">
                                        <Globe size={12} />
                                        app.fase.id/m/
                                    </span>
                                    <input
                                        id="slug"
                                        name="slug"
                                        type="text"
                                        autoComplete="off"
                                        defaultValue={MOCK_MOSQUE.slug}
                                        disabled
                                        className="flex-1 px-4 py-3.5 bg-transparent text-slate-600 dark:text-slate-300 font-mono text-sm font-medium focus:outline-none"
                                    />
                                    <button
                                        onClick={handleCopySlug}
                                        className={`px-4 text-xs font-bold transition-all flex items-center gap-2 ${copied ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                    >
                                        {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-2 ml-1 font-medium">Hubungi admin untuk mengubah permalink ini.</p>
                            </div>

                            {/* Year Established */}
                            <div>
                                <label htmlFor="establishedYear" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Tahun Berdiri
                                </label>
                                <input
                                    id="establishedYear"
                                    name="establishedYear"
                                    type="number"
                                    autoComplete="off"
                                    defaultValue={MOCK_MOSQUE.establishedYear || ''}
                                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-bold text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm"
                                    placeholder="Contoh: 1998"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* ── Location Section ── */}
                    <motion.section {...fadeUp} transition={{ delay: 0.2 }} className="bg-white/60 dark:bg-slate-800/30 backdrop-blur-lg rounded-[2rem] border border-white/40 dark:border-white/5 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100/80 dark:border-slate-700/30 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shadow-sm border border-blue-100/50 dark:border-blue-500/10">
                                <MapPin size={16} className="text-blue-500" />
                            </div>
                            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Lokasi & Peta
                            </h3>
                        </div>
                        <div className="p-5 space-y-5">
                            {/* Address */}
                            <div>
                                <label htmlFor="address" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Alamat Lengkap</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    autoComplete="street-address"
                                    defaultValue={MOCK_MOSQUE.address}
                                    rows={3}
                                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium text-slate-800 dark:text-white resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm leading-relaxed"
                                    placeholder="Jalan, Nomor, RT/RW, Kelurahan..."
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label htmlFor="city" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Kota / Kabupaten</label>
                                <div className="relative">
                                    <select
                                        id="city"
                                        name="city"
                                        autoComplete="address-level2"
                                        className="w-full appearance-none px-4 py-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-bold text-slate-800 dark:text-white text-sm"
                                    >
                                        <option>Kota Bogor</option>
                                        <option>Kab. Bogor</option>
                                        <option>DKI Jakarta</option>
                                        <option>Depok</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <ChevronRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Titik Peta</label>
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
                                            className="relative w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10 border-2 border-white dark:border-slate-800"
                                        >
                                            <MapPin size={24} fill="currentColor" />
                                        </motion.div>
                                    </div>
                                    <div className="text-center z-10">
                                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 block">Atur Lokasi di Peta</span>
                                    </div>
                                    {/* Arrow indicator */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={24} className="text-emerald-500" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div>
                                        <label htmlFor="latitude" className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-1 ml-1">Latitude</label>
                                        <div className="relative">
                                            <input id="latitude" name="latitude" type="text" disabled defaultValue="-6.5971469" className="w-full pl-3 pr-8 py-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl text-xs font-mono text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/50" />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="longitude" className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-1 ml-1">Longitude</label>
                                        <div className="relative">
                                            <input id="longitude" name="longitude" type="text" disabled defaultValue="106.8060388" className="w-full pl-3 pr-8 py-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl text-xs font-mono text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/50" />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        </div>
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
