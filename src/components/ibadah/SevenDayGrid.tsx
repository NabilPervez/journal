import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { IbadahLog } from '../../db/schema';
import { trackerService } from '../../services/trackerService';

interface SevenDayGridProps {
    logs: IbadahLog[];
    startDate: Date;
}

const prayerKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

export function SevenDayGrid({ logs, startDate }: SevenDayGridProps) {
    // Create a map for easy lookup
    const logMap = new Map(logs.map(l => [l.dateString, l]));

    // Generate dates for current week view or range
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        return d;
    });

    return (
        <div className="w-full bg-slate-900/40 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
            <div className="overflow-x-auto pb-2">
                <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-y-3 gap-x-1 min-w-[300px]">

                    {/* Header Row */}
                    <div className="h-8"></div> {/* Corner */}
                    {days.map((d, i) => (
                        <div key={i} className="h-8 flex flex-col items-center justify-end pb-1 border-b border-slate-800/50">
                            <span className="text-[10px] uppercase text-slate-500 font-bold">{format(d, 'EEE')}</span>
                            <span className={`text-xs font-heading ${format(d, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-gold' : 'text-starlight'}`}>
                                {format(d, 'd')}
                            </span>
                        </div>
                    ))}

                    {/* Rows */}
                    {prayerKeys.map(prayer => (
                        <div key={prayer} className="contents group">
                            <div className="h-8 flex items-center justify-center border-r border-slate-800/50 pr-2">
                                <span className="text-xs font-heading capitalize text-slate-400 font-medium group-hover:text-gold transition-colors">{prayer[0]}</span>
                            </div>

                            {days.map((d) => { // Removed index here
                                const dateStr = format(d, 'yyyy-MM-dd');
                                const log = logMap.get(dateStr);
                                const status = log ? log[prayer] : null;

                                let color = 'bg-slate-800 border border-slate-700'; // Empty
                                if (status === 2) color = 'bg-gold border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]';
                                else if (status === 1) color = 'bg-orange-900/40 border-orange-500/50';
                                else if (status === 0) color = 'bg-crimson/20 border-crimson/50';

                                return (
                                    <div key={`${dateStr}-${prayer}`} className="h-8 flex items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            whileHover={{ scale: 1.2 }}
                                            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${color}`}
                                            title={`${prayer} on ${format(d, 'MMM d')}: ${status === 2 ? 'On Time' : status === 1 ? 'Late' : status === 0 ? 'Missed' : 'Not logged'}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Score */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center px-2">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Weekly Score</span>
                    <span className="text-xs text-slate-400">Based on on-time prayers</span>
                </div>
                <div className="flex items-baseline gap-1 animate-pulse-slow">
                    <span className="text-2xl font-heading text-gold font-bold">{trackerService.calculateSpiritualHealth(logs)}</span>
                    <span className="text-sm text-gold/60">%</span>
                </div>
            </div>
        </div>
    );
}
