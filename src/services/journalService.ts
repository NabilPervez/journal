import { db } from '../db/db';
import type { JournalEntry } from '../db/schema';

export const journalService = {
    async getEntry(dateString: string): Promise<JournalEntry | undefined> {
        return await db.entries.get(dateString);
    },

    async saveEntry(entry: Partial<JournalEntry> & { dateString: string }) {
        const existing = await this.getEntry(entry.dateString);
        const now = Date.now();

        const newEntry: JournalEntry = {
            dateString: entry.dateString,
            hijriDate: entry.hijriDate || existing?.hijriDate || '',
            contentRaw: entry.contentRaw || existing?.contentRaw || '',
            contentHtml: entry.contentHtml || existing?.contentHtml || '',
            promptId: entry.promptId || existing?.promptId,
            tags: entry.tags || existing?.tags || [],
            mood: entry.mood || existing?.mood || 'neutral',
            wordCount: entry.wordCount || existing?.wordCount || 0,
            isSealed: existing?.isSealed || false,
            lastModified: now,
            syncedToBackup: false,
        };

        await db.entries.put(newEntry);
        return newEntry;
    },

    async sealEntry(dateString: string) {
        const entry = await this.getEntry(dateString);
        if (!entry) throw new Error('Entry not found');
        if (entry.wordCount < 10) throw new Error('Entry too short to seal');

        await db.entries.update(dateString, { isSealed: true, lastModified: Date.now(), syncedToBackup: false });
    },

    async searchEntries(query: string) {
        const lowerQuery = query.toLowerCase();
        return await db.entries
            .filter(e => e.contentRaw.toLowerCase().includes(lowerQuery) || e.tags.some(t => t.toLowerCase().includes(lowerQuery)))
            .toArray();
    },

    async getAllEntries() {
        return await db.entries.orderBy('dateString').reverse().toArray();
    },

    async updateTags(dateString: string, tags: string[]) {
        await db.entries.update(dateString, { tags, lastModified: Date.now(), syncedToBackup: false });
    }
};
