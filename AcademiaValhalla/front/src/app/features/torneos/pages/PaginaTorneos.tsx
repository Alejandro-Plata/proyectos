import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { torneosService, type TorneoResumen, type TorneoDetalle, type FilaLeaderboard } from '../services/torneosService';

const ESTADO_LABEL: Record<string, string> = { active: 'En curso', upcoming: 'Próximo', finished: 'Finalizado' };
const ESTADO_COLOR: Record<string, string> = {
    active: 'text-emerald-500 border-emerald-500/40',
    upcoming: 'text-sky-400 border-sky-400/40',
    finished: 'text-slate-400 border-slate-400/30',
};

function cuentaAtras(iso: string): string {
    const ms = new Date(iso).getTime() - Date.now();
    if (ms <= 0) return 'finalizado';
    const h = Math.floor(ms / 3_600_000);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ${h % 24}h`;
    const m = Math.floor((ms % 3_600_000) / 60_000);
    return `${h}h ${m}m`;
}

export const PaginaTorneos = () => {
    const navigate = useNavigate();
    const [torneos, setTorneos] = useState<TorneoResumen[]>([]);
    const [cargando, setCargando] = useState(true);
    const [activo, setActivo] = useState<TorneoDetalle | null>(null);
    const [tabla, setTabla] = useState<FilaLeaderboard[]>([]);
    const pollRef = useRef<ReturnType<typeof setInterval>>(undefined);

    const cargar = useCallback(async () => {
        setCargando(true);
        try { setTorneos(await torneosService.listar()); }
        catch { /* */ }
        finally { setCargando(false); }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const abrir = useCallback(async (id: string) => {
        const det = await torneosService.obtener(id);
        setActivo(det);
        setTabla(await torneosService.leaderboard(id));
    }, []);

    // Leaderboard en vivo mientras hay un torneo abierto y activo
    useEffect(() => {
        clearInterval(pollRef.current);
        if (activo && activo.status === 'active') {
            pollRef.current = setInterval(async () => {
                try { setTabla(await torneosService.leaderboard(activo.tournament_id)); } catch { /* */ }
            }, 10_000);
        }
        return () => clearInterval(pollRef.current);
    }, [activo]);

    const unirse = async () => {
        if (!activo) return;
        try {
            await torneosService.unirse(activo.tournament_id);
            await abrir(activo.tournament_id);
        } catch (e: any) { alert(e?.message ?? 'No se pudo unir'); }
    };

    // ── Detalle ────────────────────────────────────────────────
    if (activo) {
        return (
            <div className="max-w-3xl mx-auto px-5 py-8">
                <button onClick={() => setActivo(null)} className="font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-emerald-500 mb-4">← Torneos</button>

                <header className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${ESTADO_COLOR[activo.status]}`}>{ESTADO_LABEL[activo.status]}</span>
                        {activo.season && <span className="font-mono text-[9px] text-slate-400">Temporada {activo.season}</span>}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{activo.title}</h1>
                    {activo.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{activo.description}</p>}
                    <p className="font-mono text-xs text-slate-400 mt-2">
                        {activo.status === 'active' ? `Termina en ${cuentaAtras(activo.ends_at)}` : activo.status === 'upcoming' ? `Empieza en ${cuentaAtras(activo.starts_at)}` : 'Finalizado'} · Premio {activo.reward_xp} XP
                    </p>
                    {activo.status === 'active' && !activo.joined && (
                        <button onClick={unirse} className="mt-3 px-4 py-2 font-mono text-[10px] uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-black">Unirse al torneo</button>
                    )}
                    {activo.joined && <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-emerald-500">Participas</p>}
                </header>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Retos */}
                    <section>
                        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2">Retos {activo.mode === 'troll' && '(modo caza)'}</h2>
                        {activo.mode === 'troll' ? (
                            <button onClick={() => navigate('/dashboard/assistant')} className="w-full text-left border border-emerald-500/20 p-3 hover:border-emerald-500/40">
                                <span className="text-sm text-slate-900 dark:text-white">Ir a la Caza al bichillo (Freya) →</span>
                            </button>
                        ) : (
                            <ul className="space-y-2">
                                {activo.challenges.map(c => (
                                    <li key={c.challenge_id}>
                                        <button onClick={() => navigate('/dashboard/challenges')} className={`w-full text-left border p-3 ${c.solved ? 'border-emerald-500/40 bg-emerald-500/[0.04]' : 'border-slate-200 dark:border-white/10 hover:border-emerald-500/40'}`}>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm ${c.solved ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{c.title}</span>
                                                <span className="font-mono text-[10px] text-emerald-500">{c.points} pts</span>
                                            </div>
                                            <span className="font-mono text-[9px] uppercase text-slate-400">{c.difficulty}{c.solved ? ' · resuelto' : ''}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Leaderboard */}
                    <section>
                        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2">Clasificación {activo.status === 'active' && '· en vivo'}</h2>
                        {tabla.length === 0 ? (
                            <p className="text-sm text-slate-400">Aún no hay puntuaciones.</p>
                        ) : (
                            <ol className="space-y-1">
                                {tabla.map(f => (
                                    <li key={f.user_id} className="flex items-center gap-3 p-2 border-b border-slate-100 dark:border-white/5">
                                        <span className={`font-mono text-sm w-6 ${f.rank <= 3 ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>{f.rank}</span>
                                        <span className="flex-1 text-sm text-slate-900 dark:text-white truncate">{f.username}</span>
                                        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">{f.score} pts</span>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </section>
                </div>
            </div>
        );
    }

    // ── Lista ──────────────────────────────────────────────────
    const grupos: { label: string; items: TorneoResumen[] }[] = [
        { label: 'En curso', items: torneos.filter(t => t.status === 'active') },
        { label: 'Próximos', items: torneos.filter(t => t.status === 'upcoming') },
        { label: 'Finalizados', items: torneos.filter(t => t.status === 'finished') },
    ];

    return (
        <div className="max-w-3xl mx-auto px-5 py-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">Las Justas de Valhalla</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Torneos de retos cronometrados. Resuelve, puntúa y escala en la clasificación.</p>
            </header>

            {cargando ? (
                <p className="text-sm text-slate-400">Cargando...</p>
            ) : torneos.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No hay torneos por ahora. Vuelve pronto.</p>
            ) : (
                <div className="space-y-6">
                    {grupos.filter(g => g.items.length > 0).map(g => (
                        <section key={g.label}>
                            <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2">{g.label}</h2>
                            <div className="space-y-2">
                                {g.items.map(t => (
                                    <button key={t.tournament_id} onClick={() => abrir(t.tournament_id)} className="w-full text-left border border-slate-200 dark:border-white/10 p-4 hover:border-emerald-500/40 transition-colors">
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</h3>
                                            <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border shrink-0 ${ESTADO_COLOR[t.status]}`}>{ESTADO_LABEL[t.status]}</span>
                                        </div>
                                        <p className="font-mono text-[10px] text-slate-400 mt-1">
                                            {t.participant_count} participantes · {t.reward_xp} XP
                                            {t.status === 'active' && ` · termina en ${cuentaAtras(t.ends_at)}`}
                                            {t.status === 'upcoming' && ` · empieza en ${cuentaAtras(t.starts_at)}`}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};
