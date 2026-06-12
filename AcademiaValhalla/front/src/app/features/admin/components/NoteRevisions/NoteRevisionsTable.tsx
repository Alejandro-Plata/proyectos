import { useState, useEffect, useCallback } from 'react';
import { notesService } from '../../../notes/services/notesService';
import { getAvatarUrl } from '../../../../utils/getAvatarUrl';

const NOTCH = 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)';

interface RevisionRow {
    revision_id: string;
    status: string;
    created_at: string;
    payload: Record<string, any>;
    nota: { note_id: string; title: string; community_status: string };
    autor: { user_id: string; username: string; avatar_url?: string };
}

interface Props {
    onResolved: () => void;
}

export const NoteRevisionsTable = ({ onResolved }: Props) => {
    const [rows, setRows] = useState<RevisionRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState<RevisionRow | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await notesService.listRevisions();
            setRows(data);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleResolve = async (revisionId: string, action: 'approve' | 'reject', comment?: string) => {
        await notesService.resolveRevision(revisionId, action, comment);
        setRows(prev => prev.filter(r => r.revision_id !== revisionId));
        setActive(null);
        onResolved();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-[2px] border-emerald-500/20 border-t-emerald-500 animate-spin" />
            </div>
        );
    }

    if (rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-emerald-500/15 dark:border-emerald-500/10">
                <svg className="w-10 h-10 mb-3 text-emerald-500/20" viewBox="0 0 48 48" fill="none">
                    <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600">
                    Sin revisiones pendientes
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-emerald-500/10 bg-emerald-500/[0.02]">
                            {['Autor', 'Apunte', 'Fecha', 'Acción'].map(h => (
                                <th key={h} className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-500/[0.06]">
                        {rows.map(row => (
                            <tr key={row.revision_id} className="hover:bg-emerald-500/[0.02] transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={getAvatarUrl(row.autor.username, row.autor.avatar_url)}
                                            className="w-7 h-7 object-cover hex-shield shrink-0"
                                            alt=""
                                        />
                                        <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                                            @{row.autor.username}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[240px]">
                                        {row.nota.title}
                                    </p>
                                    <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                        {row.nota.community_status === 'approved' ? 'Apunte publicado' : row.nota.community_status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                        {new Date(row.created_at).toLocaleDateString('es-ES')}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => setActive(row)}
                                        className="font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/[0.05] transition-colors"
                                        style={{ clipPath: NOTCH }}
                                    >
                                        Revisar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {active && (
                <RevisionModal
                    row={active}
                    onResolve={handleResolve}
                    onClose={() => setActive(null)}
                />
            )}
        </>
    );
};

/* ---- Modal de revisión ---- */

interface ModalProps {
    row: RevisionRow;
    onResolve: (id: string, action: 'approve' | 'reject', comment?: string) => Promise<void>;
    onClose: () => void;
}

const RevisionModal = ({ row, onResolve, onClose }: ModalProps) => {
    const [showReject, setShowReject] = useState(false);
    const [comment, setComment]       = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handle = async (action: 'approve' | 'reject') => {
        setSubmitting(true);
        try {
            await onResolve(row.revision_id, action, action === 'reject' ? comment.trim() : undefined);
        } finally {
            setSubmitting(false);
        }
    };

    const changedFields = Object.keys(row.payload).filter(k => k !== 'content');
    const hasContent = 'content' in row.payload;

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-xl max-h-[85vh] flex flex-col bg-white dark:bg-[#0a0b0e] border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-emerald-500/10 bg-emerald-500/[0.03] flex items-center justify-between shrink-0">
                    <div>
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 block mb-1">
                            Revisión de edición
                        </span>
                        <p className="font-mono text-sm text-slate-900 dark:text-white font-bold">
                            {row.nota.title}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                    <div className="flex items-center gap-3">
                        <img src={getAvatarUrl(row.autor.username, row.autor.avatar_url)} className="w-8 h-8 object-cover hex-shield shrink-0" alt="" />
                        <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-white">@{row.autor.username}</p>
                            <p className="font-mono text-[10px] text-slate-400">{new Date(row.created_at).toLocaleString('es-ES')}</p>
                        </div>
                    </div>

                    <div className="border border-emerald-500/15 dark:border-emerald-500/10 p-4 space-y-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Cambios propuestos</p>
                        {changedFields.map(field => (
                            <div key={field} className="flex gap-3">
                                <span className="font-mono text-[10px] uppercase text-emerald-600 dark:text-emerald-400 shrink-0 w-20">{field}</span>
                                <span className="text-xs text-slate-700 dark:text-slate-300 break-all">
                                    {Array.isArray(row.payload[field])
                                        ? (row.payload[field] as string[]).join(', ')
                                        : String(row.payload[field])}
                                </span>
                            </div>
                        ))}
                        {hasContent && (
                            <div className="flex gap-3">
                                <span className="font-mono text-[10px] uppercase text-emerald-600 dark:text-emerald-400 shrink-0 w-20">content</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {(row.payload.content as any[]).length} bloque(s) — {(row.payload.content as any[]).filter((b: any) => b.type === 'code').length} de código
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-emerald-500/10 bg-emerald-500/[0.02] shrink-0">
                    {showReject ? (
                        <div className="space-y-3">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Motivo del rechazo (opcional)</p>
                            <textarea
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder="Explica brevemente el motivo..."
                                rows={3}
                                className="w-full text-sm p-3 resize-none outline-none border bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 placeholder:font-mono placeholder:text-xs border-rose-500/30 focus:border-rose-500/60 transition-colors"
                            />
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setShowReject(false)} className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 border border-emerald-500/20 text-slate-500 hover:border-emerald-500/40 transition-colors">
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handle('reject')}
                                    disabled={submitting}
                                    className="font-mono text-[10px] uppercase tracking-wider px-6 py-2 bg-rose-500 text-white hover:bg-rose-400 disabled:opacity-50 transition-colors"
                                >
                                    {submitting ? 'Enviando…' : 'Confirmar rechazo'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowReject(true)}
                                className="font-mono text-[10px] uppercase tracking-wider px-6 py-2.5 border border-rose-500/30 text-rose-600 hover:bg-rose-500/[0.06] dark:text-rose-500 transition-colors"
                            >
                                Rechazar
                            </button>
                            <button
                                onClick={() => handle('approve')}
                                disabled={submitting}
                                style={{ clipPath: NOTCH }}
                                className="font-mono text-[10px] uppercase tracking-wider px-6 py-2.5 bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-60 transition-colors font-bold"
                            >
                                {submitting ? 'Aplicando…' : 'Aprobar cambios'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
