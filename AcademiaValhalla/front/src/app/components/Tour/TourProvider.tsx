import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { TourContextType, TourStep } from './tourTypes';
import { TourOverlay } from './TourOverlay';

const TourContext = createContext<TourContextType | null>(null);

const SESSION_KEY = 'valhalla:tour:session';

interface TourSession {
    tourId: string;
    currentIndex: number;
}

interface Props {
    tours: Record<string, TourStep[]>;
    children: React.ReactNode;
}

export const TourProvider = ({ tours, children }: Props) => {
    const location  = useLocation();
    const navigate  = useNavigate();

    const [activeTourId, setActiveTourId] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const stepNavigatingRef = useRef(false);

    const steps    = activeTourId ? (tours[activeTourId] ?? []) : [];
    const step     = steps[currentIndex] ?? null;
    const isActive = activeTourId !== null;

    /* ---- Restaurar sesión al montar ---- */
    useEffect(() => {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return;
        try {
            const session: TourSession = JSON.parse(raw);
            if (tours[session.tourId]) {
                setActiveTourId(session.tourId);
                setCurrentIndex(session.currentIndex);
            }
        } catch {
            sessionStorage.removeItem(SESSION_KEY);
        }
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---- Persistir sesión ---- */
    useEffect(() => {
        if (activeTourId !== null) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ tourId: activeTourId, currentIndex }));
        }
    }, [activeTourId, currentIndex]);

    /* ---- Navegar cuando cambia el paso ---- */
    useEffect(() => {
        if (!step || !stepNavigatingRef.current) return;
        stepNavigatingRef.current = false;
        if (step.route && location.pathname !== step.route) {
            navigate(step.route);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    const start = useCallback((tourId: string) => {
        const tourSteps = tours[tourId];
        if (!tourSteps?.length) return;
        setActiveTourId(tourId);
        setCurrentIndex(0);
        stepNavigatingRef.current = true;
        if (tourSteps[0].route && location.pathname !== tourSteps[0].route) {
            navigate(tourSteps[0].route);
        }
    }, [tours, location.pathname, navigate]);

    const stop = useCallback(() => {
        setActiveTourId(null);
        setCurrentIndex(0);
        sessionStorage.removeItem(SESSION_KEY);
    }, []);

    const next = useCallback(() => {
        if (!activeTourId) return;
        const tourSteps = tours[activeTourId] ?? [];
        if (currentIndex >= tourSteps.length - 1) {
            stop();
            return;
        }
        stepNavigatingRef.current = true;
        setCurrentIndex(i => i + 1);
    }, [activeTourId, currentIndex, tours, stop]);

    const prev = useCallback(() => {
        if (currentIndex <= 0) return;
        stepNavigatingRef.current = true;
        setCurrentIndex(i => i - 1);
    }, [currentIndex]);

    /* ---- Navegar después de setCurrentIndex (next/prev) ---- */
    useEffect(() => {
        if (!stepNavigatingRef.current || !step) return;
        stepNavigatingRef.current = false;
        if (step.route && location.pathname !== step.route) {
            navigate(step.route);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    /* ---- Cerrar con Esc global ---- */
    useEffect(() => {
        if (!isActive) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') stop();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isActive, stop]);

    const ctx: TourContextType = {
        isActive,
        currentStep: step,
        currentIndex,
        totalSteps: steps.length,
        start,
        stop,
        next,
        prev,
    };

    return (
        <TourContext.Provider value={ctx}>
            {children}
            {isActive && step && (
                <TourOverlay
                    step={step}
                    currentIndex={currentIndex}
                    totalSteps={steps.length}
                    onNext={next}
                    onPrev={prev}
                    onStop={stop}
                />
            )}
        </TourContext.Provider>
    );
};

export const useTour = (): TourContextType => {
    const ctx = useContext(TourContext);
    if (!ctx) throw new Error('useTour must be used inside TourProvider');
    return ctx;
};
