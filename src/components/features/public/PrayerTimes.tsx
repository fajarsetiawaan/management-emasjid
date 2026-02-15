'use client';

import { useState, useEffect } from 'react';
import { MapPin, Moon, Sun, Sunrise, CloudSun } from 'lucide-react';
import { motion } from 'framer-motion';
import { getNextPrayer, getTodaySchedule } from '@/lib/prayer';

export default function PrayerTimes() {
    const [nextPrayer, setNextPrayer] = useState(getNextPrayer());
    const [countdown, setCountdown] = useState('');
    const schedule = getTodaySchedule();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const diff = nextPrayer.targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                // Refresh next prayer when time is up
                setNextPrayer(getNextPrayer());
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(
                `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [nextPrayer]);

    const timelineItems = [
        { name: 'Subuh', time: schedule.subuh, icon: CloudSun },
        { name: 'Dzuhur', time: schedule.dzuhur, icon: Sun },
        { name: 'Ashar', time: schedule.ashar, icon: Sun },
        { name: 'Maghrib', time: schedule.maghrib, icon: Moon },
        { name: 'Isya', time: schedule.isya, icon: Moon },
    ];

    return (
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white pb-6 pt-24 rounded-b-3xl shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Hero Section */}
            <div className="text-center relative z-10 mb-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-medium text-emerald-100/80 uppercase tracking-widest mb-2"
                >
                    Menuju Waktu {nextPrayer.name}
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-mono text-5xl font-bold tracking-tight mb-4 drop-shadow-md"
                >
                    {countdown || "00 : 00 : 00"}
                </motion.div>

                <div className="flex items-center justify-center gap-2 text-emerald-100/90 bg-white/10 w-fit mx-auto px-4 py-1.5 rounded-full backdrop-blur-sm">
                    <MapPin size={14} />
                    <span className="text-xs font-semibold">Jakarta Pusat</span>
                </div>
            </div>

            {/* Timeline Scroll */}
            <div className="flex overflow-x-auto gap-3 px-4 no-scrollbar pb-2 snap-x">
                {timelineItems.map((item, index) => {
                    const isActive = item.name === nextPrayer.name;

                    return (
                        <div
                            key={item.name}
                            className={`flex-shrink-0 min-w-[85px] flex flex-col items-center p-3 rounded-2xl transition-all duration-300 snap-center
                                ${isActive
                                    ? 'bg-white text-emerald-800 shadow-lg scale-105 ring-4 ring-white/20'
                                    : 'bg-white/10 text-emerald-50'
                                }
                            `}
                        >
                            <span className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                {item.name}
                            </span>
                            <div className="mb-2">
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                            </div>
                            <span className="text-sm font-bold font-mono">
                                {item.time}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
