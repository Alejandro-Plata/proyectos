import type { DashboardStats, DashboardActivity, Trophy } from '../types/types';
import { API_BASE, authHeaders } from '../../../services/apiClient';

export const fetchDashboardStats = async (): Promise<{
    stats: DashboardStats;
    recentActivity: DashboardActivity[];
}> => {
    const res = await fetch(`${API_BASE}/me/dashboard`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al obtener datos del dashboard');
    return res.json();
};

export const fetchUserAchievements = async (): Promise<Trophy[]> => {
    const res = await fetch(`${API_BASE}/achievements`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al obtener logros');
    return res.json();
};
