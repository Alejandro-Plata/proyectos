import { useEffect } from 'react';

export const useUnsavedChangesWarning = (isDirty: boolean) => {
    // Prevenir cierre/recarga del navegador
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // Interceptar navegación con el botón atrás del navegador
    useEffect(() => {
        if (!isDirty) return;

        const handlePopState = () => {
            const confirmed = window.confirm('Tienes cambios sin guardar. ¿Deseas salir de todas formas?');
            if (!confirmed) {
                window.history.pushState(null, '', window.location.href);
            }
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isDirty]);
};
