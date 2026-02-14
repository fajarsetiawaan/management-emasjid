'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function PendingApprovalPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
            </div>

            <div className="w-full max-w-sm relative z-10 text-center">

                <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-black/20">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-inner"
                    >
                        <Clock size={48} strokeWidth={2} />
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight"
                    >
                        Pendaftaran Berhasil!
                    </motion.h1>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 text-sm"
                    >
                        <p className="mb-4">Masjid Anda sedang dalam proses verifikasi oleh tim kami.</p>
                        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-3 mb-4 border border-white/40 dark:border-white/5">
                            <span className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Estimasi</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">1-2 Hari Kerja</span>
                        </div>
                        <p className="text-xs">Anda akan menerima notifikasi via email & WhatsApp setelah disetujui.</p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 mb-8 text-left"
                    >
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Tracking Status</p>
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Status</span>
                            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800/50">PENDING REVIEW</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                            <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Ref ID</span>
                            <span className="font-mono text-slate-800 dark:text-slate-200 text-xs tracking-wide">MSJ-2025-00142</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link href="/login" className="block w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xl shadow-slate-900/20 dark:shadow-white/5 active:scale-95">
                            Kembali ke Login
                        </Link>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
