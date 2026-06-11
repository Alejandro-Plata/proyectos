import type { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: ReactNode;
    message: string;
    description?: string;
}

export const EmptyState = ({ icon, message, description }: EmptyStateProps) => (
    <div className="flex flex-col items-center justify-center py-16 gap-3 border border-emerald-500/15 dark:border-emerald-500/10">
        {icon ? (
            <div className="w-10 h-10 text-emerald-500/30">{icon}</div>
        ) : (
            <svg width="32" height="36" viewBox="0 0 64 72" className="opacity-30">
                <polygon points="32,2 62,18 62,54 32,70 2,54 2,18" stroke="#10b981" strokeWidth="2" fill="none" />
            </svg>
        )}
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
            // {message}
        </p>
        {description && (
            <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400/70 dark:text-slate-500/70 max-w-xs text-center">
                {description}
            </p>
        )}
    </div>
);
