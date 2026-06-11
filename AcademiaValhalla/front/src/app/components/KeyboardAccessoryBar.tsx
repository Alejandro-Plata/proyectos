interface KeyboardAccessoryBarProps {
    onInsert: (text: string) => void;
}

const ITEMS = ['{', '}', '[', ']', '(', ')', '<', '>', '"', "'", ';', '/', '*', '#', '_', '`'];

export const KeyboardAccessoryBar = ({ onInsert }: KeyboardAccessoryBarProps) => (
    <div
        className="shrink-0 flex gap-1 overflow-x-auto px-2 py-1 bg-slate-100 dark:bg-[#0a0b0e] border-t border-emerald-500/10 scrollbar-hide"
        style={{ paddingBottom: 'var(--safe-pb)' }}
    >
        {ITEMS.map(c => (
            <button
                key={c}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onInsert(c); }}
                className="min-w-[44px] h-11 font-mono text-sm bg-white dark:bg-white/5 border border-emerald-500/15 text-slate-700 dark:text-slate-300 shrink-0"
            >
                {c}
            </button>
        ))}
    </div>
);
