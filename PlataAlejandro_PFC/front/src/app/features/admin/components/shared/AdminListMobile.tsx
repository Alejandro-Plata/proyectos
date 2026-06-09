import { useState } from 'react';

interface AdminListMobileProps<T> {
    items: T[];
    keyExtractor: (item: T) => string;
    renderHeader: (item: T) => React.ReactNode;
    renderBody?: (item: T) => React.ReactNode;
    renderActions: (item: T) => React.ReactNode;
    emptyMessage?: string;
}

export function AdminListMobile<T>({
    items,
    keyExtractor,
    renderHeader,
    renderBody,
    renderActions,
    emptyMessage = 'Sin resultados',
}: AdminListMobileProps<T>) {
    const [openId, setOpenId] = useState<string | null>(null);

    if (items.length === 0) {
        return (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 font-mono text-sm">
                {emptyMessage}
            </div>
        );
    }

    return (
        <ul className="space-y-2">
            {items.map(item => {
                const id = keyExtractor(item);
                const isOpen = openId === id;
                return (
                    <li key={id} className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10">
                        <button
                            onClick={() => setOpenId(isOpen ? null : id)}
                            className="w-full min-h-[64px] flex items-center justify-between px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            aria-expanded={isOpen}
                        >
                            <div className="flex-1 min-w-0">{renderHeader(item)}</div>
                            <svg
                                className={`w-4 h-4 shrink-0 ml-2 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isOpen && (
                            <div className="px-4 pb-4 space-y-3 border-t border-emerald-500/10 pt-3">
                                {renderBody?.(item)}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {renderActions(item)}
                                </div>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
