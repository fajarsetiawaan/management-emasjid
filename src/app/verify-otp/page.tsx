'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, RefreshCw, MailOpen } from 'lucide-react';

export default function OTPVerificationPage() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(59);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value !== '' && element.nextSibling) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            const prevInput = (e.target as HTMLInputElement).previousSibling as HTMLInputElement;
            if (prevInput) prevInput.focus();
        }
    };

    const handleVerify = () => {
        router.push('/pending-approval');
    };

    const handleResend = () => {
        setTimeLeft(59);
    };

    const filled = otp.every(digit => digit !== '');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-sm relative z-10 glass-card">
                <button
                    onClick={() => router.back()}
                    className="absolute top-0 left-0 -mt-16 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-black/20">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400 shadow-sm">
                        <MailOpen size={32} />
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verifikasi Email</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Kode verifikasi telah dikirim ke: <br />
                            <span className="font-bold text-slate-800 dark:text-slate-200">ketua@masjid-annur.com</span>
                        </p>
                    </div>

                    <div className="flex gap-2 justify-center mb-8">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                className="w-11 h-12 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 text-center text-xl font-bold text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                onFocus={e => e.target.select()}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={!filled}
                        className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${filled
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30 active:scale-95'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        Verifikasi
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-2">Tidak menerima kode?</p>
                        {timeLeft > 0 ? (
                            <span className="text-slate-400 text-xs font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                Kirim ulang dalam {timeLeft}s
                            </span>
                        ) : (
                            <button
                                onClick={handleResend}
                                className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center justify-center gap-1 mx-auto hover:underline"
                            >
                                <RefreshCw size={14} /> Kirim Ulang
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
