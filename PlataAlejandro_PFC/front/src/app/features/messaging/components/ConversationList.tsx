import { useState, useEffect } from 'react';
import { useConversations } from '../hooks/useConversations';
import { EntradaCodice } from './EntradaCodice';
import { SearchInput } from '../../../components/SearchInput';
import { useUser } from '../../../context/UserContext';
import { useMessaging } from '../../../hooks/useMessaging';
import { messagingService } from '../services/messagingService';
import type { Conversation } from '../types/types';
import '../styles/codice.css';

interface ConversationListProps {
    isDark: boolean;
    onNewChat: () => void;
    onSelectConversation?: (conversationId: string) => void;
}

export const ConversationList = ({ onNewChat, onSelectConversation }: ConversationListProps) => {
    const { conversations, activeConversationId, searchQuery, setSearchQuery } = useConversations();
    const { archiveConversation, unarchiveConversation, closeConversation, openConversation } = useMessaging();
    const { user } = useUser();

    const [showArchived, setShowArchived] = useState(false);
    const [archived, setArchived] = useState<Conversation[]>([]);
    const [loadingArchived, setLoadingArchived] = useState(false);

    useEffect(() => {
        if (!showArchived) return;
        setLoadingArchived(true);
        messagingService.getArchivedConversations()
            .then(setArchived)
            .catch(() => setArchived([]))
            .finally(() => setLoadingArchived(false));
    }, [showArchived]);

    const handleSelect = (conv: Conversation) => {
        openConversation(conv);
        if (onSelectConversation) onSelectConversation(conv.id);
    };

    const handleArchive = async (conversationId: string) => {
        await archiveConversation(conversationId);
        setArchived((prev) => prev.filter((c) => c.id !== conversationId));
    };

    const handleUnarchive = async (conversationId: string) => {
        await unarchiveConversation(conversationId);
        setArchived((prev) => prev.filter((c) => c.id !== conversationId));
    };

    const handleClose = async (conversationId: string) => {
        await closeConversation(conversationId);
        setArchived((prev) => prev.filter((c) => c.id !== conversationId));
    };

    const displayList = showArchived ? archived : conversations;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-5 pt-4 pb-3 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {showArchived && (
                        <button
                            onClick={() => setShowArchived(false)}
                            className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                    <div>
                        {showArchived && (
                            <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                                Archivados
                            </h2>
                        )}
                    </div>
                </div>
                {!showArchived && (
                    <button
                        onClick={onNewChat}
                        title="Nueva conversación"
                        className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors border border-emerald-500/30 hover:border-emerald-500/60 px-2 py-1"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
                    >
                        [+]
                    </button>
                )}
            </div>

            {!showArchived && (
                <>
                    <div className="px-4 pb-2 shrink-0">
                        <SearchInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar conversación..."
                        />
                    </div>
                    <button
                        onClick={() => setShowArchived(true)}
                        className="mx-4 mb-3 flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wide transition-colors shrink-0 text-slate-500 hover:text-emerald-500 border border-slate-200/0 hover:border-emerald-500/20 dark:text-slate-400 dark:hover:text-emerald-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                            <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" />
                            <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM7 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                        </svg>
                        Archivados
                    </button>
                </>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-0.5">
                {/* Skeleton */}
                {showArchived && loadingArchived && (
                    <div className="space-y-1 px-2 pt-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                                <div className="w-10 h-10 hex-shield shrink-0 bg-slate-100 dark:bg-white/5" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-2.5 w-24 bg-slate-100 dark:bg-white/5" />
                                    <div className="h-2 w-40 bg-slate-100 dark:bg-white/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Conversation entries */}
                {!loadingArchived && displayList.map((conv) => (
                    <EntradaCodice
                        key={conv.id}
                        conversation={conv}
                        isActive={conv.id === activeConversationId}
                        onClick={() => handleSelect(conv)}
                        onArchive={() => handleArchive(conv.id)}
                        onUnarchive={() => handleUnarchive(conv.id)}
                        onClose={() => handleClose(conv.id)}
                        currentUserId={user?.user_id ?? ''}
                    />
                ))}

                {/* Empty state */}
                {!loadingArchived && displayList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <svg width="32" height="36" viewBox="0 0 64 72" fill="none" className="opacity-30">
                            <polygon points="32,2 62,18 62,54 32,70 2,54 2,18"
                                stroke="#10b981" strokeWidth="2" fill="none" />
                        </svg>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            // {showArchived ? 'sin archivados' : ''}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
