import { CazaTroll } from '../modelos/Modelos.js';
import { ServicioIA, MODELO } from './ServicioIA.js';
import { executeCode } from './ServicioCodeArena.js';
import { CODE_ARENA_LANGUAGES } from '../utils/codeArenaLanguages.js';
import { ServicioXP } from './ServicioXP.js';
import { ServicioLogros } from './ServicioLogros.js';
import { ServicioTorneos } from './ServicioTorneos.js';

const PROMPT_BUG = `Genera un pequeño programa CORRECTO sobre el tema indicado y una variante con UN ÚNICO bug sutil y realista.
El programa debe ser autocontenido y no requerir entrada del usuario (puede imprimir un resultado fijo en consola).
El bug debe ser del tipo: off-by-one, condición invertida, mutación de estado, índice incorrecto, operador equivocado, etc.
NO añadas comentarios que delaten el fallo. Mantén el mismo formato/indentación entre ambas versiones.
Devuelve SOLO un JSON:
{ "language": "javascript|python|java|typescript|go|cpp|c",
  "original_code": "versión correcta",
  "buggy_code": "versión con el bug",
  "bug_line": <número de línea 1-based del bug en buggy_code>,
  "bug_explanation": "explicación breve del fallo en español" }`;

interface BugGenerado {
    language: string;
    original_code: string;
    buggy_code: string;
    bug_line: number;
    bug_explanation: string;
}

const XP_CAZA = 35;

/**
 * Banco de respaldo de bichillos curados manualmente. Se usa cuando la IA (Groq)
 * o Judge0 no están disponibles, de modo que la caza nunca falle con un 502.
 * Cada bug está verificado a mano: el `bug_line` apunta al fallo real.
 */
export const BANCO_BICHILLOS: BugGenerado[] = [
    {
        language: 'javascript',
        original_code: `function suma(numeros) {\n  let total = 0;\n  for (let i = 0; i < numeros.length; i++) {\n    total += numeros[i];\n  }\n  return total;\n}\nconsole.log(suma([1, 2, 3, 4]));`,
        buggy_code: `function suma(numeros) {\n  let total = 0;\n  for (let i = 0; i <= numeros.length; i++) {\n    total += numeros[i];\n  }\n  return total;\n}\nconsole.log(suma([1, 2, 3, 4]));`,
        bug_line: 3,
        bug_explanation: 'Error off-by-one: la condición usa "<=" en lugar de "<", lo que accede a numeros[length] (undefined) y produce NaN.',
    },
    {
        language: 'python',
        original_code: `def es_par(n):\n    return n % 2 == 0\n\nnumeros = [1, 2, 3, 4, 5, 6]\npares = [x for x in numeros if es_par(x)]\nprint(pares)`,
        buggy_code: `def es_par(n):\n    return n % 2 == 1\n\nnumeros = [1, 2, 3, 4, 5, 6]\npares = [x for x in numeros if es_par(x)]\nprint(pares)`,
        bug_line: 2,
        bug_explanation: 'Condición invertida: "n % 2 == 1" detecta impares, no pares. Debería comparar con 0.',
    },
    {
        language: 'javascript',
        original_code: `function maximo(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}\nconsole.log(maximo([3, 7, 2, 9, 4]));`,
        buggy_code: `function maximo(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] < max) max = arr[i];\n  }\n  return max;\n}\nconsole.log(maximo([3, 7, 2, 9, 4]));`,
        bug_line: 4,
        bug_explanation: 'Operador equivocado: usa "<" en vez de ">", por lo que calcula el mínimo en lugar del máximo.',
    },
    {
        language: 'python',
        original_code: `def factorial(n):\n    resultado = 1\n    for i in range(1, n + 1):\n        resultado *= i\n    return resultado\n\nprint(factorial(5))`,
        buggy_code: `def factorial(n):\n    resultado = 1\n    for i in range(1, n):\n        resultado *= i\n    return resultado\n\nprint(factorial(5))`,
        bug_line: 3,
        bug_explanation: 'Rango incorrecto: range(1, n) excluye n, así que factorial(5) calcula 4! = 24 en lugar de 120.',
    },
    {
        language: 'javascript',
        original_code: `function invertir(texto) {\n  let resultado = '';\n  for (let i = texto.length - 1; i >= 0; i--) {\n    resultado += texto[i];\n  }\n  return resultado;\n}\nconsole.log(invertir('hola'));`,
        buggy_code: `function invertir(texto) {\n  let resultado = '';\n  for (let i = texto.length - 1; i > 0; i--) {\n    resultado += texto[i];\n  }\n  return resultado;\n}\nconsole.log(invertir('hola'));`,
        bug_line: 3,
        bug_explanation: 'Off-by-one: la condición "i > 0" omite el índice 0, perdiendo la primera letra del texto.',
    },
    {
        language: 'python',
        original_code: `def contar_vocales(texto):\n    vocales = 'aeiou'\n    contador = 0\n    for c in texto.lower():\n        if c in vocales:\n            contador += 1\n    return contador\n\nprint(contar_vocales('Murcielago'))`,
        buggy_code: `def contar_vocales(texto):\n    vocales = 'aeiou'\n    contador = 0\n    for c in texto:\n        if c in vocales:\n            contador += 1\n    return contador\n\nprint(contar_vocales('Murcielago'))`,
        bug_line: 4,
        bug_explanation: 'Falta normalizar a minúsculas: al iterar sobre "texto" sin .lower(), no cuenta vocales mayúsculas.',
    },
];

export class ServicioCazaTroll {

    static elegirFallback(tema?: string): BugGenerado {
        // Si el tema sugiere un lenguaje, prioriza ese subconjunto del banco
        const t = (tema ?? '').toLowerCase();
        const lang = ['python', 'javascript', 'typescript', 'java'].find(l => t.includes(l));
        const candidatos = lang ? BANCO_BICHILLOS.filter(b => b.language === lang) : BANCO_BICHILLOS;
        const pool = candidatos.length ? candidatos : BANCO_BICHILLOS;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    static async iniciar(userId: string, tema = 'lógica de arrays'): Promise<{ hunt_id: string; language: string; buggy_code: string }> {
        let bug: BugGenerado | null = null;

        // Intenta generar un bug con IA (Groq) + verificación con Judge0.
        // Si algo falla (sin API key, rate limit, Judge0 caído...), recurre al banco local.
        try {
            for (let intento = 0; intento < 2 && !bug; intento++) {
                const candidato = await ServicioIA.json<BugGenerado>({
                    modelo: MODELO.potente,
                    system: PROMPT_BUG,
                    messages: [{ role: 'user', content: `Tema: ${tema}` }],
                    validar: (x): x is BugGenerado =>
                        x && typeof x.buggy_code === 'string' && typeof x.original_code === 'string' && Number.isFinite(x.bug_line),
                    temperature: 0.7,
                    maxTokens: 1800,
                });

                const slug = (candidato.language ?? '').toLowerCase();
                if (!CODE_ARENA_LANGUAGES[slug]) continue;

                if (await this.bugEsRealista(slug, candidato.original_code, candidato.buggy_code)) {
                    bug = candidato;
                }
            }
        } catch (e) {
            console.error('[caza.iniciar] IA/Judge0 no disponible, usando banco local:', (e as any)?.message ?? e);
        }

        // Respaldo garantizado: nunca devolvemos 502 por culpa de servicios externos.
        if (!bug) bug = this.elegirFallback(tema);

        const hunt = await CazaTroll.create({
            user_id: userId,
            language: bug.language.toLowerCase(),
            original_code: bug.original_code,
            buggy_code: bug.buggy_code,
            bug_line: bug.bug_line,
            bug_explanation: bug.bug_explanation,
        });

        // No se revela bug_line ni la explicación
        return { hunt_id: hunt.hunt_id, language: hunt.language, buggy_code: hunt.buggy_code };
    }

    /** El bug es válido si la versión correcta y la buggy difieren al ejecutarse. */
    private static async bugEsRealista(slug: string, original: string, buggy: string): Promise<boolean> {
        try {
            const [ro, rb] = await Promise.all([
                executeCode(slug, original, { cpuTimeLimit: 5, wallTimeLimit: 15 }),
                executeCode(slug, buggy, { cpuTimeLimit: 5, wallTimeLimit: 15 }),
            ]);
            if (ro.compileError) return false; // el "correcto" debe compilar
            const distinto = ro.stdout.trim() !== rb.stdout.trim()
                || ro.exitCode !== rb.exitCode
                || (!!rb.stderr && !ro.stderr);
            return distinto;
        } catch {
            return false;
        }
    }

    /** Pista tipo "frío/caliente" comparando la línea sospechada con la real. */
    static async pista(huntId: string, userId: string, lineGuess: number): Promise<{ temperatura: string }> {
        const hunt = await CazaTroll.findOne({ where: { hunt_id: huntId, user_id: userId } });
        if (!hunt) throw new Error('Caza no encontrada');
        const dist = Math.abs(lineGuess - hunt.bug_line);
        const temperatura = dist === 0 ? 'ardiendo' : dist <= 1 ? 'caliente' : dist <= 3 ? 'templado' : 'frío';
        return { temperatura };
    }

    static async resolver(huntId: string, userId: string, lineGuess: number, explanation: string) {
        const hunt = await CazaTroll.findOne({ where: { hunt_id: huntId, user_id: userId } });
        if (!hunt) throw new Error('Caza no encontrada');

        const acierto = lineGuess === hunt.bug_line && (explanation?.trim().length ?? 0) >= 10;

        let recompensaXP = null;
        let logros: any[] = [];

        if (acierto && !hunt.solved) {
            await hunt.update({ solved: true });
            recompensaXP = await ServicioXP.otorgarXP(userId, XP_CAZA);
            const cazas = await CazaTroll.count({ where: { user_id: userId, solved: true } });
            logros = await ServicioLogros.verificarYDesbloquear(userId, 'troll_hunt_count', cazas);
            await ServicioTorneos.registrarResolucionTroll(userId);
        }

        return {
            correcto: acierto,
            bug_line: hunt.bug_line,
            bug_explanation: hunt.bug_explanation,
            xpReward: recompensaXP,
            unlockedAchievements: logros,
        };
    }
}
