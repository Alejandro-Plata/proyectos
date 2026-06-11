import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { fetchAdminChallenges, deleteChallenge } from '../services/adminService';
import type { AdminChallenge, AdminFilters } from '../types/types';

export const useChallengeManagement = () => {
    const { user } = useUser();
    const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<AdminFilters>({
        search: '', page: 1, limit: 15, sortBy: 'created_at', sortOrder: 'desc',
    });

    const load = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const res = await fetchAdminChallenges(user.token, filters);
            setChallenges(res.data);
            setTotal(res.total);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    }, [user?.token, filters]);

    useEffect(() => { load(); }, [load]);

    const handleDeleteChallenge = async (challengeId: string) => {
        if (!user?.token) return;
        await deleteChallenge(user.token, challengeId);
        setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
        setTotal((prev) => prev - 1);
    };

    return { challenges, total, isLoading, filters, setFilters, handleDeleteChallenge, reload: load };
};
