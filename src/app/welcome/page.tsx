'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Users, ShieldCheck, ChevronRight, ArrowRight } from 'lucide-react';

const SLIDES = [
    {
        id: 1,
        title: "Transparansi Keuangan",
        desc: "Catat dan laporkan keuangan masjid dengan mudah, akurat, dan dapat diakses oleh jamaah secara realtime.",
        icon: <Wallet size={48} className="text-emerald-500 drop-shadow-sm" />,
    },
    {
        id: 2,
        title: "Kolaborasi Tim Pengurus",
        desc: "Kelola tugas, jadwal imam/muadzin, dan kegiatan masjid bersama seluruh pengurus dalam satu aplikasi.",
        icon: <Users size={48} className="text-blue-500 drop-shadow-sm" />,
    },
    {
        id: 3,
        title: "Terpercaya & Amanah",
        desc: "Bangun kepercayaan jamaah dengan pelaporan yang transparan dan pengelolaan data yang aman.",
        icon: <ShieldCheck size={48} className="text-orange-500 drop-shadow-sm" />,
    }
];

export default function WelcomePage() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            router.push('/role-selection');
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between overflow-hidden transition-colors duration-300">

            {/* Background Gradients for Glassmorphism Context */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Content Container with Glass Effect */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-sm text-center"
                    >
                        <div className="mb-8 relative">
                            {/* Icon Container with Glass Effect */}
                            <div className="w-24 h-24 mx-auto bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/10">
                                {SLIDES[currentSlide].icon}
                            </div>
                        </div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
                        >
                            {SLIDES[currentSlide].title}
                        </motion.h2>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg"
                        >
                            {SLIDES[currentSlide].desc}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Navigation with Glass Effect */}
            <div className="p-8 relative z-10 shrink-0">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    {/* Page Indicators */}
                    <div className="flex gap-2">
                        {SLIDES.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'w-8 bg-emerald-500 shadow-md shadow-emerald-500/20'
                                        : 'w-2 bg-slate-300 dark:bg-slate-700'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={handleNext}
                        className="w-14 h-14 bg-white/40 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-full flex items-center justify-center text-slate-900 dark:text-white hover:bg-white/60 dark:hover:bg-white/20 active:scale-95 transition-all shadow-lg"
                    >
                        {currentSlide === SLIDES.length - 1 ? (
                            <ArrowRight size={24} strokeWidth={2.5} />
                        ) : (
                            <ChevronRight size={28} />
                        )}
                    </button>
                </div>

                {/* Skip Button */}
                {currentSlide < SLIDES.length - 1 && (
                    <button
                        onClick={() => router.push('/role-selection')}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        Lewati
                    </button>
                )}
            </div>
        </div>
    );
}
