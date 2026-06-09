export interface CodeArenaLanguage {
    id: number;
    name: string;
    needsMainWrapper?: boolean;
}

export const CODE_ARENA_LANGUAGES: Record<string, CodeArenaLanguage> = {
    javascript: { id: 63,  name: 'JavaScript (Node.js 12.14.0)' },
    typescript: { id: 74,  name: 'TypeScript (3.7.4)' },
    python:     { id: 71,  name: 'Python (3.8.1)' },
    java:       { id: 62,  name: 'Java (OpenJDK 13.0.1)', needsMainWrapper: true },
    csharp:     { id: 51,  name: 'C# (Mono 6.6.0.161)',   needsMainWrapper: true },
    go:         { id: 60,  name: 'Go (1.13.5)' },
    rust:       { id: 73,  name: 'Rust (1.40.0)' },
    cpp:        { id: 54,  name: 'C++ (GCC 9.2.0)' },
    c:          { id: 50,  name: 'C (GCC 9.2.0)' },
};

export function resolveCodeArenaLanguage(slug: string): CodeArenaLanguage | null {
    return CODE_ARENA_LANGUAGES[slug.toLowerCase()] ?? null;
}
