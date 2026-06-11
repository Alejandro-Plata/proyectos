import { useState } from 'react';
import type { AdminChallenge } from '../../types/types';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { AdminListMobile } from '../shared/AdminListMobile';
import { ModalConfirmacion } from '../shared/ModalConfirmacion';

interface Props {
    challenges: AdminChallenge[];
    onDelete: (id: string) => Promise<void>;
}

const DIFF_LABELS: Record<string, string> = {
    easy: 'Fácil', medium: 'Intermedio', hard: 'Difícil',
};

const DIFF_STYLES: Record<string, string> = {
    easy:   'bg-emerald-500/[0.08] text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
    medium: 'bg-amber-500/[0.08] text-amber-600 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    hard:   'bg-rose-500/[0.08] text-rose-600 border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400',
};

export const ChallengeTable = ({ challenges, onDelete }: Props) => {
    const isMobile = useIsMobile();
    const [pendienteEliminar, setPendienteEliminar] = useState<AdminChallenge | null>(null);

    if (challenges.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 mb-2">· sin datos</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">No hay challenges creados.</p>
            </div>
        );
    }

    const confirmarEliminar = () => {
        if (pendienteEliminar) {
            onDelete(pendienteEliminar.id);
            setPendienteEliminar(null);
        }
    };

    if (isMobile) {
        return (
            <>
            <AdminListMobile
                items={challenges}
                keyExtractor={(c) => c.id}
                renderHeader={(c) => (
                    <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate font-mono uppercase tracking-wide">{c.title}</p>
                            <p className="text-xs text-slate-500 font-mono">{c.language?.toUpperCase()}</p>
                        </div>
                        <span className={`shrink-0 inline-flex px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold border ${DIFF_STYLES[c.difficulty] ?? ''}`}>
                            {DIFF_LABELS[c.difficulty] ?? c.difficulty}
                        </span>
                    </div>
                )}
                renderBody={(c) => (
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                        <dt className="text-slate-500 font-mono uppercase tracking-wider">Global</dt>
                        <dd className="text-slate-900 dark:text-white font-mono">{c.is_global ? 'Sí' : 'No'}</dd>
                        <dt className="text-slate-500 font-mono uppercase tracking-wider">Tags</dt>
                        <dd className="text-slate-500 font-mono">{c.tags.join(', ') || '—'}</dd>
                        <dt className="text-slate-500 font-mono uppercase tracking-wider">Creado</dt>
                        <dd className="text-slate-500 font-mono">{new Date(c.created_at).toLocaleDateString('es-ES')}</dd>
                    </dl>
                )}
                renderActions={(c) => (
                    <button
                        onClick={() => setPendienteEliminar(c)}
                        className="basis-full min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                    >
                        Eliminar
                    </button>
                )}
                emptyMessage="No hay challenges creados"
            />
            {pendienteEliminar && (
                <ModalConfirmacion
                    titulo={`¿Eliminar "${pendienteEliminar.title}"?`}
                    descripcion="Esta acción no se puede deshacer."
                    onConfirmar={confirmarEliminar}
                    onCancelar={() => setPendienteEliminar(null)}
                />
            )}
            </>
        );
    }

    return (
        <>
        {pendienteEliminar && (
            <ModalConfirmacion
                titulo={`¿Eliminar "${pendienteEliminar.title}"?`}
                descripcion="Esta acción no se puede deshacer."
                onConfirmar={confirmarEliminar}
                onCancelar={() => setPendienteEliminar(null)}
            />
        )}
        <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-emerald-500/10 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                            <th className="py-3 px-5 font-medium">Título</th>
                            <th className="py-3 px-5 font-medium">Dificultad</th>
                            <th className="py-3 px-5 font-medium">Lenguaje</th>
                            <th className="py-3 px-5 font-medium">Tags</th>
                            <th className="py-3 px-5 font-medium text-center">Global</th>
                            <th className="py-3 px-5 font-medium">Creado</th>
                            <th className="py-3 px-5 font-medium text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 dark:text-slate-300">
                        {challenges.map((c) => (
                            <tr
                                key={c.id}
                                className="group border-b border-emerald-500/[0.06] hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.05] transition-colors"
                            >
                                <td className="py-3 px-5 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-900 dark:text-white truncate max-w-[200px]" title={c.title}>
                                    {c.title}
                                </td>
                                <td className="py-3 px-5">
                                    <span className={`inline-flex px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold border ${DIFF_STYLES[c.difficulty] ?? ''}`}>
                                        {DIFF_LABELS[c.difficulty] ?? c.difficulty}
                                    </span>
                                </td>
                                <td className="py-3 px-5">
                                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-500/20 dark:border-emerald-500/15 text-slate-600 dark:text-slate-400">
                                        {c.language}
                                    </span>
                                </td>
                                <td className="py-3 px-5">
                                    <div className="flex flex-wrap gap-1.5">
                                        {c.tags.slice(0, 2).map((t) => (
                                            <span key={t} className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-emerald-500/20 dark:border-emerald-500/10 text-slate-500 dark:text-slate-400">
                                                {t}
                                            </span>
                                        ))}
                                        {c.tags.length > 2 && (
                                            <span className="font-mono text-[9px] px-1.5 py-0.5 text-slate-400 dark:text-slate-500">
                                                +{c.tags.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-5 text-center">
                                    {c.is_global ? (
                                        <span className="font-mono text-[10px] text-emerald-500">◆</span>
                                    ) : (
                                        <span className="font-mono text-[10px] text-slate-300 dark:text-slate-600">◇</span>
                                    )}
                                </td>
                                <td className="py-3 px-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                    {new Date(c.created_at).toLocaleDateString('es-ES')}
                                </td>
                                <td className="py-3 px-5 text-right">
                                    <button
                                        onClick={() => setPendienteEliminar(c)}
                                        className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-rose-500/30 text-rose-600 hover:bg-rose-500/[0.06] dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};
