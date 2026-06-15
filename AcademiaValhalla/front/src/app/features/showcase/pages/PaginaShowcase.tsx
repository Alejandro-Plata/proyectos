import { useEffect, useState, useCallback } from 'react';
import { resolveAssetUrl } from '../../../utils/getAvatarUrl';
import { showcaseService, type ProyectoResumen, type ProyectoDetalle } from '../services/showcaseService';

const DIMENSIONES: { key: string; label: string }[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'diseno', label: 'Diseño' },
    { key: 'idea', label: 'Idea' },
    { key: 'documentacion', label: 'Documentación' },
];

type Vista = 'galeria' | 'detalle' | 'crear';

export const PaginaShowcase = () => {
    const [vista, setVista] = useState<Vista>('galeria');
    const [proyectos, setProyectos] = useState<ProyectoResumen[]>([]);
    const [cargando, setCargando] = useState(true);
    const [activo, setActivo] = useState<ProyectoDetalle | null>(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        try { setProyectos(await showcaseService.listar()); }
        catch { /* */ }
        finally { setCargando(false); }
    }, []);

    useEffect(() => { if (vista === 'galeria') cargar(); }, [vista, cargar]);

    const abrir = async (id: string) => {
        setActivo(await showcaseService.obtener(id));
        setVista('detalle');
    };

    if (vista === 'crear') return <FormularioProyecto onHecho={() => setVista('galeria')} onCancelar={() => setVista('galeria')} />;
    if (vista === 'detalle' && activo) return <Detalle proyecto={activo} onVolver={() => { setActivo(null); setVista('galeria'); }} onRecargar={() => abrir(activo.project_id)} />;

    const destacados = proyectos.filter(p => p.featured);
    const resto = proyectos.filter(p => !p.featured);

    return (
        <div className="max-w-4xl mx-auto px-5 py-8">
            <header className="mb-6 flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">Salón de los Héroes</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Muestra lo que has construido y recibe feedback de la comunidad.</p>
                </div>
                <button onClick={() => setVista('crear')} className="shrink-0 px-4 py-2 font-mono text-[10px] uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-black">+ Publicar</button>
            </header>

            {cargando ? <p className="text-sm text-slate-400">Cargando...</p>
                : proyectos.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-400">Todavía no hay proyectos. ¡Sé el primero!</p>
                : (
                    <div className="space-y-8">
                        {destacados.length > 0 && (
                            <section>
                                <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-500 mb-2">Destacados</h2>
                                <div className="grid sm:grid-cols-2 gap-3">{destacados.map(p => <Tarjeta key={p.project_id} p={p} onClick={() => abrir(p.project_id)} />)}</div>
                            </section>
                        )}
                        <section>
                            <div className="grid sm:grid-cols-2 gap-3">{resto.map(p => <Tarjeta key={p.project_id} p={p} onClick={() => abrir(p.project_id)} />)}</div>
                        </section>
                    </div>
                )}
        </div>
    );
};

function Tarjeta({ p, onClick }: { p: ProyectoResumen; onClick: () => void }) {
    return (
        <button onClick={onClick} className="text-left border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 transition-colors overflow-hidden">
            {p.cover_image_url
                ? <img src={resolveAssetUrl(p.cover_image_url)} alt="" className="w-full h-32 object-cover" />
                : <div className="w-full h-32 bg-emerald-500/[0.06] flex items-center justify-center text-emerald-500/40 font-mono text-xs">sin portada</div>}
            <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{p.title}{p.featured && <span className="text-amber-500"> ★</span>}</h3>
                    <span className="font-mono text-[10px] text-emerald-500 shrink-0">▲ {p.upvote_count}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{p.summary}</p>
                <div className="flex flex-wrap gap-1 mt-2">{p.tech_stack.slice(0, 4).map(t => <span key={t} className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-emerald-500/[0.08] text-emerald-500">{t}</span>)}</div>
            </div>
        </button>
    );
}

function Detalle({ proyecto, onVolver, onRecargar }: { proyecto: ProyectoDetalle; onVolver: () => void; onRecargar: () => void }) {
    const [dim, setDim] = useState('codigo');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [enviando, setEnviando] = useState(false);

    const votar = async () => { await showcaseService.upvote(proyecto.project_id); onRecargar(); };
    const enviarFeedback = async () => {
        setEnviando(true);
        try { await showcaseService.feedback(proyecto.project_id, dim, rating, comment.trim() || undefined); setComment(''); onRecargar(); }
        finally { setEnviando(false); }
    };
    const borrar = async () => { if (window.confirm('¿Eliminar el proyecto?')) { await showcaseService.eliminar(proyecto.project_id); onVolver(); } };

    return (
        <div className="max-w-3xl mx-auto px-5 py-8">
            <button onClick={onVolver} className="font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-emerald-500 mb-4">← Salón</button>

            {proyecto.cover_image_url && <img src={resolveAssetUrl(proyecto.cover_image_url)} alt="" className="w-full max-h-64 object-cover border border-slate-200 dark:border-white/10 mb-4" />}

            <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{proyecto.title}{proyecto.featured && <span className="text-amber-500"> ★</span>}</h1>
                <button onClick={votar} className={`shrink-0 font-mono text-[11px] px-3 py-1.5 border ${proyecto.i_upvoted ? 'border-emerald-500 text-emerald-500 bg-emerald-500/[0.06]' : 'border-slate-200 dark:border-white/10 text-slate-400'}`}>▲ {proyecto.upvote_count}</button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{proyecto.summary}</p>
            <div className="flex items-center gap-3 mb-4 text-xs">
                {proyecto.author && <span className="text-slate-500">por {proyecto.author.username}</span>}
                {proyecto.repo_url && <a href={proyecto.repo_url} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline">Repositorio ↗</a>}
                {proyecto.demo_url && <a href={proyecto.demo_url} target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline">Demo ↗</a>}
                {proyecto.is_owner && <button onClick={borrar} className="text-red-500 ml-auto">Eliminar</button>}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-6">{proyecto.tech_stack.map(t => <span key={t} className="font-mono text-[10px] uppercase px-2 py-0.5 bg-emerald-500/[0.08] text-emerald-500">{t}</span>)}</div>

            <div className="prose-sm space-y-3 mb-8">
                {proyecto.description.map((b, i) => b.type === 'code'
                    ? <pre key={i} className="bg-[#0a0b0e] text-slate-200 text-[13px] p-3 overflow-x-auto font-mono">{b.value}</pre>
                    : <p key={i} className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{b.value}</p>)}
            </div>

            {/* Feedback por dimensiones */}
            <section className="border-t border-emerald-500/10 pt-5">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-3">Feedback</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                    {DIMENSIONES.map(d => {
                        const s = proyecto.feedback_summary[d.key] ?? { count: 0, avg: 0 };
                        return (
                            <div key={d.key} className="border border-slate-200 dark:border-white/10 p-2 text-center">
                                <p className="font-mono text-[9px] uppercase text-slate-400">{d.label}</p>
                                <p className="text-lg font-bold text-emerald-500">{s.avg || '—'}</p>
                                <p className="font-mono text-[9px] text-slate-400">{s.count} reseña(s)</p>
                            </div>
                        );
                    })}
                </div>

                {!proyecto.is_owner && (
                    <div className="border border-emerald-500/20 p-3 mb-5 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <select value={dim} onChange={e => setDim(e.target.value)} className="text-xs bg-transparent border border-emerald-500/20 px-2 py-1 text-slate-700 dark:text-slate-300">
                                {DIMENSIONES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                            </select>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => setRating(n)} className={`w-6 h-6 text-sm ${n <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}>★</button>)}
                            </div>
                        </div>
                        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} placeholder="Comentario (opcional)" className="w-full px-2 py-1.5 text-sm bg-transparent border border-emerald-500/20 focus:border-emerald-400 outline-none text-slate-900 dark:text-white" />
                        <button onClick={enviarFeedback} disabled={enviando} className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-50">Enviar reseña</button>
                    </div>
                )}

                <div className="space-y-2">
                    {proyecto.feedback.map(f => (
                        <div key={f.feedback_id} className="border-l-2 border-emerald-500/30 pl-3 py-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-900 dark:text-white">{f.author?.username}</span>
                                <span className="font-mono text-[9px] uppercase text-slate-400">{DIMENSIONES.find(d => d.key === f.dimension)?.label}</span>
                                <span className="text-amber-400 text-xs">{'★'.repeat(f.rating)}</span>
                            </div>
                            {f.comment && <p className="text-sm text-slate-600 dark:text-slate-300">{f.comment}</p>}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function FormularioProyecto({ onHecho, onCancelar }: { onHecho: () => void; onCancelar: () => void }) {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [repo, setRepo] = useState('');
    const [demo, setDemo] = useState('');
    const [stack, setStack] = useState('');
    const [cover, setCover] = useState<string | null>(null);
    const [subiendo, setSubiendo] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subirPortada = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSubiendo(true);
        try { setCover(await showcaseService.subirPortada(file)); }
        catch (err: any) { setError(err?.message ?? 'Error al subir'); }
        finally { setSubiendo(false); }
    };

    const guardar = async () => {
        if (!title.trim() || !summary.trim()) { setError('Título y resumen son obligatorios'); return; }
        setGuardando(true); setError(null);
        try {
            await showcaseService.crear({
                title, summary,
                description: descripcion.trim() ? [{ type: 'text', value: descripcion }] : [],
                repo_url: repo.trim() || null,
                demo_url: demo.trim() || null,
                tech_stack: stack.split(',').map(s => s.trim()).filter(Boolean),
                cover_image_url: cover,
            });
            onHecho();
        } catch (e: any) { setError(e?.message ?? 'Error al publicar'); }
        finally { setGuardando(false); }
    };

    const input = 'w-full px-3 py-2 text-sm bg-transparent border border-emerald-500/20 focus:border-emerald-400 outline-none text-slate-900 dark:text-white';

    return (
        <div className="max-w-2xl mx-auto px-5 py-8">
            <button onClick={onCancelar} className="font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-emerald-500 mb-4">← Cancelar</button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Publicar un proyecto</h1>
            <div className="space-y-3">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" className={input} maxLength={160} />
                <input value={summary} onChange={e => setSummary(e.target.value)} placeholder="Resumen breve" className={input} maxLength={280} />
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={5} placeholder="Descripción del proyecto..." className={input} />
                <input value={repo} onChange={e => setRepo(e.target.value)} placeholder="URL del repositorio (opcional)" className={input} />
                <input value={demo} onChange={e => setDemo(e.target.value)} placeholder="URL de la demo (opcional)" className={input} />
                <input value={stack} onChange={e => setStack(e.target.value)} placeholder="Tecnologías separadas por comas (React, Node, ...)" className={input} />
                <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block mb-1">Portada</label>
                    <input type="file" accept="image/*" onChange={subirPortada} className="text-xs" />
                    {subiendo && <span className="text-xs text-slate-400 ml-2">subiendo...</span>}
                    {cover && <span className="text-xs text-emerald-500 ml-2">imagen lista</span>}
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button onClick={guardar} disabled={guardando} className="w-full py-2.5 font-mono text-[11px] uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-50">
                    {guardando ? 'Publicando...' : 'Publicar proyecto'}
                </button>
            </div>
        </div>
    );
}
