import { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { masteryService, type Maestria, type Endoso, type Emblema } from '../services/masteryService';

const NIVEL_COLOR: Record<string, string> = {
    Maestro: 'from-purple-400 to-pink-500',
    Avanzado: 'from-red-400 to-rose-600',
    Competente: 'from-emerald-400 to-teal-500',
    Iniciado: 'from-emerald-300 to-teal-400',
};

const EMBLEMA_LABEL: Record<string, string> = {
    season: 'Temporada',
    mentor: 'Mentor',
    showcase: 'Proyecto destacado',
    tournament: 'Torneo',
};

interface Props {
    userId: string;
}

export const SeccionMaestrias = ({ userId }: Props) => {
    const { user } = useUser();
    const esMiPerfil = user?.user_id === userId;

    const [maestrias, setMaestrias] = useState<Maestria[]>([]);
    const [endosos, setEndosos] = useState<Endoso[]>([]);
    const [emblemas, setEmblemas] = useState<Emblema[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargar = useCallback(async () => {
        setCargando(true);
        try {
            const [m, e, em] = await Promise.all([
                masteryService.getMastery(userId).catch(() => []),
                masteryService.getEndorsements(userId).catch(() => []),
                masteryService.getEmblems(userId).catch(() => []),
            ]);
            setMaestrias(m);
            setEndosos(e);
            setEmblemas(em);
        } finally {
            setCargando(false);
        }
    }, [userId]);

    useEffect(() => { if (userId) cargar(); }, [userId, cargar]);

    const toggleEndoso = async (skill: string, ya: boolean) => {
        setEndosos(ya
            ? await masteryService.removeEndorsement(userId, skill)
            : await masteryService.endorse(userId, skill));
    };

    if (cargando) return null;
    if (maestrias.length === 0 && endosos.length === 0 && emblemas.length === 0) return null;

    const maxScore = Math.max(1, ...maestrias.map(m => m.score));
    // Habilidades endosables: las maestrías del usuario que aún no aparecen en endosos
    const skillsEndosables = maestrias.map(m => m.skill);
    const endosadas = new Set(endosos.map(e => e.skill));

    return (
        <div className="space-y-6">
            {emblemas.length > 0 && (
                <section>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-3">Emblemas</h3>
                    <div className="flex flex-wrap gap-2">
                        {emblemas.map(em => (
                            <span
                                key={em.emblem_id}
                                title={EMBLEMA_LABEL[em.kind] ?? em.kind}
                                className="font-mono text-[10px] px-2.5 py-1 border border-amber-400/40 text-amber-500 bg-amber-400/[0.06]"
                            >
                                {em.label}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {maestrias.length > 0 && (
                <section>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-3">Mapa de maestrías</h3>
                    <div className="space-y-2">
                        {maestrias.map(m => (
                            <div key={`${m.kind}-${m.skill}`} className="flex items-center gap-3">
                                <span className="w-28 shrink-0 text-xs text-slate-700 dark:text-slate-300 truncate">{m.skill}</span>
                                <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded">
                                    <div className={`h-full rounded bg-gradient-to-r ${NIVEL_COLOR[m.level] ?? NIVEL_COLOR.Iniciado}`} style={{ width: `${Math.round((m.score / maxScore) * 100)}%` }} />
                                </div>
                                <span className="w-20 shrink-0 text-right font-mono text-[9px] uppercase text-slate-400">{m.level}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-3">Endosos de la comunidad</h3>
                <div className="flex flex-wrap gap-2">
                    {endosos.map(e => (
                        <button
                            key={e.skill}
                            disabled={esMiPerfil}
                            onClick={() => toggleEndoso(e.skill, e.endorsed_by_me)}
                            className={`font-mono text-[10px] px-2.5 py-1 border transition-colors ${e.endorsed_by_me ? 'border-emerald-500 text-emerald-500 bg-emerald-500/[0.06]' : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-emerald-500/40'} ${esMiPerfil ? 'cursor-default' : ''}`}
                        >
                            {e.skill} <span className="text-emerald-500">+{e.count}</span>
                        </button>
                    ))}
                    {/* Habilidades del usuario aún sin endosar (solo visitantes) */}
                    {!esMiPerfil && skillsEndosables.filter(s => !endosadas.has(s)).map(s => (
                        <button key={s} onClick={() => toggleEndoso(s, false)} className="font-mono text-[10px] px-2.5 py-1 border border-dashed border-slate-300 dark:border-white/10 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-500">
                            + endosar {s}
                        </button>
                    ))}
                    {endosos.length === 0 && esMiPerfil && <p className="text-xs text-slate-400">Aún no tienes endosos.</p>}
                </div>
            </section>
        </div>
    );
};
