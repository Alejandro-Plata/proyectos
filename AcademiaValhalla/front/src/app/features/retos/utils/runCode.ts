import { executeCode } from '../services/challengesService';
import type { ConsoleLog } from '../types/types';

export interface RunCodeParams {
    code: string;
    testCode: string;
    language: string;
    executionTemplate?: string | null;
}

export interface RunCodeResult {
    logs: ConsoleLog[];
    passed: boolean;
}

export const runCode = async ({
    code,
    testCode,
    language,
    executionTemplate,
}: RunCodeParams): Promise<RunCodeResult> => {
    const logs: ConsoleLog[] = [];

    // tokens aleatorios para que el usuario no pueda falsear el resultado con un console.log
    const successToken = `__OK_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}__`;
    const failedToken  = `__FAIL_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}__`;

    const processedTestCode = testCode
        .replace(/SUCCESS_TOKEN/g, successToken)
        .replace(/FAILED_TOKEN/g, failedToken);

    const commentChar = language.toLowerCase() === 'python' ? '#' : '//';
    let fullCode: string;
    if (executionTemplate) {
        fullCode = executionTemplate
            .replace('{{USER_CODE}}', code)
            .replace('{{TEST_CODE}}', processedTestCode);
    } else {
        fullCode = `${code}\n\n${commentChar} --- TESTS ---\n${processedTestCode}`;
    }

    try {
        const result = await executeCode(fullCode, language);

        if (result.timedOut) {
            logs.push({
                type: 'error',
                message: 'Tu código superó el tiempo límite de ejecución. ¿Tienes un bucle infinito?',
            });
            return { logs, passed: false };
        }

        if (result.stderr) {
            const stderrLines = result.stderr.split('\n').slice(0, 10).join('\n');
            logs.push({ type: 'error', message: stderrLines });
        }

        const stdout = result.stdout || '';

        if (stdout.includes(successToken)) {
            const userOutput = stdout.split(successToken)[0].trim();
            if (userOutput) logs.push({ type: 'log', message: userOutput });
            logs.push({ type: 'success', message: '¡Correcto! Todos los tests pasaron.' });
            return { logs, passed: true };
        }

        if (stdout.includes(failedToken)) {
            const after = stdout.split(failedToken)[1] ?? '';
            const failMsg = after.replace(/^:\s*/, '').trim() || 'Un test falló.';
            const userOutput = stdout.split(failedToken)[0].trim();
            if (userOutput) logs.push({ type: 'log', message: userOutput });
            logs.push({ type: 'error', message: `❌ ${failMsg}` });
            return { logs, passed: false };
        }

        if (stdout) logs.push({ type: 'log', message: stdout });

        if (result.exitCode !== 0) {
            logs.push({ type: 'error', message: `El proceso terminó con código de salida ${result.exitCode}.` });
            return { logs, passed: false };
        }

        if (!result.stderr) {
            logs.push({
                type: 'log',
                message: 'El código se ejecutó sin errores, pero los tests no emitieron resultado.',
            });
        }
        return { logs, passed: false };

    } catch (err) {
        logs.push({
            type: 'error',
            message: err instanceof Error ? err.message : 'Error desconocido al ejecutar el código.',
        });
        return { logs, passed: false };
    }
};
