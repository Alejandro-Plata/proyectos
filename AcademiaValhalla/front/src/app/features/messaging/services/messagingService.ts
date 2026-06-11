import { io, type Socket } from 'socket.io-client';
import type { Message, Conversation, WsEvent, WsCommand } from '../types/types';
import { API_BASE, WS_URL, authHeaders as postHeaders, getToken } from '../../../services/apiClient';

const getHeaders = (): HeadersInit => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const messagingService = {

    getConversations: async (): Promise<Conversation[]> => {
        const res = await fetch(`${API_BASE}/messages/conversations`, {
            headers: getHeaders(),
        });
        if (!res.ok) {
            const body = await res.text().catch(() => '');
            console.error(`[messaging] GET /messages/conversations → ${res.status}`, body);
            throw new Error('Error al cargar las conversaciones');
        }
        return res.json();
    },

    getMessages: async (conversationId: string): Promise<Message[]> => {
        const res = await fetch(`${API_BASE}/messages/${conversationId}`, {
            headers: getHeaders(),
        });
        if (!res.ok) {
            const body = await res.text().catch(() => '');
            console.error(`[messaging] GET /messages/${conversationId} → ${res.status}`, body);
            throw new Error('Error al cargar los mensajes');
        }
        return res.json();
    },

    startConversation: async (targetUserId: string): Promise<Conversation> => {
        const res = await fetch(`${API_BASE}/messages/conversations`, {
            method: 'POST',
            headers: postHeaders(),
            body: JSON.stringify({ participant_id: targetUserId }),
        });
        if (!res.ok) throw new Error('Error al crear la conversación');
        return res.json();
    },

    searchUsers: async (query: string): Promise<{ user_id: string; username: string; avatar_url?: string }[]> => {
        const res = await fetch(`${API_BASE}/users/search?q=${encodeURIComponent(query)}`, {
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Error al buscar usuarios');
        return res.json();
    },

    getArchivedConversations: async (): Promise<Conversation[]> => {
        const res = await fetch(`${API_BASE}/messages/conversations/archived`, { headers: getHeaders() });
        if (!res.ok) return [];
        return res.json();
    },

    archiveConversation: async (conversationId: string): Promise<void> => {
        await fetch(`${API_BASE}/messages/conversations/${conversationId}/archive`, { method: 'PATCH', headers: getHeaders() });
    },

    unarchiveConversation: async (conversationId: string): Promise<void> => {
        await fetch(`${API_BASE}/messages/conversations/${conversationId}/unarchive`, { method: 'PATCH', headers: getHeaders() });
    },

    closeConversation: async (conversationId: string): Promise<void> => {
        await fetch(`${API_BASE}/messages/conversations/${conversationId}`, { method: 'DELETE', headers: getHeaders() });
    },

    getSuggestedUsers: async (): Promise<{ user_id: string; username: string; avatar_url?: string }[]> => {
        const res = await fetch(`${API_BASE}/users/suggestions`, {
            headers: getHeaders(),
        });
        if (!res.ok) return [];
        return res.json();
    },
};

export function createWebSocket() {
    let socket: Socket | null = null;
    let listeners: Array<(event: WsEvent) => void> = [];

    function connect(token: string) {
        if (socket?.connected) return;

        socket = io(WS_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 3000,
        });

        socket.on('connect', () => {});

        const eventTypes: WsEvent['type'][] = [
            'new_message', 'new_conversation', 'message_read',
            'user_online', 'user_offline', 'typing', 'stop_typing',
        ];

        eventTypes.forEach((eventType) => {
            socket!.on(eventType, (payload: WsEvent['payload']) => {
                const event = { type: eventType, payload } as WsEvent;
                listeners.forEach((listener) => listener(event));
            });
        });

        socket.on('disconnect', (_reason) => {});

        socket.on('connect_error', (err) => {
            console.error('[Socket.IO] Error de conexión:', err.message, (err as unknown as { data?: unknown }).data);
        });
    }

    function send(command: WsCommand) {
        if (socket?.connected) {
            socket.emit(command.type, command.payload);
        } else {
            console.warn('[Socket.IO] No conectado. Comando descartado:', command.type);
        }
    }

    function subscribe(listener: (event: WsEvent) => void): () => void {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    }

    function disconnect() {
        socket?.disconnect();
        socket = null;
        listeners = [];
    }

    return { connect, send, subscribe, disconnect };
}
