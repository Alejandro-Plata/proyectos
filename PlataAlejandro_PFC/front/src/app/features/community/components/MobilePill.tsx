import type { MobilPillProps } from "../types/types";

export const MobilePill = ({ active, onClick, label, dotColor }: MobilPillProps) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 min-h-[36px] font-mono text-[10px] uppercase tracking-[0.15em] font-bold border transition-colors whitespace-nowrap ${
            active
                ? 'bg-emerald-500 border-emerald-500 text-black'
                : 'bg-white dark:bg-[#0a0b0e] border-emerald-500/15 dark:border-emerald-500/10 text-slate-700 dark:text-slate-300 hover:border-emerald-500/30 dark:hover:border-emerald-500/20'
        }`}
    >
        {dotColor && <div className={`w-1.5 h-1.5 ${dotColor}`} />}{label}
    </button>
);
