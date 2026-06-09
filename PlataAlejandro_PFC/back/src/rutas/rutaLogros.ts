import { Router } from 'express';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorLogros } from '../controladores/ControladorLogros.js';

const achievementRouter = Router();

/**
 * @openapi
 * /achievements:
 *   get:
 *     tags: [Logros]
 *     summary: Obtener mis logros desbloqueados
 *     responses:
 *       '200':
 *         description: Lista de logros del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Logro' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
achievementRouter.get('/', autenticar, ControladorLogros.obtenerLogrosUsuario);

export default achievementRouter;
