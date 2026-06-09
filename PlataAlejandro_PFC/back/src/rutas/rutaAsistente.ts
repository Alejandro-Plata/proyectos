import { Router } from 'express';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorAsistente } from '../controladores/ControladorAsistente.js';

const router = Router();

/**
 * @openapi
 * /assistant/chat:
 *   post:
 *     tags: [Asistente]
 *     summary: Enviar mensaje al asistente IA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:    { type: string, example: "¿Cómo funciona la recursión?" }
 *               context:    { type: string, description: "Código o contexto adicional" }
 *               language:   { type: string, example: "javascript" }
 *     responses:
 *       '200':
 *         description: Respuesta del asistente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply: { type: string }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
router.post('/chat', autenticar, ControladorAsistente.chatear);

export default router;
