import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import namesData from '../../data/names.json';
import { gratitudeService } from '../../services/gratitudeService';
import { Button } from '../ui/Button';
import TextareaAutosize from 'react-textarea-autosize';
import { Sparkles, Save, X } from 'lucide-react';

export function NameCard() {
    const [isReflecting, setIsReflecting] = useState(false);
    const [reflection, setReflection] = useState('');

    // Daily Rotation based on day of year
    const nameOfTheDay = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const index = dayOfYear % namesData.length;
        return namesData[index];
    }, []);

    const handleSave = async () => {
        if (!reflection.trim()) return;
        try {
            await gratitudeService.addEntry({
                dateString: format(new Date(), 'yyyy-MM-dd'),
                content: reflection,
                category: nameOfTheDay.transliteration, // Link to Name
                createdAt: Date.now()
            });
            setReflection('');
            setIsReflecting(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="bg-slate-900/40 border border-gold/20 rounded-2xl p-6 relative overflow-hidden group backdrop-blur-sm shadow-lg hover:shadow-gold/5 transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <Sparkles size={80} className="text-gold" />
            </div>

            <div className="text-center mb-6 relative z-10">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-3 block opacity-80">Name of the Day</span>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="font-arabic text-5xl text-starlight mb-2 drop-shadow-2xl">{nameOfTheDay.arabic}</h3>
                    <h4 className="text-xl font-heading text-gold mb-1 tracking-wide">{nameOfTheDay.transliteration}</h4>
                    <p className="text-sm text-slate-400 italic font-serif">"{nameOfTheDay.meaning}"</p>
                </motion.div>
            </div>

            <p className="text-sm text-slate-300 text-center mb-6 leading-relaxed max-w-sm mx-auto">
                {nameOfTheDay.desc}
            </p>

            <AnimatePresence mode="wait">
                {!isReflecting ? (
                    <motion.div
                        key="button"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-center"
                    >
                        <Button
                            onClick={() => setIsReflecting(true)}
                            variant="ghost"
                            className="text-gold border border-gold/30 hover:bg-gold/10 text-xs uppercase tracking-wider transition-all hover:scale-105"
                        >
                            Reflect on this Attribute
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                    >
                        <TextareaAutosize
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            placeholder={`How does ${nameOfTheDay.transliteration} manifest in your life?`}
                            minRows={3}
                            className="w-full bg-slate-800/50 rounded-lg p-3 text-starlight text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-gold resize-none border border-slate-700/50"
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setIsReflecting(false)}
                                className="p-2 text-slate-500 hover:text-crimson transition-colors text-xs uppercase tracking-wider font-bold"
                            >
                                Cancel
                            </button>
                            <Button onClick={handleSave} disabled={!reflection.trim()} size="sm" className="bg-gold text-midnight hover:bg-gold/90">
                                <Save size={14} className="mr-1" /> Save Reflection
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
