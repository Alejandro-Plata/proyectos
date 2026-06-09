import { CODE_ARENA_LANGUAGES, resolveCodeArenaLanguage } from '../utils/codeArenaLanguages.js';

const BASE_URL    = process.env.JUDGE0_URL            ?? 'https://judge029.p.rapidapi.com';
const AUTH_TOKEN  = process.env.JUDGE0_AUTH_TOKEN     ?? null;
const AUTH_HEADER = process.env.JUDGE0_AUTH_HEADER    ?? 'X-RapidAPI-Key';
const WAIT_MODE   = process.env.JUDGE0_WAIT_SUPPORTED !== 'false';

const TIMEOUT_MS   = 50_000;
const POLL_INTERVAL = 800;
const POLL_ATTEMPTS = 25;

export interface CodeArenaExecuteOptions {
    stdin?:         string;
    cpuTimeLimit?:  number;
    wallTimeLimit?: number;
    memoryLimitKb?: number;
}

export interface CodeArenaResult {
    stdout:       string;
    stderr:       string;
    exitCode:     number;
    signal:       string | null;
    timedOut:     boolean;
    compileError: boolean;
}

const STATUS = {
    IN_QUEUE:            1,
    PROCESSING:          2,
    ACCEPTED:            3,
    TIME_LIMIT_EXCEEDED: 5,
    COMPILATION_ERROR:   6,
    INTERNAL_ERROR:      13,
} as const;

const toB64   = (s: string)                   => Buffer.from(s, 'utf8').toString('base64');
const fromB64 = (s: string | null | undefined) => s ? Buffer.from(s, 'base64').toString('utf8') : '';
const sleep   = (ms: number)                   => new Promise(r => setTimeout(r, ms));

function buildHeaders(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (AUTH_TOKEN) {
        h[AUTH_HEADER] = AUTH_TOKEN;
        const host = BASE_URL.match(/^https?:\/\/([^/]+\.p\.rapidapi\.com)/)?.[1];
        if (host) h['X-RapidAPI-Host'] = host;
    }
    return h;
}

async function request(url: string, init: RequestInit = {}): Promise<Response> {
    return fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
}

export async function executeCode(
    languageSlug: string,
    sourceCode: string,
    opts: CodeArenaExecuteOptions = {},
): Promise<CodeArenaResult> {
    const lang = resolveCodeArenaLanguage(languageSlug);
    if (!lang) {
        throw new Error(
            `Lenguaje "${languageSlug}" no soportado. Disponibles: ${Object.keys(CODE_ARENA_LANGUAGES).join(', ')}`,
        );
    }

    const headers = buildHeaders();
    const body = JSON.stringify({
        source_code:               toB64(sourceCode),
        language_id:               lang.id,
        stdin:                     opts.stdin ? toB64(opts.stdin) : undefined,
        cpu_time_limit:            opts.cpuTimeLimit  ?? 5,
        wall_time_limit:           opts.wallTimeLimit ?? 10,
        memory_limit:              opts.memoryLimitKb ?? 128_000,
        redirect_stderr_to_stdout: false,
    });

    if (WAIT_MODE) {
        const res = await request(`${BASE_URL}/submissions?base64_encoded=true&wait=true`, { method: 'POST', headers, body });
        if (res.status !== 422) {
            if (!res.ok) throw new Error(`Judge0 HTTP ${res.status}: ${await res.text().catch(() => '')}`);
            return normalize(await res.json());
        }
    }

    const createRes = await request(`${BASE_URL}/submissions?base64_encoded=true&wait=false`, { method: 'POST', headers, body });
    if (!createRes.ok) {
        throw new Error(`Judge0 HTTP ${createRes.status}: ${await createRes.text().catch(() => '')}`);
    }
    const { token } = (await createRes.json()) as { token: string };

    for (let i = 0; i < POLL_ATTEMPTS; i++) {
        await sleep(POLL_INTERVAL);
        const res = await request(`${BASE_URL}/submissions/${token}?base64_encoded=true`, { headers });
        if (!res.ok) continue;
        const data = await res.json();
        const sid = data?.status?.id;
        if (sid !== STATUS.IN_QUEUE && sid !== STATUS.PROCESSING) return normalize(data);
    }

    return {
        stdout: '', stderr: 'La ejecución superó el tiempo máximo permitido.',
        exitCode: 1, signal: 'TIMEOUT', timedOut: true, compileError: false,
    };
}

function normalize(s: any): CodeArenaResult {
    const stdout     = fromB64(s.stdout);
    const stderr     = fromB64(s.stderr);
    const compileOut = fromB64(s.compile_output);
    const message    = fromB64(s.message);
    const sid        = s?.status?.id ?? STATUS.INTERNAL_ERROR;
    const timedOut   = sid === STATUS.TIME_LIMIT_EXCEEDED;
    const compileErr = sid === STATUS.COMPILATION_ERROR;
    const exitCode   = typeof s.exit_code === 'number' ? s.exit_code : (sid === STATUS.ACCEPTED ? 0 : 1);

    return {
        stdout,
        stderr:       compileErr ? (compileOut || stderr || message || 'Error de compilación') : (stderr || message || ''),
        exitCode,
        signal:       timedOut ? 'SIGKILL' : (s.signal ?? null),
        timedOut,
        compileError: compileErr,
    };
}
