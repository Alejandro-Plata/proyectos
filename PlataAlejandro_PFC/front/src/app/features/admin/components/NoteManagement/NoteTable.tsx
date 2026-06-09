import { useState } from 'react';
import type { AdminNote } from '../../types/types';
import { NotePreviewModal } from './NotePreviewModal';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { AdminListMobile } from '../shared/AdminListMobile';

interface Props {
    notes: AdminNote[];
    onDelete: (id: string) => Promise<void>;
    onReview: (id: string, action: 'approve' | 'reject') => Promise<void>;
}

const DIFFICULTY_STYLES: Record<string, string> = {
    'Básico':     'bg-emerald-500/[0.08] text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
    'Intermedio': 'bg-amber-500/[0.08] text-amber-600 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    'Avanzado':   'bg-rose-500/[0.08] text-rose-600 border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400',
};

export const TablaNotas = ({ notes, onDelete, onReview }: Props) => {
    const [previewNoteId, setPreviewNoteId] = useState<string | null>(null);
    const isMobile = useIsMobile();

    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 mb-2">· sin pendientes</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sin notas pendientes de revisión.</p>
            </div>
        );
    }

    return (
        <>
        {isMobile ? (
            <AdminListMobile
                items={notes}
                keyExtractor={(n) => n.id}
                renderHeader={(n) => (
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate font-mono uppercase tracking-wide">{n.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500 font-mono">{n.submitted_by ?? '—'}</span>
                            <span className={`inline-flex px-1.5 py-0 font-mono text-[10px] uppercase tracking-wider font-bold border ${DIFFICULTY_STYLES[n.difficulty] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                {n.difficulty}
                            </span>
                        </div>
                    </div>
                )}
                renderBody={(n) => (
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                        <dt className="text-slate-500 font-mono uppercase tracking-wider">Lenguaje</dt>
                        <dd className="text-slate-900 dark:text-white font-mono uppercase">{n.language}</dd>
                        <dt className="text-slate-500 font-mono uppercase tracking-wider">Enviado</dt>
                        <dd className="text-slate-500 font-mono">{new Date(n.created_at).toLocaleDateString('es-ES')}</dd>
                    </dl>
                )}
                renderActions={(n) => (
                    <>
                        <button
                            onClick={() => setPreviewNoteId(n.id)}
                            className="flex-1 min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-violet-500/30 text-violet-600 hover:bg-violet-500/10"
                        >
                            Previsualizar
                        </button>
                        <button
                            onClick={() => onReview(n.id, 'approve')}
                            className="flex-1 min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                        >
                            Aprobar
                        </button>
                        <button
                            onClick={() => onReview(n.id, 'reject')}
                            className="flex-1 min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                        >
                            Rechazar
                        </button>
                        <button
                            onClick={() => { if (confirm(`¿Eliminar "${n.title}"?`)) onDelete(n.id); }}
                            className="basis-full min-h-[44px] font-mono text-[11px] uppercase tracking-wider border border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                        >
                            Eliminar
                        </button>
                    </>
                )}
                emptyMessage="Sin notas pendientes de revisión"
            />
        ) : (
            <div className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-emerald-500/10 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                <th className="py-3 px-5 font-medium">Título</th>
                                <th className="py-3 px-5 font-medium">Autor</th>
                                <th className="py-3 px-5 font-medium">Lenguaje</th>
                                <th className="py-3 px-5 font-medium">Dificultad</th>
                                <th className="py-3 px-5 font-medium">Enviado</th>
                                <th className="py-3 px-5 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700 dark:text-slate-300">
                            {notes.map((n) => (
                                <tr key={n.id} className="group border-b border-emerald-500/[0.06] hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.05] transition-colors">
                                    <td className="py-3 px-5">
                                        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-900 dark:text-white">{n.title}</span>
                                    </td>
                                    <td className="py-3 px-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                        {n.submitted_by ?? '—'}
                                    </td>
                                    <td className="py-3 px-5">
                                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-500/20 dark:border-emerald-500/15 text-slate-600 dark:text-slate-400">
                                            {n.language}
                                        </span>
                                    </td>
                                    <td className="py-3 px-5">
                                        <span className={`inline-flex px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold border ${DIFFICULTY_STYLES[n.difficulty] ?? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-slate-400 dark:border-white/20'}`}>
                                            {n.difficulty}
                                        </span>
                                    </td>
                                    <td className="py-3 px-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                        {new Date(n.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="py-3 px-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setPreviewNoteId(n.id)}
                                                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-violet-500/30 text-violet-600 hover:bg-violet-500/[0.06] dark:text-violet-400 dark:hover:bg-violet-500/10 transition-colors"
                                            >
                                                Previsualizar
                                            </button>
                                            <button
                                                onClick={() => onReview(n.id, 'approve')}
                                                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/[0.06] dark:text-emerald-400 dark:hover:bg-emerald-500/10 transition-colors"
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => onReview(n.id, 'reject')}
                                                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-amber-500/30 text-amber-600 hover:bg-amber-500/[0.06] dark:text-amber-400 dark:hover:bg-amber-500/10 transition-colors"
                                            >
                                                Rechazar
                                            </button>
                                            <button
                                                onClick={() => { if (confirm(`¿Eliminar "${n.title}"?`)) onDelete(n.id); }}
                                                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-rose-500/30 text-rose-600 hover:bg-rose-500/[0.06] dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {previewNoteId && (
            <NotePreviewModal
                noteId={previewNoteId}
                onClose={() => setPreviewNoteId(null)}
            />
        )}
        </>
    );
};
