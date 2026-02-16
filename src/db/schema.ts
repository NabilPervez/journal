export interface JournalEntry {
    dateString: string;       // PK: "YYYY-MM-DD"
    hijriDate: string;        // "1445-04-12"
    contentRaw: string;
    contentHtml: string;
    promptId?: string;
    tags: string[];
    mood: 'peace' | 'struggle' | 'neutral' | 'high-imaan';
    wordCount: number;
    isSealed: boolean;
    lastModified: number;
    syncedToBackup: boolean;
}

export interface IbadahLog {
    dateString: string;       // PK
    fajr: 0 | 1 | 2 | null;
    dhuhr: 0 | 1 | 2 | null;
    asr: 0 | 1 | 2 | null;
    maghrib: 0 | 1 | 2 | null;
    isha: 0 | 1 | 2 | null;
    qiyam: boolean;
    duha: boolean;
    quranPagesRead: number;
    fastingType: 'none' | 'ramadan' | 'sunnah' | 'makeup';
}

export interface UserSettings {
    key: string;              // PK
    value: any;
}
