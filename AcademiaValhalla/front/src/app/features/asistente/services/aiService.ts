import type { ChatMessage } from '../types/types';
import { authHeaders } from '../../../services/apiClient';
import { URL_BASE_API } from '../../../config/api';

const BASE = `${URL_BASE_API}/assistant`;

export interface PerfilAprendizaje {
    user_id: string;
    languages: Record<string, number>;
    concepts_seen: string[];
    recurring_errors: { tag: string; count: number }[];
    session_summaries: { at: string; text: string }[];
}

export interface RevisionHallazgo {
    line: number;
    severity: 'bug' | 'estilo' | 'rendimiento' | 'seguridad';
    hint: string;
    concept?: string;
}

export interface BorradorApunte {
    title: string;
    summary: string;
    language: string;
    tags: string[];
    difficulty: string;
    content: { type: string; value?: string; title?: string; language?: string }[];
}

const json = async (res: Response) => {
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? body.msg ?? 'Error en la petición a la IA');
    }
    return res.json();
};

export const aiService = {
    sendMessage: async (messages: ChatMessage[]): Promise<string> => {
        const res = await fetch(`${BASE}/chat`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ messages }),
        });
        const data = await json(res);
        if (!data.reply) throw new Error('Respuesta vacía o inválida del servidor');
        return data.reply;
    },

    // ── A1 · Perfil de aprendizaje ─────────────────────────────
    getProfile: async (): Promise<PerfilAprendizaje> => {
        return json(await fetch(`${BASE}/profile`, { headers: authHeaders() }));
    },
    updateProfile: async (patch: Partial<PerfilAprendizaje>): Promise<PerfilAprendizaje> => {
        return json(await fetch(`${BASE}/profile`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(patch) }));
    },
    deleteProfile: async (): Promise<void> => {
        await fetch(`${BASE}/profile`, { method: 'DELETE', headers: authHeaders() });
    },
    /** Destila la conversación en el perfil (fire-and-forget). */
    distillSession: (messages: ChatMessage[]): void => {
        if (!messages?.length) return;
        fetch(`${BASE}/profile/distill`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ messages }),
            keepalive: true,
        }).catch(() => {});
    },

    // ── A3 · Revisión socrática ────────────────────────────────
    reviewCode: async (code: string, language: string): Promise<RevisionHallazgo[]> => {
        const res = await fetch(`${BASE}/review`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ code, language }),
        });
        const data = await json(res);
        return data.findings ?? [];
    },

    // ── A5 · Destilar apunte ───────────────────────────────────
    distillNote: async (messages: ChatMessage[]): Promise<BorradorApunte> => {
        const res = await fetch(`${BASE}/distill-note`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ messages }),
        });
        return json(res);
    },
};
