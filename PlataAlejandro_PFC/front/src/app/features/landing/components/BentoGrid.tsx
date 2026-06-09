import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../../../components/Icons';

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(16, 185, 129, 0.12)" }: { children: ReactNode; className?: string; spotlightColor?: string }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative overflow-hidden border border-emerald-500/15 dark:border-emerald-500/10 bg-white dark:bg-[#0a0b0e] ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
};

const MockupEditor = () => (
    <div className="w-full h-full bg-[#1e1e1e] border-t border-l border-white/10 p-6 shadow-2xl">
        <div className="flex gap-1 mb-4 border-b border-white/5 pb-2">
            <div className="px-3 py-1 bg-white/5 text-[10px] font-mono text-emerald-400 border border-white/5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500" />
                engine.core.ts
            </div>
            <div className="px-3 py-1 text-[10px] font-mono text-slate-500 flex items-center gap-2 opacity-50">
                types.d.ts
            </div>
        </div>
        <div className="space-y-3 font-mono text-xs leading-relaxed opacity-90">
            <div className="flex gap-3"><span className="text-slate-700 select-none">1</span><div className="flex-1"><span className="text-purple-400">import</span> <span className="text-yellow-100">{`{ ValhallaInstance }`}</span> <span className="text-purple-400">from</span> <span className="text-emerald-300">'@core/engine'</span>;</div></div>
            <div className="flex gap-3"><span className="text-slate-700 select-none">2</span></div>
            <div className="flex gap-3"><span className="text-slate-700 select-none">3</span><div className="flex-1"><span className="text-blue-400">class</span> <span className="text-yellow-300">VikingWarrior</span> <span className="text-blue-400">implements</span> <span className="text-yellow-100">Unit</span> {`{`}</div></div>
            <div className="flex gap-3"><span className="text-slate-700 select-none">4</span><div className="flex-1 pl-4"><span className="text-slate-500 italic">// Logic implementation for battle system</span></div></div>
            <div className="flex gap-3"><span className="text-slate-700 select-none">5</span><div className="flex-1 pl-4"><span className="text-purple-400">constructor</span>(<span className="text-orange-300">level</span>: <span className="text-blue-400">number</span>) {`{`}</div></div>
            <div className="flex gap-3"><span className="text-slate-700 select-none">6</span><div className="flex-1 pl-8"><span className="text-blue-400">this</span>.<span className="text-white">power</span> = <span className="text-orange-300">level</span> * <span className="text-emerald-300">1.5</span>;</div></div>
            <div className="flex gap-3"><span className="text-slate-700 select-none">7</span><div className="flex-1 pl-4">{`}`}</div></div>
            <div className="flex gap-3"><span className="text-slate-700 select-none">8</span><div className="flex-1 pl-4"><span className="text-purple-400">attack</span>() {`{`}</div></div>
            <div className="flex gap-3"><span className="text-slate-700 select-none">9</span><div className="flex-1 pl-8"><span className="text-blue-400">return</span> <span className="text-white">true</span>;</div></div>
        </div>
    </div>
);

const MockupAI = () => (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
        <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-center">
            <div className="w-4 h-4 bg-emerald-500 dark:bg-white shadow-[0_0_40px_rgba(52,211,153,0.8)] animate-pulse z-20 relative">
                <div className="absolute inset-0 m-auto w-1 h-1 bg-white dark:bg-emerald-500" />
            </div>
            <div className="absolute w-16 h-16 border border-emerald-400/40 rounded-full animate-[spin_3s_linear_infinite]"
                style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }} />
            <div className="absolute w-32 h-32 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
            <div className="absolute w-48 h-48 border border-dashed border-emerald-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
        </div>

        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-emerald-400 animate-pulse opacity-60" />
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-emerald-500 animate-pulse delay-700 opacity-40" />
        <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-teal-400 animate-pulse delay-300 opacity-50" />

        <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md flex items-center gap-2 shadow-sm"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
        >
            <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-mono tracking-wider uppercase">Freya está escribiendo</span>
            <div className="flex gap-1">
                <div className="w-1 h-1 bg-emerald-500 dark:bg-emerald-400 animate-bounce delay-0" />
                <div className="w-1 h-1 bg-emerald-500 dark:bg-emerald-400 animate-bounce delay-150" />
                <div className="w-1 h-1 bg-emerald-500 dark:bg-emerald-400 animate-bounce delay-300" />
            </div>
        </div>
    </div>
);

export const MockupGamification = () => (
    <div className="w-full h-full flex flex-col justify-end relative overflow-hidden bg-slate-50 dark:bg-[#050505]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50 dark:opacity-30" />

        <div
            className="relative z-10 mx-auto w-[85%] mb-6 p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1115]/90 shadow-lg dark:shadow-2xl"
            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
        >
            <div className="flex justify-between items-start mb-5">
                <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono tracking-widest uppercase mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                        Liga Actual
                    </span>
                    <span className="font-mono text-xl font-bold text-slate-900 dark:text-white tracking-tight">DIAMANTE II</span>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="relative w-14 h-14 flex-shrink-0">
                    {Icons.progressCircle}
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono text-slate-700 dark:text-white">75%</div>
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex justify-between text-[11px] items-center">
                        <span className="font-mono text-slate-500 dark:text-slate-400">XP Total</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">12,450</span>
                    </div>
                    <div className="flex justify-between text-[11px] items-center">
                        <span className="font-mono text-slate-500 dark:text-slate-400">Racha</span>
                        <span className="font-mono font-bold text-orange-500 flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 pb-0.5">{Icons.flame}</div>
                            14 Días
                        </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 mt-1.5 overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-emerald-500/10 blur-[60px] pointer-events-none" />
    </div>
);

const MockupCommunity = () => {
    const activities = [
        { user: "AlexDev", action: "solved", target: "Two Sum", time: "2m", color: "text-emerald-600 dark:text-emerald-400" },
        { user: "Sarah_K", action: "pushed to", target: "main", time: "5m", color: "text-purple-600 dark:text-purple-400" },
        { user: "Viking01", action: "joined", target: "The Clan", time: "12m", color: "text-blue-600 dark:text-blue-400" },
        { user: "Rustacean", action: "reviewed", target: "PR #402", time: "15m", color: "text-amber-600 dark:text-yellow-400" },
    ];

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col bg-slate-50 dark:bg-[#050505]">
            <div className="absolute inset-0 opacity-[0.07] dark:opacity-20">
                <div className="absolute top-4 left-8 w-1 h-1 bg-slate-900 dark:bg-white animate-ping" />
                <div className="absolute top-12 right-12 w-1 h-1 bg-slate-900 dark:bg-white animate-ping delay-700" />
                <div className="absolute bottom-8 left-1/3 w-1 h-1 bg-slate-900 dark:bg-white animate-ping delay-1000" />
                {Icons.networkGrid}
            </div>

            <div className="relative z-10 px-6 pt-6 flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-mono text-base font-bold uppercase tracking-[0.06em] text-slate-900 dark:text-white leading-none mb-1">Academia Valhala</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Apoyo, risas y oportunidades</p>
                </div>
                <div
                    className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                >
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 bg-blue-500" />
                    </span>
                    Live
                </div>
            </div>

            <div className="relative z-10 flex-1 px-4 pb-2 flex flex-col justify-end">
                <div className="space-y-2">
                    {activities.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 animate-fade-in-up"
                            style={{ animationDelay: `${i * 150}ms` }}
                        >
                            <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-white/10 flex items-center justify-center text-[8px] font-mono font-bold text-slate-700 dark:text-white shrink-0">
                                {item.user.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0 font-mono text-[10px] text-slate-500 dark:text-slate-300 truncate">
                                <span className="font-bold text-slate-900 dark:text-white">{item.user}</span>{' '}{item.action}{' '}<span className={`${item.color} font-medium`}>{item.target}</span>
                            </div>
                            <div className="font-mono text-[9px] text-slate-400 dark:text-slate-600 whitespace-nowrap">{item.time}</div>
                        </div>
                    ))}
                    <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-slate-50 dark:from-[#0a0b0e] to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export const BentoGrid = () => {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 mb-32 z-10">

            {/* Cabecera de sección */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-block w-1 h-4 bg-emerald-500 shrink-0" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Plataforma</span>
                    </div>
                    <h2 className="font-mono text-3xl md:text-4xl font-bold uppercase tracking-[0.04em] text-slate-900 dark:text-white mb-4">
                        Programar no es aburrido
                    </h2>
                    <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                        Ecosistema diseñado para ingeniería de software de alto rendimiento. Sin relleno, solo código.
                    </p>
                </div>
                <Link
                    to="/register"
                    className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] font-bold px-5 py-2.5 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/[0.08] transition-colors shrink-0"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                >
                    Explorar →
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">

                {/* 1. Editor */}
                <SpotlightCard className="col-span-1 md:col-span-6 lg:col-span-8 min-h-[450px] md:min-h-[360px] group overflow-hidden relative">
                    <div className="relative z-20 p-6 md:p-8 flex flex-col justify-start md:max-w-md h-full pointer-events-none">
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1 border border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400 text-[10px] font-mono tracking-widest font-bold mb-4 w-fit"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}
                        >
                            <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                            CLOUD_ENGINE
                        </div>
                        <h3 className="font-mono text-2xl font-bold uppercase tracking-[0.06em] text-slate-900 dark:text-white mb-3 text-center md:text-left">
                            Programa en línea
                        </h3>
                        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 leading-relaxed text-center md:text-left mb-6 md:mb-0">
                            Entorno basado en Monaco Editor. Ejecuta JavaScript, Java, C#, Python y Go directamente en el navegador.
                        </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[220px] md:top-0 md:bottom-0 md:h-auto md:left-auto md:w-[65%] overflow-hidden z-10 pointer-events-none">
                        <div className="w-full h-full transform translate-y-[10%] md:translate-x-[15%] md:translate-y-[15%] scale-[1.1] md:scale-[1.15] origin-bottom md:origin-bottom-right transition-transform duration-700 ease-out group-hover:translate-y-[5%] md:group-hover:translate-x-[10%] md:group-hover:translate-y-[10%]">
                            <MockupEditor />
                        </div>
                        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white dark:from-[#0a0b0e] to-transparent md:inset-y-0 md:left-0 md:top-0 md:h-auto md:w-32 md:bg-gradient-to-r md:from-white md:dark:from-[#0a0b0e] md:to-transparent" />
                    </div>
                </SpotlightCard>

                {/* 2. Mentoría IA */}
                <SpotlightCard className="col-span-1 md:col-span-6 lg:col-span-4 min-h-[360px]" spotlightColor="rgba(16, 185, 129, 0.12)">
                    <div className="relative z-20 p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                {Icons.chip}
                            </div>
                            <span
                                className="text-[9px] font-mono text-emerald-600/80 dark:text-emerald-500/80 bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10"
                                style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                            >
                                v2.4.0 (ODIN)
                            </span>
                        </div>
                        <h3 className="font-mono text-xl font-bold uppercase tracking-[0.08em] text-slate-900 dark:text-white mb-2">
                            Mentoría incorporada
                        </h3>
                        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 leading-relaxed">
                            Un tutor personal que entiende tu código. Aprovecha las herramientas de IA para aprender más rápido.
                        </p>
                    </div>
                    <div className="absolute inset-0 top-[30%] z-10">
                        <MockupAI />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
                </SpotlightCard>

                {/* 3. Gamificación */}
                <SpotlightCard className="col-span-1 md:col-span-3 lg:col-span-6 min-h-[260px] overflow-hidden" spotlightColor="rgba(249, 115, 22, 0.10)">
                    <div className="absolute z-20 p-6 w-full pointer-events-none">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Compite con la comunidad</span>
                        </div>
                        <h3 className="font-mono text-lg font-bold uppercase tracking-[0.06em] text-slate-900 dark:text-white">Compite y mejora</h3>
                        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 max-w-xs">Sube de rango y gana recompensas.</p>
                    </div>
                    <MockupGamification />
                </SpotlightCard>

                {/* 4. Comunidad */}
                <SpotlightCard className="col-span-1 md:col-span-3 lg:col-span-6 min-h-[260px] overflow-hidden p-0" spotlightColor="rgba(59, 130, 246, 0.10)">
                    <MockupCommunity />
                </SpotlightCard>

            </div>
        </section>
    );
};
