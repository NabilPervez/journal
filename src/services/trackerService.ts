import { db } from '../db/db';
import type { IbadahLog } from '../db/schema';

type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const trackerService = {
    async getTrackerData(dateString: string): Promise<IbadahLog> {
        const entry = await db.ibadah_log.get(dateString);
        if (!entry) {
            return {
                dateString,
                fajr: null,
                dhuhr: null,
                asr: null,
                maghrib: null,
                isha: null,
                qiyam: false,
                duha: false,
                quranPagesRead: 0,
                fastingType: 'none',
            };
        }
        return entry;
    },

    async logPrayer(dateString: string, prayer: PrayerName, status: 0 | 1 | 2 | null) {
        const existing = await db.ibadah_log.get(dateString);
        const updates = { [prayer]: status } as Partial<IbadahLog>;

        if (existing) {
            await db.ibadah_log.update(dateString, updates);
        } else {
            await db.ibadah_log.put({
                dateString,
                fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null,
                qiyam: false, duha: false, quranPagesRead: 0, fastingType: 'none',
                ...updates
            });
        }
    },

    async logExtra(dateString: string, extra: 'qiyam' | 'duha', value: boolean) {
        const existing = await db.ibadah_log.get(dateString);
        const updates = { [extra]: value };

        if (existing) {
            await db.ibadah_log.update(dateString, updates);
        } else {
            await db.ibadah_log.put({
                dateString,
                fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null,
                qiyam: false, duha: false, quranPagesRead: 0, fastingType: 'none',
                ...updates
            });
        }
    },

    async logQuranPages(dateString: string, pages: number) {
        const existing = await db.ibadah_log.get(dateString);
        const updates = { quranPagesRead: pages };

        if (existing) {
            await db.ibadah_log.update(dateString, updates);
        } else {
            await db.ibadah_log.put({
                dateString,
                fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null,
                qiyam: false, duha: false, quranPagesRead: 0, fastingType: 'none',
                ...updates
            });
        }
    },

    async logFasting(dateString: string, type: 'none' | 'ramadan' | 'sunnah' | 'makeup') {
        const existing = await db.ibadah_log.get(dateString);
        const updates = { fastingType: type };

        if (existing) {
            await db.ibadah_log.update(dateString, updates);
        } else {
            await db.ibadah_log.put({
                dateString,
                fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null,
                qiyam: false, duha: false, quranPagesRead: 0, fastingType: 'none',
                ...updates
            });
        }
    },

    async getWeekData(startDate: string, endDate: string) {
        // Ensure startDate < endDate logic if needed, but dexie 'between' handles range if correctly ordered?
        // Actually dexie expects [lower, upper].
        return await db.ibadah_log.where('dateString').between(startDate, endDate, true, true).toArray();
    },

    calculateSpiritualHealth(logs: IbadahLog[]) {
        if (!logs || logs.length === 0) return 0;

        let totalPossible = 0;
        let score = 0;
        const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

        logs.forEach(log => {
            prayers.forEach(p => {
                const status = log[p];
                if (status !== null && status !== undefined) {
                    totalPossible += 2;
                    if (status === 2) score += 2;      // On time
                    else if (status === 1) score += 1; // Late
                }
            });
        });

        return totalPossible === 0 ? 0 : Math.round((score / totalPossible) * 100);
    }
};
