import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AyahPicker } from './AyahPicker';
import { SoapInput, type SoapData } from './SoapInput';
import { quranService, type QuranVerse } from '../../services/quranService';
import type { QuranLog } from '../../db/schema';
import { Trash2, Plus, Book, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function QuranPage() {
    const [selectedVerse, setSelectedVerse] = useState<QuranVerse | null>(null);
    const [reflections, setReflections] = useState<QuranLog[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadReflections();
    }, []);

    const loadReflections = () => {
        quranService.getReflections().then(setReflections);
    };

    const handleSave = async (data: SoapData) => {
        setIsLoading(true);
        try {
            await quranService.saveReflection({
                dateString: format(new Date(), 'yyyy-MM-dd'),
                surahNumber: data.verse.surah_number,
                ayahNumber: data.verse.ayah_number,
                verseText: data.verse.text_en.substring(0, 200), // Snapshot
                reflectionContent: {
                    observation: data.observation,
                    application: data.application,
                    prayer: data.prayer
                },
                tags: [],
                createdAt: Date.now()
            });
            loadReflections();
            setIsCreating(false);
            setSelectedVerse(null);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this reflection?')) {
            await quranService.deleteReflection(id);
            loadReflections();
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-32 px-4 pt-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-heading text-gold mb-1">Quran Study</h1>
                    <p className="text-slate-400 text-sm">Reflect on the words of Allah using the S.O.A.P. method.</p>
                </div>
                {/* New Entry Button logic inside list view? */}
            </div>

            <AnimatePresence mode="wait">
                {isCreating ? (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                            <h2 className="font-heading text-xl text-starlight">New Reflection</h2>
                            <button onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-crimson">Cancel</button>
                        </div>

                        {!selectedVerse ? (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">Select a Verse</p>
                                <AyahPicker onSelect={(v) => setSelectedVerse(v)} />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <button onClick={() => setSelectedVerse(null)} className="text-xs text-gold/80 hover:text-gold uppercase tracking-wider mb-2">← Change Verse</button>
                                <SoapInput
                                    verse={selectedVerse}
                                    onSave={handleSave}
                                    isLoading={isLoading}
                                />
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* Add New Button Card */}
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full p-6 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/10 hover:bg-slate-800/30 hover:border-gold/30 hover:text-gold text-slate-500 transition-all flex flex-col items-center justify-center gap-3 group"
                        >
                            <div className="p-3 rounded-full bg-slate-800 group-hover:bg-gold/10 transition-colors">
                                <Plus size={24} />
                            </div>
                            <span className="font-medium">Start a New Reflection</span>
                        </button>

                        {/* List */}
                        <div className="space-y-4">
                            {reflections.length === 0 && (
                                <div className="text-center py-12 text-slate-500">
                                    <Book size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No reflections yet. Use the S.O.A.P. method to document your Quran study journey.</p>
                                </div>
                            )}

                            {reflections.map(log => (
                                <motion.div
                                    key={log.id}
                                    layoutId={`log-${log.id}`}
                                    className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors relative group"
                                >
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(log.id!); }}
                                            className="text-slate-600 hover:text-crimson p-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4 text-xs tracking-wider text-slate-500">
                                        <span className="bg-slate-800 px-2 py-1 rounded text-gold font-bold">
                                            {log.surahNumber}:{log.ayahNumber}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {format(log.createdAt, 'MMM d, yyyy')}
                                        </span>
                                    </div>

                                    <p className="font-serif text-lg text-starlight leading-relaxed mb-4 pl-4 border-l-2 border-gold/20 pr-8 line-clamp-2">
                                        "{log.verseText}"
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
                                        {log.reflectionContent.observation && (
                                            <div>
                                                <strong className="text-indigo-400/80 block mb-1 uppercase tracking-widest text-[10px]">Observation</strong>
                                                <p className="line-clamp-2">{log.reflectionContent.observation}</p>
                                            </div>
                                        )}
                                        {log.reflectionContent.application && (
                                            <div>
                                                <strong className="text-amber-400/80 block mb-1 uppercase tracking-widest text-[10px]">Application</strong>
                                                <p className="line-clamp-2">{log.reflectionContent.application}</p>
                                            </div>
                                        )}
                                        {log.reflectionContent.prayer && (
                                            <div>
                                                <strong className="text-emerald-400/80 block mb-1 uppercase tracking-widest text-[10px]">Prayer</strong>
                                                <p className="line-clamp-2">{log.reflectionContent.prayer}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
