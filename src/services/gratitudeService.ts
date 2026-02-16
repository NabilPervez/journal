import { db } from '../db/db';
import type { GratitudeEntry } from '../db/schema';

export const gratitudeService = {
    async addEntry(entry: Omit<GratitudeEntry, 'id'>) {
        return await db.gratitude_logs.add(entry);
    },

    async getEntries(limit = 100) {
        return await db.gratitude_logs.orderBy('createdAt').reverse().limit(limit).toArray();
    },

    async deleteEntry(id: number) {
        return await db.gratitude_logs.delete(id);
    }
};
