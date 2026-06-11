import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { fetchAdminPosts, deleteAdminPost, deleteAdminComment } from '../services/adminService';
import type { PublicacionAdmin, AdminFilters } from '../types/types';

export const useForumPosts = () => {
    const { user } = useUser();
    const [posts, setPosts] = useState<PublicacionAdmin[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<AdminFilters>({
        search: '', page: 1, limit: 15, sortBy: 'created_at', sortOrder: 'desc',
    });

    const load = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const res = await fetchAdminPosts(user.token, filters);
            setPosts(res.data);
            setTotal(res.total);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    }, [user?.token, filters]);

    useEffect(() => { load(); }, [load]);

    const handleDeletePost = async (postId: string) => {
        if (!user?.token) return;
        await deleteAdminPost(user.token, postId);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setTotal((prev) => prev - 1);
    };

    const handleDeleteComment = async (commentId: string, postId: string) => {
        if (!user?.token) return;
        await deleteAdminComment(user.token, commentId);
        setPosts((prev) => prev.map((p) =>
            p.id === postId ? { ...p, comment_count: Math.max(0, p.comment_count - 1) } : p
        ));
    };

    return { posts, total, isLoading, filters, setFilters, handleDeletePost, handleDeleteComment };
};
