import { useState, useEffect, useCallback } from 'react';
import { challengesService } from '../services/challengesService';
import type { Reto as Challenge } from '../types/types';

export const useRetos = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        challengesService
            .getAll()
            .then(setChallenges)
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    const fetchChallenge = useCallback(async (id: number): Promise<Challenge | null> => {
        try {
            return await challengesService.getById(id);
        } catch {
            return null;
        }
    }, []);

    const deleteChallenge = useCallback(async (id: string | number): Promise<void> => {
        await challengesService.deleteChallenge(id);
        setChallenges(prev => prev.filter(c => c.id !== id));
    }, []);

    return { challenges, isLoading, error, fetchChallenge, deleteChallenge };
};
