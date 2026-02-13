import { getTodaySchedule } from './prayer';

export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
}

export async function getPrayerTimes(city: string, coords?: { lat: number; lng: number }): Promise<PrayerTimes | null> {
    try {
        let url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=20`;

        if (coords) {
            url = `https://api.aladhan.com/v1/timings?latitude=${coords.lat}&longitude=${coords.lng}&method=20`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch prayer times');
        }

        const data = await response.json();
        return data.data.timings;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        // Fallback to mock data if offline or API fails
        const mock = getTodaySchedule();
        return {
            Fajr: mock.subuh,
            Sunrise: mock.terbit,
            Dhuhr: mock.dzuhur,
            Asr: mock.ashar,
            Maghrib: mock.maghrib,
            Isha: mock.isya,
        };
    }
}
