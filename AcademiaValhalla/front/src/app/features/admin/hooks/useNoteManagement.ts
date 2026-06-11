import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { fetchAdminNotes, deleteNote, reviewNote } from '../services/adminService';
// Hook renombrado a useGestionNotas — se mantiene alias useNoteManagement para compatibilidad
import type { AdminNote, AdminFilters } from '../types/types';

export const useGestionNotas = () => {
    const { user } = useUser();
    const [notes, setNotes] = useState<AdminNote[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<AdminFilters>({
        search: '', page: 1, limit: 15, sortBy: 'created_at', sortOrder: 'desc',
    });

    const cargar = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const res = await fetchAdminNotes(user.token, filters);
            setNotes(res.data);
            setTotal(res.total);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    }, [user?.token, filters]);

    useEffect(() => { cargar(); }, [cargar]);

    const manejarEliminarNota = async (idNota: string) => {
        if (!user?.token) return;
        await deleteNote(user.token, idNota);
        setNotes((prev) => prev.filter((n) => n.id !== idNota));
        setTotal((prev) => prev - 1);
    };

    const manejarRevisarNota = async (idNota: string, action: 'approve' | 'reject') => {
        if (!user?.token) return;
        await reviewNote(user.token, idNota, action);
        setNotes((prev) => prev.filter((n) => n.id !== idNota));
        setTotal((prev) => prev - 1);
    };

    return { notes, total, isLoading, filters, setFilters, handleDeleteNote: manejarEliminarNota, handleReviewNote: manejarRevisarNota, reload: cargar };
};

// Alias para compatibilidad con importaciones existentes
export const useNoteManagement = useGestionNotas;
