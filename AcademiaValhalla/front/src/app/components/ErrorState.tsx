interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
    <div className="flex flex-col items-center justify-center py-16 gap-3 border border-red-500/15 dark:border-red-500/10">
        <svg className="w-10 h-10 text-rose-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="font-mono text-[10px] uppercase tracking-widest text-rose-500/70">
            // {message}
        </p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500/60 hover:text-emerald-500 transition-colors border border-emerald-500/20 hover:border-emerald-500/40 px-3 py-1"
            >
                // reintentar
            </button>
        )}
    </div>
);
