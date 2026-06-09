import { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import { fetchDashboardStats } from "../services/dashboardService";
import type { DashboardStats, DashboardActivity } from "../types/types";
import type { User } from "../../../context/types/types";
import { calculateLevelFromXP } from "../../../utils/consts/xpConsts";

// Usuario por defecto mientras carga el contexto (evita crasheos en la UI)
const DEFAULT_USER: User = {
    user_id: '',
    username: 'Cargando...',
    email: '',
    role: 'USUARIO',
    current_level: 1,
    experience_points: 0,
    streak_days: 0,
};

export const useProfile = () => {
    const { user } = useUser();

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<DashboardActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const activeUser = user || DEFAULT_USER;

    // Calcular porcentaje usando la fórmula dinámica
    const levelInfo = calculateLevelFromXP(activeUser.experience_points);
    const xpPercentage = levelInfo.progressPercent;

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const data = await fetchDashboardStats();
                if (!cancelled) {
                    setStats(data.stats);
                    setRecentActivity(data.recentActivity);
                }
            } catch (err) {
                console.error('Error cargando dashboard:', err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        load();
        return () => { cancelled = true; };
    }, []);

    return {
        // 4. Retornamos el objeto exacto que los componentes ProfileDesktop y ProfileMobile esperan
        user: activeUser,
        stats,
        recentActivity,
        isLoading,
        xpPercentage
    };
};