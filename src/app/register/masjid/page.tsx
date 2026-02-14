'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Upload,
    Image as ImageIcon,
    Eye,
    EyeOff,
    Check
} from 'lucide-react';

const STEPS = [
    { id: 1, title: "Data Masjid" },
    { id: 2, title: "Kontak & Lokasi" },
    { id: 3, title: "Upload Dokumen" },
    { id: 4, title: "Data Ketua" }
];

export default function RegistrationWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);

    // Mock Form State
    const [formData, setFormData] = useState({
        // Step 1
        name: '',
        address: '',
        province: '',
        city: '',
        postalCode: '',
        // Step 2
        phone: '',
        email: '',
        // Step 4
        adminName: '',
        adminPhone: '',
        adminEmail: '',
        adminPassword: '',
        adminConfirmPassword: '',
        agreed: false
    });

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            // Submit logic -> Go to OTP
            router.push('/verify-otp');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        } else {
            router.back();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pb-24 transition-colors duration-300 relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none fixed">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-400/10 dark:bg-emerald-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            {/* Header / Progress Bar */}
            <div className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 px-6 py-4 shadow-sm">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={handleBack} className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-sm font-bold text-slate-800 dark:text-white tracking-wide">
                            Langkah {currentStep} dari 4
                        </span>
                        <div className="w-8" /> {/* Spacer for centering */}
                    </div>
                    {/* Progress Indicator */}
                    <div className="flex gap-2">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step.id <= currentStep
                                        ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                        : 'bg-slate-200/50 dark:bg-slate-800/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                            {STEPS[currentStep - 1].title}
                        </h2>

                        {/* Card Container for Inputs */}
                        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg border border-white/40 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5">

                            {currentStep === 1 && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Nama Masjid *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 hover:bg-white/80 dark:hover:bg-slate-800/80 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Contoh: Masjid Raya Al-Falah"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Alamat Lengkap *</label>
                                        <textarea
                                            rows={3}
                                            className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 hover:bg-white/80 dark:hover:bg-slate-800/80 outline-none transition-all resize-none placeholder:text-slate-400"
                                            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Provinsi</label>
                                            <select className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all appearance-none cursor-pointer">
                                                <option>Pilih...</option>
                                                <option>DKI Jakarta</option>
                                                <option>Jawa Barat</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Kota/Kab</label>
                                            <select className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all appearance-none cursor-pointer">
                                                <option>Pilih...</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Kode Pos</label>
                                        <input
                                            type="number"
                                            className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 hover:bg-white/80 dark:hover:bg-slate-800/80 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Contoh: 12345"
                                        />
                                    </div>
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">No. Telepon Masjid</label>
                                            <input
                                                type="tel"
                                                className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                                placeholder="021-xxxxxxx"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Masjid (Optional)</label>
                                            <input
                                                type="email"
                                                className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                                placeholder="info@masjid...com"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">Pin Lokasi</label>
                                        <div className="aspect-video bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden relative group cursor-pointer border-2 border-dashed border-slate-300/50 dark:border-slate-700/50 hover:border-emerald-500 transition-colors">
                                            <MapPin size={32} className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors" />
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Klik untuk buka Google Maps</span>
                                        </div>
                                        <button className="mt-4 w-full py-3.5 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition-colors flex items-center justify-center gap-2">
                                            <MapPin size={16} />
                                            Gunakan Lokasi Saat Ini
                                        </button>
                                    </div>
                                </>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
                                            Foto/Scan Akta Pendirian <span className="text-slate-400 dark:text-slate-600 font-normal normal-case ml-1">(Optional)</span>
                                        </label>
                                        <div className="border-2 border-dashed border-slate-300/60 dark:border-slate-700/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all bg-slate-50/30 dark:bg-slate-800/20">
                                            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                                                <Upload size={24} />
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Dokumen</span>
                                                <span className="block text-xs text-slate-400 mt-1">Max 5MB (PDF/JPG)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
                                            Foto Masjid <span className="text-slate-400 dark:text-slate-600 font-normal normal-case ml-1">(Optional, Minimal 1)</span>
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            <div className="aspect-square bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300/60 dark:border-slate-700/60 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors text-slate-400 hover:text-emerald-500">
                                                <ImageIcon size={24} />
                                            </div>
                                            <div className="aspect-square bg-slate-100/30 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-800/50"></div>
                                            <div className="aspect-square bg-slate-100/30 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-800/50"></div>
                                            <div className="aspect-square bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl border-2 border-dashed border-emerald-500/30 flex items-center justify-center cursor-pointer text-emerald-500">
                                                <Check size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {currentStep === 4 && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Nama Lengkap Ketua *</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Sesuai KTP"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">No. HP (WhatsApp) *</label>
                                        <input
                                            type="tel"
                                            className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Ketua *</label>
                                        <input
                                            type="email"
                                            className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="email@pribadi.com"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Password *</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all pr-12 placeholder:text-slate-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Konfirmasi Password *</label>
                                        <input
                                            type="password"
                                            className="w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex items-start gap-3 mt-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                        <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                                        <label className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                            Saya menyetujui <span className="text-emerald-600 dark:text-emerald-400 font-bold">Syarat & Ketentuan</span> serta <span className="text-emerald-600 dark:text-emerald-400 font-bold">Kebijakan Privasi</span> yang berlaku.
                                        </label>
                                    </div>
                                </>
                            )}

                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Fixed Bottom Action with Glass Effect */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-t border-white/20 dark:border-white/5 safe-area-bottom z-50">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleNext}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span>{currentStep === 4 ? 'Daftar Sekarang' : 'Selanjutnya'}</span>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
