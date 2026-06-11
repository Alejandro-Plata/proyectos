import type { AgendaProps } from "../../types/types";

export const AgendaDesktop: React.FC<AgendaProps> = ({ events }) => {
    return (
        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 p-6 h-fit shadow-sm shadow-emerald-500/5">
            <div className="flex items-center mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Agenda</h2>
                <div className="ml-auto font-mono text-[10px] uppercase tracking-[0.15em] bg-slate-100 dark:bg-white/5 px-2 py-1 text-slate-500 border border-emerald-500/15 dark:border-emerald-500/10">HOY</div>
            </div>
            <div className="space-y-3">
                {events.map((event) => (
                    <div key={event.id} className="flex gap-3 items-center border-l-2 border-emerald-500/30 pl-3 py-2 transition-colors hover:border-emerald-500/60 group cursor-default">
                        <div className="flex flex-col items-center justify-center w-12 h-12 shrink-0 border border-emerald-500/15 dark:border-emerald-500/10 bg-slate-50 dark:bg-[#0F1115] group-hover:border-emerald-500/40 transition-colors">
                            <span className="font-mono text-xs font-bold text-slate-700 dark:text-white">{event.time.split(':')[0]}</span>
                            <span className="font-mono text-[8px] uppercase text-slate-400">{event.time.split(':')[1] === '00' ? ':00' : 'min'}</span>
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-700 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{event.title}</h4>
                            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-0.5">{event.type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AgendaMobile: React.FC<AgendaProps> = ({ events }) => {
    return (
        <div className="w-full bg-slate-50 dark:bg-[#050505] pt-4 pb-6 border-b border-emerald-500/15 dark:border-emerald-500/10">

            <div className="flex items-center px-6 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Agenda</h2>
                <div className="ml-auto font-mono text-[10px] uppercase tracking-[0.15em] bg-slate-100 dark:bg-white/5 px-2 py-1 text-slate-500 dark:text-slate-400 border border-emerald-500/15 dark:border-emerald-500/10">HOY</div>
            </div>

            <div className="flex flex-col">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="flex gap-4 items-center px-6 py-4 border-b border-emerald-500/10 active:bg-slate-100 dark:active:bg-white/5 transition-colors border-l-2 border-l-emerald-500/30"
                    >
                        <div className="flex flex-col items-center justify-center w-12 shrink-0 border-r border-emerald-500/15 dark:border-emerald-500/10 pr-4">
                            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{event.time.split(':')[0]}</span>
                            <span className="font-mono text-[9px] uppercase text-slate-500">{event.time.split(':')[1] === '00' ? ':00' : 'min'}</span>
                        </div>

                        <div className="min-w-0 flex-1">
                            <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-900 dark:text-white truncate">{event.title}</h4>
                            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-0.5">{event.type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
