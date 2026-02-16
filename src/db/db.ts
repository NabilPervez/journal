import Dexie, { type Table } from 'dexie';
import type { JournalEntry, IbadahLog, UserSettings } from './schema';

export class DeenJournalDB extends Dexie {
    entries!: Table<JournalEntry, string>;
    ibadah_log!: Table<IbadahLog, string>;
    user_settings!: Table<UserSettings, string>;

    constructor() {
        super('DeenJournal_Local_DB');
        this.version(1).stores({
            entries: 'dateString, tags, isSealed',
            ibadah_log: 'dateString',
            user_settings: 'key'
        });
    }
}

export const db = new DeenJournalDB();
