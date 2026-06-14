import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/** Selección de modelo según la tarea. */
export const MODELO = {
    rapido: 'llama-3.1-8b-instant',     // tareas rutinarias (resúmenes, perfil)
    potente: 'llama-3.3-70b-versatile', // generación/revisión exigente
} as const;

export interface MensajeIA {
    role: 'user' | 'assistant';
    content: string;
}

interface OpcionesChat {
    system: string;
    messages: MensajeIA[];
    modelo?: string;
    temperature?: number;
    maxTokens?: number;
}

interface OpcionesJSON<T> extends OpcionesChat {
    /** Validador opcional de la forma del JSON devuelto. */
    validar?: (x: any) => x is T;
}

/**
 * Acceso centralizado a Groq. Reutilizable por todas las funciones de IA.
 */
export class ServicioIA {
    /** Respuesta en texto libre (chat). */
    static async chat(o: OpcionesChat): Promise<string> {
        const r = await groq.chat.completions.create({
            model: o.modelo ?? MODELO.rapido,
            temperature: o.temperature ?? 0.5,
            max_tokens: o.maxTokens ?? 1024,
            messages: [{ role: 'system', content: o.system }, ...o.messages],
        });
        return r.choices[0]?.message?.content ?? '';
    }

    /**
     * Respuesta forzada a JSON. Reintenta una vez si el parseo o la validación fallan.
     */
    static async json<T = any>(o: OpcionesJSON<T>): Promise<T> {
        const intentar = async (): Promise<T> => {
            const r = await groq.chat.completions.create({
                model: o.modelo ?? MODELO.potente,
                temperature: o.temperature ?? 0.3,
                max_tokens: o.maxTokens ?? 2048,
                response_format: { type: 'json_object' },
                messages: [{ role: 'system', content: o.system }, ...o.messages],
            });
            const raw = r.choices[0]?.message?.content ?? '{}';
            const parsed = JSON.parse(raw);
            if (o.validar && !o.validar(parsed)) {
                throw new Error('La IA devolvió un JSON con forma inválida');
            }
            return parsed as T;
        };

        try {
            return await intentar();
        } catch {
            // Reintento único
            return await intentar();
        }
    }
}
