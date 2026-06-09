import { useState, useEffect } from 'react';

// señal de módulo para que FloatingChat sepa si el asistente está abierto y se oculte
let listeners: Array<(v: boolean) => void> = [];
let currentValue = false;

export function setFreyaOpen(v: boolean) {
    currentValue = v;
    listeners.forEach(l => l(v));
}

export function useFreyaOpen(): boolean {
    const [open, setOpen] = useState<boolean>(currentValue);
    useEffect(() => {
        listeners.push(setOpen);
        return () => {
            listeners = listeners.filter(l => l !== setOpen);
        };
    }, []);
    return open;
}
