import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

        // Base styles
        const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:pointer-events-none";

        // Context-dependent styles
        const variantStyles = {
            primary: "bg-gold text-midnight hover:bg-[#c4a030] shadow-md",
            secondary: "bg-slate-800 text-starlight hover:bg-slate-700 border border-slate-700",
            ghost: "hover:bg-slate-800/50 text-slate-300 hover:text-white hover:bg-white/5",
            danger: "bg-crimson/90 text-white hover:bg-crimson",
        };

        const sizeStyles = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2 text-sm",
            lg: "h-12 px-6 text-lg",
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.98 }}
                className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
                disabled={isLoading || disabled}
                {...props as HTMLMotionProps<"button">} // Ensure props are compatible with motion.button
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";
