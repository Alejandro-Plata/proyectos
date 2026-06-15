import { API_BASE, authHeaders } from '../../../services/apiClient';

export interface Maestria {
    skill: string;
    kind: 'language' | 'category';
    score: number;
    level: string;
}

export interface Endoso {
    skill: string;
    count: number;
    endorsed_by_me: boolean;
}

export interface Emblema {
    emblem_id: string;
    kind: string;   // 'season' | 'mentor' | 'showcase' | 'tournament'
    label: string;
    meta?: Record<string, any>;
}

const json = async (res: Response) => {
    if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.msg ?? 'Error');
    }
    return res.json();
};

export const masteryService = {
    getMastery: (userId: string): Promise<Maestria[]> =>
        fetch(`${API_BASE}/users/${userId}/mastery`, { headers: authHeaders() }).then(json),

    getEmblems: (userId: string): Promise<Emblema[]> =>
        fetch(`${API_BASE}/users/${userId}/emblems`, { headers: authHeaders() }).then(json),

    getEndorsements: (userId: string): Promise<Endoso[]> =>
        fetch(`${API_BASE}/users/${userId}/endorsements`, { headers: authHeaders() }).then(json),

    endorse: (userId: string, skill: string): Promise<Endoso[]> =>
        fetch(`${API_BASE}/users/${userId}/endorsements`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ skill }) }).then(json),

    removeEndorsement: (userId: string, skill: string): Promise<Endoso[]> =>
        fetch(`${API_BASE}/users/${userId}/endorsements/${encodeURIComponent(skill)}`, { method: 'DELETE', headers: authHeaders() }).then(json),
};
