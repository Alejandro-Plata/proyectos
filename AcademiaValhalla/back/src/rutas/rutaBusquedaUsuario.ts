// src/routes/userSearchRouter.ts
import { Router } from 'express';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorBusquedaUsuario as ControladorBusqueda } from '../controladores/ControladorBusqueda.js';

const router = Router();

/**
 * @openapi
 * /users/search:
 *   get:
 *     tags: [Búsqueda]
 *     summary: Buscar usuarios por nombre
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string, example: "vikingo" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       '200':
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Usuario' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/search', autenticar, ControladorBusqueda.buscar);

/**
 * @openapi
 * /users/suggestions:
 *   get:
 *     tags: [Búsqueda]
 *     summary: Obtener sugerencias de usuarios a seguir
 *     responses:
 *       '200':
 *         description: Lista de sugerencias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Usuario' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/suggestions', autenticar, ControladorBusqueda.sugerencias);

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     tags: [Búsqueda]
 *     summary: Obtener perfil público de un usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: Perfil público del usuario
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.get('/:userId', autenticar, ControladorBusqueda.obtenerPerfilPublico);

export default router;
