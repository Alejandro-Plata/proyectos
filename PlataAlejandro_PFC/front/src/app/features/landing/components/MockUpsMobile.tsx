import { Icons } from "../../../components/Icons";

export const MockupAI = () => (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#08090b]">
        <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-center scale-75">
            <div className="w-4 h-4 bg-white shadow-[0_0_40px_rgba(52,211,153,0.8)] animate-pulse z-20 relative">
                <div className="absolute inset-0 m-auto w-1 h-1 bg-emerald-500" />
            </div>
            <div className="absolute w-16 h-16 border border-emerald-400/30 rounded-full animate-[spin_3s_linear_infinite]"
                style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }} />
            <div className="absolute w-32 h-32 border border-emerald-500/10 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
        </div>

        <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg w-max"
            style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}
        >
            <span className="text-[9px] text-emerald-300 font-mono tracking-wider uppercase">Freya está escribiendo</span>
            <div className="flex gap-1">
                <div className="w-1 h-1 bg-emerald-400 animate-bounce delay-0" />
                <div className="w-1 h-1 bg-emerald-400 animate-bounce delay-150" />
                <div className="w-1 h-1 bg-emerald-400 animate-bounce delay-300" />
            </div>
        </div>
    </div>
);

export const MockupGamification = () => (
    <div className="w-full h-full flex flex-col justify-end relative overflow-hidden bg-[#050505] border-t border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />

        <div
            className="relative z-10 mx-auto w-[90%] mb-4 p-3 border border-white/10 bg-[#0F1115]/95 backdrop-blur-md shadow-2xl"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <span className="text-[8px] text-emerald-400 font-mono tracking-widest uppercase mb-0.5 flex items-center gap-1">
                        <span className="w-1 h-1 bg-emerald-500 animate-pulse" /> Liga
                    </span>
                    <span className="font-mono text-sm font-bold text-white tracking-tight">DIAMANTE II</span>
                </div>
                <div className="text-emerald-500 opacity-20">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 flex-shrink-0">
                    {Icons.progressCircle}
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] font-bold text-white">75%</div>
                </div>
                <div className="flex flex-col gap-1 w-full min-w-0">
                    <div className="flex justify-between text-[9px] items-center">
                        <span className="font-mono text-slate-400">XP Total</span>
                        <span className="font-mono font-bold text-white">12,450</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 mt-0.5 overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-20 bg-emerald-500/20 blur-[50px] pointer-events-none" />
    </div>
);

export const MockupCommunity = () => {
    const activities = [
        { user: "Alex", action: "solved", target: "Two Sum", color: "text-emerald-400", char: "A" },
        { user: "Sarah", action: "joined", target: "The Clan", color: "text-blue-400", char: "S" },
        { user: "Ragnar", action: "pushed", target: "fix-bug", color: "text-purple-400", char: "R" },
        { user: "Loki", action: "reviewed", target: "PR #1", color: "text-yellow-400", char: "L" },
    ];

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col bg-[#050505]">
            <div className="absolute inset-0 opacity-20 pointer-events-none">{Icons.networkGrid}</div>

            <div className="relative z-10 px-5 pt-5 flex justify-between items-start mb-1">
                <div>
                    <h3 className="font-mono text-base font-bold uppercase tracking-[0.06em] text-white leading-none mb-1">Academia Valhalla</h3>
                </div>
                <div
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[8px] font-mono text-blue-400 font-bold uppercase tracking-wide"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)' }}
                >
                    <span className="relative flex h-1 w-1">
                        <span className="animate-ping absolute inline-flex h-full w-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex h-1 w-1 bg-blue-500" />
                    </span>
                    {' '}Live
                </div>
            </div>

            <div className="relative z-10 flex-1 px-3 pb-3 flex flex-col justify-end gap-1.5">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#050505] to-transparent z-20 pointer-events-none" />

                {activities.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 p-2 bg-white/5 border border-white/5 backdrop-blur-sm animate-fade-in-up"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="w-5 h-5 bg-slate-800 border border-white/10 flex items-center justify-center font-mono text-[8px] font-bold text-white shrink-0">
                            {item.char}
                        </div>
                        <p className="font-mono text-[9px] text-slate-300 flex-1 truncate min-w-0">
                            <span className="font-bold text-white">{item.user}</span>{' '}{item.action}{' '}<span className={item.color}>{item.target}</span>
                        </p>
                        <span className="font-mono text-[8px] text-slate-600 shrink-0">2m</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
