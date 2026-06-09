import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { fetchReportedPosts, resolveReport } from '../services/adminService';
import type { ReportedPost, AdminFilters } from '../types/types';

export const useForumModeration = () => {
    const { user } = useUser();
    const [posts, setPosts] = useState<ReportedPost[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<AdminFilters>({
        search: '', page: 1, limit: 15,
    });

    const load = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const res = await fetchReportedPosts(user.token, filters);
            setPosts(res.data);
            setTotal(res.total);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    }, [user?.token, filters]);

    useEffect(() => { load(); }, [load]);

    const handleResolve = async (reportId: string, action: 'dismissed' | 'removed') => {
        if (!user?.token) return;
        await resolveReport(user.token, reportId, action);
        setPosts((prev) => prev.map((p) =>
            p.id === reportId ? { ...p, status: action } : p
        ));
    };

    return { posts, total, isLoading, filters, setFilters, handleResolve, reload: load };
};
