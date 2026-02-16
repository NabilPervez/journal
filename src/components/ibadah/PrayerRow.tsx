import { motion } from 'framer-motion';
import { Check, X, Minus, Circle } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

export type PrayerStatus = 0 | 1 | 2 | null;
export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

interface PrayerRowProps {
    name: PrayerName;
    status: PrayerStatus;
    onChange: (status: PrayerStatus) => void;
    isLoading?: boolean;
}

const statusConfig = {
    empty: { icon: Circle, color: 'text-slate-600', bg: 'bg-transparent', border: 'border-slate-600', ring: 'ring-0' },
    ontime: { icon: Check, color: 'text-slate-900', bg: 'bg-gold', border: 'border-gold', ring: 'ring-gold/50' },
    late: { icon: Minus, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500', ring: 'ring-orange-500/30' },
    missed: { icon: X, color: 'text-crimson', bg: 'bg-crimson/10', border: 'border-crimson', ring: 'ring-crimson/30' },
};

export function PrayerRow({ name, status, onChange, isLoading }: PrayerRowProps) {
    const playClick = useSound('/sounds/pen-click.mp3');

    const handleToggle = () => {
        if (isLoading) return;
        playClick();
        // Cycle: null -> 2 (on time) -> 1 (late) -> 0 (missed) -> null
        const nextStatus = status === null ? 2 : status === 2 ? 1 : status === 1 ? 0 : null;
        onChange(nextStatus);
    };

    const currentKey = status === null ? 'empty' : status === 2 ? 'ontime' : status === 1 ? 'late' : 'missed';
    const config = statusConfig[currentKey];
    const Icon = config.icon;

    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm mb-3 group hover:border-slate-700 transition-colors">
            <span className="font-heading text-lg capitalize text-starlight tracking-wide">{name}</span>

            <motion.button
                onClick={handleToggle}
                disabled={isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`
          w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 
          ${config.border} ${config.bg} ${config.color} hover:shadow-lg focus:outline-none focus:ring-4 ${config.ring}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <motion.div
                    key={currentKey}
                    initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                    <Icon className="w-5 h-5" strokeWidth={status === null ? 1.5 : 3} />
                </motion.div>
            </motion.button>
        </div>
    );
}
