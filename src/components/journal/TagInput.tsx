import { useState, type KeyboardEvent } from 'react';
import { X, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    disabled?: boolean;
}

export function TagInput({ tags = [], onChange, disabled }: TagInputProps) {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const trimmed = input.trim().replace(/,/g, '');
            if (trimmed && !tags.includes(trimmed)) {
                onChange([...tags, trimmed]);
                setInput('');
            }
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className={`
      flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 focus-within:ring-2 focus-within:ring-gold/30 focus-within:border-gold/30 transition-all w-full
      ${disabled ? 'opacity-50 pointer-events-none' : ''}
    `}>
            <div className="text-slate-500 pr-2 border-r border-slate-700">
                <Hash size={16} />
            </div>

            <AnimatePresence mode="popLayout">
                {tags.map((tag) => (
                    <motion.div
                        key={tag}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        layout
                        className="flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-md bg-slate-800 text-xs font-medium text-starlight border border-slate-700 shadow-sm group hover:border-gold/30 transition-colors"
                    >
                        <span>{tag}</span>
                        <button
                            onClick={() => removeTag(tag)}
                            className="p-0.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-crimson/80 focus:outline-none transition-colors"
                            type="button"
                        >
                            <X size={12} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>

            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? "Add tags (e.g. ramadan, reflection)..." : "Add tag..."}
                className="flex-1 bg-transparent border-none outline-none text-sm text-starlight placeholder:text-slate-600 min-w-[120px] focus:ring-0 px-1"
                disabled={disabled}
            />
        </div>
    );
}
