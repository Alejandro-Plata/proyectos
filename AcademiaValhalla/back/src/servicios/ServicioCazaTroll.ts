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

export class ServicioCazaTroll {

    static async iniciar(userId: string, tema = 'lógica de arrays'): Promise<{ hunt_id: string; language: string; buggy_code: string }> {
        let bug: BugGenerado | null = null;

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

        if (!bug) throw new Error('No se pudo preparar la caza. Inténtalo de nuevo.');

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
