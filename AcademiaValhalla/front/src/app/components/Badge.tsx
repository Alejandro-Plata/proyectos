import type { ReactNode } from 'react';

type BadgeState = 'primary' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeVariant = 'category' | 'language' | 'difficulty';

const STATE_CLASSES: Record<BadgeState, string> = {
    primary: 'bg-emerald-500/[0.08] text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
    warning: 'bg-amber-500/[0.08] text-amber-600 border border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    danger: 'bg-red-500/[0.08] text-red-600 border border-red-500/30 dark:bg-red-500/10 dark:text-red-400',
    info: 'bg-violet-500/[0.08] text-violet-600 border border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/[0.04] dark:text-slate-400 dark:border-white/10',
};

interface BadgeProps {
    state?: BadgeState;
    variant?: BadgeVariant;
    color?: string;
    border?: string;
    bg?: string;
    children: ReactNode;
    className?: string;
}

export const Badge = ({ state, color = '', border = '', bg = '', children, className = '' }: BadgeProps) => {
    if (state) {
        return (
            <span
                style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold ${STATE_CLASSES[state]} ${className}`.trim()}
            >
                {children}
            </span>
        );
    }
    return (
        <span
            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
            className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold ${color} ${border} ${bg} ${className}`.trim()}
        >
            {children}
        </span>
    );
};
