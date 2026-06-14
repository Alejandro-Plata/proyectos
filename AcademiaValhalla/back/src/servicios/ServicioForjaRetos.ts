import { Op } from 'sequelize';
import { Reto, LenguajeReto, LenguajeProgramacion } from '../modelos/Modelos.js';
import { Dificultad, Categoria } from '../types/types.js';
import { ServicioIA, MODELO } from './ServicioIA.js';
import { executeCode } from './ServicioCodeArena.js';
import { CODE_ARENA_LANGUAGES } from '../utils/codeArenaLanguages.js';

export interface CasoTest { stdin: string; expected_stdout: string; hidden?: boolean }

interface RetoGenerado {
    title: string;
    language: string;
    difficulty: string;
    instructions: string;
    starter_code: string;
    reference_solution: string;
    test_cases: CasoTest[];
}

const PROMPT_FORJA = `Eres un diseñador de ejercicios de programación. Crea UN reto autocontenido sobre el tema indicado.
El programa debe LEER de la entrada estándar (STDIN) y ESCRIBIR el resultado en la salida estándar (STDOUT), para poder testearlo por entrada/salida.
Devuelve SOLO un JSON con esta forma exacta:
{ "title": "título corto",
  "language": "javascript|python|java|typescript|csharp|go|cpp|c",
  "difficulty": "Básico|Intermedio|Avanzado",
  "instructions": "enunciado claro en español, indicando el formato exacto de entrada y salida",
  "starter_code": "plantilla con TODOs, SIN resolver",
  "reference_solution": "solución COMPLETA y correcta que lee de STDIN y escribe en STDOUT",
  "test_cases": [ { "stdin": "...", "expected_stdout": "..." } ] }
Incluye entre 3 y 5 casos de prueba, con al menos un caso límite. La reference_solution debe pasar todos los test_cases. No incluyas nada fuera del JSON.`;

const MAPA_DIFICULTAD: Record<string, Dificultad> = {
    'basico': Dificultad.FACIL, 'básico': Dificultad.FACIL,
    'intermedio': Dificultad.MEDIO,
    'avanzado': Dificultad.DIFICIL,
    'experto': Dificultad.EXPERTO,
};
const XP_POR_DIFICULTAD: Record<Dificultad, number> = {
    [Dificultad.FACIL]: 15, [Dificultad.MEDIO]: 30, [Dificultad.DIFICIL]: 50, [Dificultad.EXPERTO]: 80,
};

const normalizar = (s: string) => (s ?? '').replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trim();

export class ServicioForjaRetos {

    /** Genera, valida con Judge0 y persiste un reto a medida del usuario. */
    static async forjar(userId: string, tema: string): Promise<Reto> {
        let generado: RetoGenerado | null = null;

        // Hasta 2 intentos: si la solución de referencia no pasa sus propios tests, se reintenta.
        for (let intento = 0; intento < 2 && !generado; intento++) {
            const candidato = await ServicioIA.json<RetoGenerado>({
                modelo: MODELO.potente,
                system: PROMPT_FORJA,
                messages: [{ role: 'user', content: `Tema: ${tema}` }],
                validar: (x): x is RetoGenerado =>
                    x && typeof x.title === 'string' && typeof x.reference_solution === 'string' && Array.isArray(x.test_cases),
                temperature: 0.6,
                maxTokens: 2500,
            });

            const slug = (candidato.language ?? '').toLowerCase();
            if (!CODE_ARENA_LANGUAGES[slug]) continue; // lenguaje no ejecutable → descartar

            if (await this.validar(slug, candidato.reference_solution, candidato.test_cases)) {
                generado = candidato;
            }
        }

        if (!generado) {
            throw new Error('No se pudo forjar un reto válido. Inténtalo de nuevo.');
        }

        const dificultad = MAPA_DIFICULTAD[(generado.difficulty ?? '').toLowerCase()] ?? Dificultad.MEDIO;
        const slug = generado.language.toLowerCase();

        const reto = await Reto.create({
            title: generado.title,
            description: generado.instructions,
            difficulty: dificultad,
            category: Categoria.ALGORITMOS,
            experience_reward: XP_POR_DIFICULTAD[dificultad],
            instructions: generado.instructions,
            example_output: generado.test_cases[0]?.expected_stdout ?? null,
            created_by: userId,
            generated_by_ai: true,
            generated_for: userId,
            // Los casos ocultos no se revelan al usuario; aquí marcamos los > primero como ocultos
            test_cases: generado.test_cases.map((c, i) => ({ ...c, hidden: i >= 2 })),
        });

        // Variante de lenguaje (find-or-create del lenguaje para garantizar editor)
        const [lenguaje] = await LenguajeProgramacion.findOrCreate({
            where: { name: { [Op.iLike]: slug } },
            defaults: { name: slug, monaco_language_id: slug },
        });
        await LenguajeReto.create({
            challenge_id: reto.challenge_id,
            language_id: lenguaje.language_id,
            initial_code: generado.starter_code,
            solution_code: generado.reference_solution,
            validation_code: '',
        });

        return reto;
    }

    /** Ejecuta una solución contra una batería de casos y devuelve si todos pasan. */
    static async validar(slug: string, code: string, casos: CasoTest[]): Promise<boolean> {
        for (const caso of casos) {
            try {
                const r = await executeCode(slug, code, { stdin: caso.stdin, cpuTimeLimit: 5, wallTimeLimit: 15 });
                if (r.timedOut || r.compileError) return false;
                if (normalizar(r.stdout) !== normalizar(caso.expected_stdout)) return false;
            } catch {
                return false;
            }
        }
        return true;
    }

    /** Verifica el código del usuario contra los test_cases de un reto. */
    static async verificarSolucion(reto: Reto, slug: string, code: string): Promise<{ passed: boolean; results: any[] }> {
        const casos = (reto.test_cases ?? []) as CasoTest[];
        const results: any[] = [];
        let passed = true;
        for (const caso of casos) {
            let ok = false;
            let salida = '';
            try {
                const r = await executeCode(slug, code, { stdin: caso.stdin, cpuTimeLimit: 5, wallTimeLimit: 15 });
                salida = r.stdout;
                ok = !r.timedOut && !r.compileError && normalizar(r.stdout) === normalizar(caso.expected_stdout);
            } catch { ok = false; }
            if (!ok) passed = false;
            results.push({
                hidden: !!caso.hidden,
                passed: ok,
                stdin: caso.hidden ? undefined : caso.stdin,
                expected: caso.hidden ? undefined : caso.expected_stdout,
                got: caso.hidden ? undefined : salida,
            });
        }
        return { passed, results };
    }
}
