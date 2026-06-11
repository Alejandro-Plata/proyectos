export const StreakCard = ({ streakDays }: { streakDays: number }) => {
    return (
        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 p-6 shadow-sm shadow-emerald-500/5 transition-colors duration-300 flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start mb-4">
                    {/* BB-3 section label */}
                    <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Racha activa</h2>
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="font-mono text-4xl text-slate-900 dark:text-white">{streakDays}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">días</span>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex gap-2 mb-3">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1.5 transition-colors ${
                                i < Math.min(streakDays, 7)
                                    ? 'bg-amber-500 dark:bg-amber-400'
                                    : 'bg-slate-100 dark:bg-white/5'
                            }`}
                        />
                    ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {streakDays > 0 ? 'Mantén el ritmo' : 'Resuelve un challenge'}
                </p>
            </div>
        </div>
    );
};
