import { createContext, use, useCallback, useRef, useState } from 'react';
import type { LogroDesbloqueado } from '../hooks/useDesbloqueoLogro';
import ModalLogroDesbloqueado from '../components/ModalLogroDesbloqueado';

interface AchievementContextType {
    encolarLogros: (logros: LogroDesbloqueado[]) => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const useAchievements = () => {
    const ctx = use(AchievementContext);
    if (!ctx) throw new Error('useAchievements must be used within AchievementProvider');
    return ctx;
};

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [, setQueue] = useState<LogroDesbloqueado[]>([]);
    const [logroActual, setLogroActual] = useState<LogroDesbloqueado | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    // useRef para que encolarLogros lea siempre el valor actual sin recrearse
    const mostrandoRef = useRef(false);
    mostrandoRef.current = mostrarModal;

    const encolarLogros = useCallback((logros: LogroDesbloqueado[]) => {
        if (logros.length === 0) return;

        setQueue((prev) => {
            const all = [...prev, ...logros];
            if (!mostrandoRef.current) {
                setLogroActual(all[0]);
                setMostrarModal(true);
                return all.slice(1);
            }
            return all;
        });
    }, []);

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

    return (
        <AchievementContext value={{ encolarLogros }}>
            {children}
            {logroActual && (
                <ModalLogroDesbloqueado
                    achievement={logroActual}
                    visible={mostrarModal}
                    onClose={cerrarModal}
                />
            )}
        </AchievementContext>
    );
};
