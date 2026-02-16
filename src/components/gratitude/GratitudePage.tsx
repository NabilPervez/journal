import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { gratitudeService } from '../../services/gratitudeService';
import type { GratitudeEntry } from '../../db/schema';
import { Button } from '../ui/Button'; // Assuming Button component exists
import TextareaAutosize from 'react-textarea-autosize';
import { Trash2, Heart, Sparkles } from 'lucide-react';

const categories = [
    'General',
    'Health',
    'Family',
    'Faith',
    'Work/Rizq',
    'Nature',
    'Personal Growth',
    'Al-Wahhab (The Giver)',
    'Al-Razzaq (The Provider)',
    'Al-Wadud (The Loving)'
];

export function GratitudePage() {
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [entries, setEntries] = useState<GratitudeEntry[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = () => {
        gratitudeService.getEntries().then(setEntries);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await gratitudeService.addEntry({
                dateString: format(new Date(), 'yyyy-MM-dd'),
                content: content.trim(),
                category,
                createdAt: Date.now()
            });
            setContent('');
            loadEntries();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Remove this blessing?')) {
            await gratitudeService.deleteEntry(id);
            loadEntries();
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-32 px-4 pt-6">
            <div className="text-center mb-10 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block"
                >
                    <div className="flex items-center justify-center gap-2 text-gold mb-2">
                        <Sparkles size={20} />
                        <span className="uppercase tracking-[0.2em] text-sm font-bold">Al-Hamdulillah</span>
                        <Sparkles size={20} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading text-starlight mb-4">Count Your Blessings</h1>
                    <p className="text-slate-400 max-w-md mx-auto">"If you show gratitude, I will surely increase you." (Quran 14:7)</p>
                </motion.div>
            </div>

            {/* Input Area */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl max-w-2xl mx-auto mb-12 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50" />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase text-slate-500 font-bold mb-2 tracking-wider">What are you grateful for today?</label>
                        <TextareaAutosize
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="E.g. The cool breeze during Fajr..."
                            minRows={2}
                            className="w-full bg-slate-800/50 rounded-xl p-4 text-lg text-starlight placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-gold transition-all resize-none"
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:w-auto">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-800 text-sm text-slate-300 rounded-lg px-3 py-2 border border-slate-700 focus:border-gold/50 outline-none cursor-pointer hover:bg-slate-700/50 transition-colors"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className="w-full sm:w-auto bg-gold text-midnight hover:bg-[#c4a030] shadow-lg shadow-gold/20"
                        >
                            {isSubmitting ? 'Saving...' : 'Add Blessing'}
                        </Button>
                    </div>
                </form>
            </motion.div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {entries.map((entry) => (
                        <motion.div
                            key={entry.id}
                            layoutId={`gratitude-${entry.id}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6 hover:border-slate-700 transition-all group relative flex flex-col"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(entry.id!)}
                                    className="text-slate-600 hover:text-crimson p-1 rounded-full hover:bg-slate-800 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <span className="text-[10px] uppercase tracking-widest text-gold/60 font-bold bg-gold/5 px-2 py-1 rounded-full">
                                    {entry.category}
                                </span>
                            </div>

                            <p className="font-serif text-lg text-starlight leading-relaxed mb-6 flex-grow">
                                "{entry.content}"
                            </p>

                            <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center text-xs text-slate-500">
                                <span>{format(new Date(entry.createdAt), 'MMM d, yyyy')}</span>
                                <Heart size={12} className="text-crimson/40" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {entries.length === 0 && (
                <div className="text-center py-12 opacity-30">
                    <Heart size={64} className="mx-auto mb-4" />
                    <p>Start your gratitude journey today.</p>
                </div>
            )}
        </div>
    );
}
