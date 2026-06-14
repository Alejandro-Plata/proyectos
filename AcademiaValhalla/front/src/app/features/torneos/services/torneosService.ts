import { API_BASE, authHeaders } from '../../../services/apiClient';

export interface TorneoResumen {
    tournament_id: string;
    title: string;
    mode: 'challenges' | 'troll';
    season: string | null;
    status: 'upcoming' | 'active' | 'finished';
    starts_at: string;
    ends_at: string;
    reward_xp: number;
    participant_count: number;
}

export interface RetoTorneo {
    challenge_id: string;
    title: string;
    difficulty: string;
    points: number;
    solved: boolean;
}

export interface TorneoDetalle extends Omit<TorneoResumen, 'participant_count'> {
    description: string | null;
    joined: boolean;
    challenges: RetoTorneo[];
}

export interface FilaLeaderboard {
    rank: number;
    user_id: string;
    username: string;
    avatar_url: string | null;
    level: number;
    score: number;
    solved_count: number;
}

const json = async (res: Response) => {
    if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.msg ?? 'Error en la petición');
    }
    return res.json();
};

export const torneosService = {
    listar: (status?: string): Promise<TorneoResumen[]> =>
        fetch(`${API_BASE}/tournaments${status ? `?status=${status}` : ''}`, { headers: authHeaders() }).then(json),

    obtener: (id: string): Promise<TorneoDetalle> =>
        fetch(`${API_BASE}/tournaments/${id}`, { headers: authHeaders() }).then(json),

    leaderboard: (id: string): Promise<FilaLeaderboard[]> =>
        fetch(`${API_BASE}/tournaments/${id}/leaderboard`, { headers: authHeaders() }).then(json),

    unirse: (id: string): Promise<void> =>
        fetch(`${API_BASE}/tournaments/${id}/join`, { method: 'POST', headers: authHeaders() }).then(json),
};
