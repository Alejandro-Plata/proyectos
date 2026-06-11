interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    fullPage?: boolean;
}

const SIZE_MAP = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-2',
};

export const LoadingSpinner = ({ size = 'md', className = '', fullPage }: LoadingSpinnerProps) => {
    const spinner = (
        <div className={`${SIZE_MAP[size]} border-emerald-500/20 border-t-emerald-500 animate-spin ${className}`} />
    );
    if (fullPage) {
        return (
            <div className="flex items-center justify-center py-12">
                {spinner}
            </div>
        );
    }
    return spinner;
};
