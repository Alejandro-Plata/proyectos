import { useState, useCallback } from 'react';
import { useTheme } from '../../../../hooks/useTheme';
import { useMessaging } from '../../../../hooks/useMessaging';
import { ConversationList } from '../ConversationList';
import { VentanaCodice } from '../VentanaCodice';
import { UserSearchModal } from '../UserSearchModal';
import { useLocation } from 'react-router-dom';
import { useFreyaOpen } from '../../../../hooks/useFreyaOpen';

export const FloatingChat = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { activeConversation, conversations, selectConversation } = useMessaging();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'list' | 'chat'>('list');
    const [showNewChat, setShowNewChat] = useState(false);
    const location = useLocation();
    const isFreyaOpen = useFreyaOpen();

    const isMessagesPage = location.pathname.includes('/messages');
    const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

    const handleSelectConversation = useCallback(
        (conversationId: string) => {
            selectConversation(conversationId);
            setView('chat');
        },
        [selectConversation]
    );

    const handleBack = () => {
        setView('list');
    };

    if (isMessagesPage || isFreyaOpen) return null;

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setView(activeConversation ? 'chat' : 'list');
                }}
                className={`
                    fixed bottom-6 right-6 z-[200] w-12 h-12
                    flex items-center justify-center
                    transition-all duration-200
                    ${isOpen
                        ? 'bg-[#0f1115] border border-emerald-500/40 text-emerald-500'
                        : totalUnread > 0
                            ? 'bg-emerald-500 text-black hover:bg-emerald-400 animate-pulse'
                            : 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/20'
                    }
                `}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
                    </svg>
                )}

                {/* Mensajes sin leer */}
                {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-mono font-bold min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {totalUnread > 4 ? '4+' : totalUnread}
                    </span>
                )}
            </button>

            {/* Modal del chat */}
            {isOpen && (
                <div
                    className={`
                        fixed bottom-24 right-6 z-[200]
                        w-[360px] h-[500px] overflow-hidden
                        shadow-lg shadow-emerald-500/5 border flex flex-col
                        ${isDark
                            ? 'bg-[#0a0b0e] border-emerald-500/10'
                            : 'bg-white border-emerald-500/15'
                        }
                    `}
                >
                    {view === 'list' ? (
                        <ConversationList
                            isDark={isDark}
                            onNewChat={() => setShowNewChat(true)}
                            onSelectConversation={handleSelectConversation}
                        />
                    ) : (
                        <VentanaCodice isDark={isDark} onBack={handleBack} />
                    )}
                </div>
            )}

            <UserSearchModal
                isOpen={showNewChat}
                onClose={() => setShowNewChat(false)}
                onStarted={() => { setShowNewChat(false); setView('chat'); }}
            />
        </>
    );
};
