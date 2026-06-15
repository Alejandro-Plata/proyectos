import { useEffect, useState } from 'react';
import { aiService, type PerfilAprendizaje, type RevisionHallazgo } from '../services/aiService';
import { CazaBichillo } from '../../cazaTroll';

interface Props {
    onClose: () => void;
}

const SEV_COLOR: Record<string, string> = {
    bug: 'text-red-500 border-red-500/40',
    estilo: 'text-sky-400 border-sky-400/40',
    rendimiento: 'text-amber-400 border-amber-400/40',
    seguridad: 'text-fuchsia-400 border-fuchsia-400/40',
};

/**
 * A1 (memoria) + A3 (revisión socrática) en un panel lateral del asistente.
 */
export const HerramientasIA = ({ onClose }: Props) => {
    const [tab, setTab] = useState<'memoria' | 'revision' | 'caza'>('memoria');

    // A1
    const [perfil, setPerfil] = useState<PerfilAprendizaje | null>(null);
    const [cargandoPerfil, setCargandoPerfil] = useState(true);

    // A3
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [findings, setFindings] = useState<RevisionHallazgo[] | null>(null);
    const [revisando, setRevisando] = useState(false);
    const [errorRev, setErrorRev] = useState<string | null>(null);

    useEffect(() => {
        aiService.getProfile()
            .then(setPerfil)
            .catch(() => setPerfil(null))
            .finally(() => setCargandoPerfil(false));
    }, []);

    const borrarMemoria = async () => {
        if (!window.confirm('¿Borrar todo lo que Freya recuerda de ti?')) return;
        await aiService.deleteProfile();
        setPerfil(null);
    };

    const revisar = async () => {
        if (!code.trim()) return;
        setRevisando(true); setErrorRev(null); setFindings(null);
        try {
            setFindings(await aiService.reviewCode(code, language));
        } catch (e: any) {
            setErrorRev(e?.message ?? 'Error al revisar');
        } finally {
            setRevisando(false);
        }
    };

    const langs = perfil ? Object.entries(perfil.languages ?? {}) : [];

    return (
        <div className="absolute inset-0 z-30 bg-white dark:bg-[#0a0b0e] flex flex-col">
            <div className="flex items-center justify-between px-5 h-14 border-b border-emerald-500/10 shrink-0">
                <div className="flex gap-1">
                    <button onClick={() => setTab('memoria')} className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border ${tab === 'memoria' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/[0.06]' : 'border-transparent text-slate-400'}`}>Lo que Freya sabe</button>
                    <button onClick={() => setTab('revision')} className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border ${tab === 'revision' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/[0.06]' : 'border-transparent text-slate-400'}`}>Revisar mi código</button>
                    <button onClick={() => setTab('caza')} className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border ${tab === 'caza' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/[0.06]' : 'border-transparent text-slate-400'}`}>Caza al bichillo</button>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-emerald-500 font-mono text-xs">[×]</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
                {tab === 'memoria' && (
                    <div className="space-y-4">
                        {cargandoPerfil ? (
                            <p className="text-sm text-slate-400">Cargando...</p>
                        ) : !perfil || (!langs.length && !perfil.recurring_errors?.length && !perfil.session_summaries?.length) ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Freya todavía no te conoce. A medida que converséis, recordará tus lenguajes, errores frecuentes y temas trabajados (puedes borrarlo cuando quieras).
                            </p>
                        ) : (
                            <>
                                {langs.length > 0 && (
                                    <section>
                                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">Lenguajes</h4>
                                        <div className="space-y-1.5">
                                            {langs.map(([lang, v]) => (
                                                <div key={lang} className="flex items-center gap-2">
                                                    <span className="text-xs w-24 truncate text-slate-700 dark:text-slate-300">{lang}</span>
                                                    <div className="flex-1 h-1.5 bg-emerald-500/10">
                                                        <div className="h-full bg-emerald-500" style={{ width: `${Math.round(Number(v) * 100)}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {perfil.recurring_errors?.length > 0 && (
                                    <section>
                                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">Errores recurrentes</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {perfil.recurring_errors.map((e) => (
                                                <span key={e.tag} className="font-mono text-[10px] px-2 py-0.5 border border-amber-400/40 text-amber-500">
                                                    {e.tag} ×{e.count}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {perfil.session_summaries?.length > 0 && (
                                    <section>
                                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">Sesiones recientes</h4>
                                        <ul className="space-y-1.5">
                                            {[...perfil.session_summaries].reverse().slice(0, 5).map((s, i) => (
                                                <li key={i} className="text-xs text-slate-600 dark:text-slate-300 border-l-2 border-emerald-500/30 pl-2">{s.text}</li>
                                            ))}
                                        </ul>
                                    </section>
                                )}
                                <button onClick={borrarMemoria} className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-red-500/30 text-red-500 hover:bg-red-500/[0.06]">
                                    Borrar memoria
                                </button>
                            </>
                        )}
                    </div>
                )}

                {tab === 'revision' && (
                    <div className="space-y-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pega tu código. Freya lo revisará <strong>sin dártelo resuelto</strong>: te señalará pistas por línea para que lo descubras tú.
                        </p>
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-xs bg-transparent border border-emerald-500/20 px-2 py-1 text-slate-700 dark:text-slate-300">
                            {['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'cpp', 'c'].map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            rows={8}
                            placeholder="// pega aquí tu código"
                            className="w-full px-3 py-2 font-mono text-[13px] bg-[#0a0b0e] text-slate-200 border border-emerald-500/20 focus:border-emerald-400 outline-none"
                        />
                        <button onClick={revisar} disabled={revisando || !code.trim()} className="w-full py-2 font-mono text-[10px] uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-50">
                            {revisando ? 'Revisando...' : 'Revisar'}
                        </button>
                        {errorRev && <p className="text-xs text-red-500">{errorRev}</p>}
                        {findings && findings.length === 0 && <p className="text-sm text-emerald-500">No he encontrado problemas relevantes. ¡Buen trabajo!</p>}
                        {findings && findings.length > 0 && (
                            <ul className="space-y-2">
                                {findings.map((f, i) => (
                                    <li key={i} className={`border-l-2 pl-3 py-1 ${SEV_COLOR[f.severity] ?? 'border-slate-400/40'}`}>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-mono text-[10px] uppercase">{f.severity}</span>
                                            <span className="font-mono text-[10px] text-slate-400">línea {f.line}</span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-200">{f.hint}</p>
                                        {f.concept && <p className="text-[10px] font-mono text-slate-400 mt-0.5">repasa: {f.concept}</p>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {tab === 'caza' && (
                    <CazaBichillo />
                )}
            </div>
        </div>
    );
};
