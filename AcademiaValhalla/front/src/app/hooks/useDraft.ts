import { useEffect } from 'react';

export function useDraft<T>(key: string, value: T, setValue: (v: T) => void) {
    useEffect(() => {
        const raw = localStorage.getItem(`draft:${key}`);
        if (raw) {
            try { setValue(JSON.parse(raw)); } catch { /* ignore */ }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    useEffect(() => {
        const t = setTimeout(() => localStorage.setItem(`draft:${key}`, JSON.stringify(value)), 800);
        return () => clearTimeout(t);
    }, [key, value]);
}

export function clearDraft(key: string) {
    localStorage.removeItem(`draft:${key}`);
}
