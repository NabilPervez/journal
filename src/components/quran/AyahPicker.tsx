import { useState, useEffect } from 'react';
import { quranService, type QuranVerse } from '../../services/quranService';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface AyahPickerProps {
    onSelect: (verse: QuranVerse) => void;
}

export function AyahPicker({ onSelect }: AyahPickerProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<QuranVerse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const search = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const hits = await quranService.searchVerses(query);
                setResults(hits);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(search, 300); // 300ms debounce
        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Quran (e.g. 'mercy', '2:255')..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-starlight placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                />
            </div>

            <div className="min-h-[100px] relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">Searching...</div>
                )}

                {!loading && query.length >= 2 && results.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">No verses found. Try a different keyword.</div>
                )}

                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {results.map(v => (
                        <motion.button
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={`${v.surah_number}:${v.ayah_number}`}
                            onClick={() => {
                                onSelect(v);
                                setQuery(''); // Clear search on select? Optional.
                                setResults([]);
                            }}
                            className="w-full text-left p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/80 border border-slate-700/30 hover:border-gold/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gold font-bold text-xs bg-gold/10 px-2 py-0.5 rounded-full">{v.surah_number}:{v.ayah_number}</span>
                                <span className="font-arabic text-xl text-right dir-rtl text-starlight leading-relaxed w-2/3">{v.text_ar}</span>
                            </div>
                            <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{v.text_en}</p>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
