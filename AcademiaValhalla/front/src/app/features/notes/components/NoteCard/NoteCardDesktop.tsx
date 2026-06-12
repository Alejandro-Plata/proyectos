import { useState } from 'react';
import React from 'react';
import type { NoteCardProps } from '../../types/types';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { getDifficultyConfig, getLanguageColor } from '../../utils';
import { Badge } from '../../../../components/Badge';
import { notesService } from '../../services/notesService';

const COMMUNITY_STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    pending:  { label: 'Solicitud enviada', cls: 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/[0.06]' },
    approved: { label: 'Publicado en comunidad', cls: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.06]' },
    rejected: { label: 'Solicitud rechazada', cls: 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/[0.06]' },
};

export const NoteCardDesktop: React.FC<NoteCardProps> = ({ note }) => {
    const navigate = useNavigate();
    const config = getDifficultyConfig(note.difficulty);
    const status = note.community_status;
    const canRequest = !status || status === 'personal' || status === 'rejected';
    const isPersonal = note.source === 'personal';

    const [requesting, setRequesting] = useState(false);
    const [requested, setRequested] = useState(false);
    const [requestError, setRequestError] = useState(false);

    const handleRequestCommunity = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (requesting || requested) return;
        setRequesting(true);
        setRequestError(false);
        try {
            await notesService.requestCommunity(note.id);
            setRequested(true);
        } catch {
            setRequestError(true);
        } finally {
            setRequesting(false);
        }
    };

    const statusInfo = requested
        ? COMMUNITY_STATUS_LABELS['pending']
        : status && COMMUNITY_STATUS_LABELS[status];

    return (
        <div className="relative h-full flex flex-col overflow-hidden border transition-colors bg-white dark:bg-[#0a0b0e] border-emerald-500/15 dark:border-emerald-500/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 shadow-sm shadow-emerald-500/5 group">
            <Link to={`${note.id}`} className="flex-1 flex flex-col p-5 min-h-0">

                {/* Section label */}
                <div className="mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Nota</span>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                    <Badge variant="language" className={getLanguageColor(note.language)}>
                        {note.language}
                    </Badge>
                    <Badge variant="difficulty" bg={config.bg} color={config.color} border={config.border}>
                        {note.difficulty}
                    </Badge>
                </div>

                {/* Título */}
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {note.title}
                </h3>

                {/* Descripción */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-5 flex-1">
                    {note.shortDescription}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-emerald-500/10 dark:border-emerald-500/[0.07] mt-auto">
                    <div className="flex gap-3 overflow-hidden">
                        {note.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-[0.15em]">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <span className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-500 transition-colors">
                        {Icons.chevronRight}
                    </span>
                </div>
            </Link>

            {/* Revision badges */}
            {note.pendingRevision && (
                <div className="px-5 py-2 border-t border-amber-500/20 bg-amber-500/[0.04] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber-600 dark:text-amber-400">
                        En revisión — cambios pendientes
                    </span>
                </div>
            )}
            {!note.pendingRevision && note.rejectedRevision && (
                <div className="px-5 py-2 border-t border-rose-500/20 bg-rose-500/[0.04] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-rose-600 dark:text-rose-400 truncate">
                            {note.rejectedRevision.review_comment
                                ? `Rechazado: ${note.rejectedRevision.review_comment}`
                                : 'Cambios rechazados'}
                        </span>
                    </div>
                    <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); navigate(`${note.id}/edit`); }}
                        className="font-mono text-[10px] uppercase tracking-[0.15em] text-rose-600 dark:text-rose-400 hover:text-rose-500 shrink-0 transition-colors"
                    >
                        Editar →
                    </button>
                </div>
            )}

            {/* Community action row */}
            <div className="px-5 py-3 border-t border-emerald-500/10 dark:border-emerald-500/[0.07] bg-slate-50/50 dark:bg-white/[0.01] flex items-center justify-between gap-3">
                {statusInfo ? (
                    <span className={`font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border ${statusInfo.cls}`}>
                        {statusInfo.label}
                    </span>
                ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">
                        Nota personal
                    </span>
                )}

                <div className="flex items-center gap-2 shrink-0">
                    {isPersonal && (
                        <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); navigate(`${note.id}/edit`); }}
                            className="flex items-center gap-1 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}
                            title="Editar nota"
                            data-tour="note-card-edit"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                            Editar
                        </button>
                    )}

                {canRequest && !requested && (
                    <button
                        onClick={handleRequestCommunity}
                        disabled={requesting}
                        className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/[0.05] disabled:opacity-50 transition-colors shrink-0"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}
                        title="Solicitar publicar esta nota en la comunidad"
                    >
                        {requesting ? (
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        )}
                        {requesting ? 'Enviando…' : 'Proponer a comunidad'}
                    </button>
                )}

                {requestError && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-rose-500/70">
                        Error al enviar
                    </span>
                )}
                </div>
            </div>
        </div>
    );
};
