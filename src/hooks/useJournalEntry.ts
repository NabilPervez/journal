import { useState, useEffect, useCallback } from 'react';
import { journalService } from '../services/journalService';
import type { JournalEntry } from '../db/schema';

export function useJournalEntry(dateString: string) {
    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);
        journalService.getEntry(dateString)
            .then(data => {
                if (mounted) {
                    setEntry(data || null);
                    setIsLoading(false);
                }
            })
            .catch(err => {
                if (mounted) {
                    setError(err as Error);
                    setIsLoading(false);
                }
            });
        return () => { mounted = false; };
    }, [dateString]);

    const save = useCallback(async (content: string) => {
        setIsSaving(true);
        try {
            const updated = await journalService.saveEntry({
                dateString,
                contentRaw: content,
                wordCount: content.trim().split(/\s+/).filter(Boolean).length
            });
            setEntry(updated);
            setIsSaving(false);
        } catch (err) {
            setError(err as Error);
            setIsSaving(false);
        }
    }, [dateString]);

    return { entry, isLoading, isSaving, error, save };
}
