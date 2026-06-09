import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    size?: 'sm' | 'md';
    icon?: React.ReactNode;
}

export const PrimaryButton = ({
    children,
    isLoading,
    size = 'md',
    className = '',
    icon,
    disabled,
    ...props
}: PrimaryButtonProps) => {
    const height = size === 'sm' ? 'h-8 px-4 text-[10px]' : 'h-9 px-5 text-[11px]';
    return (
        <button
            disabled={isLoading || disabled}
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
            className={`inline-flex items-center justify-center gap-2 ${height} bg-emerald-500 hover:bg-emerald-400 text-black font-mono uppercase tracking-[0.15em] font-bold transition-colors disabled:bg-emerald-500/[0.08] disabled:text-emerald-500/30 disabled:cursor-not-allowed w-full ${className}`}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black animate-spin" />
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};
