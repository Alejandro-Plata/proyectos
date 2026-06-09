import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MonacoEditorDesktop } from '../../../../components/MonacoEditor/MonacoEditorDesktop';
import { getAvatarUrl } from '../../../../utils/getAvatarUrl';
import type { ContentRequest, ReviewRequestPayload, ReviewResponse } from '../../types/types';

interface Props {
    request: ContentRequest;
    onReview: (requestId: string, payload: ReviewRequestPayload) => Promise<ReviewResponse>;
    onClose: () => void;
}

type Tab = 'Metadata' | 'Instrucciones' | 'Código' | 'Tests' | 'Vista previa';
const TABS: Tab[] = ['Metadata', 'Instrucciones', 'Código', 'Tests', 'Vista previa'];

const DIFF_LABEL: Record<string, string> = { easy: 'Fácil', medium: 'Intermedio', hard: 'Difícil' };
const DIFF_COLOR: Record<string, string> = {
    easy: 'bg-emerald-500/[0.08] text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
    medium: 'bg-amber-500/[0.08] text-amber-600 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    hard: 'bg-rose-500/[0.08] text-rose-600 border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400',
};
const NOTCH_SM = 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)';
const NOTCH_MD = 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)';
const NOTCH_CODE = 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)';

const MonacoBlock = ({ code, label, language }: { code: string; label: string; language: string }) => (
    <div className="border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden flex flex-col" style={{ clipPath: NOTCH_CODE, height: 280 }}>
        <div className="flex justify-between items-center px-4 py-2 bg-emerald-500/[0.03] border-b border-emerald-500/10 shrink-0">
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</span>
        </div>
        <div className="flex-1 min-h-0">
            <MonacoEditorDesktop
                code={code}
                language={language}
                editable={false}
                options={{ readOnly: true, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, fontSize: 13, padding: { top: 8, bottom: 8 } }}
            />
        </div>
    </div>
);

export const ChallengeReviewModal = ({ request, onReview, onClose }: Props) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('Metadata');
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewResult, setReviewResult] = useState<ReviewResponse | null>(null);

    const cd = request.challenge_data!;
    const lang = cd.language ?? 'javascript';

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
            <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0a0b0e] border border-emerald-500/20 dark:border-emerald-500/15 shadow-2xl shadow-emerald-500/10 overflow-hidden animate-in zoom-in-95 duration-200">

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
                                    className="px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider border bg-amber-500/[0.08] text-amber-600 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
                                    style={{ clipPath: NOTCH_SM }}
                                >
                                    Reto
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
                        <div className="space-y-5">
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{request.description}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400" style={{ clipPath: NOTCH_SM }}>{cd.language}</span>
                                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${DIFF_COLOR[cd.difficulty]}`} style={{ clipPath: NOTCH_SM }}>
                                    {DIFF_LABEL[cd.difficulty] ?? cd.difficulty}
                                </span>
                                {cd.category && (
                                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-slate-300/50 dark:border-slate-600/30 text-slate-500 dark:text-slate-400" style={{ clipPath: NOTCH_SM }}>{cd.category}</span>
                                )}
                                {(cd.tags ?? []).map((t) => (
                                    <span key={t} className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-500/15 dark:border-emerald-500/10 text-slate-500 dark:text-slate-400" style={{ clipPath: NOTCH_SM }}>#{t}</span>
                                ))}
                            </div>
                            <div className="flex items-center gap-3 p-3 border border-emerald-500/15 dark:border-emerald-500/10 bg-emerald-500/[0.02]">
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">XP que se otorgará:</span>
                                <span className="font-mono text-sm font-bold text-emerald-500">
                                    {cd.difficulty === 'easy' ? 50 : cd.difficulty === 'medium' ? 100 : 200} XP
                                </span>
                            </div>
                        </div>
                    )}

                    {/* INSTRUCCIONES */}
                    {activeTab === 'Instrucciones' && (
                        <div className="space-y-5">
                            {cd.instructions ? (
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">Instrucciones</p>
                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{cd.instructions}</p>
                                </div>
                            ) : (
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Sin instrucciones detalladas.</p>
                            )}

                            {cd.example_output && (
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Salida esperada</p>
                                    <div className="p-4 border font-mono text-xs relative overflow-hidden bg-white border-emerald-500/15 text-slate-700 dark:bg-[#050505] dark:border-emerald-500/10 dark:text-slate-300">
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500" />
                                        <pre className="whitespace-pre-wrap pl-2">{cd.example_output}</pre>
                                    </div>
                                </div>
                            )}

                            {cd.examples && cd.examples.length > 0 && (
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Ejemplos</p>
                                    <div className="space-y-2">
                                        {cd.examples.map((ex, i) => (
                                            <div key={i} className="border border-emerald-500/15 dark:border-emerald-500/10 p-3 text-xs font-mono bg-white dark:bg-black/30">
                                                <div className="flex gap-4 flex-wrap">
                                                    <span className="text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-700 dark:text-slate-300">Entrada:</span> {ex.input}</span>
                                                    <span className="text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-700 dark:text-slate-300">Salida:</span> {ex.expected_output}</span>
                                                </div>
                                                {ex.explanation && <p className="mt-1 text-slate-400 dark:text-slate-500">{ex.explanation}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {cd.hints && cd.hints.length > 0 && (
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Pistas</p>
                                    <div className="space-y-1.5">
                                        {cd.hints.map((h, i) => (
                                            <div key={i} className="flex gap-2 p-2.5 border border-violet-500/20 bg-violet-500/[0.04] dark:bg-violet-500/[0.06] text-xs font-mono text-violet-700 dark:text-violet-300">
                                                <span className="text-violet-500/50 shrink-0">#{h.order ?? i + 1}</span>
                                                <span>{h.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CÓDIGO */}
                    {activeTab === 'Código' && (
                        <div className="space-y-4">
                            <MonacoBlock code={cd.starter_code} label={`Código inicial · ${lang}`} language={lang} />
                            <MonacoBlock code={cd.solution_code} label={`Solución de referencia · ${lang}`} language={lang} />
                        </div>
                    )}

                    {/* TESTS */}
                    {activeTab === 'Tests' && (
                        <div className="space-y-4">
                            {cd.test_code ? (
                                <MonacoBlock code={cd.test_code} label={`Tests · ${lang}`} language={lang} />
                            ) : (
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Sin código de tests adjunto.</p>
                            )}
                        </div>
                    )}

                    {/* VISTA PREVIA */}
                    {activeTab === 'Vista previa' && (
                        <div className="border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
                            {/* Cabecera del reto (simulada) */}
                            <div className="p-5 border-b border-emerald-500/10 bg-emerald-500/[0.02]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-block w-1 h-3.5 bg-emerald-500" />
                                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">La Misión</span>
                                </div>
                                <h2 className="font-mono text-lg uppercase tracking-[0.1em] text-slate-900 dark:text-white mb-3">{request.title}</h2>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400" style={{ clipPath: NOTCH_SM }}>{cd.language}</span>
                                    <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${DIFF_COLOR[cd.difficulty]}`} style={{ clipPath: NOTCH_SM }}>
                                        {DIFF_LABEL[cd.difficulty] ?? cd.difficulty}
                                    </span>
                                    {(cd.tags ?? []).map((t) => (
                                        <span key={t} className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-500/15 dark:border-emerald-500/10 text-slate-500 dark:text-slate-400" style={{ clipPath: NOTCH_SM }}>#{t}</span>
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{request.description}</p>
                            </div>
                            {/* Instrucciones */}
                            {cd.instructions && (
                                <div className="p-5 border-b border-emerald-500/10">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Instrucciones</p>
                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{cd.instructions}</p>
                                </div>
                            )}
                            {/* Output esperado */}
                            {cd.example_output && (
                                <div className="p-5 border-b border-emerald-500/10">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Output esperado</p>
                                    <div className="p-4 border font-mono text-xs relative overflow-hidden bg-white border-emerald-500/15 text-slate-700 dark:bg-[#050505] dark:border-emerald-500/10 dark:text-slate-300">
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500" />
                                        <pre className="whitespace-pre-wrap pl-2">{cd.example_output}</pre>
                                    </div>
                                </div>
                            )}
                            {/* Nota */}
                            <div className="p-4 text-center">
                                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400/50">Vista previa · Editor deshabilitado</p>
                            </div>
                        </div>
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
                                    {reviewResult.resource ? 'Reto publicado correctamente' : 'Solicitud rechazada'}
                                </p>
                                {reviewResult.resource && (
                                    <button
                                        onClick={() => { navigate(reviewResult.resource!.url); onClose(); }}
                                        className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500 hover:text-emerald-400 transition-colors"
                                    >
                                        Ver en desafíos →
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
                                        ? 'Este contenido ya está publicado en la plataforma.'
                                        : `Motivo: ${request.rejection_reason}`}
                                </p>
                                {request.status === 'approved' && request.resource_id && (
                                    <button
                                        onClick={() => navigate(`/dashboard/challenges/${request.resource_id}`)}
                                        className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500 hover:text-emerald-400 transition-colors"
                                    >
                                        Ver en desafíos →
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
