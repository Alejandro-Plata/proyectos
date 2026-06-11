import { useState, useCallback, useEffect, useRef } from 'react';
import { messagingService } from '../services/messagingService';
import { useMessaging } from '../../../hooks/useMessaging';
import { getAvatarUrl } from '../../../utils/getAvatarUrl';
import '../styles/codice.css';

type UserResult = { user_id: string; username: string; avatar_url?: string };

// Double-notch: top-right + bottom-left corners cut
const CLIP_MODAL = 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))';
const CLIP_TL    = 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)';
const CLIP_TR    = 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)';

function HexAvatar({ user, size = 'md' }: { user: UserResult; size?: 'sm' | 'md' }) {
    const dim = size === 'md' ? 'w-10 h-10' : 'w-8 h-8';
    return (
        <div className={`${dim} hex-shield overflow-hidden shrink-0`}>
            <img
                src={getAvatarUrl(user.username, user.avatar_url)}
                alt=""
                className="w-full h-full object-cover"
            />
        </div>
    );
}

interface UserSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStarted?: () => void;
}

export const UserSearchModal = ({ isOpen, onClose, onStarted }: UserSearchModalProps) => {
    const { startConversation } = useMessaging();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserResult[]>([]);
    const [suggestions, setSuggestions] = useState<UserResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [starting, setStarting] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        setLoadingSuggestions(true);
        messagingService.getSuggestedUsers()
            .then(setSuggestions)
            .catch(() => setSuggestions([]))
            .finally(() => setLoadingSuggestions(false));
        setTimeout(() => inputRef.current?.focus(), 50);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query.trim()) { setResults([]); return; }
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const users = await messagingService.searchUsers(query.trim());
                setResults(users);
            } catch { setResults([]); }
            finally { setSearching(false); }
        }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query, isOpen]);

    useEffect(() => {
        if (!isOpen) { setQuery(''); setResults([]); }
    }, [isOpen]);

    const handleSelect = useCallback(async (userId: string) => {
        setStarting(userId);
        try {
            await startConversation(userId);
            if (onStarted) onStarted(); else onClose();
        } finally { setStarting(null); }
    }, [startConversation, onClose, onStarted]);

    if (!isOpen) return null;

    const showSearch = query.trim().length > 0;
    const displayList = showSearch ? results : suggestions;

    return (
        <div
            className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Double-notched modal container */}
            <div
                className="
                    w-full sm:max-w-md sm:mx-4
                    flex flex-col overflow-hidden
                    sm:max-h-[560px] max-h-[80vh]
                    shadow-2xl shadow-emerald-500/5
                    bg-white dark:bg-[#0f1115]
                    border border-slate-200/80 dark:border-emerald-500/20
                "
                style={{ clipPath: CLIP_MODAL }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
                    <div>
                        <div className="mb-1">
                            <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                                Nueva conversación
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center transition-colors font-mono text-xs text-slate-400 hover:text-emerald-500 border border-slate-200 dark:border-white/10 hover:border-emerald-500/50"
                        style={{ clipPath: CLIP_TR }}
                    >
                        [×]
                    </button>
                </div>

                <div
                    className="h-px mx-5 mb-3 shrink-0"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.4), transparent)' }}
                />

                <div className="px-5 pb-3 shrink-0">
                    <div className="flex items-center gap-0">
                        {/* Input */}
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por nombre de usuario..."
                                className="
                                    w-full px-3 py-2.5 text-sm outline-none
                                    bg-transparent
                                    text-slate-900 placeholder:text-slate-400
                                    dark:text-white dark:placeholder:text-slate-500
                                    border-b-2 border-emerald-500/40 focus:border-emerald-400
                                    transition-colors
                                "
                                style={{ borderRadius: 0 }}
                            />
                            {searching && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <div className="w-3.5 h-3.5 border-2 border-t-emerald-500 animate-spin border-slate-200 dark:border-white/10" style={{ borderRadius: '50%' }} />
                                </div>
                            )}
                            {query && !searching && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-slate-400 hover:text-emerald-500 transition-colors"
                                >
                                    [×]
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {!showSearch && (
                    <p className="px-5 pb-1.5 font-mono text-[10px] uppercase tracking-[0.25em] shrink-0 text-slate-400 dark:text-slate-500">
                        Sugerencias
                    </p>
                )}

                {/* List */}
                <div className="flex-1 overflow-y-auto px-3 pb-4">
                    {/* No results */}
                    {showSearch && !searching && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <svg width="32" height="36" viewBox="0 0 64 72" fill="none" className="opacity-40">
                                <polygon points="32,2 62,18 62,54 32,70 2,54 2,18"
                                    stroke="#10b981" strokeWidth="2" fill="none" />
                            </svg>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                No se encuentra ningún usuario 
                            </p>
                        </div>
                    )}

                    {!showSearch && loadingSuggestions && (
                        <div className="space-y-1.5">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 animate-pulse">
                                    <div className="w-10 h-10 hex-shield shrink-0 bg-slate-100 dark:bg-white/5" />
                                    <div className="h-3 w-28 bg-slate-100 dark:bg-white/5" />
                                </div>
                            ))}
                        </div>
                    )}

                    {displayList.length > 0 && (
                        <div className="space-y-1">
                            {displayList.map((u) => (
                                <button
                                    key={u.user_id}
                                    onClick={() => handleSelect(u.user_id)}
                                    disabled={starting === u.user_id}
                                    className="
                                        w-full group/row flex items-center gap-3 px-2.5 py-2.5 text-left
                                        transition-colors disabled:opacity-60
                                        hover:bg-emerald-500/5 dark:hover:bg-emerald-500/8
                                        border-l-2 border-transparent hover:border-emerald-500/50
                                    "
                                >
                                    <HexAvatar user={u} />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[13px] font-bold tracking-tight block truncate text-slate-900 dark:text-white uppercase">
                                            {u.username}
                                        </span>
                                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                            @{u.username.toLowerCase()}
                                        </span>
                                    </div>
                                    {starting === u.user_id ? (
                                        <div className="w-4 h-4 border-2 border-t-emerald-500 animate-spin shrink-0 border-slate-200 dark:border-white/10" style={{ borderRadius: '50%' }} />
                                    ) : (
                                        <span
                                            className="
                                                shrink-0 font-mono text-[9px] uppercase tracking-widest
                                                text-emerald-500 border border-emerald-500/40 px-2 py-1
                                                opacity-0 group-hover/row:opacity-100 transition-opacity
                                            "
                                            style={{ clipPath: CLIP_TL }}
                                        >
                                            [ABRIR CÓDICE]
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
