import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../../hooks/useTheme';
import { useMessaging } from '../../../../hooks/useMessaging';
import { ConversationList } from '../../components/ConversationList';
import { VentanaCodice } from '../../components/VentanaCodice';
import { UserSearchModal } from '../../components/UserSearchModal';

export const MessagingDesktop = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [showNewChat, setShowNewChat] = useState(false);
    const { conversations, startConversation, selectConversation } = useMessaging();
    const [searchParams, setSearchParams] = useSearchParams();
    const startWithUserId = searchParams.get('startWith');

    useEffect(() => {
        if (!startWithUserId || conversations === undefined) return;
        const existing = conversations.find(c => c.participant.user_id === startWithUserId);
        if (existing) {
            selectConversation(existing.id);
            setSearchParams({}, { replace: true });
        } else {
            startConversation(startWithUserId).then(() => {
                setSearchParams({}, { replace: true });
            });
        }
    }, [startWithUserId, conversations]);

    return (
        <div className="flex p-8 h-full w-full">
            <div className="flex-1 flex overflow-hidden border bg-white dark:bg-[#0a0b0e] border-emerald-500/15 dark:border-emerald-500/10 shadow-sm shadow-emerald-500/5">
                {/* Left panel: conversation list */}
                <div className="w-80 shrink-0 flex flex-col border-r border-emerald-500/15 dark:border-emerald-500/10">
                    <ConversationList isDark={isDark} onNewChat={() => setShowNewChat(true)} />
                </div>

                {/* Emerald divider line */}
                <div
                    className="w-px shrink-0 self-stretch"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.2), transparent)' }}
                />

                {/* Right panel: active chat */}
                <div className="flex-1 flex flex-col">
                    <VentanaCodice isDark={isDark} />
                </div>

                <UserSearchModal
                    isOpen={showNewChat}
                    onClose={() => setShowNewChat(false)}
                />
            </div>
        </div>
    );
};
