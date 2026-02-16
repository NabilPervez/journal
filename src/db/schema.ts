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

export interface QuranLog {
    id?: number;              // Auto increment ID (Dexie manages this)
    dateString: string;       // Index: "YYYY-MM-DD"
    surahNumber: number;
    ayahNumber: number;
    verseText: string;        // Snapshot of the verse text
    reflectionContent: {
        observation: string;
        application: string;
        prayer: string;
    };
    tags: string[];
    createdAt: number;
}

// Phase 4.4 Gratitude
export interface GratitudeEntry {
    id?: number;
    dateString: string;
    content: string;
    category?: string; // e.g. Name of Allah
    createdAt: number;
}
