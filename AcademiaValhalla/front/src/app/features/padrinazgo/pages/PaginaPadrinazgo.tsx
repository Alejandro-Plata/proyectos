import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '../../../utils/getAvatarUrl';
import { padrinazgoService, type Mentor, type MisMentorias } from '../services/padrinazgoService';

type Tab = 'buscar' | 'ser' | 'mias';

const LENGUAJES = ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'cpp', 'c'];

export const PaginaPadrinazgo = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('buscar');

    // Buscar mentor
    const [mentores, setMentores] = useState<Mentor[]>([]);
    const [filtroLang, setFiltroLang] = useState('');
    const [cargandoMentores, setCargandoMentores] = useState(false);
    const [solicitando, setSolicitando] = useState<Mentor | null>(null);
    const [goal, setGoal] = useState('');

    // Ser mentor
    const [elegible, setElegible] = useState<boolean | null>(null);
    const [langsMentor, setLangsMentor] = useState<string[]>([]);
    const [bioMentor, setBioMentor] = useState('');
    const [capacity, setCapacity] = useState(3);
    const [guardandoMentor, setGuardandoMentor] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);

    // Mis mentorías
    const [mias, setMias] = useState<MisMentorias | null>(null);

    const cargarMentores = useCallback(async () => {
        setCargandoMentores(true);
        try { setMentores(await padrinazgoService.listarMentores(filtroLang ? { language: filtroLang } : undefined)); }
        catch { setMentores([]); }
        finally { setCargandoMentores(false); }
    }, [filtroLang]);

    const cargarMias = useCallback(async () => {
        try { setMias(await padrinazgoService.mias()); } catch { /* */ }
    }, []);

    useEffect(() => { if (tab === 'buscar') cargarMentores(); }, [tab, cargarMentores]);
    useEffect(() => { if (tab === 'mias') cargarMias(); }, [tab, cargarMias]);
    useEffect(() => {
        if (tab === 'ser' && elegible === null) {
            padrinazgoService.eligibility().then(r => setElegible(r.eligible)).catch(() => setElegible(false));
        }
    }, [tab, elegible]);

    const enviarSolicitud = async () => {
        if (!solicitando || goal.trim().length < 4) return;
        try {
            await padrinazgoService.solicitar(solicitando.user_id, goal.trim());
            setSolicitando(null); setGoal('');
            setMensaje('Solicitud enviada. El mentor recibirá tu petición.');
        } catch (e: any) { setMensaje(e?.message ?? 'Error'); }
    };

    const activarMentor = async () => {
        setGuardandoMentor(true); setMensaje(null);
        try {
            await padrinazgoService.activarMentor({ languages: langsMentor, bio_mentor: bioMentor, capacity });
            setMensaje('¡Listo! Ya apareces como mentor disponible.');
        } catch (e: any) { setMensaje(e?.message ?? 'Error'); }
        finally { setGuardandoMentor(false); }
    };

    const responder = async (id: string, action: 'accept' | 'reject') => {
        await padrinazgoService.responder(id, action);
        cargarMias();
    };

    const finalizar = async (id: string) => {
        if (!window.confirm('¿Finalizar esta mentoría?')) return;
        await padrinazgoService.finalizar(id);
        cargarMias();
    };

    const toggleLang = (l: string) => setLangsMentor(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);

    return (
        <div className="max-w-3xl mx-auto px-5 py-8">
            <header className="mb-5">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">🛡️ Padrinazgo</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Encuentra un mentor humano o apadrina a quien empieza.</p>
            </header>

            <div className="flex gap-1 mb-5 border-b border-emerald-500/10">
                {([['buscar', 'Buscar mentor'], ['ser', 'Ser mentor'], ['mias', 'Mis mentorías']] as [Tab, string][]).map(([t, label]) => (
                    <button key={t} onClick={() => { setTab(t); setMensaje(null); }} className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 border-b-2 ${tab === t ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400 hover:text-emerald-500'}`}>{label}</button>
                ))}
            </div>

            {mensaje && <p className="mb-4 text-sm text-emerald-600 dark:text-emerald-400">{mensaje}</p>}

            {/* ── Buscar mentor ── */}
            {tab === 'buscar' && (
                <div>
                    <div className="flex gap-2 flex-wrap mb-4">
                        <button onClick={() => setFiltroLang('')} className={`font-mono text-[10px] uppercase px-2 py-1 border ${!filtroLang ? 'border-emerald-500/50 text-emerald-500' : 'border-slate-200 dark:border-white/10 text-slate-400'}`}>Todos</button>
                        {LENGUAJES.map(l => (
                            <button key={l} onClick={() => setFiltroLang(l)} className={`font-mono text-[10px] uppercase px-2 py-1 border ${filtroLang === l ? 'border-emerald-500/50 text-emerald-500' : 'border-slate-200 dark:border-white/10 text-slate-400'}`}>{l}</button>
                        ))}
                    </div>
                    {cargandoMentores ? <p className="text-sm text-slate-400">Cargando...</p>
                        : mentores.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400">No hay mentores disponibles con ese filtro.</p>
                        : (
                            <div className="space-y-2">
                                {mentores.map(m => (
                                    <div key={m.user_id} className="flex items-center gap-3 border border-slate-200 dark:border-white/10 p-3">
                                        <img src={getAvatarUrl(m.username, m.avatar_url)} alt="" className="w-10 h-10 hex-shield object-cover shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{m.username} <span className="font-mono text-[10px] text-slate-400">· Nivel {m.level}</span></p>
                                            <p className="font-mono text-[10px] text-slate-400">{m.languages.join(', ') || 'varios'} · {m.slots_free} plaza(s)</p>
                                            {m.bio_mentor && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{m.bio_mentor}</p>}
                                        </div>
                                        <button onClick={() => setSolicitando(m)} className="shrink-0 font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10">Solicitar</button>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            )}

            {/* ── Ser mentor ── */}
            {tab === 'ser' && (
                <div>
                    {elegible === false ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">Todavía no cumples los requisitos para ser mentor: alcanza el <strong>nivel 10</strong> o suma <strong>15 soluciones</strong> aceptadas.</p>
                    ) : elegible === null ? <p className="text-sm text-slate-400">Comprobando...</p> : (
                        <div className="space-y-4 border border-emerald-500/20 p-4">
                            <div>
                                <label className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block mb-1.5">Lenguajes que ofreces</label>
                                <div className="flex flex-wrap gap-2">
                                    {LENGUAJES.map(l => (
                                        <button key={l} onClick={() => toggleLang(l)} className={`font-mono text-[10px] uppercase px-2 py-1 border ${langsMentor.includes(l) ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/[0.06]' : 'border-slate-200 dark:border-white/10 text-slate-400'}`}>{l}</button>
                                    ))}
                                </div>
                            </div>
                            <textarea value={bioMentor} onChange={e => setBioMentor(e.target.value)} rows={3} placeholder="Preséntate como mentor (opcional)..." className="w-full px-3 py-2 text-sm bg-transparent border border-emerald-500/20 focus:border-emerald-400 outline-none text-slate-900 dark:text-white" />
                            <div className="flex items-center gap-2">
                                <label className="font-mono text-[10px] uppercase text-slate-400">Plazas máximas</label>
                                <input type="number" min={1} max={20} value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="w-16 px-2 py-1 text-sm bg-transparent border border-emerald-500/20 text-slate-900 dark:text-white" />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={activarMentor} disabled={guardandoMentor || langsMentor.length === 0} className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-50">
                                    {guardandoMentor ? 'Guardando...' : 'Activar perfil de mentor'}
                                </button>
                                <button onClick={() => padrinazgoService.desactivarMentor().then(() => setMensaje('Perfil desactivado.'))} className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest border border-slate-200 dark:border-white/10 text-slate-400">Desactivar</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Mis mentorías ── */}
            {tab === 'mias' && mias && (
                <div className="space-y-6">
                    <section>
                        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2">Como mentor</h2>
                        {mias.as_mentor.length === 0 ? <p className="text-sm text-slate-400">Sin solicitudes ni aprendices.</p> : (
                            <div className="space-y-2">
                                {mias.as_mentor.map(m => (
                                    <div key={m.mentorship_id} className="flex items-center gap-3 border border-slate-200 dark:border-white/10 p-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-900 dark:text-white">{m.other?.username} <span className="font-mono text-[9px] uppercase text-slate-400">· {m.status === 'pending' ? 'solicita' : 'activo'}</span></p>
                                            {m.goal && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{m.goal}</p>}
                                        </div>
                                        {m.status === 'pending' ? (
                                            <div className="flex gap-1 shrink-0">
                                                <button onClick={() => responder(m.mentorship_id, 'accept')} className="font-mono text-[9px] uppercase px-2 py-1 bg-emerald-500 text-black">Aceptar</button>
                                                <button onClick={() => responder(m.mentorship_id, 'reject')} className="font-mono text-[9px] uppercase px-2 py-1 border border-red-500/30 text-red-500">Rechazar</button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1 shrink-0">
                                                <button onClick={() => navigate('/dashboard/messages')} className="font-mono text-[9px] uppercase px-2 py-1 border border-emerald-500/40 text-emerald-500">Chat</button>
                                                <button onClick={() => finalizar(m.mentorship_id)} className="font-mono text-[9px] uppercase px-2 py-1 border border-slate-200 dark:border-white/10 text-slate-400">Finalizar</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                    <section>
                        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2">Como aprendiz</h2>
                        {mias.as_apprentice.length === 0 ? <p className="text-sm text-slate-400">No tienes mentor todavía.</p> : (
                            <div className="space-y-2">
                                {mias.as_apprentice.map(m => (
                                    <div key={m.mentorship_id} className="flex items-center gap-3 border border-slate-200 dark:border-white/10 p-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-900 dark:text-white">{m.other?.username} <span className="font-mono text-[9px] uppercase text-slate-400">· {m.status === 'pending' ? 'pendiente' : 'activo'}</span></p>
                                        </div>
                                        {m.status === 'active' && <button onClick={() => navigate('/dashboard/messages')} className="shrink-0 font-mono text-[9px] uppercase px-2 py-1 border border-emerald-500/40 text-emerald-500">Chat</button>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* Modal solicitar */}
            {solicitando && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSolicitando(null)}>
                    <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/20 p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Solicitar a {solicitando.username}</h3>
                        <textarea value={goal} onChange={e => setGoal(e.target.value)} rows={3} placeholder="¿En qué quieres que te ayude?" className="w-full px-3 py-2 text-sm bg-transparent border border-emerald-500/20 focus:border-emerald-400 outline-none text-slate-900 dark:text-white mb-3" />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setSolicitando(null)} className="font-mono text-[10px] uppercase px-3 py-1.5 text-slate-400">Cancelar</button>
                            <button onClick={enviarSolicitud} disabled={goal.trim().length < 4} className="font-mono text-[10px] uppercase px-3 py-1.5 bg-emerald-500 text-black disabled:opacity-50">Enviar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
