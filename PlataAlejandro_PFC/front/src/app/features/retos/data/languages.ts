
export interface LanguageRuntime {
    /** Slug que el backend mapea al motor de ejecución (actualmente Judge0). */
    backendSlug: string;
    /** Nombre para mostrar en la UI. */
    label: string;
    /** Extensión de archivo para Monaco Editor. */
    extension: string;
    /** ID de lenguaje para Monaco. */
    monacoId: string;
    /** Plantilla de código inicial por defecto. */
    starterTemplate: string;
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageRuntime> = {
    javascript: {
        backendSlug: 'javascript',
        label: 'JavaScript',
        extension: 'js',
        monacoId: 'javascript',
        starterTemplate: 'function solution() {\n  // Tu código aquí\n}\n',
    },
    typescript: {
        backendSlug: 'typescript',
        label: 'TypeScript',
        extension: 'ts',
        monacoId: 'typescript',
        starterTemplate: 'function solution(): void {\n  // Tu código aquí\n}\n',
    },
    python: {
        backendSlug: 'python',
        label: 'Python',
        extension: 'py',
        monacoId: 'python',
        starterTemplate: 'def solution():\n    # Tu código aquí\n    pass\n',
    },
    java: {
        backendSlug: 'java',
        label: 'Java',
        extension: 'java',
        monacoId: 'java',
        starterTemplate: 'public class Main {\n    public static void main(String[] args) {\n        // Tu código aquí\n    }\n}\n',
    },
    csharp: {
        backendSlug: 'csharp',
        label: 'C#',
        extension: 'cs',
        monacoId: 'csharp',
        starterTemplate: 'using System;\n\nclass Program {\n    static void Main() {\n        // Tu código aquí\n    }\n}\n',
    },
    go: {
        backendSlug: 'go',
        label: 'Go',
        extension: 'go',
        monacoId: 'go',
        starterTemplate: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// Tu código aquí\n\tfmt.Println("hello")\n}\n',
    },
};

/** Clases Tailwind para el badge de cada lenguaje. */
export const LANGUAGE_BADGE_COLORS: Record<string, string> = {
    javascript: 'bg-yellow-400/10 text-yellow-500 border-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-400 dark:border-yellow-400/25',
    typescript: 'bg-blue-500/10 text-blue-600 border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-400/25',
    python:     'bg-sky-500/10 text-sky-600 border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-400/25',
    java:       'bg-orange-500/10 text-orange-600 border-orange-400/30 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-400/25',
    csharp:     'bg-violet-500/10 text-violet-600 border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-400/25',
    go:         'bg-cyan-500/10 text-cyan-600 border-cyan-400/30 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-400/25',
    c:          'bg-indigo-500/10 text-indigo-600 border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-400/25',
    cpp:        'bg-pink-500/10 text-pink-600 border-pink-400/30 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-400/25',
    rust:       'bg-rose-500/10 text-rose-600 border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-400/25',
};

/** Array para la UI de filtros — derivado de SUPPORTED_LANGUAGES. */
export const LANGUAGES = Object.entries(SUPPORTED_LANGUAGES).map(([id, lang]) => ({
    id,
    label: lang.label,
    ext: lang.extension,
}));
