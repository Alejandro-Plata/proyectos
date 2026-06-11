interface SummaryRowProps {
    label: string;
    value: string;
}

export const SummaryRow = ({ label, value }: SummaryRowProps) => (
    <div className="flex justify-between items-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{label}</span>
        {/* BB-9 value pill */}
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.08] dark:bg-emerald-500/10 border border-emerald-500/30 dark:border-emerald-500/20 px-2 py-0.5">
            {value}
        </span>
    </div>
);
