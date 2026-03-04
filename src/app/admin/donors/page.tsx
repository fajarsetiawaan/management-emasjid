'use client';

import { useState } from 'react';
import { MOCK_DONORS } from '@/lib/mock-data';
import { Search, Phone, User, ExternalLink, Plus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DonorsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDonors = MOCK_DONORS.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pb-24 relative overflow-hidden font-sans">
            {/* Deep Ambient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
                <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[128px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
                <div className="px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Jamaah & Donatur</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bina relasi & apresiasi</p>
                    </div>

                    <div className="flex gap-2">
                        {/* Example Filter/Tools Button */}
                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Search Bar - Integrated into sticky header */}
                <div className="px-6 pb-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama jamaah atau donatur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 dark:text-white backdrop-blur-md shadow-inner transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </header>

            <main className="px-4 pt-6 relative z-10 space-y-8">
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <div className="sticky top-[140px] z-30 mb-4 ml-1 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-full shadow-sm border border-white/20 dark:border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <h2 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                Daftar Kontak
                            </h2>
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black px-1.5 rounded-md">
                                {filteredDonors.length}
                            </span>
                        </div>

                        {/* Add Button */}
                        <button className="group relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                                <Plus size={16} strokeWidth={3} />
                            </div>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {filteredDonors.map((donor) => (
                            <motion.div
                                key={donor.id}
                                variants={itemVariant}
                                whileTap={{ scale: 0.98 }}
                                className="group relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[1.5rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-white/50 dark:border-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-900/70"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-2xl flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-black shadow-inner border border-white/60 dark:border-slate-600/50 group-hover:from-blue-50 group-hover:to-blue-100 dark:group-hover:from-blue-900/30 dark:group-hover:to-blue-800/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                                            {getInitials(donor.name)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 truncate pr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {donor.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border
                                                    ${donor.type === 'DONATUR_TETAP'
                                                        ? 'bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50'
                                                        : 'bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700/50'}
                                                `}>
                                                    {donor.type === 'DONATUR_TETAP' ? 'Tetap' : 'Umum'}
                                                </span>
                                                <span className="text-slate-300 dark:text-slate-700 mx-0.5">•</span>
                                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                                                    Total: <span className="text-slate-700 dark:text-slate-300 font-bold">{formatRupiah(donor.totalDonated)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <a
                                        href={`https://wa.me/${donor.phone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:scale-110 active:scale-95 transition-all shadow-sm border border-emerald-100/50 dark:border-emerald-800/30"
                                    >
                                        <Phone size={18} className="drop-shadow-sm" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}

                        {filteredDonors.length === 0 && (
                            <div className="text-center py-12 text-slate-400 text-sm italic backdrop-blur-sm bg-white/30 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                Tidak ditemukan nama "{searchTerm}".
                            </div>
                        )}
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
