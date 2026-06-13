import { useRef, useState } from 'react';
import type { Conversation } from '../types/types';
import { formatMessageTime } from '../utils/formatMessageTime';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { getAvatarUrl } from '../../../utils/getAvatarUrl';

interface PropsEntradaCodice {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
    onArchive: () => void;
    onUnarchive?: () => void;
    onClose: () => void;
    currentUserId: string;
}

export const EntradaCodice = ({
    conversation, isActive, onClick, onArchive, onUnarchive, onClose, currentUserId,
}: PropsEntradaCodice) => {
    const { last_message, last_message_time, last_message_sender_id, unread_count, is_archived } = conversation;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

    const isOwnMessage = last_message_sender_id === currentUserId;
    const hasUnread = unread_count > 0 && !isOwnMessage;

    // Resolve display info based on conversation type
    const displayName = conversation.is_group
        ? conversation.name
        : conversation.participant.username;

    const avatarUrl = conversation.is_group
        ? conversation.avatar_url
        : conversation.participant.avatar_url;

    const isOnline = conversation.is_group
        ? false
        : conversation.participant.is_online;

    // For groups, prefix last_message with sender name
    const lastMessageDisplay = (() => {
        if (!last_message) return null;
        if (conversation.is_group && last_message_sender_id && last_message_sender_id !== currentUserId) {
            const sender = conversation.participants.find(p => p.user_id === last_message_sender_id);
            if (sender) return `${sender.username}: ${last_message}`;
        }
        return last_message;
    })();

    return (
        <div className={`relative group ${menuOpen ? 'z-10' : ''}`}>
            {/* Left accent bar */}
            <span className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors ${
                isActive ? 'bg-emerald-500' : hasUnread ? 'bg-emerald-500/50' : 'bg-transparent'
            }`} />

            <button
                onClick={onClick}
                className={`w-full flex items-center gap-3 pl-4 pr-10 py-3 text-left transition-colors ${
                    isActive
                        ? 'bg-emerald-500/[0.06] dark:bg-emerald-500/[0.09]'
                        : 'hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                }`}
            >
                {/* Avatar */}
                <div className="relative shrink-0 w-10 h-10">
                    {conversation.is_group ? (
                        <div className={`w-10 h-10 hex-shield flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 overflow-hidden ${is_archived ? 'opacity-40 grayscale' : ''}`}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-mono text-[11px] font-bold text-emerald-500">
                                    {displayName.slice(0, 2).toUpperCase()}
                                </span>
                            )}
                        </div>
                    ) : (
                        <img
                            src={getAvatarUrl(conversation.participant.username, conversation.participant.avatar_url)}
                            alt={displayName}
                            className={`w-10 h-10 hex-shield object-cover ${is_archived ? 'opacity-40 grayscale' : ''}`}
                        />
                    )}
                    {isOnline && !is_archived && (
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0a0b0e]" />
                    )}
                    {conversation.is_group && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                            <svg className="w-2 h-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z" />
                            </svg>
                        </span>
                    )}
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className={`font-mono text-[11px] uppercase tracking-[0.1em] truncate ${
                            isActive || hasUnread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                        } ${is_archived ? 'opacity-60' : ''}`}>
                            {displayName}
                        </span>
                        <span className="font-mono text-[10px] shrink-0 text-emerald-500/50">
                            {formatMessageTime(last_message_time)}
                        </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${
                        hasUnread ? 'text-slate-800 font-medium dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                        {isOwnMessage && last_message_sender_id && (
                            <span className="text-emerald-500/50 mr-1 font-mono">&gt;_</span>
                        )}
                        {lastMessageDisplay || <span className="italic opacity-50 font-mono text-[10px]">· sin mensajes</span>}
                    </p>
                </div>

                {/* Unread badge */}
                {unread_count > 0 && (
                    <span className="shrink-0 min-w-[20px] h-5 flex items-center justify-center px-1.5 bg-emerald-500 text-black font-mono text-[10px] font-bold">
                        {unread_count > 9 ? '9+' : unread_count}
                    </span>
                )}
            </button>

            {/* Menu */}
            <div ref={menuRef} className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
                    className={`w-7 h-7 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${menuOpen ? '!opacity-100' : ''} text-slate-400 hover:text-emerald-500`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                    </svg>
                </button>

                {menuOpen && (
                    <div className="absolute right-0 top-8 z-50 w-44 overflow-hidden bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-lg shadow-emerald-500/5">
                        {is_archived ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onUnarchive?.(); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors hover:bg-emerald-500/[0.05] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                                Mover a mensajes
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onArchive(); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors hover:bg-emerald-500/[0.05] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                                Archivar
                            </button>
                        )}
                        <div className="h-px bg-emerald-500/10" />
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onClose(); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors text-red-500 hover:bg-red-500/[0.06] dark:hover:bg-red-500/10"
                        >
                            {conversation.is_group ? 'Salir del grupo' : 'Cerrar conversación'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export { EntradaCodice as ConversationItem };
