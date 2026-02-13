import { useState, useEffect } from 'react';
import { PrayerTimes } from '@/lib/prayer-service';

export function usePrayerCountdown(timings: PrayerTimes | null) {
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; remaining: string } | null>(null);
    const [activePrayer, setActivePrayer] = useState<string | null>(null);

    useEffect(() => {
        if (!timings) return;

        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

            const prayerList = [
                { name: 'Subuh', time: timings.Fajr },
                { name: 'Terbit', time: timings.Sunrise }, // Often skipped for logic, but good for display
                { name: 'Dzuhur', time: timings.Dhuhr },
                { name: 'Ashar', time: timings.Asr },
                { name: 'Maghrib', time: timings.Maghrib },
                { name: 'Isya', time: timings.Isha },
            ];

            // Filter out Sunrise if we only want 5 prayers for "next prayer" logic, 
            // but user asked for Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha in filtering. 
            // Usually "Terbit" is not a prayer time you countdown to for prayer, but let's keep it if requested or handle it.
            // For now, let's treat it as a mapped time but maybe not the "Next Prayer" unless specifically desired.
            // Let's stick to standard 5 prayers + Syuruq/Terbit for display.

            let foundNext = false;
            let currentActive = null;

            for (let i = 0; i < prayerList.length; i++) {
                const p = prayerList[i];
                const [h, m] = p.time.split(':').map(Number);
                const pTime = h * 60 + m;
                const pSeconds = h * 3600 + m * 60;

                if (pTime > currentTime) {
                    // This is the next prayer
                    const diffSeconds = pSeconds - currentSeconds;
                    const hours = Math.floor(diffSeconds / 3600);
                    const minutes = Math.floor((diffSeconds % 3600) / 60);
                    const seconds = diffSeconds % 60;

                    setNextPrayer({
                        name: p.name,
                        time: p.time,
                        remaining: `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
                    });
                    foundNext = true;

                    // The one before this (if any) is the active one
                    if (i > 0) {
                        currentActive = prayerList[i - 1].name;
                    } else {
                        // If next is Subuh, active could be nothing or Isya from yesterday (conceptually)
                        currentActive = 'Isya'; // Assuming before Subuh is Isya time
                    }
                    break;
                }
            }

            if (!foundNext) {
                // Next is Subuh tomorrow
                const [h, m] = timings.Fajr.split(':').map(Number);
                // Seconds until midnight + seconds of Fajr
                const secondsInDay = 24 * 3600;
                const fajrSeconds = h * 3600 + m * 60;
                const diffSeconds = (secondsInDay - currentSeconds) + fajrSeconds;

                const hours = Math.floor(diffSeconds / 3600);
                const minutes = Math.floor((diffSeconds % 3600) / 60);
                const seconds = diffSeconds % 60;

                setNextPrayer({
                    name: 'Subuh',
                    time: timings.Fajr,
                    remaining: `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
                });

                // If passed Isya
                currentActive = 'Isya';
            }

            setActivePrayer(currentActive);

        }, 1000);

        return () => clearInterval(interval);
    }, [timings]);

    return { nextPrayer, activePrayer };
}
