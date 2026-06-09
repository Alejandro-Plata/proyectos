interface DifficultyDotsProps {
    level: string;
    isDark: boolean;
    compact?: boolean;
}

const LEVEL_CONFIG: Record<string, { bars: number; colorClass: string }> = {
    'Fácil':      { bars: 1, colorClass: 'bg-emerald-500 shadow-[0_0_6px_#10b981]' },
    'Intermedio': { bars: 2, colorClass: 'bg-amber-500 shadow-[0_0_6px_#f59e0b]' },
    'Difícil':    { bars: 3, colorClass: 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' },
};

export const DifficultyDots = ({ level, compact = false }: DifficultyDotsProps) => {
    const config = LEVEL_CONFIG[level] ?? LEVEL_CONFIG['Fácil'];

    return (
        <div className={`flex items-center gap-1.5 ${!compact ? 'px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5' : ''}`}>
            <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i <= config.bars ? config.colorClass : 'bg-slate-300 dark:bg-slate-700'}`}
                    />
                ))}
            </div>
            {!compact && (
                <span className="text-[10px] font-bold uppercase tracking-wider ml-1 text-slate-600 dark:text-slate-300">
                    {level}
                </span>
            )}
        </div>
    );
};
