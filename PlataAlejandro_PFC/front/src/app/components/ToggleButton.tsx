import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Icons } from './Icons';

export const ToggleButton: React.FC = () => {
    const { toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-500/[0.06] transition-all duration-300 group sm:block hidden"
            title="Cambiar tema"
            type="button"
        >
            { Icons.sun }
            { Icons.moon }
        </button>
    );
};