import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { CommentItem } from '../../components/CommentItem';
import { ReplyEditor } from '../../components/ReplyEditor';
import { kFormatter } from '../../../../utils/kFormatter';
import { UserPopover } from '../../components/UserPopover/UserPopover';
import { usePostDetail } from '../../hooks/usePostDetail';
import { useUser } from '../../../../hooks/useUser';
import type { ContentPart } from '../../types/types';
import { renderContent } from '../../../notes/utils/renderContent';
import { useAchievements } from '../../../../context/AchievementContext';
import { EncabezadoMobile } from '../../../../components/Header/HeaderMobile';
import { resolveAssetUrl } from '../../../../utils/getAvatarUrl';

export const PostDetailMobile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showReplyEditor, setShowReplyEditor] = useState(false);
    const { user } = useUser();

    const {
        thread,
        comments,
        totalComments,
        isLoading,
        error,
        userVote,
        localLikes,
        handleVote,
        addComment,
        toggleSolution,
        deletePost,
        deleteComment,
    } = usePostDetail(id ?? '');

    const isAuthor = !!user && !!thread && thread.author.id === user.user_id;
    const isModOrAdmin = user?.role === 'ADMIN' || user?.role === 'MODERADOR';
    const { encolarLogros } = useAchievements();

    const handleMarkSolution = async (commentId: string) => {
        const { unlockedAchievements } = await toggleSolution(commentId);
        if (unlockedAchievements.length > 0) {
            encolarLogros(unlockedAchievements);
        }
    };

    const handleDeletePost = async () => {
        if (!confirm('¿Eliminar este post? Esta acción no se puede deshacer.')) return;
        
        await deletePost();
        navigate(-1);
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('¿Eliminar este comentario?')) return;
        
        await deleteComment(commentId);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (error || !thread) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col items-center justify-center gap-4">
                <p className="text-rose-500 text-sm">{error || 'Post no encontrado'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="h-10 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors border border-slate-200 dark:border-white/10"
                >
                    Volver
                </button>
            </div>
        );
    }

    const contentParts = thread.content ?? [];

    return (
        <>
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-200 font-sans pb-48">

            <EncabezadoMobile
                modo="subpagina"
                titulo={thread.title}
                onBack={() => navigate(-1)}
            />

            <div className="px-4 pt-6 pb-4 border-b border-slate-200 dark:border-white/[0.06]">

                <div className="flex items-center gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
                    <UserPopover userId={thread.author.id} username={thread.author.name} avatarUrl={thread.author.avatar}>
                        <img
                            src={thread.author.avatar}
                            alt={thread.author.name}
                            className="hex-shield w-8 h-8 bg-slate-200 dark:bg-slate-800"
                        />
                    </UserPopover>
                    <div>
                        <UserPopover userId={thread.author.id} username={thread.author.name} avatarUrl={thread.author.avatar}>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">
                                @{thread.author.name}
                            </span>
                        </UserPopover>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{thread.timestamp}</p>
                    </div>
                </div>

                <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                    {thread.title}
                </h1>

                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
                    {contentParts.map((part: ContentPart, i: number) => {
                        if (part.type === 'code') {
                            return <pre key={i} className="bg-slate-100 dark:bg-[#0f1115] border border-slate-200 dark:border-emerald-500/10 p-3 font-mono text-xs text-slate-800 dark:text-emerald-300 overflow-x-auto whitespace-pre">{part.value}</pre>;
                        }
                        if (part.type === 'definition') {
                            return (
                                <div key={i} className="border-l-2 border-emerald-500/50 pl-3 py-2 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05]">
                                    {part.title && (
                                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mb-1">{part.title}</p>
                                    )}
                                    <div>{renderContent(part.value)}</div>
                                </div>
                            );
                        }
                        if (part.type === 'image') {
                            return (
                                <div key={i} className="border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
                                    <img src={resolveAssetUrl(part.value)} alt="" className="w-full max-h-64 object-cover" />
                                </div>
                            );
                        }
                        return <div key={i}>{renderContent(part.value)}</div>;
                    })}
                </div>

                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.06]">
                    <div className="flex items-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-emerald-500/10">
                        <button
                            onClick={() => handleVote('up')}
                            className={`w-11 h-11 flex items-center justify-center transition-colors ${userVote === 'up' ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'}`}
                        >
                            <div className="w-4 h-4">{Icons.arrowUp}</div>
                        </button>
                        <span className={`font-mono text-sm font-bold min-w-[1.5ch] text-center px-1 ${userVote === 'up' ? 'text-emerald-500' : userVote === 'down' ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                            {kFormatter(localLikes)}
                        </span>
                        <button
                            onClick={() => handleVote('down')}
                            className={`w-11 h-11 flex items-center justify-center transition-colors ${userVote === 'down' ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                        >
                            <div className="w-4 h-4">{Icons.arrowDown}</div>
                        </button>
                    </div>

                    <button
                        onClick={() => setShowReplyEditor(v => !v)}
                        className="flex items-center gap-1.5 h-11 px-2 text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors"
                    >
                        <div className="w-4 h-4">{Icons.message}</div>
                        <span className="text-sm font-medium">{totalComments}</span>
                    </button>

                    <button
                        onClick={() => navigator.clipboard.writeText(window.location.href).catch(() => {})}
                        className="h-11 w-11 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors ml-auto"
                    >
                        <div className="w-4 h-4">{Icons.share}</div>
                    </button>

                    {isModOrAdmin && (
                        <button
                            onClick={handleDeletePost}
                            className="h-11 w-11 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                            title="Eliminar post"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {showReplyEditor && (
                <div className="px-4 py-4 border-b border-slate-200 dark:border-white/[0.06]">
                    <ReplyEditor
                        placeholder="Añade tu comentario..."
                        autoFocus
                        onCancel={() => setShowReplyEditor(false)}
                        compact
                        onSubmit={async (content) => {
                            await addComment(content);
                            setShowReplyEditor(false);
                        }}
                    />
                </div>
            )}

            <div className="px-4 py-4 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 pt-2">
                    {totalComments} {totalComments === 1 ? 'comentario' : 'comentarios'}
                </h2>

                {comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        postId={id}
                        onMarkSolution={isAuthor ? () => handleMarkSolution(comment.id) : undefined}
                        onDelete={isModOrAdmin ? handleDeleteComment : undefined}
                        onReplySubmit={(parentId, content) => addComment(content, parentId)}
                    />
                ))}

                {comments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sé el primero en comentar.</p>
                    </div>
                )}
            </div>

        </div>

</>
    );
};
