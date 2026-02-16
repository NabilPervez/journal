import { format } from 'date-fns';
import { useHijriDate } from '../../hooks/useHijriDate';
import { Calendar } from 'lucide-react';

interface DualDateDisplayProps {
    date: Date;
    onDateClick?: () => void;
}

export function DualDateDisplay({ date, onDateClick }: DualDateDisplayProps) {
    const hijri = useHijriDate(date);

    return (
        <div
            onClick={onDateClick}
            className={`group flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors cursor-pointer select-none ring-offset-midnight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50`}
            role="button"
            tabIndex={0}
            aria-label="Select date"
        >
            <div className="p-2 bg-slate-800 rounded-lg text-gold group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                <Calendar className="w-5 h-5" />
            </div>
            <div>
                <div className="font-heading text-lg text-starlight leading-none mb-1 tracking-wide">
                    {format(date, 'EEEE, MMMM do, yyyy')}
                </div>
                <div className="font-arabic text-gold/80 text-sm leading-none mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {hijri ? `${hijri.day} ${hijri.nameMonth} ${hijri.year} AH` : 'Loading Hijri...'}
                </div>
            </div>
        </div>
    );
}
