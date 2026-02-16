import { motion } from 'framer-motion';
import { Sun, Moon, BookOpen, Utensils } from 'lucide-react';
import { type IbadahLog } from '../../db/schema';
import { useSound } from '../../hooks/useSound';

interface ExtraPrayerToggleProps {
    log: IbadahLog;
    onUpdate: (updates: Partial<IbadahLog>) => void;
    isLoading?: boolean;
}

export function ExtraPrayerToggle({ log, onUpdate, isLoading }: ExtraPrayerToggleProps) {
    const playClick = useSound('/sounds/pen-click.mp3');

    const handleToggle = (key: 'qiyam' | 'duha') => {
        if (isLoading) return;
        playClick();
        onUpdate({ [key]: !log[key] });
    };

    const handleQuranChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let pages = parseInt(e.target.value);
        if (isNaN(pages) || pages < 0) pages = 0;
        onUpdate({ quranPagesRead: pages });
    };

    const handleFastingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ fastingType: e.target.value as IbadahLog['fastingType'] });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Qiyam - Night Prayer */}
                <motion.button
                    onClick={() => handleToggle('qiyam')}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${log.qiyam ? 'bg-indigo-900/30 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:bg-slate-800/50'}`}
                >
                    <Moon size={24} className={log.qiyam ? 'text-indigo-300 drop-shadow-md' : 'text-slate-600'} />
                    <span className={`text-xs uppercase tracking-wider font-bold ${log.qiyam ? 'text-indigo-200' : 'text-slate-500'}`}>Qiyam</span>
                </motion.button>

                {/* Duha - Morning Prayer */}
                <motion.button
                    onClick={() => handleToggle('duha')}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${log.duha ? 'bg-amber-900/30 border-amber-500 shadow-lg shadow-amber-500/10' : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:bg-slate-800/50'}`}
                >
                    <Sun size={24} className={log.duha ? 'text-amber-300 drop-shadow-md' : 'text-slate-600'} />
                    <span className={`text-xs uppercase tracking-wider font-bold ${log.duha ? 'text-amber-200' : 'text-slate-500'}`}>Duha</span>
                </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Quran Pages */}
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between gap-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <BookOpen size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Quran Pages</span>
                    </div>
                    <input
                        type="number"
                        value={log.quranPagesRead || ''}
                        onChange={handleQuranChange}
                        placeholder="0"
                        className="bg-slate-800 rounded-lg px-3 py-2 text-starlight text-lg font-mono w-full focus:ring-1 focus:ring-gold outline-none border border-transparent focus:border-gold/50 transition-all placeholder:text-slate-600"
                        min={0}
                        disabled={isLoading}
                    />
                </div>

                {/* Fasting Type */}
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between gap-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Utensils size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Fasting</span>
                    </div>
                    <div className="relative">
                        <select
                            value={log.fastingType}
                            onChange={handleFastingChange}
                            disabled={isLoading}
                            className="w-full bg-slate-800 text-starlight text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-gold appearance-none border border-transparent focus:border-gold/50 transition-all cursor-pointer"
                        >
                            <option value="none">None</option>
                            <option value="sunnah">Sunnah</option>
                            <option value="makeup">Make-up</option>
                            <option value="ramadan">Ramadan</option>
                        </select>
                        {/* Custom arrow could go here */}
                    </div>
                </div>
            </div>
        </div>
    );
}
