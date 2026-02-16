import { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { DualDateDisplay } from '../journal/DualDateDisplay';
import { PrayerRow, type PrayerName } from './PrayerRow';
import { ExtraPrayerToggle } from './ExtraPrayerToggle';
import { SevenDayGrid } from './SevenDayGrid';
import { useTracker } from '../../hooks/useTracker';
import { trackerService } from '../../services/trackerService';
import type { IbadahLog } from '../../db/schema';
import { Calendar, BarChart2 } from 'lucide-react';

export function TrackerPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    const { data: dailyLog, isLoading: isDailyLoading, updateLog } = useTracker(dateString);
    const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
    const [weekLogs, setWeekLogs] = useState<IbadahLog[]>([]);

    // Fetch weekly logs when needed
    useEffect(() => {
        if (viewMode === 'weekly') {
            const start = format(startOfWeek(selectedDate, { weekStartsOn: 0 }), 'yyyy-MM-dd'); // Sunday start
            const end = format(endOfWeek(selectedDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');
            trackerService.getWeekData(start, end).then(setWeekLogs);
        }
    }, [viewMode, selectedDate, dailyLog]); // Refresh if dailyLog updates (e.g. user toggles something then switches view)

    const handleDateChange = (direction: 'prev' | 'next') => {
        const newDate = direction === 'next' ? addDays(selectedDate, 1) : subDays(selectedDate, 1);
        setSelectedDate(newDate);
    };

    const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    return (
        <div className="max-w-4xl mx-auto pb-32 px-4">
            {/* Header & Nav */}
            <div className="flex items-center justify-between mb-6 sticky top-0 z-30 bg-midnight/95 backdrop-blur py-4 -mx-4 px-4 md:static md:bg-transparent md:p-0 border-b border-slate-800 md:border-0">
                <button onClick={() => handleDateChange('prev')} className="text-slate-400 hover:text-gold p-2">←</button>
                <DualDateDisplay date={selectedDate} />
                <button onClick={() => handleDateChange('next')} className="text-slate-400 hover:text-gold p-2">→</button>
            </div>

            {/* View Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-slate-900 p-1 rounded-full border border-slate-800 flex gap-1">
                    <button
                        onClick={() => setViewMode('daily')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'daily' ? 'bg-gold text-midnight shadow-lg' : 'text-slate-400 hover:text-starlight'}`}
                    >
                        <Calendar size={16} /> Daily
                    </button>
                    <button
                        onClick={() => setViewMode('weekly')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'weekly' ? 'bg-gold text-midnight shadow-lg' : 'text-slate-400 hover:text-starlight'}`}
                    >
                        <BarChart2 size={16} /> Weekly
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'daily' ? (
                    <motion.div
                        key="daily"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                    >
                        {isDailyLoading && !dailyLog ? (
                            <div className="text-center py-12 text-slate-500">Loading tracker...</div>
                        ) : (
                            <>
                                {/* Obligatory Prayers */}
                                <div>
                                    <h3 className="text-sm font-heading text-gold mb-4 uppercase tracking-widest pl-1 font-bold">Obligatory Prayers</h3>
                                    <div className="space-y-3">
                                        {prayers.map(p => (
                                            <PrayerRow
                                                key={p}
                                                name={p}
                                                status={dailyLog ? dailyLog[p] : null}
                                                onChange={(s) => updateLog({ [p]: s })}
                                                isLoading={isDailyLoading}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Extras */}
                                <div>
                                    <h3 className="text-sm font-heading text-gold mb-4 uppercase tracking-widest pl-1 font-bold mt-8">Extra Ibadah</h3>
                                    {dailyLog && (
                                        <ExtraPrayerToggle
                                            log={dailyLog}
                                            onUpdate={updateLog}
                                            isLoading={isDailyLoading}
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="weekly"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="text-sm font-heading text-gold mb-4 uppercase tracking-widest pl-1 font-bold">Weekly Performance</h3>
                        <SevenDayGrid
                            logs={weekLogs}
                            startDate={startOfWeek(selectedDate, { weekStartsOn: 0 })}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
