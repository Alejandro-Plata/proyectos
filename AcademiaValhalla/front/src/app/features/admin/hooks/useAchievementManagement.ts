import { useState, useEffect, useCallback } from 'react';
import {
    fetchAdminAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    updateAchievementStatus,
} from '../services/adminService';
import type { AdminAchievement } from '../types/types';
import { useUser } from '../../../context/UserContext';

export const useAchievementManagement = () => {
    const { user } = useUser();
    const [achievements, setAchievements] = useState<AdminAchievement[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const res = await fetchAdminAchievements(user.token, { limit: 100 });
            setAchievements(res.achievements);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [user?.token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreate = async (data: FormData) => {
        if (!user?.token) return;
        await createAchievement(user.token, data);
        await fetchData();
    };

    const handleUpdate = async (id: string, data: FormData) => {
        if (!user?.token) return;
        await updateAchievement(user.token, id, data);
        await fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!user?.token) return;
        await deleteAchievement(user.token, id);
        setAchievements((prev) => prev.filter((a) => a.achievement_id !== id));
    };

    const handleStatusChange = async (id: string, status: 'pending' | 'published') => {
        if (!user?.token) return;
        const updated = await updateAchievementStatus(user.token, id, status);
        setAchievements((prev) =>
            prev.map((a) => (a.achievement_id === id ? { ...a, status: updated.status } : a))
        );
    };

    return {
        achievements,
        isLoading,
        fetchData,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleStatusChange,
    };
};
