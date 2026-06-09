import type { RunButtonProps } from "./types/types";

export const RunButton = ({
    isRunning,
    label = "Ejecutar",
    loadingLabel = "Ejecutando...",
    className = '',
    ...props
}: RunButtonProps) => {
    return (
        <button
            disabled={isRunning || props.disabled}
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
            className={`
                flex items-center justify-center gap-1.5
                h-8 px-4
                font-mono text-[10px] uppercase tracking-[0.2em] font-bold
                bg-emerald-500 hover:bg-emerald-400 text-black
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
            {...props}
        >
            {isRunning ? (
                <>
                    <svg className="animate-spin h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {loadingLabel}
                </>
            ) : (
                <>
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    {label}
                </>
            )}
        </button>
    );
};
