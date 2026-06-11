import { Icons } from '../../../components/Icons';
import { UserPopover } from './UserPopover/UserPopover';
import { ReplyEditor } from './ReplyEditor';
import { CommentVoteControls } from './CommentVoteControls';
import { useComment } from '../hooks/useComment';
import type { CommentItemProps } from '../types/types';
import { renderContent } from '../../notes/utils/renderContent';

export const CommentItem = ({ comment, depth = 0, onMarkSolution, onDelete, postId, onReplySubmit }: CommentItemProps) => {
    const {
        isReplying,
        setIsReplying,
        toggleReply,
        areRepliesVisible,
        toggleRepliesVisibility,
        userVote,
        localVotes,
        handleVote,
    } = useComment(comment.likes, postId, comment.id);

    const hasReplies = comment.replies && comment.replies.length > 0;

    const indentationClass = depth > 0
        ? (depth < 3 ? 'ml-12' : 'ml-4 pl-4 border-l-2 border-emerald-500/15 dark:border-emerald-500/10')
        : '';

    const handleReplySubmit = async (content: string) => {
        if (onReplySubmit) await onReplySubmit(comment.id, content);
        setIsReplying(false);
    };

    return (
        <div className={`relative group animate-fade-in ${indentationClass}`}>

            {depth > 0 && depth < 3 && (
                <div className="absolute -left-[20px] top-0 bottom-0 w-[2px] bg-emerald-500/10 dark:bg-emerald-500/[0.07] group-hover:bg-emerald-500/20 transition-colors" />
            )}

            <div className={`p-4 border transition-colors relative overflow-hidden
                ${comment.isOfficialSolution
                    ? 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white dark:bg-[#0a0b0e] border-emerald-500/15 dark:border-emerald-500/10 hover:border-emerald-500/25 dark:hover:border-emerald-500/15'
                }`}
            >
                {comment.isOfficialSolution && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl pointer-events-none" />
                )}

                <div className="flex gap-4 relative z-10">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                        <UserPopover
                            userId={comment.author.id}
                            username={comment.author.name}
                            avatarUrl={comment.author.avatar}
                            onReply={() => setIsReplying(true)}
                        >
                            <img
                                src={comment.author.avatar}
                                alt={comment.author.name}
                                className="hex-shield w-8 h-8 bg-slate-100 object-cover cursor-pointer"
                            />
                        </UserPopover>
                        {hasReplies && areRepliesVisible && (
                            <div className="w-[2px] flex-1 bg-emerald-500/10 dark:bg-emerald-500/[0.07] my-2" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <UserPopover
                                    userId={comment.author.id}
                                    username={comment.author.name}
                                    avatarUrl={comment.author.avatar}
                                    onReply={() => setIsReplying(true)}
                                >
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">
                                        @{comment.author.name}
                                    </span>
                                </UserPopover>

                                {comment.isOfficialSolution && (
                                    <span
                                        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] font-bold bg-emerald-500 text-black"
                                    >
                                        <div className="w-3 h-3">{Icons.check}</div> Solución
                                    </span>
                                )}

                                <span className="font-mono text-[10px] text-slate-400">• {comment.timestamp}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {onMarkSolution && (
                                    <button
                                        onClick={onMarkSolution}
                                        aria-pressed={comment.isOfficialSolution}
                                        className={`transition-colors font-mono text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 px-2 py-1 border min-h-[32px]
                                        ${comment.isOfficialSolution
                                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/30'
                                            : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border-transparent hover:border-emerald-500/20'
                                        }`}
                                        title={comment.isOfficialSolution ? 'Desmarcar solución' : 'Marcar como solución correcta'}
                                    >
                                        <div className="w-3 h-3">{Icons.check}</div>
                                        {comment.isOfficialSolution ? 'Solución Correcta' : 'Marcar Solución'}
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(comment.id)}
                                        aria-label="Eliminar comentario"
                                        className="transition-colors font-mono text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1 px-2 py-1 border border-transparent hover:border-rose-500/20 text-slate-400 hover:text-rose-500 hover:bg-rose-500/[0.06] dark:hover:bg-rose-500/[0.08] min-h-[32px]"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                            {renderContent(comment.content)}
                        </div>

                        <div className="flex items-center gap-4 select-none">
                            <CommentVoteControls
                                localVotes={localVotes}
                                userVote={userVote}
                                onVote={handleVote}
                            />

                            <button
                                onClick={toggleReply}
                                className={`font-mono text-[10px] font-bold uppercase tracking-[0.15em] hover:text-emerald-500 transition-colors flex items-center gap-1.5 ${isReplying ? 'text-emerald-500' : 'text-slate-500'}`}
                            >
                                <div className="w-4 h-4">{Icons.message}</div> Responder
                            </button>

                            {hasReplies && (
                                <button
                                    onClick={toggleRepliesVisibility}
                                    className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-emerald-500 transition-colors ml-auto flex items-center gap-1"
                                >
                                    {areRepliesVisible
                                        ? <><span className="hidden sm:inline">Ocultar</span> <div className="w-3 h-3">{Icons.chevronUp}</div></>
                                        : <><span className="hidden sm:inline">Ver {comment.replies.length} respuestas</span> <div className="w-3 h-3">{Icons.chevronDown}</div></>
                                    }
                                </button>
                            )}
                        </div>

                        {isReplying && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                <ReplyEditor
                                    placeholder={`Respondiendo a @${comment.author.name}...`}
                                    autoFocus={true}
                                    onCancel={() => setIsReplying(false)}
                                    compact
                                    onSubmit={handleReplySubmit}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {hasReplies && areRepliesVisible && (
                <div className="mt-3 flex flex-col gap-3">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            postId={postId}
                            onReplySubmit={onReplySubmit}
                            onDelete={onDelete}
                        />
                    ))}
                    {comment.replies.length > 5 && (
                        <button className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-500 ml-12 hover:text-emerald-400 transition-colors text-left">
                            Ver más respuestas...
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
