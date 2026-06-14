import { Request, Response } from 'express';
import { buildSystemPrompt } from '../config/promptSistema.js';
import { ServicioIA, MODELO } from '../servicios/ServicioIA.js';
import { ServicioMemoria } from '../servicios/ServicioMemoria.js';
import { PerfilAprendizaje } from '../modelos/Modelos.js';

const CONVENCION_REF = `\n\nSi referencias un apunte del aprendiz incluido en su contexto, enlázalo con el formato [[note:ID]] usando el id real del apunte.`;

const PROMPT_REVISION = `Eres un revisor de código socrático. NO reescribas el código del usuario ni le des la solución.
Para cada problema que detectes, formula una observación que GUÍE al autor a descubrirlo por sí mismo.
Severidades permitidas: "bug" | "estilo" | "rendimiento" | "seguridad".
Devuelve SOLO un JSON con esta forma:
{ "findings": [ { "line": <número de línea 1-based>, "severity": "bug|estilo|rendimiento|seguridad",
  "hint": "pregunta o pista breve en español, sin dar la respuesta",
  "concept": "concepto a repasar (1-3 palabras)" } ] }
Si el código no tiene problemas relevantes, devuelve { "findings": [] }.`;

const PROMPT_DESTILAR_APUNTE = `Convierte esta conversación en un apunte de estudio en español. Devuelve SOLO un JSON:
{ "title": "título breve",
  "summary": "1-2 frases de resumen",
  "language": "javascript|java|python|typescript|csharp|go|general",
  "tags": ["..."],
  "difficulty": "Básico|Intermedio|Avanzado",
  "content": [ bloques ] }
Cada bloque del array "content" debe ser uno de estos objetos:
  { "type": "text", "value": "explicación en markdown" }
  { "type": "code", "value": "código", "language": "js", "title": "opcional" }
  { "type": "definition", "title": "término", "value": "definición" }
Incluye al final un bloque "text" titulado "Errores que cometí" si los hubo en la conversación.
No inventes contenido que no aparezca en la conversación. No incluyas nada fuera del JSON.`;

export class ControladorAsistente {

    static chatear = async (req: Request, res: Response): Promise<void> => {
        try {
            const { messages } = req.body;
            const userId = req.user!.user_id;

            if (!messages || !Array.isArray(messages)) {
                res.status(400).json({ error: 'El historial de mensajes es requerido' });
                return;
            }

            const ultimoUsuario = [...messages].reverse().find((m: any) => m.role === 'user')?.content ?? '';
            let contexto = '';
            try {
                contexto = await ServicioMemoria.construirContexto(userId, ultimoUsuario);
            } catch (e) {
                console.error('[chatear] contexto memoria falló (se continúa sin él):', (e as any)?.message);
            }

            const system = buildSystemPrompt + (contexto ? `\n\n${contexto}` : '') + CONVENCION_REF;

            const respuesta = await ServicioIA.chat({
                system,
                messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
                modelo: MODELO.rapido,
                temperature: 0.5,
                maxTokens: 1024,
            });

            res.status(200).json({ reply: respuesta });
        } catch (error) {
            console.error('Error al comunicarse con Freya:', error);
            res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud' });
        }
    };

    // ── A1 · Perfil de aprendizaje ─────────────────────────────

    static obtenerPerfil = async (req: Request, res: Response): Promise<void> => {
        try {
            const perfil = await ServicioMemoria.obtenerPerfil(req.user!.user_id);
            res.json(perfil);
        } catch (error) {
            console.error('[obtenerPerfil]', error);
            res.status(500).json({ error: 'Error al obtener el perfil' });
        }
    };

    static borrarPerfil = async (req: Request, res: Response): Promise<void> => {
        try {
            await PerfilAprendizaje.destroy({ where: { user_id: req.user!.user_id } });
            res.json({ msg: 'Memoria borrada' });
        } catch (error) {
            console.error('[borrarPerfil]', error);
            res.status(500).json({ error: 'Error al borrar el perfil' });
        }
    };

    static actualizarPerfil = async (req: Request, res: Response): Promise<void> => {
        try {
            const perfil = await ServicioMemoria.obtenerPerfil(req.user!.user_id);
            const { languages, concepts_seen, recurring_errors } = req.body;
            const updates: Record<string, any> = {};
            if (languages !== undefined) updates.languages = languages;
            if (concepts_seen !== undefined) updates.concepts_seen = concepts_seen;
            if (recurring_errors !== undefined) updates.recurring_errors = recurring_errors;
            await perfil.update(updates);
            res.json(perfil);
        } catch (error) {
            console.error('[actualizarPerfil]', error);
            res.status(500).json({ error: 'Error al actualizar el perfil' });
        }
    };

    static destilarSesion = async (req: Request, res: Response): Promise<void> => {
        // Responde rápido y procesa en segundo plano
        res.status(202).json({ msg: 'Procesando' });
        try {
            const { messages } = req.body;
            if (Array.isArray(messages) && messages.length) {
                await ServicioMemoria.destilarSesion(req.user!.user_id, messages);
            }
        } catch (error) {
            console.error('[destilarSesion]', (error as any)?.message ?? error);
        }
    };

    // ── A3 · Revisión socrática ────────────────────────────────

    static revisarCodigo = async (req: Request, res: Response): Promise<void> => {
        try {
            const { code, language } = req.body;
            if (typeof code !== 'string' || !code.trim()) {
                res.status(400).json({ error: 'Se requiere el campo "code"' });
                return;
            }
            if (code.length > 20_000) {
                res.status(400).json({ error: 'El código es demasiado largo (máx 20.000 caracteres)' });
                return;
            }

            const review = await ServicioIA.json<{ findings: any[] }>({
                modelo: MODELO.potente,
                system: PROMPT_REVISION,
                messages: [{ role: 'user', content: `Lenguaje: ${language ?? 'desconocido'}\n\`\`\`\n${code}\n\`\`\`` }],
                validar: (x): x is { findings: any[] } => Array.isArray(x?.findings),
                maxTokens: 1500,
            });

            res.json({ findings: review.findings ?? [] });
        } catch (error) {
            console.error('[revisarCodigo]', error);
            res.status(500).json({ error: 'Error al revisar el código' });
        }
    };

    // ── A5 · Destilador de apuntes ─────────────────────────────

    static destilarApunte = async (req: Request, res: Response): Promise<void> => {
        try {
            const { messages } = req.body;
            if (!Array.isArray(messages) || messages.length < 2) {
                res.status(400).json({ error: 'Conversación insuficiente para destilar un apunte' });
                return;
            }

            const nota = await ServicioIA.json<any>({
                modelo: MODELO.potente,
                system: PROMPT_DESTILAR_APUNTE,
                messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
                validar: (x): x is any => x && typeof x.title === 'string' && Array.isArray(x.content),
                maxTokens: 2200,
            });

            res.json(nota);
        } catch (error) {
            console.error('[destilarApunte]', error);
            res.status(500).json({ error: 'Error al destilar el apunte' });
        }
    };
}
