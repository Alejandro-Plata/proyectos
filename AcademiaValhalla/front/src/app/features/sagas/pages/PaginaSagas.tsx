import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sagasService, type SagaResumen, type SagaDetalle, type HitoSaga, type TipoHito } from '../services/sagasService';

const ICONO_TIPO: Record<TipoHito, string> = {
    note: '📖', challenge: '⚔️', project: '🏗️', checkpoint: '🚩',
};
const ETIQUETA_TIPO: Record<TipoHito, string> = {
    note: 'Apunte', challenge: 'Reto', project: 'Proyecto', checkpoint: 'Checkpoint',
};

export const PaginaSagas = () => {
    const navigate = useNavigate();
    const [sagas, setSagas] = useState<SagaResumen[]>([]);
    const [cargando, setCargando] = useState(true);
    const [goal, setGoal] = useState('');
    const [generando, setGenerando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activa, setActiva] = useState<SagaDetalle | null>(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        try { setSagas(await sagasService.listar()); }
        catch { /* silencioso */ }
        finally { setCargando(false); }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const crear = async () => {
        if (goal.trim().length < 4) return;
        setGenerando(true); setError(null);
        try {
            const detalle = await sagasService.crear(goal.trim());
            setGoal('');
            setActiva(detalle);
            cargar();
        } catch (e: any) {
            setError(e?.message ?? 'No se pudo generar el roadmap');
        } finally {
            setGenerando(false);
        }
    };

    const abrir = async (id: string) => {
        try { setActiva(await sagasService.obtener(id)); } catch { /* */ }
    };

    const toggleHito = async (h: HitoSaga) => {
        if (!activa) return;
        const nuevo = h.status === 'done' ? 'pending' : 'done';
        await sagasService.actualizarHito(activa.saga_id, h.milestone_id, nuevo);
        setActiva(await sagasService.obtener(activa.saga_id));
        cargar();
    };

    const irAlRecurso = (h: HitoSaga) => {
        if (h.type === 'note' && h.ref_id) navigate(`/dashboard/notes/${h.ref_id}`);
        else if (h.type === 'challenge' && h.ref_id) navigate('/dashboard/challenges');
    };

    // ── Vista de detalle (mapa de la saga) ─────────────────────
    if (activa) {
        return (
            <div className="max-w-3xl mx-auto px-5 py-8">
                <button onClick={() => setActiva(null)} className="font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-emerald-500 mb-4">
                    ← Mis roadmaps
                </button>

                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{activa.title}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Objetivo: {activa.goal}</p>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-emerald-500/10">
                            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${activa.progress}%` }} />
                        </div>
                        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">{activa.progress}%</span>
                    </div>
                </header>

                <ol className="relative border-l-2 border-emerald-500/20 ml-3 space-y-4">
                    {activa.milestones.map((h) => {
                        const hecho = h.status === 'done';
                        const enlazable = (h.type === 'note' || h.type === 'challenge') && h.ref_id;
                        return (
                            <li key={h.milestone_id} className="ml-5 relative">
                                <span className={`absolute -left-[34px] top-1 w-5 h-5 flex items-center justify-center text-[10px] border-2 ${hecho ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white dark:bg-[#0a0b0e] border-emerald-500/40'}`}>
                                    {hecho ? '✓' : ''}
                                </span>
                                <div className={`border p-3 ${hecho ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : 'border-slate-200 dark:border-white/10'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span>{ICONO_TIPO[h.type]}</span>
                                        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">{ETIQUETA_TIPO[h.type]}</span>
                                    </div>
                                    <h3 className={`text-sm font-semibold ${hecho ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{h.title}</h3>
                                    {h.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{h.description}</p>}
                                    <div className="flex items-center gap-2 mt-2">
                                        {enlazable && (
                                            <button onClick={() => irAlRecurso(h)} className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                                                Ir al recurso
                                            </button>
                                        )}
                                        <button onClick={() => toggleHito(h)} className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 border border-slate-200 dark:border-white/10 text-slate-500 hover:border-emerald-500/40 hover:text-emerald-500">
                                            {hecho ? 'Marcar pendiente' : 'Marcar hecho'}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        );
    }

    // ── Vista de lista + creación ──────────────────────────────
    return (
        <div className="max-w-3xl mx-auto px-5 py-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">🗺️ RoadMap de aprendizaje</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Declara un objetivo y Freya te trazará un itinerario con apuntes y retos reales de la academia.
                </p>
            </header>

            <div className="border border-emerald-500/20 p-4 mb-8 space-y-3">
                <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    rows={2}
                    placeholder="Ej.: Quiero aprender backend con Node.js y APIs REST"
                    className="w-full px-3 py-2 text-sm bg-transparent border-b-2 border-emerald-500/40 focus:border-emerald-400 outline-none text-slate-900 dark:text-white resize-none"
                />
                <button
                    onClick={crear}
                    disabled={generando || goal.trim().length < 4}
                    className="w-full py-2.5 font-mono text-[11px] uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-black transition-colors disabled:opacity-50"
                >
                    {generando ? 'Trazando el roadmap...' : 'Trazar mi roadmap'}
                </button>
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            {cargando ? (
                <p className="text-sm text-slate-400">Cargando...</p>
            ) : sagas.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Aún no tienes ningún roadmap. Crea el primero arriba.</p>
            ) : (
                <div className="space-y-3">
                    {sagas.map((s) => (
                        <button key={s.saga_id} onClick={() => abrir(s.saga_id)} className="w-full text-left border border-slate-200 dark:border-white/10 p-4 hover:border-emerald-500/40 transition-colors">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 shrink-0">{s.progress}%</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{s.goal}</p>
                            <div className="mt-2 h-1.5 bg-emerald-500/10">
                                <div className="h-full bg-emerald-500" style={{ width: `${s.progress}%` }} />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
