import { API_BASE, authHeaders } from '../../../services/apiClient';

export interface CazaIniciada {
    hunt_id: string;
    language: string;
    buggy_code: string;
}

export interface ResultadoCaza {
    correcto: boolean;
    bug_line: number;
    bug_explanation: string;
    xpReward?: any;
    unlockedAchievements?: any[];
}

const post = async (url: string, body?: any) => {
    const res = await fetch(url, { method: 'POST', headers: authHeaders(), body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.msg ?? 'Error en la caza');
    }
    return res.json();
};

export const cazaTrollService = {
    iniciar: (tema?: string): Promise<CazaIniciada> =>
        post(`${API_BASE}/caza-bichillo`, { tema }),

    pista: (huntId: string, line: number): Promise<{ temperatura: string }> =>
        post(`${API_BASE}/caza-bichillo/${huntId}/hint`, { line }),

    resolver: (huntId: string, line: number, explanation: string): Promise<ResultadoCaza> =>
        post(`${API_BASE}/caza-bichillo/${huntId}/solve`, { line, explanation }),
};
