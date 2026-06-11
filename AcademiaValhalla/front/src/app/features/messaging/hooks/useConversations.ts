import { useState, useMemo } from 'react';
import { useMessaging } from '../../../hooks/useMessaging';

export const useConversations = () => {
    const { conversations, activeConversation, selectConversation, isLoading } = useMessaging();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = useMemo(() => {
        if (!searchQuery.trim()) return conversations;
        const q = searchQuery.toLowerCase();
        return conversations.filter((c) =>
            c.participant?.username?.toLowerCase().includes(q)
        );
    }, [conversations, searchQuery]);

    return {
        conversations: filteredConversations,
        activeConversationId: activeConversation?.id ?? null,
        searchQuery,
        setSearchQuery,
        selectConversation,
        isLoading,
    };
};
