import { createContext } from 'react';
import type { Conversation, Message, WsCommand, MessageType } from '../features/messaging/types/types';

export interface MessagingContextType {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    messages: Message[];
    totalUnread: number;
    typingUserId: string | null;
    isLoading: boolean;

    selectConversation: (conversationId: string) => void;
    openConversation: (conv: Conversation) => Promise<void>;
    sendMessage: (content: string, replyToId?: string) => void;
    sendMediaMessage: (file: File, messageType: MessageType, caption?: string, replyToId?: string, onProgress?: (pct: number) => void) => Promise<void>;
    markAsRead: () => void;
    sendCommand: (command: WsCommand) => void;
    startConversation: (targetUserId: string) => Promise<void>;
    createGroup: (name: string, participantIds: string[]) => Promise<void>;
    updateGroup: (groupId: string, data: { name?: string; avatar?: File }) => Promise<void>;
    addGroupParticipants: (groupId: string, userIds: string[]) => Promise<void>;
    removeGroupParticipant: (groupId: string, userId: string) => Promise<void>;
    updateGroupRole: (groupId: string, userId: string, role: 'admin' | 'member') => Promise<void>;
    leaveGroup: (groupId: string) => Promise<void>;
    archiveConversation: (conversationId: string) => Promise<void>;
    unarchiveConversation: (conversationId: string) => Promise<void>;
    closeConversation: (conversationId: string) => Promise<void>;
}

export const MessagingContext = createContext<MessagingContextType | undefined>(undefined);
