export interface PrayerSchedule {
    imsak: string;
    subuh: string;
    terbit: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
}

export const getTodaySchedule = (): PrayerSchedule => {
    return {
        imsak: '04:30',
        subuh: '04:40',
        terbit: '06:00',
        dzuhur: '12:05',
        ashar: '15:15',
        maghrib: '18:10',
        isya: '19:20',
    };
};

export const getNextPrayer = () => {
    const schedule = getTodaySchedule();
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const times = [
        { name: 'Subuh', time: schedule.subuh },
        { name: 'Dzuhur', time: schedule.dzuhur },
        { name: 'Ashar', time: schedule.ashar },
        { name: 'Maghrib', time: schedule.maghrib },
        { name: 'Isya', time: schedule.isya },
    ];

    for (const prayer of times) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTime = hours * 60 + minutes;

        if (prayerTime > currentTime) {
            return {
                name: prayer.name,
                time: prayer.time,
                targetDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0)
            };
        }
    }

    // If all passed, next is Subuh tomorrow
    const [nextHours, nextMinutes] = schedule.subuh.split(':').map(Number);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(nextHours, nextMinutes, 0, 0);

    return {
        name: 'Subuh',
        time: schedule.subuh,
        targetDate: tomorrow
    };
};
