export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    timestamp: string;
    read: boolean;
    reply_to_id?: string;
    reply_to_content?: string;
    reply_to_sender?: string;
}

export interface Conversation {
    id: string;
    participant: ConversationUser;
    last_message: string;
    last_message_time: string;
    last_message_sender_id?: string;
    unread_count: number;
    is_archived?: boolean;
}

export interface ConversationUser {
    user_id: string;
    username: string;
    avatar_url?: string;
    is_online: boolean;
}

export type WsEvent =
    | { type: 'new_message';       payload: Message }
    | { type: 'new_conversation';  payload: Conversation }
    | { type: 'message_read';      payload: { conversation_id: string; reader_id: string } }
    | { type: 'user_online';       payload: { user_id: string } }
    | { type: 'user_offline';      payload: { user_id: string } }
    | { type: 'typing';            payload: { conversation_id: string; user_id: string } }
    | { type: 'stop_typing';       payload: { conversation_id: string; user_id: string } };

export type WsCommand =
    | { type: 'send_message';      payload: { conversation_id: string; content: string; reply_to_id?: string } }
    | { type: 'mark_read';         payload: { conversation_id: string } }
    | { type: 'typing';            payload: { conversation_id: string } }
    | { type: 'stop_typing';       payload: { conversation_id: string } };
