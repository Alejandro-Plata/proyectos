import { useState } from 'react';

interface TestHelpModalProps {
    onClose: () => void;
    initialLanguage?: string;
}

const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'go', 'csharp'] as const;
type Lang = typeof LANGUAGES[number];

const LANG_LABELS: Record<Lang, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    go: 'Go',
    csharp: 'C#',
};

const TEST_EXAMPLES: Record<Lang, { description: string; code: string }> = {
    javascript: {
        description: 'Usa funciones de aserción simples. El código de validación recibe la función del usuario y verifica casos de prueba.',
        code: `// La función del usuario estará disponible en el scope
// Lanza un error si un test falla

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Test 1: caso básico
assert(solution([1, 2, 3]) === 6, 'Suma de [1,2,3] debe ser 6');

// Test 2: array vacío
assert(solution([]) === 0, 'Suma de [] debe ser 0');

// Test 3: números negativos
assert(solution([-1, -2, 3]) === 0, 'Suma de [-1,-2,3] debe ser 0');

// Si todos los tests pasan, no se lanza ningún error
`,
    },
    typescript: {
        description: 'Igual que JavaScript, pero puedes usar tipos. La función del usuario se llama `solution`.',
        code: `// La función del usuario está disponible como \`solution\`
// Lanza un error si un test falla

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

// Test 1: caso básico
assert(solution([1, 2, 3]) === 6, 'Suma de [1,2,3] debe ser 6');

// Test 2: cadenas vacías
assert(solution('') === '', 'String vacío debe devolver vacío');

// Test 3: valor nulo
assert(solution(null) === null, 'null debe devolver null');
`,
    },
    python: {
        description: 'Usa `assert` con mensajes descriptivos. Cada assert lanza AssertionError si falla.',
        code: `# La función del usuario está disponible en el scope
# Usa assert para verificar resultados

# Test 1: caso básico
assert solution([1, 2, 3]) == 6, "Suma de [1,2,3] debe ser 6"

# Test 2: lista vacía
assert solution([]) == 0, "Suma de [] debe ser 0"

# Test 3: números negativos
assert solution([-1, -2, 3]) == 0, "Suma de [-1,-2,3] debe ser 0"

# Test 4: un solo elemento
assert solution([42]) == 42, "Suma de [42] debe ser 42"
`,
    },
    java: {
        description: 'Usa un método `assert` personalizado o bloques if/throw. La clase del usuario está disponible en el scope.',
        code: `// La solución del usuario está disponible como método estático \`solution\`
// Lanza RuntimeException si un test falla

static void check(boolean condition, String message) {
    if (!condition) throw new RuntimeException("FAIL: " + message);
}

// Test 1: caso básico
check(solution(new int[]{1, 2, 3}) == 6, "Suma de [1,2,3] debe ser 6");

// Test 2: array vacío
check(solution(new int[]{}) == 0, "Suma de [] debe ser 0");

// Test 3: número negativo
check(solution(new int[]{-1, 5}) == 4, "Suma de [-1,5] debe ser 4");
`,
    },
    go: {
        description: 'Usa comparaciones directas con panic. El paquete de la solución se importa automáticamente.',
        code: `// La función del usuario está disponible en el mismo package
// Usa panic con mensaje descriptivo si un test falla

func runTests() {
    // Test 1: caso básico
    if result := solution([]int{1, 2, 3}); result != 6 {
        panic(fmt.Sprintf("FAIL: esperado 6, obtenido %d", result))
    }

    // Test 2: slice vacío
    if result := solution([]int{}); result != 0 {
        panic(fmt.Sprintf("FAIL: esperado 0, obtenido %d", result))
    }

    // Test 3: números negativos
    if result := solution([]int{-1, 5}); result != 4 {
        panic(fmt.Sprintf("FAIL: esperado 4, obtenido %d", result))
    }
}
`,
    },
    csharp: {
        description: 'Usa un método `Assert` personalizado o throw. La clase del usuario está accesible en el scope.',
        code: `// La solución del usuario está disponible como método estático \`Solution\`
// Lanza Exception si un test falla

static void Assert(bool condition, string message) {
    if (!condition) throw new Exception("FAIL: " + message);
}

// Test 1: caso básico
Assert(Solution(new int[]{1, 2, 3}) == 6, "Suma de [1,2,3] debe ser 6");

// Test 2: array vacío
Assert(Solution(new int[]{}) == 0, "Suma de [] debe ser 0");

// Test 3: valores negativos
Assert(Solution(new int[]{-1, 5}) == 4, "Suma de [-1,5] debe ser 4");
`,
    },
};

export const TestHelpModal = ({ onClose, initialLanguage = 'javascript' }: TestHelpModalProps) => {
    const initial = LANGUAGES.includes(initialLanguage as Lang) ? initialLanguage as Lang : 'javascript';
    const [activeLang, setActiveLang] = useState<Lang>(initial);
    const example = TEST_EXAMPLES[activeLang];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div
                className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-[#0f1115] border border-emerald-500/20 dark:border-emerald-500/15 shadow-2xl shadow-emerald-500/10 overflow-hidden animate-in zoom-in-95 duration-200"
                style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/15 dark:border-emerald-500/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="inline-block w-1 h-4 bg-emerald-500 shrink-0" />
                        <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-700 dark:text-slate-200 font-bold">
                            Cómo escribir tests de validación
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Language selector */}
                <div className="flex gap-1 px-5 pt-4 flex-wrap shrink-0">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] border transition-colors ${
                                activeLang === lang
                                    ? 'bg-emerald-500 text-black border-emerald-500'
                                    : 'text-slate-500 dark:text-slate-400 border-emerald-500/15 dark:border-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-500'
                            }`}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)' }}
                        >
                            {LANG_LABELS[lang]}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">

                    {/* Description */}
                    <div className="p-3 border border-emerald-500/15 dark:border-emerald-500/10 bg-emerald-500/[0.02]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">
                            Patrón de validación
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {example.description}
                        </p>
                    </div>

                    {/* Code example */}
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">
                            Ejemplo de tests
                        </p>
                        <div className="relative bg-[#1e1e1e] border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
                                <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                </div>
                                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                                    validation.{activeLang === 'typescript' ? 'ts' : activeLang === 'javascript' ? 'js' : activeLang === 'python' ? 'py' : activeLang === 'java' ? 'java' : activeLang === 'go' ? 'go' : 'cs'}
                                </span>
                            </div>
                            <pre className="p-4 text-[12px] text-slate-300 leading-relaxed overflow-x-auto font-mono whitespace-pre">
                                {example.code}
                            </pre>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="p-3 border border-amber-500/15 bg-amber-500/[0.03] space-y-1.5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-500/70">· consejos</p>
                        <ul className="space-y-1">
                            {[
                                'Cubre el caso base, el caso límite y al menos un caso negativo.',
                                'Los mensajes de error deben indicar qué se esperaba y qué se obtuvo.',
                                'No uses dependencias externas: el runner solo ejecuta el código en sandbox.',
                                'La función del usuario siempre se llama `solution` en el scope global.',
                            ].map((tip) => (
                                <li key={tip} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                    <span className="text-amber-500/60 mt-0.5 shrink-0">›</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
