import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { fetchContentRequests, reviewContentRequest } from '../services/adminService';
import type { ContentRequest, AdminFilters, ReviewRequestPayload, ReviewResponse } from '../types/types';

export const useContentRequests = () => {
    const { user } = useUser();
    const [requests, setRequests] = useState<ContentRequest[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<AdminFilters & { status?: string; content_type?: string }>({
        search: '', page: 1, limit: 15,
        status: 'pending',
        content_type: undefined,
    });

    const load = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const res = await fetchContentRequests(user.token, filters);
            setRequests(res.data);
            setTotal(res.total);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    }, [user?.token, filters]);

    useEffect(() => { load(); }, [load]);

    const handleReview = async (requestId: string, payload: ReviewRequestPayload): Promise<ReviewResponse> => {
        if (!user?.token) throw new Error('No autenticado');
        const response = await reviewContentRequest(user.token, requestId, payload);
        const newStatus = payload.action === 'approve' ? 'approved' : 'rejected';
        setRequests((prev) => prev.map((r) =>
            r.id === requestId
                ? {
                    ...r,
                    status: newStatus,
                    rejection_reason: payload.rejection_reason,
                    resource_id: response.resource?.id,
                    resource_type: response.resource?.type,
                }
                : r
        ));
        return response;
    };

    return { requests, total, isLoading, filters, setFilters, handleReview, reload: load };
};
