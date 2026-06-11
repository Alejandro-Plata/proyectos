export interface LogConsola {
    type: 'log' | 'error' | 'success';
    message: string;
}

export interface CasoTest {
    id: number | string;
    name: string;
    test_code: string;
    is_hidden: boolean;
    sort_order: number;
}

export interface VarianteReto {
    id: number | string;
    language: string;
    starter_code: string;
    solution_code?: string;
    /** Template para envolver el código en lenguajes como Java/Go (null para JS/TS/Python). */
    execution_template?: string | null;
    test_cases: CasoTest[];
}

export interface Reto {
    id: number | string;
    title: string;
    slug?: string;
    description: string;
    difficulty: 'Fácil' | 'Intermedio' | 'Difícil';
    tags: string[];
    xp_reward?: number;
    /** Para mostrar en la UI de guía. */
    example_output?: string;
    variants: VarianteReto[];
    /** Lenguajes disponibles (derivado de variants). */
    available_languages: string[];
    /** Estado de completado por lenguaje del usuario actual. */
    completion_status?: Record<string, boolean>;
}

export interface ResultadoTest {
    name: string;
    passed: boolean;
    error?: string;
}

export interface ResultadoEnvio {
    passed: boolean;
    xp_earned: number;
    test_results: ResultadoTest[];
    total_tests: number;
    passed_tests: number;
}

// Backward-compat aliases
export type ConsoleLog = LogConsola;
export type TestCase = CasoTest;
export type ChallengeVariant = VarianteReto;
export type Challenge = Reto;
export type TestRunResult = ResultadoTest;
export type SubmitResult = ResultadoEnvio;
