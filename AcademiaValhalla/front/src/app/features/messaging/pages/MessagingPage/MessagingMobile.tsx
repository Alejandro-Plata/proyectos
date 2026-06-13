import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../../hooks/useTheme';
import { useMessaging } from '../../../../hooks/useMessaging';
import { ConversationList } from '../../components/ConversationList';
import { VentanaCodice } from '../../components/VentanaCodice';
import { UserSearchModal } from '../../components/UserSearchModal';

export const MessagingMobile = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { activeConversation, conversations, startConversation, selectConversation } = useMessaging();
    const [showChat, setShowChat] = useState(false);
    const [showNewChat, setShowNewChat] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const startWithUserId = searchParams.get('startWith');

    useEffect(() => {
        if (!startWithUserId || conversations === undefined) return;
        const existing = conversations.find(c => !c.is_group && c.participant.user_id === startWithUserId);
        if (existing) {
            selectConversation(existing.id);
            setSearchParams({}, { replace: true });
            setShowChat(true);
        } else {
            startConversation(startWithUserId).then(() => {
                setSearchParams({}, { replace: true });
                setShowChat(true);
            });
        }
    }, [startWithUserId, conversations]);

    const handleSelectConversation = () => setShowChat(true);
    const handleNewChatStarted = () => { setShowNewChat(false); setShowChat(true); };

    return (
        <div className="flex flex-col overflow-hidden h-[calc(100dvh_-_4rem)]">
            {showChat && activeConversation ? (
                <VentanaCodice isDark={isDark} onBack={() => setShowChat(false)} />
            ) : (
                <div className="flex-1 overflow-hidden">
                    <ConversationList
                        isDark={isDark}
                        onNewChat={() => setShowNewChat(true)}
                        onSelectConversation={handleSelectConversation}
                    />
                </div>
            )}

            <UserSearchModal
                isOpen={showNewChat}
                onClose={() => setShowNewChat(false)}
                onStarted={handleNewChatStarted}
            />
        </div>
    );
};
