import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '../../../../utils/getAvatarUrl';
import { PreviewNotePost } from '../../../community/components/PreviewNotePost';
import type { ContentRequest, ReviewRequestPayload, ReviewResponse } from '../../types/types';

interface Props {
    request: ContentRequest;
    onReview: (requestId: string, payload: ReviewRequestPayload) => Promise<ReviewResponse>;
    onClose: () => void;
}

type Tab = 'Metadata' | 'Vista previa';
const TABS: Tab[] = ['Metadata', 'Vista previa'];
const NOTCH_SM = 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)';
const NOTCH_MD = 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)';

export const NoteReviewModal = ({ request, onReview, onClose }: Props) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('Vista previa');
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewResult, setReviewResult] = useState<ReviewResponse | null>(null);

    const nd = request.note_data!;

    const handleApprove = async () => {
        setIsSubmitting(true);
        try {
            const result = await onReview(request.id, { action: 'approve' });
            setReviewResult(result);
        } catch (err: any) {
            alert(err.message ?? 'Error al aprobar');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (rejectionReason.trim().length < 5) return;
        setIsSubmitting(true);
        try {
            const result = await onReview(request.id, { action: 'reject', rejection_reason: rejectionReason.trim() });
            setReviewResult(result);
        } catch (err: any) {
            alert(err.message ?? 'Error al rechazar');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0a0b0e] border border-emerald-500/20 dark:border-emerald-500/15 shadow-2xl shadow-emerald-500/10 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* BB-3 Header */}
                <div className="px-6 py-4 flex items-start justify-between border-b border-emerald-500/10 bg-emerald-500/[0.03] shrink-0">
                    <div className="flex items-center gap-4">
                        <img
                            src={getAvatarUrl(request.author_username, request.author_avatar_url)}
                            className="hex-shield w-11 h-11 object-cover shrink-0"
                            alt="Avatar"
                        />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-block w-1 h-3.5 bg-emerald-500 shrink-0" />
                                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                                    Revisar solicitud · @{request.author_username} · {new Date(request.submitted_at).toLocaleDateString('es-ES')}
                                </span>
                                <span
                                    className="px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider border bg-violet-500/[0.08] text-violet-600 border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400"
                                    style={{ clipPath: NOTCH_SM }}
                                >
                                    Apunte
                                </span>
                            </div>
                            <p className="font-mono text-sm uppercase tracking-[0.1em] text-slate-900 dark:text-white leading-tight">
                                {request.title}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Tab strip */}
                <div className="border-b border-emerald-500/10 flex gap-1 px-6 shrink-0">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`px-3 h-9 font-mono text-[11px] uppercase tracking-[0.15em] border-b-2 transition-colors ${
                                activeTab === t
                                    ? 'text-emerald-500 border-emerald-500'
                                    : 'text-slate-400 border-transparent hover:text-emerald-500'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">

                    {/* METADATA */}
                    {activeTab === 'Metadata' && (
                        <div className="space-y-4">
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{request.description}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-violet-500/30 bg-violet-500/[0.08] text-violet-600 dark:text-violet-400" style={{ clipPath: NOTCH_SM }}>{nd.language}</span>
                                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-cyan-500/30 bg-cyan-500/[0.08] text-cyan-600 dark:text-cyan-400" style={{ clipPath: NOTCH_SM }}>{nd.difficulty}</span>
                                {(nd.tags ?? []).map((t) => (
                                    <span key={t} className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-500/15 dark:border-emerald-500/10 text-slate-500 dark:text-slate-400" style={{ clipPath: NOTCH_SM }}>#{t}</span>
                                ))}
                            </div>
                            <div className="p-3 border border-emerald-500/15 dark:border-emerald-500/10 bg-emerald-500/[0.02] text-sm">
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 block mb-1">Bloques de contenido</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">
                                    {nd.content?.length ?? 0} bloque(s) — {nd.content?.filter(b => b.type === 'code').length ?? 0} de código
                                </span>
                            </div>
                        </div>
                    )}

                    {/* VISTA PREVIA */}
                    {activeTab === 'Vista previa' && (
                        <PreviewNotePost
                            title={request.title}
                            content={nd.content ?? []}
                            author={{ username: request.author_username, avatar_url: request.author_avatar_url }}
                            submittedAt={request.submitted_at}
                            tags={nd.tags}
                            language={nd.language}
                            difficulty={nd.difficulty}
                            definitions={nd.definitions}
                            interactive={false}
                        />
                    )}
                </div>

                {/* Footer — resultado */}
                {reviewResult && (
                    <div className="p-5 border-t border-emerald-500/10 bg-emerald-500/[0.02] shrink-0">
                        <div className={`flex items-center gap-3 p-4 border ${
                            reviewResult.resource
                                ? 'bg-emerald-500/[0.06] border-emerald-500/30 dark:bg-emerald-500/10'
                                : 'bg-rose-500/[0.06] border-rose-500/30 dark:bg-rose-500/10'
                        }`}>
                            <span>
                                {reviewResult.resource
                                    ? <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    : <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                }
                            </span>
                            <div className="flex-1">
                                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-800 dark:text-white mb-1">
                                    {reviewResult.resource ? 'Apunte publicado en comunidad' : 'Solicitud rechazada'}
                                </p>
                                {reviewResult.resource && (
                                    <button
                                        onClick={() => { navigate(reviewResult.resource!.url); onClose(); }}
                                        className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500 hover:text-emerald-400 transition-colors"
                                    >
                                        Ver en comunidad →
                                    </button>
                                )}
                            </div>
                            <button onClick={onClose} className="font-mono text-[10px] uppercase tracking-wider border border-emerald-500/20 hover:border-emerald-500/40 px-3 py-1 text-slate-500 transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer — acciones */}
                {!reviewResult && request.status === 'pending' && (
                    <div className="p-5 border-t border-emerald-500/10 bg-emerald-500/[0.02] shrink-0">
                        {showRejectForm ? (
                            <div className="space-y-3">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Motivo del rechazo</p>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explica brevemente por qué no se acepta..."
                                    rows={3}
                                    className="w-full text-sm p-3 resize-none outline-none border bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400/60 placeholder:font-mono placeholder:text-xs border-rose-500/30 focus:border-rose-500/60 transition-colors"
                                />
                                <div className="flex gap-3 justify-end">
                                    <button onClick={() => setShowRejectForm(false)} className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 border border-emerald-500/20 text-slate-500 hover:border-emerald-500/40 transition-colors">
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={rejectionReason.trim().length < 5 || isSubmitting}
                                        className="font-mono text-[10px] uppercase tracking-wider px-6 py-2 bg-rose-500 text-white hover:bg-rose-400 disabled:opacity-50 transition-colors"
                                    >
                                        {isSubmitting ? 'Enviando...' : 'Confirmar rechazo'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowRejectForm(true)}
                                    className="font-mono text-[10px] uppercase tracking-wider px-6 py-2.5 border border-rose-500/30 text-rose-600 hover:bg-rose-500/[0.06] dark:text-rose-500 dark:hover:bg-rose-500/10 transition-colors"
                                >
                                    Rechazar solicitud
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={isSubmitting}
                                    style={{ clipPath: NOTCH_MD }}
                                    className="font-mono text-[10px] uppercase tracking-wider px-6 py-2.5 bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-60 transition-colors"
                                >
                                    {isSubmitting ? 'Aprobando...' : 'Aprobar y Publicar'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer — ya revisada */}
                {!reviewResult && request.status !== 'pending' && (
                    <div className="p-5 border-t border-emerald-500/10 bg-emerald-500/[0.02] shrink-0">
                        <div className={`flex items-center gap-3 p-4 border ${
                            request.status === 'approved'
                                ? 'bg-emerald-500/[0.06] border-emerald-500/30 dark:bg-emerald-500/10'
                                : 'bg-rose-500/[0.06] border-rose-500/30 dark:bg-rose-500/10'
                        }`}>
                            <div className="flex-1">
                                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-800 dark:text-white mb-1">
                                    {request.status === 'approved' ? 'Solicitud aprobada' : 'Solicitud rechazada'}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    {request.status === 'approved'
                                        ? 'Este apunte ya está publicado en comunidad.'
                                        : `Motivo: ${request.rejection_reason}`}
                                </p>
                                {request.status === 'approved' && request.resource_id && (
                                    <button
                                        onClick={() => navigate(`/dashboard/community/posts/${request.resource_id}`)}
                                        className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500 hover:text-emerald-400 transition-colors"
                                    >
                                        Ver en comunidad →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
