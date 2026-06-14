import { PerfilAprendizaje } from '../modelos/Modelos.js';
import { ServicioIA, MODELO, type MensajeIA } from './ServicioIA.js';
import { ServicioRecuperacion } from './ServicioRecuperacion.js';

const MAX_RESUMENES = 20;
const MAX_CONCEPTOS = 60;
const MAX_ERRORES = 30;

const PROMPT_DESTILAR_PERFIL = `Analiza esta conversación entre un aprendiz y su tutor de programación. Devuelve SOLO un JSON con esta forma exacta:
{ "concepts": ["conceptos que el aprendiz practicó"],
  "errors": [{ "tag": "etiqueta-corta-kebab", "evidence": "frase breve" }],
  "languages": { "lenguaje": confianza_de_0_a_1 },
  "summary": "2 frases en español, en segunda persona, sobre qué trabajó y dónde flaqueó" }
No incluyas nada fuera del JSON.`;

interface DestiladoPerfil {
    concepts?: string[];
    errors?: { tag: string; evidence?: string }[];
    languages?: Record<string, number>;
    summary?: string;
}

export class ServicioMemoria {
    /** Devuelve el perfil del usuario, creándolo vacío si no existe. */
    static async obtenerPerfil(userId: string): Promise<PerfilAprendizaje> {
        const [perfil] = await PerfilAprendizaje.findOrCreate({
            where: { user_id: userId },
            defaults: { user_id: userId },
        });
        return perfil;
    }

    /**
     * Construye un bloque de contexto en lenguaje natural para anteponer al system prompt.
     * Incluye perfil + apuntes relevantes (RAG) + retos sin completar.
     */
    static async construirContexto(userId: string, ultimoMensaje: string): Promise<string> {
        const [perfil, apuntes, retos] = await Promise.all([
            this.obtenerPerfil(userId),
            ServicioRecuperacion.apuntesRelevantes(userId, ultimoMensaje, 4),
            ServicioRecuperacion.retosFallados(userId, 5),
        ]);

        const partes: string[] = [];

        const langs = Object.entries(perfil.languages ?? {});
        if (langs.length) {
            const fuertes = langs.filter(([, v]) => v >= 0.6).map(([k]) => k);
            const flojos = langs.filter(([, v]) => v < 0.4).map(([k]) => k);
            if (fuertes.length) partes.push(`Lenguajes en los que se maneja: ${fuertes.join(', ')}.`);
            if (flojos.length) partes.push(`Lenguajes en los que flojea: ${flojos.join(', ')}.`);
        }

        if (perfil.recurring_errors?.length) {
            const top = [...perfil.recurring_errors].sort((a, b) => b.count - a.count).slice(0, 4).map(e => e.tag);
            partes.push(`Errores recurrentes detectados: ${top.join(', ')}.`);
        }

        if (perfil.session_summaries?.length) {
            const ultima = perfil.session_summaries[perfil.session_summaries.length - 1];
            partes.push(`Última sesión: ${ultima.text}`);
        }

        if (apuntes.length) {
            const lista = apuntes.map(a => `- "${a.title}" (id ${a.note_id}): ${a.summary}`).join('\n');
            partes.push(`Apuntes propios relacionados (puedes referenciarlos con el formato [[note:ID]] usando el id real):\n${lista}`);
        }

        if (retos.length) {
            partes.push(`Retos que empezó y no completó: ${retos.map(r => r.title).join(', ')}.`);
        }

        if (!partes.length) return '';
        return `## Contexto del aprendiz (úsalo para adaptar nivel y referenciar su material; no lo menciones explícitamente como "contexto")\n${partes.join('\n')}`;
    }

    /**
     * Destila una conversación y fusiona el resultado en el perfil del usuario.
     * Pensado para llamarse al cerrar la sesión (fire-and-forget).
     */
    static async destilarSesion(userId: string, messages: MensajeIA[]): Promise<void> {
        if (!messages?.length) return;

        const destilado = await ServicioIA.json<DestiladoPerfil>({
            modelo: MODELO.rapido,
            system: PROMPT_DESTILAR_PERFIL,
            messages,
            temperature: 0.2,
            maxTokens: 700,
        });

        const perfil = await this.obtenerPerfil(userId);

        // Fusión de lenguajes (media simple con lo previo)
        const languages = { ...(perfil.languages ?? {}) };
        for (const [lang, conf] of Object.entries(destilado.languages ?? {})) {
            const prev = languages[lang];
            languages[lang] = prev != null ? Math.min(1, (prev + Number(conf)) / 2 + 0.05) : Number(conf);
        }

        // Conceptos (set acotado)
        const concepts = Array.from(new Set([...(perfil.concepts_seen ?? []), ...(destilado.concepts ?? [])]))
            .slice(-MAX_CONCEPTOS);

        // Errores recurrentes (incrementa contador por tag)
        const errores = [...(perfil.recurring_errors ?? [])];
        for (const e of destilado.errors ?? []) {
            if (!e?.tag) continue;
            const existente = errores.find(x => x.tag === e.tag);
            if (existente) existente.count += 1;
            else errores.push({ tag: e.tag, count: 1 });
        }
        const recurring_errors = errores.sort((a, b) => b.count - a.count).slice(0, MAX_ERRORES);

        // Resúmenes (cola acotada)
        const session_summaries = [...(perfil.session_summaries ?? [])];
        if (destilado.summary?.trim()) {
            session_summaries.push({ at: new Date().toISOString(), text: destilado.summary.trim() });
        }
        while (session_summaries.length > MAX_RESUMENES) session_summaries.shift();

        await perfil.update({ languages, concepts_seen: concepts, recurring_errors, session_summaries });
    }

    /** Tema sugerido para forjar práctica: el error recurrente más frecuente. */
    static async temaDebil(userId: string): Promise<string | null> {
        const perfil = await this.obtenerPerfil(userId);
        const top = [...(perfil.recurring_errors ?? [])].sort((a, b) => b.count - a.count)[0];
        return top?.tag ?? perfil.concepts_seen?.[perfil.concepts_seen.length - 1] ?? null;
    }
}
