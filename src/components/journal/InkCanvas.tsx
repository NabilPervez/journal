import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface InkCanvasProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    isSealed?: boolean;
    className?: string;
}

export function InkCanvas({ value, onChange, isSealed, className }: InkCanvasProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={cn("relative w-full min-h-[50vh] flex flex-col items-center", className)}
        >
            {/* Paper Container */}
            <div
                className={cn(
                    "w-full h-full p-6 md:p-12 bg-white text-slate-800 shadow-2xl rounded-sm transition-all duration-1000 font-serif text-lg leading-8 relative overflow-hidden",
                    "lined-paper selection:bg-gold/30 selection:text-slate-900", // lined-paper class from global.css
                    isSealed && "grayscale opacity-80 pointer-events-none select-none filter sepia-[.3]"
                )}
                style={{ boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
            >
                {/* Margin validation line */}
                <div className="absolute left-8 md:left-16 top-0 bottom-0 w-[2px] bg-red-400/20 pointer-events-none z-0" />

                <TextareaAutosize
                    value={value}
                    onChange={onChange}
                    disabled={isSealed}
                    placeholder={isSealed ? "" : "Bismillah... Let your thoughts flow."}
                    className="w-full h-full bg-transparent border-0 resize-none focus:ring-0 text-slate-900 placeholder:text-slate-400 placeholder:italic pl-8 md:pl-12 outline-none z-10 relative font-medium"
                    style={{
                        lineHeight: '2rem',
                        backgroundImage: 'none' // Ensure no interference with parent
                    }}
                    spellCheck={false}
                />

                {isSealed && (
                    <motion.div
                        initial={{ scale: 2, opacity: 0, rotate: -30 }}
                        animate={{ scale: 1, opacity: 1, rotate: -15 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                    >
                        <div className="border-4 border-crimson/40 text-crimson/40 text-5xl md:text-8xl font-heading font-black p-4 md:p-8 rounded-xl uppercase tracking-[1rem] mix-blend-multiply stamp-effect backdrop-blur-[1px]">
                            Sealed
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
