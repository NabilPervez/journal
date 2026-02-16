import { saveAs } from 'file-saver';
import { db } from '../db/db';
import { z } from 'zod';

// Zod Schemas matching our DB interfaces
const JournalEntrySchema = z.object({
    dateString: z.string(),
    hijriDate: z.string(),
    contentRaw: z.string(),
    contentHtml: z.string(),
    promptId: z.string().optional(),
    tags: z.array(z.string()),
    mood: z.enum(['peace', 'struggle', 'neutral', 'high-imaan']),
    wordCount: z.number(),
    isSealed: z.boolean(),
    lastModified: z.number(),
    syncedToBackup: z.boolean(),
});

const IbadahLogSchema = z.object({
    dateString: z.string(),
    fajr: z.union([z.literal(0), z.literal(1), z.literal(2), z.null()]),
    dhuhr: z.union([z.literal(0), z.literal(1), z.literal(2), z.null()]),
    asr: z.union([z.literal(0), z.literal(1), z.literal(2), z.null()]),
    maghrib: z.union([z.literal(0), z.literal(1), z.literal(2), z.null()]),
    isha: z.union([z.literal(0), z.literal(1), z.literal(2), z.null()]),
    qiyam: z.boolean(),
    duha: z.boolean(),
    quranPagesRead: z.number(),
    fastingType: z.enum(['none', 'ramadan', 'sunnah', 'makeup']),
});

export const BackupSchema = z.object({
    version: z.literal(1),
    exportDate: z.string(),
    entries: z.array(JournalEntrySchema),
    logs: z.array(IbadahLogSchema),
});

export type BackupData = z.infer<typeof BackupSchema>;

export const backupService = {
    async exportData() {
        const entries = await db.entries.toArray();
        const logs = await db.ibadah_log.toArray();

        // Minimal valid backup object
        const data = {
            version: 1,
            exportDate: new Date().toISOString(),
            entries,
            logs,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const filename = `deen_journal_backup_${new Date().toISOString().split('T')[0]}.json`;
        saveAs(blob, filename);
    },

    async validateBackup(file: File): Promise<BackupData> {
        const text = await file.text();
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            throw new Error('Invalid JSON file');
        }
        return BackupSchema.parse(json);
    },

    async restoreData(data: BackupData, strategy: 'merge' | 'overwrite') {
        if (strategy === 'overwrite') {
            await db.transaction('rw', db.entries, db.ibadah_log, async () => {
                await db.entries.clear();
                await db.ibadah_log.clear();
                await db.entries.bulkPut(data.entries);
                await db.ibadah_log.bulkPut(data.logs);
            });
        } else {
            // Smart Merge: Adds missing entries, keeps local version if conflict exists (ignores incoming).
            await db.transaction('rw', db.entries, db.ibadah_log, async () => {
                for (const entry of data.entries) {
                    const existing = await db.entries.get(entry.dateString);
                    if (!existing) {
                        await db.entries.add(entry);
                    }
                }
                for (const log of data.logs) {
                    const existing = await db.ibadah_log.get(log.dateString);
                    if (!existing) {
                        await db.ibadah_log.add(log);
                    }
                }
            });
        }
    }
};
