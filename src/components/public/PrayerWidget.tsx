'use client';

import { MapPin, Moon, Sun, CloudSun, Sunrise } from 'lucide-react';
import { motion } from 'framer-motion';
import { PrayerTimes } from '@/lib/prayer-service';
import { usePrayerCountdown } from '@/hooks/usePrayerCountdown';

interface PrayerWidgetProps {
    city: string;
    timings: PrayerTimes | null;
}

export default function PrayerWidget({ city, timings }: PrayerWidgetProps) {
    const { nextPrayer, activePrayer } = usePrayerCountdown(timings);
    const isLoading = !timings || !nextPrayer;

    const prayerList = [
        { name: 'Subuh', key: 'Fajr', icon: CloudSun },
        { name: 'Dzuhur', key: 'Dhuhr', icon: Sun },
        { name: 'Ashar', key: 'Asr', icon: Sun },
        { name: 'Maghrib', key: 'Maghrib', icon: Moon },
        { name: 'Isya', key: 'Isha', icon: Moon },
    ];

    return (
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white pb-6 pt-24 rounded-b-3xl shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Hero Section */}
            <div className="text-center relative z-10 mb-8 px-4 min-h-[140px] flex flex-col justify-center">
                {isLoading ? (
                    // Skeleton Loading
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-4 w-32 bg-white/20 rounded-full mb-4"></div>
                        <div className="h-12 w-64 bg-white/20 rounded-xl mb-4"></div>
                        <div className="h-6 w-24 bg-white/20 rounded-full"></div>
                    </div>
                ) : (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs font-medium text-emerald-100/80 uppercase tracking-widest mb-2"
                        >
                            Menuju Waktu {nextPrayer!.name}
                        </motion.div>

                        <motion.div
                            key={nextPrayer!.remaining} // Re-render for ticker effect if needed, or just let text update
                            initial={{ scale: 0.95, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="font-mono text-5xl font-bold tracking-tight mb-4 drop-shadow-md tabular-nums"
                        >
                            {nextPrayer!.remaining}
                        </motion.div>

                        <div className="flex items-center justify-center gap-2 text-emerald-100/90 bg-white/10 w-fit mx-auto px-4 py-1.5 rounded-full backdrop-blur-sm">
                            <MapPin size={14} />
                            <span className="text-xs font-semibold">{city}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Timeline (Centered & Clean) */}
            <div className="flex justify-center items-center gap-1.5 px-4 pb-6">
                {prayerList.map((item) => {
                    const time = timings ? timings[item.key] : '--:--';
                    const isActive = activePrayer === item.name;

                    return (
                        <div
                            key={item.key}
                            className={`flex-1 min-w-[60px] max-w-[80px] flex flex-col items-center py-3 px-1 rounded-2xl transition-all duration-300 relative group
                                ${isLoading ? 'animate-pulse bg-white/5' : ''}
                                ${isActive
                                    ? 'bg-white text-emerald-800 shadow-[0_10px_30px_rgba(0,0,0,0.15)] -translate-y-2 z-10'
                                    : 'hover:bg-white/10 text-emerald-100/70 hover:text-white'
                                }
                            `}
                        >
                            {/* Active Dot Indicator */}
                            {isActive && (
                                <div className="absolute top-1.5 w-1 h-1 bg-rose-500 rounded-full"></div>
                            )}

                            <span className={`text-[9px] font-bold mb-2 uppercase tracking-widest ${isActive ? 'opacity-100 text-emerald-900' : 'opacity-60'}`}>
                                {item.name}
                            </span>
                            <div className="mb-2">
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                            </div>
                            <span className="text-xs font-bold font-mono tracking-tight">
                                {time}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
