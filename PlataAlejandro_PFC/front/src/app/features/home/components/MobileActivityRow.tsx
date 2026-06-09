import { formatTimeAgo } from '../../../utils/formatTimeAgo';
import type { DashboardActivity } from '../types/types';

const STATUS_MAP: Record<string, { label: string; dotColor: string }> = {
    COMPLETADO: { label: 'Completado', dotColor: 'bg-emerald-500 shadow-[0_0_8px_#10b981]' },
    EN_PROGRESO: { label: 'En progreso', dotColor: 'bg-amber-500' },
    SIN_EMPEZAR: { label: 'Sin empezar', dotColor: 'bg-slate-500' },
    ABANDONADO: { label: 'Abandonado', dotColor: 'bg-rose-500' },
};

const DIFF_MAP: Record<string, string> = {
    BASICO:     'bg-emerald-500/[0.08] text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
    INTERMEDIO: 'bg-amber-500/[0.08] text-amber-600 border border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    AVANZADO:   'bg-red-500/[0.08] text-red-600 border border-red-500/30 dark:bg-red-500/10 dark:text-red-400',
};

export const MobileActivityRow = ({ activity }: { activity: DashboardActivity }) => {
    const s = STATUS_MAP[activity.status] || STATUS_MAP.SIN_EMPEZAR;
    const diffStyle = DIFF_MAP[activity.difficulty] || DIFF_MAP.BASICO;
    const timeAgo = activity.last_attempt_at ? formatTimeAgo(activity.last_attempt_at) : '';

    return (
        <div className="flex items-start gap-3 px-5 py-4 border-b border-emerald-500/10 last:border-0">
            {/* BB-9 status indicator dot */}
            <div className={`w-2.5 h-2.5 mt-1.5 shrink-0 ${s.dotColor}`} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-200 truncate">{activity.title}</span>
                    {/* BB-9 difficulty pill */}
                    <span className={`font-mono text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 shrink-0 ${diffStyle}`}>
                        {activity.difficulty}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] uppercase tracking-[0.15em]
                        ${activity.status === 'COMPLETADO' ? 'text-emerald-500' : activity.status === 'EN_PROGRESO' ? 'text-amber-500' : 'text-slate-500'}`}>
                        {s.label}
                    </span>
                    {timeAgo && (
                        <>
                            <span className="text-slate-600 text-[10px]">&middot;</span>
                            <span className="font-mono text-[10px] text-slate-500">{timeAgo}</span>
                        </>
                    )}
                    {activity.status === 'COMPLETADO' && activity.xpReward > 0 && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-emerald-400 ml-auto bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20">
                            +{activity.xpReward} XP
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
