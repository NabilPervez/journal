import { motion } from 'framer-motion';
import { Feather } from 'lucide-react';

interface SealButtonProps {
    onClick: () => void;
    disabled?: boolean;
    wordCount?: number;
}

export function SealButton({ onClick, disabled, wordCount = 0 }: SealButtonProps) {
    const isReady = wordCount >= 10;

    return (
        <div className="fixed bottom-6 right-6 md:absolute md:bottom-12 md:right-12 z-40 pointer-events-auto">
            <motion.button
                onClick={onClick}
                disabled={disabled || !isReady}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    boxShadow: isReady && !disabled
                        ? "0 0 30px rgba(212,175,55,0.4)"
                        : "0 0 0 rgba(0,0,0,0)"
                }}
                whileHover={isReady && !disabled ? { scale: 1.1 } : {}}
                whileTap={isReady && !disabled ? { scale: 0.95 } : {}}
                className={`
          flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full 
          bg-gradient-to-br from-crimson to-red-900 border-4 border-gold/40 shadow-2xl
          transition-all duration-500 group relative overflow-hidden
          ${(disabled || !isReady) ? 'grayscale opacity-80 cursor-not-allowed filter blur-[0.5px]' : 'cursor-pointer hover:border-gold/80 hover:brightness-110'}
        `}
                title={!isReady ? `Write ${10 - wordCount} more words to seal` : "Seal Entry"}
            >
                <div className="relative flex items-center justify-center w-full h-full z-10">
                    {/* Inner ring */}
                    <div className="absolute inset-1 rounded-full border border-dashed border-gold/30 opacity-60" />

                    <Feather
                        className={`w-8 h-8 md:w-10 md:h-10 text-gold drop-shadow-md transition-transform duration-500 ${isReady && !disabled ? 'group-hover:rotate-[-15deg]' : ''}`}
                        strokeWidth={1.5}
                    />
                </div>

                {/* Shine effect */}
                {isReady && !disabled && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                )}
            </motion.button>

            {/* Helper text */}
            <motion.div
                animate={{ opacity: isReady ? 0 : 1, y: isReady ? 10 : 0 }}
                className="absolute bottom-full right-0 mb-3 px-3 py-1 bg-slate-800/90 backdrop-blur text-xs text-starlight rounded shadow border border-slate-700 whitespace-nowrap pointer-events-none"
            >
                {isReady ? "Ready to Seal" : `${10 - wordCount} words to go...`}
            </motion.div>
        </div>
    );
}
