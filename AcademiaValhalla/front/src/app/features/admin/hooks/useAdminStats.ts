import { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { fetchAdminStats } from '../services/adminService';
import type { AdminStats } from '../types/types';

export const useAdminStats = () => {
    const { user } = useUser();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.token) return;
        setIsLoading(true);
        fetchAdminStats(user.token)
            .then(setStats)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [user?.token]);

    const decrementPendingRequests = () => {
        setStats((prev) => prev ? { ...prev, pendingRequests: Math.max(0, prev.pendingRequests - 1) } : prev);
    };

    const decrementPendingRevisions = () => {
        setStats((prev) => prev ? { ...prev, pendingRevisions: Math.max(0, (prev.pendingRevisions ?? 1) - 1) } : prev);
    };

    return { stats, isLoading, decrementPendingRequests, decrementPendingRevisions };
};
