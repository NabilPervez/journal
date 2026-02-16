import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { DualDateDisplay } from './DualDateDisplay';
import { PromptBlock } from './PromptBlock';
import { InkCanvas } from './InkCanvas';
import { MoodSelector, type Mood } from './MoodSelector';
import { TagInput } from './TagInput';
import { SealButton } from './SealButton';
import { useJournalEntry } from '../../hooks/useJournalEntry';
import { useSound } from '../../hooks/useSound';
import { useDebounce } from '../../hooks/useDebounce';
import { journalService } from '../../services/journalService';
import type { JournalEntry } from '../../db/schema';
import { NameCard } from '../names/NameCard';

const promptsData = {
    morning: [
        "What is one intention for today?",
        "How can you serve others today?",
        "What attribute of Allah do you want to embody today?",
        "How will you prioritize your prayers today?",
        "Who needs your kindness today?",
        "What is one thing you want to achieve for your akhirah today?",
        "How can you improve your character today?",
        "What are you grateful for this morning?",
        "What is a sunnah you can revive today?",
        "How can you protect your heart today?"
    ],
    evening: [
        "How did you see Allah's mercy today?",
        "What is one thing you learned about yourself today?",
        "Did you feel closer to Allah today?",
        "What is a mistake you made, and how can you fix it?",
        "How did you spend your free time today?",
        "What are you grateful for tonight?",
        "Who did you help today?",
        "Did you control your anger today?",
        "How was your focus in prayer today?",
        "What do you want to ask forgiveness for?"
    ],
    friday: [
        "Reflect on Surah Kahf: Which story resonates with you today?",
        "What special dua are you making during the hour of response?",
        "How can you send more salawat on the Prophet (saw) today?",
        "What is a good deed you can do secretly today?",
        "How are you preparing for Jumu'ah?"
    ],
    ramadan: [
        "What hunger did you feel today mostly: food or spiritual?",
        "How did the Quran speak to you today?",
        "What is a bad habit you successfully avoided today?",
        "What is your special dua for iftar?",
        "How can you improve your tarawih/qiyam tonight?"
    ]
};

export function DailyPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    const { entry, isLoading, setEntry } = useJournalEntry(dateString);
    const [content, setContent] = useState('');
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [isSealed, setIsSealed] = useState(false);

    // Sound effects
    const playSealSound = useSound('/sounds/seal-entry.mp3');
    const playPageTurn = useSound('/sounds/page-turn.mp3');

    // Load Prompt Logic
    const generatePrompt = useCallback(() => {
        const hour = selectedDate.getHours();
        const day = selectedDate.getDay();
        let category: keyof typeof promptsData = 'morning';

        if (day === 5) category = 'friday';
        else if (hour >= 18) category = 'evening';

        const list = promptsData[category];
        const randomIndex = Math.floor(Math.random() * list.length);
        const newPrompt = list[randomIndex];
        setCurrentPrompt(newPrompt);
        return newPrompt;
    }, [selectedDate]);

    // Sync entry to local state
    useEffect(() => {
        if (entry) {
            setContent(entry.contentRaw || '');
            setIsSealed(entry.isSealed);
            if (entry.promptId) {
                setCurrentPrompt(entry.promptId);
            } else if (!currentPrompt) {
                generatePrompt();
            }
        } else if (!isLoading) {
            setContent('');
            setIsSealed(false);
            if (!currentPrompt) generatePrompt();
        }
    }, [entry, isLoading, dateString, generatePrompt]); // Added currentPrompt to deps

    const handleRefreshPrompt = () => {
        const newPrompt = generatePrompt();
        // Only save if entry exists to overwrite
        if (entry) {
            journalService.saveEntry({ dateString, promptId: newPrompt }).then(setEntry);
        }
    };

    // Debounced auto-save
    const debouncedContent = useDebounce(content, 2000);

    useEffect(() => {
        // Skip if loading or sealed
        if (isLoading || isSealed) return;

        // Skip if content matches entry (no changes)
        if (entry && debouncedContent === entry.contentRaw) return;

        // Skip if new entry and empty content (don't create blank entries)
        if (!entry && !debouncedContent.trim()) return;

        const save = async () => {
            const updated = await journalService.saveEntry({
                dateString,
                contentRaw: debouncedContent,
                promptId: currentPrompt,
                wordCount: debouncedContent.trim().split(/\s+/).filter(Boolean).length
            });
            setEntry(updated);
        };
        save();
    }, [debouncedContent, dateString, currentPrompt, isSealed, isLoading]);

    const handleSeal = async () => {
        playSealSound();
        await journalService.sealEntry(dateString);
        setIsSealed(true);
        setEntry((prev: JournalEntry | null) => prev ? { ...prev, isSealed: true } : null);
    };

    const handleDateChange = (direction: 'prev' | 'next') => {
        playPageTurn();
        const newDate = direction === 'next' ? addDays(selectedDate, 1) : subDays(selectedDate, 1);
        setSelectedDate(newDate);
        setCurrentPrompt(''); // Reset prompt to trigger regeneration
    };

    // Calculate word count for UI
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    if (isLoading && !entry) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
        </div>
    );

    return (
        <motion.div
            key={dateString}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto pb-32"
        >
            {/* Header with Date & Nav */}
            <div className="flex items-center justify-between mb-8 sticky top-0 z-30 bg-midnight/95 backdrop-blur py-4 -mx-4 px-4 md:static md:bg-transparent md:p-0 border-b border-slate-800 md:border-0 shadow-lg md:shadow-none">
                <button
                    onClick={() => handleDateChange('prev')}
                    className="text-slate-400 hover:text-gold p-2 rounded-full hover:bg-slate-800 transition-colors"
                >
                    ←
                </button>
                <DualDateDisplay date={selectedDate} />
                <button
                    onClick={() => handleDateChange('next')}
                    className="text-slate-400 hover:text-gold p-2 rounded-full hover:bg-slate-800 transition-colors"
                >
                    →
                </button>
            </div>

            {/* Name of Allah */}
            <div className="mb-8 px-2">
                <NameCard />
            </div>

            {/* Prompt */}
            <div className="mb-8 px-2">
                <PromptBlock
                    prompt={currentPrompt || "Loading prompt..."}
                    onRefresh={handleRefreshPrompt}
                    isLoading={isLoading}
                />
            </div>

            {/* Editor */}
            <div className="mb-8 relative px-2">
                <InkCanvas
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    isSealed={isSealed}
                    className="min-h-[60vh]"
                />

                {/* Seal Button */}
                <SealButton
                    onClick={handleSeal}
                    disabled={isSealed}
                    wordCount={wordCount}
                />
            </div>

            {/* Meta: Mood & Tags */}
            {!isSealed && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4"
                >
                    <div>
                        <h3 className="text-sm font-heading text-gold mb-4 uppercase tracking-widest pl-1 font-bold">How was your heart?</h3>
                        <MoodSelector
                            selectedMood={entry?.mood as Mood || 'neutral'}
                            onChange={(m: Mood) => {
                                setEntry((prev: JournalEntry | null) => prev ? { ...prev, mood: m } : null);
                                journalService.saveEntry({ dateString, mood: m });
                            }}
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-heading text-gold mb-4 uppercase tracking-widest pl-1 font-bold">Themes & Reflections</h3>
                        <TagInput
                            tags={entry?.tags || []}
                            onChange={(t: string[]) => {
                                setEntry((prev: JournalEntry | null) => prev ? { ...prev, tags: t } : null);
                                journalService.saveEntry({ dateString, tags: t });
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
