import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles } from 'lucide-react';

interface PromptBlockProps {
    prompt: string;
    onRefresh: () => void;
    isLoading?: boolean;
}

export function PromptBlock({ prompt, onRefresh, isLoading }: PromptBlockProps) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-xl w-full max-w-2xl mx-auto backdrop-blur-sm group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-gold">
                <Sparkles size={80} />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-gold/20 text-[10px] font-bold text-gold/80 uppercase tracking-widest">
                        <Sparkles size={10} /> Daily Reflection
                    </span>

                    <AnimatePresence mode="wait">
                        <motion.h3
                            key={prompt}
                            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                            transition={{ duration: 0.4 }}
                            className="text-lg md:text-xl font-heading text-starlight leading-relaxed"
                        >
                            "{prompt}"
                        </motion.h3>
                    </AnimatePresence>
                </div>

                <motion.button
                    onClick={onRefresh}
                    disabled={isLoading}
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 text-slate-400 hover:text-gold hover:bg-slate-800/80 rounded-full transition-colors disabled:opacity-50"
                    title="New Prompt"
                >
                    <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                </motion.button>
            </div>
        </div>
    );
}
