import { useState, useCallback, useEffect } from 'react';
import { trackerService } from '../services/trackerService';
import type { IbadahLog } from '../db/schema';

type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export function useTracker(dateString: string) {
    const [data, setData] = useState<IbadahLog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Logic
    useEffect(() => {
        let mounted = true;
        setIsLoading(true);
        trackerService.getTrackerData(dateString).then(log => {
            if (mounted) {
                setData(log);
                setIsLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [dateString]);

    // Update Logic
    const updateLog = useCallback(async (updates: Partial<IbadahLog>) => {
        // Optimistic UI Update
        setData(prev => prev ? { ...prev, ...updates } : null);

        // Persist to DB
        try {
            const keys = Object.keys(updates) as (keyof IbadahLog)[];

            // We use Promise.all to handle multiple updates if passed, though usually single field
            await Promise.all(keys.map(async (key) => {
                const val = updates[key];
                if (['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].includes(key)) {
                    await trackerService.logPrayer(dateString, key as PrayerName, val as any);
                } else if (['qiyam', 'duha'].includes(key)) {
                    await trackerService.logExtra(dateString, key as 'qiyam' | 'duha', val as boolean);
                } else if (key === 'quranPagesRead') {
                    await trackerService.logQuranPages(dateString, val as number);
                } else if (key === 'fastingType') {
                    await trackerService.logFasting(dateString, val as any);
                }
            }));
        } catch (e) {
            console.error("Failed to update tracker", e);
            // Revert? For now assume local db is reliable.
        }
    }, [dateString]);

    return { data, isLoading, updateLog };
}
