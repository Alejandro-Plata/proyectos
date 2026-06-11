import { useRef, useState } from 'react';
import type { Conversation } from '../types/types';
import { formatMessageTime } from '../utils/formatMessageTime';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { getAvatarUrl } from '../../../utils/getAvatarUrl';

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
    onArchive: () => void;
    onUnarchive?: () => void;
    onClose: () => void;
    currentUserId: string;
}

export const ConversationItem = ({
    conversation,
    isActive,
    onClick,
    onArchive,
    onUnarchive,
    onClose,
    currentUserId,
}: ConversationItemProps) => {
    const { participant, last_message, last_message_time, last_message_sender_id, unread_count, is_archived } = conversation;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    if (!participant) return null;

    const isOwnMessage = last_message_sender_id === currentUserId;
    const messagePrefix = last_message_sender_id ? (isOwnMessage ? 'Tú: ' : `${participant.username}: `) : '';

    useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

    return (
        <div className={`relative group ${menuOpen ? 'z-10' : ''}`}>
            <button
                onClick={onClick}
                className={`
                    w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left pr-10
                    ${isActive
                        ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }
                `}
            >
                {/* Avatar con indicador online */}
                <div className="relative shrink-0">
                    <img
                        src={getAvatarUrl(participant.username, participant.avatar_url)}
                        alt={participant.username}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    {participant.is_online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0a0b0e]" />
                    )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate text-slate-900 dark:text-white">
                            {participant.username}
                        </span>
                        <span className="text-xs shrink-0 text-slate-400 dark:text-slate-500">
                            {formatMessageTime(last_message_time)}
                        </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${
                        unread_count > 0 && !isOwnMessage
                            ? 'text-slate-900 font-semibold dark:text-white'
                            : 'text-slate-500 dark:text-slate-400'
                    }`}>
                        <span className="text-slate-400 dark:text-slate-500">{messagePrefix}</span>
                        {last_message || <span className="italic opacity-60">Sin mensajes</span>}
                    </p>
                </div>

                {/* Badge de no leídos */}
                {unread_count > 0 && (
                    <span className="shrink-0 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                        {unread_count > 4 ? '4+' : unread_count}
                    </span>
                )}
            </button>

            {/* Botón menú (⋯) — visible al hover */}
            <div ref={menuRef} className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
                    className={`
                        w-7 h-7 rounded-md flex items-center justify-center transition-all
                        opacity-0 group-hover:opacity-100
                        ${menuOpen ? 'opacity-100' : ''}
                        hover:bg-slate-200 text-slate-500 dark:hover:bg-white/10 dark:text-slate-400
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                    </svg>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                    <div className={`
                        absolute right-0 top-8 z-50 w-44 rounded-xl shadow-xl overflow-hidden
                        bg-white border border-slate-200 dark:bg-[#1a1d24] dark:border-white/10
                    `}>
                        {is_archived ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onUnarchive?.(); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors hover:bg-slate-50 text-slate-700 dark:hover:bg-white/8 dark:text-slate-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
                                    <path d="M3.196 12.87l-.825.483a.75.75 0 0 0 0 1.294l7.25 4.25a.75.75 0 0 0 .758 0l7.25-4.25a.75.75 0 0 0 0-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 0 1-2.276 0L3.196 12.87Z" />
                                    <path d="M3.196 8.87l-.825.483a.75.75 0 0 0 0 1.294l7.25 4.25a.75.75 0 0 0 .758 0l7.25-4.25a.75.75 0 0 0 0-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 0 1-2.276 0L3.196 8.87Z" />
                                    <path d="M10.38 1.103a.75.75 0 0 0-.76 0l-7.25 4.25a.75.75 0 0 0 0 1.294l7.25 4.25a.75.75 0 0 0 .76 0l7.25-4.25a.75.75 0 0 0 0-1.294l-7.25-4.25Z" />
                                </svg>
                                Mover a mensajes
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onArchive(); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors hover:bg-slate-50 text-slate-700 dark:hover:bg-white/8 dark:text-slate-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                                    <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" />
                                    <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM7 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                                </svg>
                                Archivar
                            </button>
                        )}
                        <div className="h-px mx-2 bg-slate-100 dark:bg-white/8" />
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onClose(); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                            </svg>
                            Cerrar conversación
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
