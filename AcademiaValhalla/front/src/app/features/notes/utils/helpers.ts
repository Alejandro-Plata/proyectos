import { LANGUAGES } from './consts';

export const generateId = (): string =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

export const getFileExtension = (langId?: string): string => {
    const lang = LANGUAGES.find(l => l.id === langId);
    return lang ? lang.ext : 'js';
};

export const getDifficultyConfig = (level: string) => {
    switch (level) {
        case 'Básico':
            return {
                color: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                border: 'border-emerald-200 dark:border-emerald-500/20'
            };
        case 'Intermedio':
            return {
                color: 'text-cyan-600 dark:text-cyan-400',
                bg: 'bg-cyan-50 dark:bg-cyan-500/10',
                border: 'border-cyan-200 dark:border-cyan-500/20'
            };
        case 'Avanzado':
            return {
                color: 'text-purple-600 dark:text-purple-400',
                bg: 'bg-purple-50 dark:bg-purple-500/10',
                border: 'border-purple-200 dark:border-purple-500/20'
            };
        default:
            return {
                color: 'text-slate-500 dark:text-slate-400',
                bg: 'bg-slate-50 dark:bg-slate-500/10',
                border: 'border-slate-200 dark:border-slate-500/20'
            };
    }
};

export const getLanguageColor = (lang: string): string => {
    switch (lang.toLowerCase()) {
        case 'javascript':
        case 'js':
            return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 group-hover:border-orange-400 dark:group-hover:border-orange-500/30';
        case 'c#':
        case 'csharp':
            return 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 group-hover:border-violet-400 dark:group-hover:border-violet-500/30';
        case 'java':
            return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 group-hover:border-red-400 dark:group-hover:border-red-500/30';
        case 'python':
            return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 group-hover:border-blue-400 dark:group-hover:border-blue-500/30';
        case 'react':
        case 'jsx':
        case 'tsx':
            return 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20 group-hover:border-cyan-400 dark:group-hover:border-cyan-500/30';
        default:
            return 'text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 group-hover:border-slate-300 dark:group-hover:border-white/10';
    }
};
