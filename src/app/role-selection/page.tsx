'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, Code2 } from 'lucide-react';

export default function RoleSelectionPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-300">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-sm relative z-10">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Pilih Peran</h1>
                    <p className="text-slate-500 dark:text-slate-400">Sesuaikan dengan kebutuhan Anda</p>
                </motion.div>

                <div className="space-y-4">
                    {/* Option 1: Admin */}
                    <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => router.push('/register/masjid')}
                        className="w-full p-5 text-left rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none hover:bg-white/80 dark:hover:bg-slate-800/80 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-sm">
                                <Building2 size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Pengurus Masjid</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">DKM, Admin, atau Petugas</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Kelola keuangan, surat, inventaris, dan kegiatan masjid dalam satu aplikasi.
                        </p>
                    </motion.button>

                    {/* Option 2: Developer */}
                    <motion.button
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => console.log('Developer mode clicked')}
                        className="w-full p-5 text-left rounded-3xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-slate-800/60 hover:scale-[1.02] active:scale-[0.98] transition-all group grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-sm">
                                <Code2 size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Developer API</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Integrasi & Custom App</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Akses API E-Masjid untuk mengembangkan solusi digital custom. (Segera Hadir)
                        </p>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
