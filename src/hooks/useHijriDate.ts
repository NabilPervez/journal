import { useState, useEffect } from 'react';
// @ts-expect-error - hijri-date-converter is not typed
import toHijri from 'hijri-date-converter';

export interface HijriDate {
    year: number;
    month: number;
    day: number;
    nameDay: string;
    nameMonth: string;
}

export function useHijriDate(date: Date = new Date(), offset: number = 0) {
    const [hijri, setHijri] = useState<HijriDate | null>(null);

    useEffect(() => {
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();

        // The library conversion
        const h = toHijri(y, m, d);

        // Apply offset logic here if needed (skipping complex calendar math for MVP)
        // Providing raw conversion for now.

        setHijri({
            year: h.year,
            month: h.month,
            day: h.day,
            nameDay: h.nameDay,
            nameMonth: h.nameMonth
        });
    }, [date, offset]);

    return hijri;
}
