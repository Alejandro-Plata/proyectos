import { useState, useEffect } from 'react';
import { useUser } from '../../../../context/UserContext';
import { fetchAdminNoteById } from '../../services/adminService';
import { PreviewNotePost } from '../../../community/components/PreviewNotePost';

interface NotePreviewModalProps {
    noteId: string;
    onClose: () => void;
}

const NOTCH_SM = 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)';

type NoteDetail = Awaited<ReturnType<typeof fetchAdminNoteById>>;

export const NotePreviewModal = ({ noteId, onClose }: NotePreviewModalProps) => {
    const { user } = useUser();
    const [note, setNote] = useState<NoteDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.token) return;
        setIsLoading(true);
        fetchAdminNoteById(user.token, noteId)
            .then(setNote)
            .catch(() => setError('No se pudo cargar el apunte'))
            .finally(() => setIsLoading(false));
    }, [noteId, user?.token]);

    return (
        <div
            className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0a0b0e] border border-emerald-500/20 dark:border-emerald-500/15 shadow-2xl shadow-emerald-500/10 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-emerald-500/10 bg-emerald-500/[0.03] shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="inline-block w-1 h-4 bg-violet-500 shrink-0" />
                        <div>
                            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                                Vista previa · apunte
                            </span>
                            {note && (
                                <p className="font-mono text-sm uppercase tracking-[0.1em] text-slate-900 dark:text-white leading-tight mt-0.5">
                                    {note.title}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {note && (
                            <span
                                className="px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider border bg-violet-500/[0.08] text-violet-600 border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400"
                                style={{ clipPath: NOTCH_SM }}
                            >
                                {note.community_status}
                            </span>
                        )}
                        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Cargando apunte…</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-center py-16">
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-rose-500/70">{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && note && (
                        <PreviewNotePost
                            title={note.title}
                            content={note.content}
                            author={{ username: note.submitted_by ?? 'usuario', avatar_url: note.author_avatar }}
                            submittedAt={note.created_at}
                            tags={note.tags}
                            language={note.language}
                            difficulty={note.difficulty}
                            interactive={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
