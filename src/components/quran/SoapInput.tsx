import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '../ui/Button';
import { type QuranVerse } from '../../services/quranService';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Eye, Zap, HeartHandshake } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SoapData {
    verse: QuranVerse;
    observation: string;
    application: string;
    prayer: string;
}

interface SoapInputProps {
    verse: QuranVerse;
    onSave: (data: SoapData) => void;
    isLoading?: boolean;
}

export function SoapInput({ verse, onSave, isLoading }: SoapInputProps) {
    const [observation, setObservation] = useState('');
    const [application, setApplication] = useState('');
    const [prayer, setPrayer] = useState('');

    const [activeAccordion, setActiveAccordion] = useState<string | null>('observation');

    const handleSave = () => {
        if (!observation.trim() && !application.trim() && !prayer.trim()) return;
        onSave({
            verse,
            observation,
            application,
            prayer
        });
    };

    const sections = [
        { id: 'observation', icon: Eye, label: 'Observation', placeholder: 'What context or meaning stands out? What is Allah telling you?', value: observation, setter: setObservation, color: 'text-indigo-400', border: 'border-indigo-500/30 ring-indigo-500/20' },
        { id: 'application', icon: Zap, label: 'Application', placeholder: 'How does this apply to your life today? What action will you take?', value: application, setter: setApplication, color: 'text-amber-400', border: 'border-amber-500/30 ring-amber-500/20' },
        { id: 'prayer', icon: HeartHandshake, label: 'Prayer', placeholder: 'Write a dua related to this verse...', value: prayer, setter: setPrayer, color: 'text-emerald-400', border: 'border-emerald-500/30 ring-emerald-500/20' },
    ];

    return (
        <div className="space-y-6">
            {/* S: Scripture (Read-only Display) */}
            <div className="bg-slate-900/50 border border-gold/20 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BookOpen size={64} className="text-gold" />
                </div>
                <div className="flex items-center gap-2 mb-4 text-gold/80 uppercase tracking-widest text-xs font-bold">
                    <span className="bg-gold/10 px-2 py-0.5 rounded">Scripture</span>
                    <span>{verse.surah_number}:{verse.ayah_number}</span>
                </div>
                <p className="font-arabic text-2xl text-right dir-rtl leading-loose mb-4 text-starlight">{verse.text_ar}</p>
                <p className="font-serif text-lg text-slate-300 italic leading-relaxed">"{verse.text_en}"</p>
            </div>

            {/* O-A-P Inputs */}
            <div className="space-y-4">
                {sections.map(section => {
                    const Icon = section.icon;
                    const isActive = activeAccordion === section.id;

                    return (
                        <motion.div
                            key={section.id}
                            initial={false}
                            animate={{ borderColor: isActive ? 'rgba(212,175,55,0.3)' : 'rgba(30,41,59,0.5)' }} // subtle gold border active
                            className={cn(
                                "bg-slate-900/40 border rounded-xl overflow-hidden transition-all",
                                isActive ? "bg-slate-900/60 shadow-lg" : "border-slate-800"
                            )}
                        >
                            <button
                                onClick={() => setActiveAccordion(isActive ? null : section.id)}
                                className="w-full flex items-center justify-between p-4 focus:outline-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-lg bg-slate-800", section.color)}>
                                        <Icon size={18} />
                                    </div>
                                    <span className={cn("font-heading font-medium tracking-wide", isActive ? "text-white" : "text-slate-400")}>{section.label}</span>
                                </div>
                                {isActive ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                            </button>

                            <AnimatePresence initial={false}>
                                {isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-4 pb-6 pt-0">
                                            <TextareaAutosize
                                                minRows={3}
                                                placeholder={section.placeholder}
                                                value={section.value}
                                                onChange={(e) => section.setter(e.target.value)}
                                                className={cn(
                                                    "w-full bg-slate-800/50 rounded-lg p-3 text-starlight placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all resize-none",
                                                    section.border
                                                )}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSave}
                    disabled={isLoading || (!observation && !application && !prayer)}
                    className="w-full md:w-auto"
                    variant="primary"
                >
                    {isLoading ? 'Saving...' : 'Save Reflection'}
                </Button>
            </div>
        </div>
    );
}
