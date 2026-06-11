import React, { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

// 1. DEFINIR TIPO LOCAL
// No usamos el de Monaco porque este estado controla toda la app, no solo el editor.
export type AppTheme = 'light' | 'dark';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    // 2. ESTADO INICIAL
    const [theme, setTheme] = useState<AppTheme>(() => {
        if (typeof window === 'undefined') return 'dark';

        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }

        // Sin preferencia guardada: solo abrimos en claro si el navegador lo pide
        // explícitamente. Si pide oscuro o no tiene ninguna preferencia, oscuro por defecto.
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }

        return 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            // Solo cambiamos automáticamente si NO hay preferencia guardada.
            // Misma regla que al arrancar: claro solo si el navegador lo pide
            // explícitamente; en cualquier otro caso, oscuro.
            if (!localStorage.getItem('theme')) {
                const prefiereClaro = window.matchMedia('(prefers-color-scheme: light)').matches;
                setTheme(prefiereClaro ? 'light' : 'dark');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme: AppTheme = prevTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
};