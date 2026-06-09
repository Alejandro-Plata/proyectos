import type { RecentActivityProps } from "../../types/types";

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
    return (
        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 p-5 sm:p-6 h-fit relative shadow-sm shadow-emerald-500/5">
            <div className="flex items-center mb-5 sm:mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actividad global</h2>
                <div className="w-2 h-2 bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981] ml-auto" />
            </div>
            <div className="space-y-0">
                {activities.map((activity) => (
                    <div key={activity.id} className="relative pl-6 py-3 border-l-2 border-emerald-500/30 last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors -ml-2 px-2 group">
                        <div className={`absolute left-[-2.5px] top-5 w-1.5 h-1.5 ${activity.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'} ring-4 ring-white dark:ring-[#0a0b0e]`} />
                        <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-1 sm:gap-0">
                            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {activity.mission}
                            </span>
                            {activity.xpEarned && (
                                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/30 self-start sm:self-auto">
                                    +{activity.xpEarned} XP
                                </span>
                            )}
                        </div>
                        <div className="mt-1 flex gap-2">
                            <span className={`font-mono text-[9px] uppercase tracking-[0.15em] ${activity.status === 'completed' ? 'text-emerald-600 dark:text-emerald-500' : 'text-amber-600 dark:text-amber-500'}`}>
                                {activity.status === 'completed' ? 'Completado' : 'En Progreso'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const RecentActivityMobile: React.FC<RecentActivityProps> = ({ activities }) => {
    return (
        <div className="w-full py-6 bg-slate-50 dark:bg-[#050505] border-b border-emerald-500/10">
            <div className="flex items-center px-6 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actividad global</h2>
                <div className="w-2 h-2 bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981] ml-auto" />
            </div>

            <div className="relative px-6">
                <div className="absolute left-[31px] top-3 bottom-3 w-px bg-emerald-500/30" />

                <div className="space-y-0">
                    {activities.map((activity) => (
                        <div key={activity.id} className="relative pl-8 py-4 flex gap-4 group border-b border-emerald-500/10 last:border-0">

                            <div className={`
                                absolute left-0 top-5 w-2.5 h-2.5 shrink-0 z-10
                                ${activity.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}
                                ring-4 ring-slate-50 dark:ring-[#050505]
                            `} />

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300 leading-tight truncate">
                                        {activity.mission}
                                    </span>
                                    {activity.xpEarned && (
                                        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-emerald-400 whitespace-nowrap bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20">
                                            +{activity.xpEarned} XP
                                        </span>
                                    )}
                                </div>
                                <span className={`font-mono text-[10px] uppercase tracking-[0.15em] block ${
                                    activity.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                                }`}>
                                    {activity.status === 'completed' ? 'Completado' : 'En Progreso'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
