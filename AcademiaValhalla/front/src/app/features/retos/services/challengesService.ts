import type { Challenge } from '../types/types';
import { API_BASE, authHeaders } from '../../../services/apiClient';

export interface ExecuteCodeResult {
    stdout: string;
    stderr: string;
    exitCode: number;
    signal: string | null;
    timedOut: boolean;
}

export const executeCode = async (
    code: string,
    languageId: string
): Promise<ExecuteCodeResult> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    try {
        const response = await fetch(`${API_BASE}/challenges/execute`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ language: languageId, code }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return {
                stdout:   '',
                stderr:   errData.error ?? `Error de ejecución (HTTP ${response.status})`,
                exitCode: 1,
                signal:   null,
                timedOut: false,
            };
        }

        const data = await response.json();
        return {
            stdout:   data.stdout   ?? '',
            stderr:   data.stderr   ?? '',
            exitCode: data.exitCode ?? 0,
            signal:   data.signal   ?? null,
            timedOut: data.timedOut ?? false,
        };

    } catch (err) {
        clearTimeout(timeout);

        if (err instanceof DOMException && err.name === 'AbortError') {
            return {
                stdout:   '',
                stderr:   'La ejecución superó el tiempo límite de 60 segundos.',
                exitCode: 1,
                signal:   'TIMEOUT',
                timedOut: true,
            };
        }

        return {
            stdout:   '',
            stderr:   `Error de red: ${err instanceof Error ? err.message : 'desconocido'}`,
            exitCode: 1,
            signal:   null,
            timedOut: false,
        };
    }
};

export const challengesService = {
    getAll: async (): Promise<Challenge[]> => {
        const res = await fetch(`${API_BASE}/challenges`, { headers: authHeaders() });
        if (!res.ok) throw new Error(`Error al cargar retos (HTTP ${res.status})`);
        const data = await res.json();
        return Array.isArray(data) ? data as Challenge[] : [];
    },

    getById: async (id: number | string): Promise<Challenge> => {
        const res = await fetch(`${API_BASE}/challenges/${id}`, { headers: authHeaders() });
        if (!res.ok) throw new Error(`Reto ${id} no encontrado (HTTP ${res.status})`);
        const data = await res.json();
        if (!data || !('variants' in data)) {
            throw new Error(`Formato de reto inválido recibido del backend`);
        }
        return data as Challenge;
    },

    executeCode,

    submitSolution: async (
        challengeId: number | string,
        languageId: string,
        code: string
    ): Promise<{ passed: boolean; xp_earned: number }> => {
        const res = await fetch(`${API_BASE}/challenges/${challengeId}/submit`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ language: languageId, code }),
        });
        if (!res.ok) throw new Error('Error al enviar la solución');
        return res.json();
    },

    updateProgress: async (
        challengeId: string | number,
        payload: { status: string; user_solution?: string }
    ): Promise<{ msg: string; progress: any; xpReward: any | null; unlockedAchievements: any[] }> => {
        const res = await fetch(`${API_BASE}/challenges/${challengeId}/progress`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error al actualizar progreso');
        return res.json();
    },

    deleteChallenge: async (challengeId: string | number): Promise<void> => {
        const res = await fetch(`${API_BASE}/challenges/${challengeId}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Error al eliminar el reto');
    },

    proposeChallenge: async (payload: {
        title: string;
        description: string;
        instructions?: string;
        expected_output?: string;
        language: string;
        difficulty: string;
        starter_code?: string;
        solution_code: string;
        test_code: string;
    }): Promise<void> => {
        const DIFFICULTY_EN: Record<string, string> = {
            'Fácil': 'easy', 'Intermedio': 'medium', 'Difícil': 'hard',
        };
        const res = await fetch(`${API_BASE}/admin/content-requests`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
                type: 'challenge',
                title: payload.title,
                description: payload.description,
                metadata: {
                    language: payload.language,
                    difficulty: DIFFICULTY_EN[payload.difficulty] ?? payload.difficulty,
                    instructions: payload.instructions,
                    example_output: payload.expected_output,
                    starter_code: payload.starter_code,
                    solution_code: payload.solution_code,
                    test_code: payload.test_code,
                },
            }),
        });
        if (!res.ok) throw new Error('Error al enviar la propuesta');
    },
};

// ── A2 · Forja de retos ────────────────────────────────────────

export interface ResultadoVerificacion {
    passed: boolean;
    results: { hidden: boolean; passed: boolean; stdin?: string; expected?: string; got?: string }[];
    xpReward?: any;
    unlockedAchievements?: any[];
}

export const forjaService = {
    /** Pide a la IA forjar un reto a medida (devuelve el id del reto creado). */
    forge: async (tema?: string): Promise<{ challenge_id: string; tema: string }> => {
        const res = await fetch(`${API_BASE}/challenges/forge`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ tema }),
        });
        if (!res.ok) {
            const b = await res.json().catch(() => ({}));
            throw new Error(b.msg ?? 'No se pudo forjar el reto');
        }
        return res.json();
    },

    /** Verifica el código del usuario contra los casos de prueba del reto. */
    verify: async (challengeId: string, language: string, code: string): Promise<ResultadoVerificacion> => {
        const res = await fetch(`${API_BASE}/challenges/${challengeId}/verify`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ language, code }),
        });
        if (!res.ok) {
            const b = await res.json().catch(() => ({}));
            throw new Error(b.msg ?? 'Error al verificar la solución');
        }
        return res.json();
    },
};
