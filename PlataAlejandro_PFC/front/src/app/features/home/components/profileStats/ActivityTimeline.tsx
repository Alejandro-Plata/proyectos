import { formatTimeAgo } from "../../../../utils/formatTimeAgo";
import type { DashboardActivity } from "../../types/types";

const STATUS_MAP: Record<string, { label: string; color: string; dot: string }> = {
    COMPLETADO:  { label: 'Completado',  color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    EN_PROGRESO: { label: 'En progreso', color: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    SIN_EMPEZAR: { label: 'Sin empezar', color: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-300 dark:bg-slate-600' },
    ABANDONADO:  { label: 'Abandonado',  color: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
};

const DIFF_MAP: Record<string, string> = {
    BASICO:     'bg-emerald-500/[0.08] text-emerald-600 border border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    INTERMEDIO: 'bg-amber-500/[0.08] text-amber-600 border border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    AVANZADO:   'bg-red-500/[0.08] text-red-600 border border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
};

export const ActivityTimeline = ({ activity }: { activity: DashboardActivity }) => {
    const s = STATUS_MAP[activity.status] || STATUS_MAP.SIN_EMPEZAR;
    const diffStyle = DIFF_MAP[activity.difficulty] || DIFF_MAP.BASICO;
    const timeAgo = activity.last_attempt_at ? formatTimeAgo(activity.last_attempt_at) : '';

    return (
        <div className="relative pl-6 py-4 border-b border-emerald-500/10 last:border-0 group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
            {/* Línea conectora — border-l-2 border-emerald-500/30 */}
            <div className="absolute left-[11px] top-0 bottom-0 w-px bg-emerald-500/30 group-last:bottom-auto group-last:h-full" />
            {/* Nodo */}
            <div className={`absolute left-[7px] top-[22px] w-2.5 h-2.5 ${s.dot} ring-4 ring-white dark:ring-[#0a0b0e] z-10`} />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-900 dark:text-white leading-tight">
                            {activity.title}
                        </span>
                        <span className={`inline-flex font-mono text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 ${diffStyle}`}>
                            {activity.difficulty}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]">
                        <span className={s.color}>{s.label}</span>
                        {timeAgo && (
                            <>
                                <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                                <span className="text-slate-400 dark:text-slate-500 normal-case tracking-normal">{timeAgo}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Recompensa XP */}
                {activity.status === 'COMPLETADO' && activity.xpReward > 0 && (
                    <div className="shrink-0 mt-2 sm:mt-0">
                        <span className="inline-flex font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-600 bg-emerald-50 border border-emerald-500/30 px-2 py-1 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                            +{activity.xpReward} XP
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
