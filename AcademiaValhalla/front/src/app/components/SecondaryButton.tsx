import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    size?: 'sm' | 'md';
    icon?: React.ReactNode;
}

export const SecondaryButton = ({
    children,
    isLoading,
    size = 'md',
    className = '',
    icon,
    disabled,
    ...props
}: SecondaryButtonProps) => {
    const height = size === 'sm' ? 'h-8 px-3 text-[10px]' : 'h-9 px-4 text-[11px]';
    return (
        <button
            disabled={isLoading || disabled}
            className={`inline-flex items-center justify-center gap-2 ${height} border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/[0.06] font-mono uppercase tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full ${className}`}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};
