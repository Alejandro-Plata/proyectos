import Groq from 'groq-sdk';
import { Request, Response } from 'express';
import { buildSystemPrompt } from '../config/promptSistema.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export class ControladorAsistente {

    static chatear = async (req: Request, res: Response): Promise<void> => {
        try {
            const { messages } = req.body;

            if (!messages || !Array.isArray(messages)) {
                res.status(400).json({ error: 'El historial de mensajes es requerido' });
                return;
            }

            const mensajesFormateados = [
                { role: 'system', content: buildSystemPrompt },
                ...messages.map((m: any) => ({
                    role: m.role,
                    content: m.content
                }))
            ];

            const completacionChat = await groq.chat.completions.create({
                messages: mensajesFormateados,
                model: 'llama-3.1-8b-instant',
                temperature: 0.5,
                max_tokens: 1024,
            });

            const respuesta = completacionChat.choices[0]?.message?.content || '';

            res.status(200).json({ reply: respuesta });

        } catch (error) {
            console.error('Error al comunicarse con Freya:', error);
            res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud' });
        }
    }
}

