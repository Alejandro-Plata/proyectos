import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { fetchUsers, updateUser, deleteUser } from '../services/adminService';
import type { AdminUser, AdminFilters, UpdateUserPayload } from '../types/types';

export const useUserManagement = () => {
    const { user } = useUser();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<AdminFilters>({
        search: '', page: 1, limit: 15, sortBy: 'created_at', sortOrder: 'desc',
    });

    const load = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const res = await fetchUsers(user.token, filters);
            setUsers(res.data);
            setTotal(res.total);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    }, [user?.token, filters]);

    useEffect(() => { load(); }, [load]);

    const handleUpdateUser = async (userId: string, payload: UpdateUserPayload) => {
        if (!user?.token) return;
        const updated = await updateUser(user.token, userId, payload);
        setUsers((prev) => prev.map((u) => (u.user_id === userId ? updated : u)));
    };

    const handleDeleteUser = async (userId: string) => {
        if (!user?.token) return;
        await deleteUser(user.token, userId);
        setUsers((prev) => prev.filter((u) => u.user_id !== userId));
        setTotal((prev) => prev - 1);
    };

    return {
        users, total, isLoading, filters,
        setFilters, handleUpdateUser, handleDeleteUser, reload: load,
    };
};
