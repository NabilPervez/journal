import Dexie, { type Table } from 'dexie';
import type { JournalEntry, IbadahLog, UserSettings, QuranLog, GratitudeEntry } from './schema';

export class DeenJournalDB extends Dexie {
    entries!: Table<JournalEntry, string>;
    ibadah_log!: Table<IbadahLog, string>;
    user_settings!: Table<UserSettings, string>;
    quran_logs!: Table<QuranLog, number>; // ID is number
    gratitude_logs!: Table<GratitudeEntry, number>;

    constructor() {
        super('DeenJournal_Local_DB');

        // Version 1: Initial Schema
        this.version(1).stores({
            entries: 'dateString, tags, isSealed',
            ibadah_log: 'dateString',
            user_settings: 'key'
        });

        // Version 2: Add Quran & Gratitude tables
        this.version(2).stores({
            entries: 'dateString, tags, isSealed',
            ibadah_log: 'dateString', // Keep existing
            user_settings: 'key',     // Keep existing
            quran_logs: '++id, dateString, [surahNumber+ayahNumber], tags',
            gratitude_logs: '++id, dateString, category'
        });
    }
}

export const db = new DeenJournalDB();
