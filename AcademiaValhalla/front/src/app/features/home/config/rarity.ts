import type { Rarity } from "../types/types";

export const RARITY_CONFIG: Record<Rarity, { 
    tag: string; 
    metalGradient: string; // Para Desktop
    energyGradient: string; // Para Desktop
    glowColor: string;      // Para Desktop
    mobileBorder: string;   // Para Móvil
    mobileGlow: string;     // Para Móvil
}> = {
    common: { 
        tag: 'text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-500 bg-slate-100 dark:bg-slate-800',
        metalGradient: 'from-slate-200 via-slate-300 to-slate-400 dark:from-slate-400 dark:via-slate-600 dark:to-slate-800',
        energyGradient: 'from-slate-100 to-slate-200 dark:from-slate-300 dark:to-slate-500',
        glowColor: 'bg-slate-400 dark:bg-slate-500',
        mobileBorder: 'border-slate-600',
        mobileGlow: 'shadow-slate-500/20'
    },
    rare: { 
        tag: 'text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30',
        metalGradient: 'from-cyan-100 via-blue-200 to-blue-300 dark:from-cyan-500 dark:via-blue-600 dark:to-cyan-900',
        energyGradient: 'from-cyan-50 to-blue-100 dark:from-cyan-300 dark:to-blue-400',
        glowColor: 'bg-cyan-400 dark:bg-cyan-500',
        mobileBorder: 'border-cyan-600',
        mobileGlow: 'shadow-cyan-500/20'
    },
    epic: { 
        tag: 'text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/30',
        metalGradient: 'from-fuchsia-100 via-purple-200 to-purple-300 dark:from-fuchsia-500 dark:via-purple-600 dark:to-purple-900',
        energyGradient: 'from-fuchsia-50 to-purple-100 dark:from-fuchsia-300 dark:to-purple-400',
        glowColor: 'bg-purple-400 dark:bg-purple-500',
        mobileBorder: 'border-purple-600',
        mobileGlow: 'shadow-purple-500/20'
    },
    legendary: { 
        tag: 'text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/30',
        metalGradient: 'from-yellow-100 via-amber-200 to-orange-300 dark:from-amber-400 dark:via-orange-500 dark:to-yellow-700',
        energyGradient: 'from-yellow-50 to-amber-100 dark:from-yellow-200 dark:via-amber-400 dark:to-orange-500',
        glowColor: 'bg-amber-400 dark:bg-amber-500',
        mobileBorder: 'border-amber-600',
        mobileGlow: 'shadow-amber-500/20'
    },
};