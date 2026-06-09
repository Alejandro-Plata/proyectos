import { API_BASE, authHeaders } from './apiClient';

export interface XPRewardResponse {
    xpGained: number;
    previousXP: number;
    newTotalXP: number;
    previousLevel: number;
    newLevel: number;
    leveledUp: boolean;
    currentLevelXP: number;
    requiredForNextLevel: number;
    progressPercent: number;
}

export interface LevelInfoResponse {
    totalXP: number;
    level: number;
    currentLevelXP: number;
    requiredForNextLevel: number;
    progressPercent: number;
}

export async function fetchLevelInfo(): Promise<LevelInfoResponse> {
    const res = await fetch(`${API_BASE}/xp/level-info`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener info de nivel');
    return res.json();
}
