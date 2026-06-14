import { io, type Socket } from 'socket.io-client';
import type { Message, Conversation, ConversationGroup, WsEvent, WsCommand, AttachmentMeta } from '../types/types';
import { API_BASE, WS_URL, authHeaders as postHeaders, getToken } from '../../../services/apiClient';

const getHeaders = (): HeadersInit => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const messagingService = {

    getConversations: async (): Promise<Conversation[]> => {
        const res = await fetch(`${API_BASE}/messages/conversations`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Error al cargar las conversaciones');
        return res.json();
    },

    getMessages: async (conversationId: string): Promise<Message[]> => {
        const res = await fetch(`${API_BASE}/messages/${conversationId}`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Error al cargar los mensajes');
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
        const res = await fetch(`${API_BASE}/users/search?q=${encodeURIComponent(query)}`, { headers: getHeaders() });
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
        const res = await fetch(`${API_BASE}/users/suggestions`, { headers: getHeaders() });
        if (!res.ok) return [];
        return res.json();
    },

    subirAdjunto: (
        conversationId: string,
        file: File,
        onProgress?: (pct: number) => void
    ): Promise<{ url: string; meta: AttachmentMeta }> => {
        return new Promise((resolve, reject) => {
            const token = getToken();
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('file', file);
            formData.append('conversation_id', conversationId);

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try { resolve(JSON.parse(xhr.responseText)); }
                    catch { reject(new Error('Respuesta inválida del servidor')); }
                } else {
                    try {
                        const body = JSON.parse(xhr.responseText);
                        reject(new Error(body.msg ?? 'Error al subir el archivo'));
                    } catch {
                        reject(new Error('Error al subir el archivo'));
                    }
                }
            });

            xhr.addEventListener('error', () => reject(new Error('Error de red al subir el archivo')));
            xhr.addEventListener('abort', () => reject(new Error('Subida cancelada')));

            xhr.open('POST', `${API_BASE}/messages/adjuntos`);
            if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);
        });
    },

    // ── Grupos ─────────────────────────────────────────────────

    createGroup: async (name: string, participantIds: string[]): Promise<ConversationGroup> => {
        const res = await fetch(`${API_BASE}/messages/grupos`, {
            method: 'POST',
            headers: postHeaders(),
            body: JSON.stringify({ name, participant_ids: participantIds }),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.msg ?? 'Error al crear el grupo');
        }
        return res.json();
    },

    updateGroup: async (groupId: string, data: { name?: string; avatar?: File }): Promise<void> => {
        const formData = new FormData();
        if (data.name !== undefined) formData.append('name', data.name);
        if (data.avatar) formData.append('avatar', data.avatar);
        const res = await fetch(`${API_BASE}/messages/grupos/${groupId}`, {
            method: 'PATCH',
            headers: getHeaders(), // sin Content-Type: el navegador pone el boundary del multipart
            body: formData,
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.msg ?? 'Error al actualizar el grupo');
        }
    },

    addGroupParticipants: async (groupId: string, userIds: string[]): Promise<void> => {
        const res = await fetch(`${API_BASE}/messages/grupos/${groupId}/participantes`, {
            method: 'POST',
            headers: postHeaders(),
            body: JSON.stringify({ user_ids: userIds }),
        });
        if (!res.ok) throw new Error('Error al añadir participantes');
    },

    removeGroupParticipant: async (groupId: string, userId: string): Promise<void> => {
        const res = await fetch(`${API_BASE}/messages/grupos/${groupId}/participantes/${userId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Error al eliminar participante');
    },

    updateGroupRole: async (groupId: string, userId: string, role: 'admin' | 'member'): Promise<void> => {
        const res = await fetch(`${API_BASE}/messages/grupos/${groupId}/participantes/${userId}`, {
            method: 'PATCH',
            headers: postHeaders(),
            body: JSON.stringify({ role }),
        });
        if (!res.ok) throw new Error('Error al actualizar rol');
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

        const eventTypes: WsEvent['type'][] = [
            'new_message', 'new_conversation', 'message_read',
            'user_online', 'user_offline', 'typing', 'stop_typing',
            'removed_from_group', 'group_updated', 'group_participant_removed',
        ];

        eventTypes.forEach((eventType) => {
            socket!.on(eventType, (payload: WsEvent['payload']) => {
                listeners.forEach((l) => l({ type: eventType, payload } as WsEvent));
            });
        });

        socket.on('connect_error', (err) => {
            console.error('[Socket.IO] Error:', err.message);
        });
    }

    function send(command: WsCommand) {
        if (socket?.connected) {
            socket.emit(command.type, command.payload);
        } else {
            console.warn('[Socket.IO] No conectado:', command.type);
        }
    }

    function subscribe(listener: (event: WsEvent) => void): () => void {
        listeners.push(listener);
        return () => { listeners = listeners.filter((l) => l !== listener); };
    }

    function disconnect() {
        socket?.disconnect();
        socket = null;
        listeners = [];
    }

    return { connect, send, subscribe, disconnect };
}
