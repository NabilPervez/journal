import { useState, useEffect } from 'react';

export interface HijriDate {
    year: number;
    month: number; // 0-indexed or 1-indexed? Intl doesn't easily give numeric month with name. I'll use 0.
    day: number;
    nameDay: string;
    nameMonth: string;
}

export function useHijriDate(date: Date = new Date(), offset: number = 0) {
    const [hijri, setHijri] = useState<HijriDate | null>(null);

    useEffect(() => {
        try {
            // Using Islamic Calendar (Umm al-Qura is common, or simplified 'islamic')
            const calendar = 'islamic-umalqura';
            const locale = 'en-u-ca-' + calendar;

            const format = new Intl.DateTimeFormat(locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
            });

            const parts = format.formatToParts(date);
            const getPart = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value || '';

            setHijri({
                year: parseInt(getPart('year')) || 1445,
                month: 0, // Placeholder
                day: parseInt(getPart('day')) || 1,
                nameDay: getPart('weekday'),
                nameMonth: getPart('month')
            });
        } catch (e) {
            console.error("Hijri conversion failed", e);
            setHijri(null);
        }
    }, [date, offset]);

    return hijri;
}
