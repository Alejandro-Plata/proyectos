import type { Concept } from '../types/types';
import { API_BASE, authHeaders } from '../../../services/apiClient';

const mapNote = (n: any, source: 'personal' | 'community' = 'personal'): Concept => ({
    id: n.note_id,
    title: n.title,
    description: n.description,
    shortDescription: n.summary?.slice(0, 100) || '',
    summary: n.summary || '',
    language: (n.language || 'general').toLowerCase(),
    tags: n.tags || [],
    difficulty: n.difficulty || 'Básico',
    content: n.content || [],
    community_status: n.community_status || 'personal',
    source,
});

export const notesService = {
    getAll: async (): Promise<Concept[]> => {
        const res = await fetch(`${API_BASE}/notes`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Error al obtener los apuntes');
        const data = await res.json();
        return data.map((n: any) => mapNote(n, 'personal'));
    },

    getCommunity: async (): Promise<Concept[]> => {
        const res = await fetch(`${API_BASE}/notes/community`, {
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Error al obtener apuntes de comunidad');
        const data = await res.json();
        return data.map((n: any) => mapNote(n, 'community'));
    },

    getById: async (id: string): Promise<Concept | undefined> => {
        const res = await fetch(`${API_BASE}/notes/${id}`, {
            headers: authHeaders(),
        });
        if (!res.ok) return undefined;
        return mapNote(await res.json(), 'personal');
    },

    requestCommunity: async (noteId: string): Promise<void> => {
        const res = await fetch(`${API_BASE}/notes/${noteId}`, {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify({ community_status: 'pending' }),
        });
        if (!res.ok) throw new Error('Error al solicitar publicación en comunidad');
    },
};
