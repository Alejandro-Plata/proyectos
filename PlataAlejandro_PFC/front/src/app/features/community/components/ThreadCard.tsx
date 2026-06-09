import { useNavigate } from "react-router-dom";
import { CATEGORY_CONFIG } from "../config/categories";
import type { Thread } from "../types/types";
import { Icons } from "../../../components/Icons";
import { kFormatter } from "../../../utils/kFormatter";
import { UserPopover } from "./UserPopover/UserPopover";
import { Badge } from "../../../components/Badge";

interface ThreadCardProps {
    data: Thread;
    onVote?: (id: string, type: 'up' | 'down') => void;
}

export const ThreadCardDesktop = ({ data, onVote }: ThreadCardProps) => {
    const config = CATEGORY_CONFIG[data.category];
    const navigate = useNavigate();

    return (
        <article
            onClick={() => navigate(`./${data.id}`)}
            className="flex w-full bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-colors cursor-pointer"
        >
            <div className="hidden sm:flex w-12 bg-slate-50/80 dark:bg-[#111214] flex-col items-center pt-3 gap-1 border-r border-emerald-500/10 dark:border-emerald-500/[0.07] shrink-0">
                <button
                    className={`p-1 transition-colors ${data.userVote === 1 ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10'}`}
                    onClick={(e) => { e.stopPropagation(); onVote?.(data.id, 'up'); }}
                >
                    {Icons.arrowUp}
                </button>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-200">{kFormatter(data.likes)}</span>
                <button
                    className={`p-1 transition-colors ${data.userVote === -1 ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-500/10'}`}
                    onClick={(e) => { e.stopPropagation(); onVote?.(data.id, 'down'); }}
                >
                    {Icons.arrowDown}
                </button>
            </div>

            <div className="flex-1 p-3 sm:p-4 flex flex-col gap-2 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <UserPopover userId={data.author.id} username={data.author.name} avatarUrl={data.author.avatar}>
                            <img
                                src={data.author.avatar}
                                alt={data.author.name}
                                className="hex-shield w-5 h-5 bg-slate-200 shrink-0"
                            />
                        </UserPopover>
                        <span
                            onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/community/profile/${data.author.id}`); }}
                            className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer truncate transition-colors"
                        >
                            {data.author.name}
                        </span>
                        {data.author.rank && (
                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 shrink-0 hidden sm:inline">
                                {data.author.rank}
                            </span>
                        )}
                        <span className="text-slate-300 dark:text-slate-700 shrink-0">·</span>
                        <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] shrink-0">{data.timestamp}</span>
                    </div>
                    <Badge variant="category" color={config.color} border={config.border} className="shrink-0">
                        {config.label}
                    </Badge>
                </div>

                <div>
                    <h3 className="font-mono text-sm sm:text-base font-bold uppercase tracking-[0.04em] text-slate-900 dark:text-slate-100 leading-snug mb-1">
                        {data.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{data.excerpt}</p>
                </div>

                {/* Footer */}
                <footer className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        {/* Mobile vote */}
                        <div className="flex sm:hidden items-center gap-2 border border-emerald-500/15 dark:border-emerald-500/10 px-2 py-1">
                            <button onClick={(e) => { e.stopPropagation(); onVote?.(data.id, 'up'); }} aria-label="Votar positivo" aria-pressed={data.userVote === 1} className={`transition-colors ${data.userVote === 1 ? 'text-emerald-500' : 'active:text-emerald-500'}`}>{Icons.arrowUp}</button>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">{kFormatter(data.likes)}</span>
                            <button onClick={(e) => { e.stopPropagation(); onVote?.(data.id, 'down'); }} aria-label="Votar negativo" aria-pressed={data.userVote === -1} className={`transition-colors ${data.userVote === -1 ? 'text-rose-500' : 'active:text-rose-500'}`}>{Icons.arrowDown}</button>
                        </div>
                        <button className="flex items-center gap-1.5 font-mono px-2 py-1 hover:text-emerald-500 transition-colors">
                            <div className="w-4 h-4">{Icons.message}</div>
                            <span>{data.comments}</span>
                        </button>
                    </div>
                    {data.isSolved && (
                        <span
                            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
                            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-1 border border-emerald-500/20"
                        >
                            <div className="w-3 h-3">{Icons.check}</div>
                            <span className="hidden sm:inline">Resuelto</span>
                        </span>
                    )}
                </footer>
            </div>
        </article>
    );
};

export const ThreadCardMobile = ({ data, onVote }: ThreadCardProps) => {
    const config = CATEGORY_CONFIG[data.category];
    const navigate = useNavigate();

    return (
        <article
            onClick={() => navigate(`./${data.id}`)}
            className="flex flex-col w-full bg-white dark:bg-[#0a0b0e] border-b border-emerald-500/10 dark:border-emerald-500/[0.07] hover:bg-emerald-500/[0.01] active:bg-emerald-500/[0.02] transition-colors p-4 gap-3"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0" onClick={(e) => e.stopPropagation()}>
                    <UserPopover userId={data.author.id} username={data.author.name} avatarUrl={data.author.avatar}>
                        <img src={data.author.avatar} alt={data.author.name} className="hex-shield w-5 h-5 bg-slate-200 dark:bg-slate-800 shrink-0" />
                    </UserPopover>
                    <span
                        onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/community/profile/${data.author.id}`); }}
                        className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px] cursor-pointer hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                    >
                        {data.author.name}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 shrink-0">·</span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] shrink-0">{data.timestamp}</span>
                </div>
                <Badge variant="category" color={config.color} border={config.border}>
                    {config.label}
                </Badge>
            </div>

            <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-[0.04em] text-slate-900 dark:text-white leading-snug mb-1">
                    {data.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{data.excerpt}</p>
            </div>

            <footer className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 border border-emerald-500/10 dark:border-emerald-500/[0.07] px-2 py-1">
                        <button
                            className={`transition-colors ${data.userVote === 1 ? 'text-emerald-500' : 'text-slate-400 active:text-emerald-500'}`}
                            onClick={(e) => { e.stopPropagation(); onVote?.(data.id, 'up'); }}
                        >
                            <div className="w-4 h-4">{Icons.arrowUp}</div>
                        </button>
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white min-w-[1.5ch] text-center">{kFormatter(data.likes)}</span>
                        <button
                            className={`transition-colors ${data.userVote === -1 ? 'text-rose-500' : 'text-slate-400 active:text-rose-500'}`}
                            onClick={(e) => { e.stopPropagation(); onVote?.(data.id, 'down'); }}
                        >
                            <div className="w-4 h-4">{Icons.arrowDown}</div>
                        </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono text-xs">
                        <div className="w-4 h-4">{Icons.message}</div>
                        <span>{data.comments || 0}</span>
                    </div>
                </div>
                {data.isSolved && (
                    <div className="flex items-center gap-1 text-emerald-500 font-mono text-[10px] font-bold uppercase tracking-[0.15em]">
                        <div className="w-3 h-3">{Icons.check}</div> Resuelto
                    </div>
                )}
            </footer>
        </article>
    );
};
