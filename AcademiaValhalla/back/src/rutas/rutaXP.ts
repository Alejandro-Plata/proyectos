import { Router } from 'express';
import { ControladorXP } from '../controladores/ControladorXP.js';
import { autenticar } from '../middleware/middlewareAuth.js';

const xpRouter = Router();

/**
 * @openapi
 * /xp/level-info:
 *   get:
 *     tags: [Logros]
 *     summary: Obtener información de nivel y XP del usuario
 *     responses:
 *       '200':
 *         description: Datos de nivel actual
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InfoNivel' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
xpRouter.get('/level-info', autenticar, ControladorXP.obtenerInfoNivel);

/**
 * @openapi
 * /xp/award:
 *   post:
 *     tags: [Logros]
 *     summary: Otorgar XP al usuario autenticado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, reason]
 *             properties:
 *               amount: { type: integer, minimum: 1, example: 50 }
 *               reason: { type: string, example: "challenge_completed" }
 *     responses:
 *       '200':
 *         description: XP otorgado, nivel actualizado si corresponde
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InfoNivel' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
xpRouter.post('/award', autenticar, ControladorXP.otorgarXP);

export default xpRouter;
