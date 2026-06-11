import type { LanguageConfig } from '../types/types';

export const AVAILABLE_TAGS = [
    'Frontend', 'Backend', 'FullStack', 'DevOps',
    'Database', 'Testing', 'Arquitectura', 'Hooks',
    'CSS', 'API', 'Seguridad', 'Performance'
];

export const LANGUAGES: LanguageConfig[] = [
    { id: 'javascript', label: 'JavaScript', ext: 'js' },
    { id: 'typescript', label: 'TypeScript', ext: 'ts' },
    { id: 'python', label: 'Python', ext: 'py' },
    { id: 'java', label: 'Java', ext: 'java' },
    { id: 'csharp', label: 'C#', ext: 'cs' },
    { id: 'sql', label: 'SQL', ext: 'sql' },
    { id: 'go', label: 'Go', ext: 'go' },
    { id: 'html', label: 'HTML', ext: 'html' },
    { id: 'css', label: 'CSS', ext: 'css' },
    { id: 'general', label: 'General', ext: 'txt' },
];

export const DIFFICULTIES = ['Básico', 'Intermedio', 'Avanzado'] as const;

export const BLOCK_MODAL_OPTIONS = [
    { type: 'text', label: 'Texto', desc: 'Párrafos con soporte Markdown.', color: 'blue' },
    { type: 'definition', label: 'Definición', desc: 'Destaca conceptos clave.', color: 'emerald' },
    { type: 'code', label: 'Código', desc: 'Editor con resaltado de sintaxis.', color: 'amber' },
    { type: 'image', label: 'Imagen', desc: 'Sube capturas o diagramas.', color: 'violet' },
] as const;

export const BLOCK_MODAL_COLORS: Record<string, { bg: string; hoverBg: string; iconBg: string; iconHoverBg: string; text: string; border: string }> = {
    blue: {
        bg: 'bg-blue-50/50 dark:bg-blue-500/5',
        hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-500/15',
        iconBg: 'bg-blue-100 dark:bg-blue-500/10 text-blue-500',
        iconHoverBg: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20',
        text: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
        border: 'hover:border-blue-300 dark:hover:border-blue-500/30',
    },
    emerald: {
        bg: 'bg-emerald-50/50 dark:bg-emerald-500/5',
        hoverBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-500/15',
        iconBg: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500',
        iconHoverBg: 'group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/20',
        text: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
        border: 'hover:border-emerald-300 dark:hover:border-emerald-500/30',
    },
    amber: {
        bg: 'bg-amber-50/50 dark:bg-amber-500/5',
        hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-500/15',
        iconBg: 'bg-amber-100 dark:bg-amber-500/10 text-amber-500',
        iconHoverBg: 'group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20',
        text: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
        border: 'hover:border-amber-300 dark:hover:border-amber-500/30',
    },
    violet: {
        bg: 'bg-violet-50/50 dark:bg-violet-500/5',
        hoverBg: 'hover:bg-violet-100 dark:hover:bg-violet-500/15',
        iconBg: 'bg-violet-100 dark:bg-violet-500/10 text-violet-500',
        iconHoverBg: 'group-hover:bg-violet-200 dark:group-hover:bg-violet-500/20',
        text: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
        border: 'hover:border-violet-300 dark:hover:border-violet-500/30',
    },
};

export const EDITOR_TABS = [
    { id: 'text', label: 'Texto' },
    { id: 'code', label: 'Código' },
    { id: 'definition', label: 'Nota' },
    { id: 'image', label: 'Img' },
] as const;
