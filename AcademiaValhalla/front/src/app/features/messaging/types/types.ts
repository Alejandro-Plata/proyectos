export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'system';

export interface AttachmentMeta {
    size: number;
    mime: string;
    width?: number;
    height?: number;
    durationSec?: number;
    thumbnailUrl?: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content?: string;
    message_type: MessageType;
    attachment_url?: string;
    attachment_meta?: AttachmentMeta;
    timestamp: string;
    read: boolean;
    reply_to_id?: string;
    reply_to_content?: string;
    reply_to_sender?: string;
}

export interface ConversationUser {
    user_id: string;
    username: string;
    avatar_url?: string;
    is_online: boolean;
    role?: 'owner' | 'admin' | 'member';
}

export interface ConversationDirect {
    id: string;
    is_group: false;
    participant: ConversationUser;
    last_message: string;
    last_message_time: string;
    last_message_sender_id?: string;
    unread_count: number;
    is_archived?: boolean;
}

export interface ConversationGroup {
    id: string;
    is_group: true;
    name: string;
    avatar_url?: string;
    participants: ConversationUser[];
    participant_count?: number;
    last_message: string;
    last_message_time: string;
    last_message_sender_id?: string;
    unread_count: number;
    is_archived?: boolean;
}

export type Conversation = ConversationDirect | ConversationGroup;

export function getConvDisplayName(conv: Conversation): string {
    return conv.is_group ? conv.name : conv.participant.username;
}

export function getConvAvatar(conv: Conversation): string | undefined {
    return conv.is_group ? conv.avatar_url : conv.participant.avatar_url;
}

export function getConvParticipant(conv: Conversation, excludeUserId?: string): ConversationUser | undefined {
    if (!conv.is_group) return conv.participant;
    return conv.participants.find(p => p.user_id !== excludeUserId);
}

export function resolveUsername(conv: Conversation | null, userId: string, currentUserId: string): string {
    if (!conv) return 'usuario';
    if (userId === currentUserId) return 'Tú';
    if (!conv.is_group) return conv.participant.username;
    return conv.participants.find(p => p.user_id === userId)?.username ?? 'usuario';
}

export type WsEvent =
    | { type: 'new_message';             payload: Message }
    | { type: 'new_conversation';        payload: Conversation }
    | { type: 'message_read';            payload: { conversation_id: string; reader_id: string } }
    | { type: 'user_online';             payload: { user_id: string } }
    | { type: 'user_offline';            payload: { user_id: string } }
    | { type: 'typing';                  payload: { conversation_id: string; user_id: string } }
    | { type: 'stop_typing';             payload: { conversation_id: string; user_id: string } }
    | { type: 'removed_from_group';      payload: { conversation_id: string } }
    | { type: 'group_updated';           payload: ConversationGroup }
    | { type: 'group_participant_removed'; payload: { conversation_id: string; user_id: string } };

export type WsCommand =
    | { type: 'send_message'; payload: { conversation_id: string; content?: string; reply_to_id?: string; message_type?: MessageType; attachment_url?: string; attachment_meta?: AttachmentMeta } }
    | { type: 'mark_read';    payload: { conversation_id: string } }
    | { type: 'typing';       payload: { conversation_id: string } }
    | { type: 'stop_typing';  payload: { conversation_id: string } };
