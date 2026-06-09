import type { AdminStats } from '../types/types';

interface Props {
    stats: AdminStats;
}

const STAT_ICON_BG: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-500',
    amber:   'bg-amber-500/10 text-amber-500',
    rose:    'bg-rose-500/10 text-rose-500',
};

export const DashboardStats = ({ stats }: Props) => {
    const CARDS = [
        {
            key: 'totalUsers',
            label: 'Usuarios Totales',
            value: stats.totalUsers,
            color: 'emerald',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            key: 'pendingRequests',
            label: 'Solicitudes Pendientes',
            value: stats.pendingRequests,
            color: 'amber',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            )
        },
        {
            key: 'reportedPosts',
            label: 'Posts Reportados',
            value: stats.reportedPosts,
            color: 'rose',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
            )
        }
    ];

    return (
        <>
            {/* Mobile: 2-column grid con cifras grandes */}
            <div className="grid grid-cols-2 gap-3 sm:hidden">
                {CARDS.map((card) => (
                    <div
                        key={card.key}
                        className="p-4 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10"
                    >
                        <div className={`w-8 h-8 flex items-center justify-center mb-3 ${STAT_ICON_BG[card.color]}`}>
                            {card.icon}
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mb-1">
                            {card.label}
                        </p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                            {card.value.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Desktop: fila horizontal */}
            <div className="hidden sm:inline-flex flex-row w-full lg:w-auto bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 overflow-hidden">
                {CARDS.map((card, index) => (
                    <div
                        key={card.key}
                        className={`flex flex-1 lg:flex-none items-center gap-4 px-6 py-4 transition-colors hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.05] ${
                            index !== CARDS.length - 1 ? 'border-r border-emerald-500/10' : ''
                        }`}
                    >
                        <div className={`flex items-center justify-center w-10 h-10 shrink-0 ${STAT_ICON_BG[card.color]}`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-0.5">
                                {card.label}
                            </p>
                            <p className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                                {card.value.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
