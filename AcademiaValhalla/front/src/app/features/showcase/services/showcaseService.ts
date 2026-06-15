import { API_BASE, authHeaders, getToken } from '../../../services/apiClient';

export interface ProyectoResumen {
    project_id: string;
    title: string;
    summary: string;
    tech_stack: string[];
    cover_image_url: string | null;
    featured: boolean;
    upvote_count: number;
    author: { user_id: string; username: string; avatar_url: string | null } | null;
}

export interface FeedbackItem {
    feedback_id: string;
    dimension: string;
    rating: number;
    comment: string | null;
    author: { user_id: string; username: string; avatar_url: string | null } | null;
}

export interface ProyectoDetalle extends ProyectoResumen {
    description: { type: string; value?: string; language?: string; title?: string }[];
    repo_url: string | null;
    demo_url: string | null;
    is_owner: boolean;
    i_upvoted: boolean;
    feedback_summary: Record<string, { count: number; avg: number }>;
    feedback: FeedbackItem[];
}

const json = async (res: Response) => {
    if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.msg ?? 'Error en la petición');
    }
    return res.json();
};

export const showcaseService = {
    listar: (tech?: string): Promise<ProyectoResumen[]> =>
        fetch(`${API_BASE}/showcase${tech ? `?tech=${encodeURIComponent(tech)}` : ''}`, { headers: authHeaders() }).then(json),

    obtener: (id: string): Promise<ProyectoDetalle> =>
        fetch(`${API_BASE}/showcase/${id}`, { headers: authHeaders() }).then(json),

    crear: (datos: any): Promise<{ project_id: string }> =>
        fetch(`${API_BASE}/showcase`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(datos) }).then(json),

    eliminar: (id: string): Promise<void> =>
        fetch(`${API_BASE}/showcase/${id}`, { method: 'DELETE', headers: authHeaders() }).then(json),

    feedback: (id: string, dimension: string, rating: number, comment?: string) =>
        fetch(`${API_BASE}/showcase/${id}/feedback`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ dimension, rating, comment }) }).then(json),

    upvote: (id: string): Promise<{ upvoted: boolean; upvote_count: number }> =>
        fetch(`${API_BASE}/showcase/${id}/upvote`, { method: 'POST', headers: authHeaders() }).then(json),

    subirPortada: async (file: File): Promise<string> => {
        const fd = new FormData();
        fd.append('image', file);
        const token = getToken();
        const res = await fetch(`${API_BASE}/showcase/cover`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: fd,
        });
        const data = await json(res);
        return data.url;
    },
};
