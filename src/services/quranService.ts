import { db } from '../db/db';
import type { QuranLog } from '../db/schema';
import quranData from '../data/quran.json';

export interface QuranVerse {
    surah_number: number;
    ayah_number: number;
    text_ar: string;
    text_en: string; // Translation
    search_tokens: string[];
}

export const quranService = {
    // --- Quran Content ---

    async searchVerses(query: string): Promise<QuranVerse[]> {
        if (!query) return [];
        const q = query.toLowerCase();

        // Basic search implementation
        // Optimisation: use FlexSearch or similar if dataset grows large
        const results = (quranData as unknown as QuranVerse[]).filter(v =>
            v.text_en.toLowerCase().includes(q) ||
            v.search_tokens.some(t => t.toLowerCase().includes(q)) ||
            // Allow searching "2:255"
            `${v.surah_number}:${v.ayah_number}`.includes(q)
        );
        return results.slice(0, 50); // Limit results
    },

    async getVerse(surah: number, ayah: number): Promise<QuranVerse | undefined> {
        return (quranData as unknown as QuranVerse[]).find(v =>
            v.surah_number === surah && v.ayah_number === ayah
        );
    },

    async getSurahVerses(surah: number): Promise<QuranVerse[]> {
        return (quranData as unknown as QuranVerse[]).filter(v => v.surah_number === surah);
    },

    // --- SOAP Reflections ---

    async saveReflection(log: Omit<QuranLog, 'id'>) {
        // Validate schema if needed
        return await db.quran_logs.add(log);
    },

    async getReflections(dateString?: string) {
        if (dateString) {
            return await db.quran_logs.where('dateString').equals(dateString).toArray();
        }
        return await db.quran_logs.orderBy('createdAt').reverse().toArray();
    },

    async deleteReflection(id: number) {
        await db.quran_logs.delete(id);
    }
};
