import { useState } from "react";
import { CodeBlockDesktop } from "../../../components/CodeBlock/CodeBlockDesktop";
import { Icons } from "../../../components/Icons";
import { kFormatter } from "../../../utils/kFormatter";
import { UserPopover } from "./UserPopover/UserPopover";
import { ReportModal } from "./ReportModal";
import { forumService } from "../services/forumService";
import type { ContentPart, Thread } from "../types/types";
import { renderContent } from "../../notes/utils/renderContent";
import { resolveAssetUrl } from "../../../utils/getAvatarUrl";

interface ThreadMainPostDesktopProps {
    thread: Thread;
    userVote?: 'up' | 'down' | null;
    localLikes?: number;
    onVote?: (type: 'up' | 'down') => void;
    onReply?: () => void;
}

export const ThreadMainPostDesktop = ({
    thread,
    userVote,
    localLikes,
    onVote,
    onReply,
}: ThreadMainPostDesktopProps) => {
    const [showReport, setShowReport] = useState(false);
    const contentParts = thread.content ?? [];
    const displayLikes = localLikes ?? thread.likes;

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
    };

    const handleReport = async (reason: string) => {
        await forumService.reportPost(thread.id, reason);
    };

    return (
        <>
        <article className="bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden shadow-sm shadow-emerald-500/5">
            <div className="flex">
                <div className="flex flex-col items-center p-4 gap-1 bg-slate-50/50 dark:bg-[#0f1115] border-r border-emerald-500/10 dark:border-emerald-500/[0.07] min-w-[60px]">
                    <button
                        onClick={() => onVote?.('up')}
                        aria-label="Votar positivo"
                        aria-pressed={userVote === 'up'}
                        className={`p-1 transition-colors ${userVote === 'up' ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'}`}
                    >
                        <div className="w-5 h-5">{Icons.arrowUp}</div>
                    </button>
                    <span className={`font-bold font-mono text-sm ${userVote === 'up' ? 'text-emerald-500' : userVote === 'down' ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                        {kFormatter(displayLikes)}
                    </span>
                    <button
                        onClick={() => onVote?.('down')}
                        aria-label="Votar negativo"
                        aria-pressed={userVote === 'down'}
                        className={`p-1 transition-colors ${userVote === 'down' ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                    >
                        <div className="w-5 h-5">{Icons.arrowDown}</div>
                    </button>
                </div>

                <div className="flex-1 p-8 min-w-0">
                    <div className="flex items-center gap-3 mb-6">
                        <UserPopover
                            userId={thread.author.id}
                            username={thread.author.name}
                            avatarUrl={thread.author.avatar}
                        >
                            <img
                                src={thread.author.avatar}
                                className="hex-shield w-10 h-10 bg-slate-200 cursor-pointer"
                                alt="avatar"
                            />
                        </UserPopover>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                                {thread.title}
                            </h1>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em]">
                                <span className="text-emerald-600 dark:text-emerald-400">
                                    {thread.author.rank}
                                </span>
                                <span className="text-slate-400">•</span>
                                <UserPopover
                                    userId={thread.author.id}
                                    username={thread.author.name}
                                    avatarUrl={thread.author.avatar}
                                >
                                    <span className="text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer transition-colors">
                                        @{thread.author.name}
                                    </span>
                                </UserPopover>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-400">{thread.timestamp}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-base leading-relaxed text-slate-700 dark:text-slate-300 space-y-4">
                        {contentParts.length > 0 ? (
                            contentParts.map((part: ContentPart, index: number) => {
                                if (part.type === 'code') {
                                    return <CodeBlockDesktop key={index} code={part.value} language={part.language || 'javascript'} />;
                                }
                                if (part.type === 'definition') {
                                    return (
                                        <div key={index} className="border-l-2 border-emerald-500/50 pl-4 py-2 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05]">
                                            {part.title && (
                                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1">{part.title}</p>
                                            )}
                                            <div className="text-sm">{renderContent(part.value)}</div>
                                        </div>
                                    );
                                }
                                if (part.type === 'image') {
                                    return (
                                        <div key={index} className="border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
                                            <img src={resolveAssetUrl(part.value)} alt="" className="w-full max-h-96 object-cover" />
                                        </div>
                                    );
                                }
                                return <div key={index}>{renderContent(part.value)}</div>;
                            })
                        ) : (
                            <p>{thread.excerpt}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-emerald-500/10 dark:border-emerald-500/[0.07] text-slate-500 dark:text-slate-400">
                        <button
                            onClick={onReply}
                            className="flex items-center gap-2 hover:text-emerald-500 text-sm font-bold font-mono uppercase tracking-[0.15em] transition-colors"
                        >
                            <div className="w-4 h-4">{Icons.message}</div> Responder
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 hover:text-emerald-500 text-sm font-bold font-mono uppercase tracking-[0.15em] transition-colors"
                        >
                            <div className="w-4 h-4">{Icons.share}</div> Compartir
                        </button>
                        <button
                            onClick={() => setShowReport(true)}
                            className="ml-auto hover:text-rose-500 font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
                        >
                            Reportar
                        </button>
                    </div>
                </div>
            </div>
        </article>

        <ReportModal
            isOpen={showReport}
            onClose={() => setShowReport(false)}
            onSubmit={handleReport}
        />
        </>
    );
};

