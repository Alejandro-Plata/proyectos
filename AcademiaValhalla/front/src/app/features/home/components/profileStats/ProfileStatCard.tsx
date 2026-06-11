interface StatProps {
    label: string;
    value: number | string;
    subtitle?: string;
    isLoading?: boolean;
}

export const ProfileStatCard = ({ label, value, subtitle, isLoading }: StatProps) => (
    <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 p-5 shadow-sm shadow-emerald-500/5 transition-colors duration-200 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 flex flex-col justify-between">
        {/* BB-3 section label */}
        <div className="mb-3">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
        </div>
        {isLoading ? (
            <div className="h-8 w-16 bg-slate-100 dark:bg-white/5 animate-pulse" />
        ) : (
            <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl tracking-tight text-slate-900 dark:text-white">{value}</span>
                {subtitle && <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">{subtitle}</span>}
            </div>
        )}
    </div>
);
