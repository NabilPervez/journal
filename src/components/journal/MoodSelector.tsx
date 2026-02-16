import { motion } from 'framer-motion';
import { Sun, Cloud, Moon, Zap } from 'lucide-react';

export type Mood = 'peace' | 'struggle' | 'neutral' | 'high-imaan';

interface MoodSelectorProps {
    selectedMood: Mood;
    onChange: (mood: Mood) => void;
    disabled?: boolean;
}

const moods = [
    { id: 'high-imaan', label: 'High Imaan', icon: Zap, color: 'text-yellow-400' },
    { id: 'peace', label: 'At Peace', icon: Sun, color: 'text-amber-300' },
    { id: 'neutral', label: 'Neutral', icon: Moon, color: 'text-slate-400' },
    { id: 'struggle', label: 'Struggling', icon: Cloud, color: 'text-slate-500' },
];

export function MoodSelector({ selectedMood, onChange, disabled }: MoodSelectorProps) {
    return (
        <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 justify-center w-full max-w-lg mx-auto">
            {moods.map((mood) => {
                const Icon = mood.icon;
                const isSelected = selectedMood === mood.id;

                return (
                    <button
                        key={mood.id}
                        onClick={() => onChange(mood.id as Mood)}
                        disabled={disabled}
                        className={`
              relative group flex flex-col items-center gap-2 p-3 rounded-xl transition-all flex-1 min-w-[80px]
              ${isSelected ? 'bg-slate-800 ring-2 ring-gold/50 shadow-lg shadow-gold/10' : 'hover:bg-slate-800/50'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                        title={mood.label}
                    >
                        <motion.div
                            whileHover={!disabled ? { scale: 1.1, rotate: 5 } : {}}
                            whileTap={!disabled ? { scale: 0.95 } : {}}
                            className={`${isSelected ? mood.color : 'text-slate-500 group-hover:text-slate-300'}`}
                        >
                            <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} />
                        </motion.div>
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${isSelected ? 'text-gold' : 'text-slate-500'}`}>
                            {mood.label}
                        </span>
                        {isSelected && (
                            <motion.div
                                layoutId="mood-indicator"
                                className="absolute inset-0 rounded-xl bg-white/5 pointer-events-none"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
