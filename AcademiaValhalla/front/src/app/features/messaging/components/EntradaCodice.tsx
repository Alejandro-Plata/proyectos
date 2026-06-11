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
    const { participant, last_message, last_message_time, last_message_sender_id, unread_count, is_archived } = conversation;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    if (!participant) return null;

    const isOwnMessage = last_message_sender_id === currentUserId;
    const hasUnread = unread_count > 0 && !isOwnMessage;

    useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

    return (
        <div className={`relative group ${menuOpen ? 'z-10' : ''}`}>
            {/* Barra de acento izquierda */}
            <span className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors ${
                isActive
                    ? 'bg-emerald-500'
                    : hasUnread
                        ? 'bg-emerald-500/50'
                        : 'bg-transparent'
            }`} />

            <button
                onClick={onClick}
                className={`
                    w-full flex items-center gap-3 pl-4 pr-10 py-3 text-left transition-colors
                    ${isActive
                        ? 'bg-emerald-500/[0.06] dark:bg-emerald-500/[0.09]'
                        : 'hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                    }
                `}
            >
                {/* Avatar hex-shield */}
                <div className="relative shrink-0 w-10 h-10">
                    <img
                        src={getAvatarUrl(participant.username, participant.avatar_url)}
                        alt={participant.username}
                        className={`w-10 h-10 hex-shield object-cover ${
                            is_archived ? 'opacity-40 grayscale' : ''
                        }`}
                    />
                    {participant.is_online && !is_archived && (
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0a0b0e]" />
                    )}
                </div>

                {/* Contenido de texto */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className={`font-mono text-[11px] uppercase tracking-[0.1em] truncate ${
                            isActive || hasUnread
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-400'
                        } ${is_archived ? 'opacity-60' : ''}`}>
                            {participant.username}
                        </span>
                        <span className="font-mono text-[10px] shrink-0 text-emerald-500/50">
                            {formatMessageTime(last_message_time)}
                        </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${
                        hasUnread
                            ? 'text-slate-800 font-medium dark:text-slate-200'
                            : 'text-slate-400 dark:text-slate-500'
                    }`}>
                        {isOwnMessage && last_message_sender_id && (
                            <span className="text-emerald-500/50 mr-1 font-mono">&gt;_</span>
                        )}
                        {last_message || <span className="italic opacity-50 font-mono text-[10px]">· sin mensajes</span>}
                    </p>
                </div>

                {/* Badge de no leídos */}
                {unread_count > 0 && (
                    <span
                        className="shrink-0 min-w-[20px] h-5 flex items-center justify-center px-1.5 bg-emerald-500 text-black font-mono text-[10px] font-bold"
                    >
                        {unread_count > 9 ? '9+' : unread_count}
                    </span>
                )}
            </button>

            {/* Botón de menú (···) */}
            <div ref={menuRef} className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
                    className={`
                        w-7 h-7 flex items-center justify-center transition-all
                        opacity-0 group-hover:opacity-100 ${menuOpen ? '!opacity-100' : ''}
                        text-slate-400 hover:text-emerald-500
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                    </svg>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                    <div className="absolute right-0 top-8 z-50 w-44 overflow-hidden bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10 shadow-lg shadow-emerald-500/5">
                        {is_archived ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onUnarchive?.(); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors hover:bg-emerald-500/[0.05] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500 shrink-0">
                                    <path d="M3.196 12.87l-.825.483a.75.75 0 0 0 0 1.294l7.25 4.25a.75.75 0 0 0 .758 0l7.25-4.25a.75.75 0 0 0 0-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 0 1-2.276 0L3.196 12.87Z" />
                                    <path d="M3.196 8.87l-.825.483a.75.75 0 0 0 0 1.294l7.25 4.25a.75.75 0 0 0 .758 0l7.25-4.25a.75.75 0 0 0 0-1.294l-.825-.484-5.666 3.322a2.25 2.25 0 0 1-2.276 0L3.196 8.87Z" />
                                    <path d="M10.38 1.103a.75.75 0 0 0-.76 0l-7.25 4.25a.75.75 0 0 0 0 1.294l7.25 4.25a.75.75 0 0 0 .76 0l7.25-4.25a.75.75 0 0 0 0-1.294l-7.25-4.25Z" />
                                </svg>
                                Mover a mensajes
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onArchive(); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors hover:bg-emerald-500/[0.05] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0">
                                    <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" />
                                    <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM7 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                                </svg>
                                Archivar
                            </button>
                        )}
                        <div className="h-px bg-emerald-500/10" />
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onClose(); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors text-red-500 hover:bg-red-500/[0.06] dark:hover:bg-red-500/10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
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

export { EntradaCodice as ConversationItem };
