import { useState, useCallback } from 'react';

export interface LogroDesbloqueado {
    achievement: {
        achievement_id: string;
        title: string;
        description: string;
        rarity: string;
        emblem_url: string | null;
        xp_reward: number;
        trigger_type: string;
    };
    xpResult: any;
    unlocked_at: string;
}

export function useDesbloqueoLogro() {
    const [, setQueue] = useState<LogroDesbloqueado[]>([]);
    const [logroActual, setLogroActual] = useState<LogroDesbloqueado | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const encolarLogros = useCallback((logros: LogroDesbloqueado[]) => {
        if (logros.length === 0) return;

        setQueue((prev) => {
            const all = [...prev, ...logros];
            if (!mostrarModal) {
                setLogroActual(all[0]);
                setMostrarModal(true);
                return all.slice(1);
            }
            return all;
        });
    }, [mostrarModal]);

    const cerrarModal = useCallback(() => {
        setMostrarModal(false);
        setTimeout(() => {
            setQueue((prev) => {
                if (prev.length > 0) {
                    setLogroActual(prev[0]);
                    setMostrarModal(true);
                    return prev.slice(1);
                }
                setLogroActual(null);
                return [];
            });
        }, 400);
    }, []);

    return { logroActual, mostrarModal, encolarLogros, cerrarModal };
}
