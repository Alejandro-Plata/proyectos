import { createContext } from 'react';
import type { Conversation, Message, WsCommand } from '../features/messaging/types/types';

export interface MessagingContextType {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    messages: Message[];
    totalUnread: number;
    typingUserId: string | null;
    isLoading: boolean;

    selectConversation: (conversationId: string) => void;
    openConversation: (conv: import('../features/messaging/types/types').Conversation) => Promise<void>;
    sendMessage: (content: string, replyToId?: string) => void;
    markAsRead: () => void;
    sendCommand: (command: WsCommand) => void;
    startConversation: (targetUserId: string) => Promise<void>;
    archiveConversation: (conversationId: string) => Promise<void>;
    unarchiveConversation: (conversationId: string) => Promise<void>;
    closeConversation: (conversationId: string) => Promise<void>;
}

export const MessagingContext = createContext<MessagingContextType | undefined>(undefined);
