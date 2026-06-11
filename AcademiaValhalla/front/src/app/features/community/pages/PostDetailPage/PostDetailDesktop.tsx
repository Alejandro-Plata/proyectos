import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { ThreadMainPostDesktop } from '../../components/ThreadMainPost';
import { CommentItem } from '../../components/CommentItem';
import { ReplyEditor } from '../../components/ReplyEditor';
import { usePostDetail } from '../../hooks/usePostDetail';
import { useUser } from '../../../../hooks/useUser';
import { useAchievements } from '../../../../context/AchievementContext';

export const PostDetailDesktop = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const replyEditorRef = useRef<HTMLDivElement>(null);
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

    const scrollToReply = () => {
        replyEditorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        replyEditorRef.current?.querySelector('textarea')?.focus();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    if (error || !thread) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] flex flex-col items-center justify-center gap-4">
                <p className="text-rose-500">{error || 'Post no encontrado'}</p>
                <button onClick={() => navigate(-1)} className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 hover:text-emerald-500 transition-colors">Volver</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] pb-20 font-sans">

            <header
                className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0b0e]/80 backdrop-blur-md border-b border-emerald-500/15 dark:border-emerald-500/10 h-16 flex items-center"
                style={{ boxShadow: 'inset 0 -1px 0 rgba(16,185,129,0.10)' }}
            >
                <div className="w-full max-w-5xl mx-auto px-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-emerald-500/[0.08] text-slate-500 hover:text-emerald-500 transition-colors"
                    >
                        <div className="w-5 h-5">{Icons.back}</div>
                    </button>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 truncate flex-1">
                        {thread.category === 'doubt' ? 'Ayuda' : 'Discusión'}
                        <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
                        <span className="text-slate-900 dark:text-white normal-case tracking-normal text-sm font-bold font-sans">{thread.title}</span>
                    </span>
                    {isModOrAdmin && (
                        <button
                            onClick={handleDeletePost}
                            className="flex items-center gap-1.5 h-8 px-3 font-mono text-[10px] uppercase tracking-[0.15em] font-bold border border-transparent hover:border-rose-500/30 text-slate-400 hover:text-rose-500 hover:bg-rose-500/[0.06] transition-colors shrink-0"
                            title="Eliminar post"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar post
                        </button>
                    )}
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">

                <ThreadMainPostDesktop
                    thread={thread}
                    userVote={userVote}
                    localLikes={localLikes}
                    onVote={handleVote}
                    onReply={scrollToReply}
                />

                <div className="space-y-6">

                    <div className="flex items-center justify-between border-b border-emerald-500/10 dark:border-emerald-500/[0.07] pb-4">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {totalComments} {totalComments === 1 ? 'comentario' : 'comentarios'}
                            </h3>
                        </div>
                    </div>

                    <div ref={replyEditorRef} className="bg-white dark:bg-[#0a0b0e] p-1 border border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5">
                        <ReplyEditor
                            placeholder="Añade un comentario a la discusión..."
                            onSubmit={(content) => addComment(content)}
                        />
                    </div>

                    <div className="space-y-6 mt-8">
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
                        {comments.length === 0 && !isLoading && (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <svg className="w-10 h-10 text-emerald-500/20" viewBox="0 0 48 48" fill="none">
                                    <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                </svg>
                                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Sé el primero en comentar</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

    </div>
    );
};
