import { API_BASE, authHeaders } from '../../../services/apiClient';

export interface Mentor {
    user_id: string;
    username: string;
    avatar_url: string | null;
    level: number;
    languages: string[];
    bio_mentor: string | null;
    slots_free: number;
}

export interface MentoriaResumen {
    mentorship_id: string;
    status: 'pending' | 'active' | 'ended' | 'rejected';
    goal: string | null;
    conversation_id: string | null;
    other: { user_id: string; username: string; avatar_url: string | null } | null;
}

export interface MisMentorias {
    as_mentor: MentoriaResumen[];
    as_apprentice: MentoriaResumen[];
}

const json = async (res: Response) => {
    if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.msg ?? 'Error en la petición');
    }
    return res.json();
};

export const padrinazgoService = {
    eligibility: (): Promise<{ eligible: boolean }> =>
        fetch(`${API_BASE}/mentorship/mentor/eligibility`, { headers: authHeaders() }).then(json),

    activarMentor: (datos: { languages: string[]; bio_mentor?: string; capacity?: number }) =>
        fetch(`${API_BASE}/mentorship/mentor`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(datos) }).then(json),

    desactivarMentor: () =>
        fetch(`${API_BASE}/mentorship/mentor`, { method: 'DELETE', headers: authHeaders() }).then(json),

    listarMentores: (filtros?: { language?: string; level?: number }): Promise<Mentor[]> => {
        const q = new URLSearchParams();
        if (filtros?.language) q.set('language', filtros.language);
        if (filtros?.level) q.set('level', String(filtros.level));
        const qs = q.toString();
        return fetch(`${API_BASE}/mentorship/mentors${qs ? `?${qs}` : ''}`, { headers: authHeaders() }).then(json);
    },

    mias: (): Promise<MisMentorias> =>
        fetch(`${API_BASE}/mentorship/mine`, { headers: authHeaders() }).then(json),

    solicitar: (mentor_id: string, goal: string) =>
        fetch(`${API_BASE}/mentorship/requests`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ mentor_id, goal }) }).then(json),

    responder: (id: string, action: 'accept' | 'reject') =>
        fetch(`${API_BASE}/mentorship/requests/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ action }) }).then(json),

    finalizar: (id: string) =>
        fetch(`${API_BASE}/mentorship/${id}/end`, { method: 'PATCH', headers: authHeaders() }).then(json),
};
