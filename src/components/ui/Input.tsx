import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="space-y-1 w-full">
                {label && <label className="text-sm font-heading font-medium text-slate-400">{label}</label>}
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-starlight placeholder:text-slate-500",
                            "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/30 transition-all",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-crimson/50 focus:ring-crimson/30",
                            className
                        )}
                        {...props}
                    />
                </motion.div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-crimson font-medium"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";
