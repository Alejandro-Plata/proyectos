import { Router } from 'express';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorReto } from '../controladores/ControladorReto.js';

const router = Router();

/**
 * @openapi
 * /challenges:
 *   get:
 *     tags: [Retos]
 *     summary: Listar todos los retos
 *     security: []
 *     parameters:
 *       - in: query
 *         name: difficulty
 *         schema: { $ref: '#/components/schemas/Dificultad' }
 *       - in: query
 *         name: category
 *         schema: { $ref: '#/components/schemas/Categoria' }
 *       - in: query
 *         name: language
 *         schema: { type: string, example: "javascript" }
 *     responses:
 *       '200':
 *         description: Lista de retos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Reto' }
 */
router.get('/', ControladorReto.obtenerTodos);

/**
 * @openapi
 * /challenges:
 *   post:
 *     tags: [Retos]
 *     summary: Crear un reto nuevo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, difficulty, category, experience_reward]
 *             properties:
 *               title:             { type: string, example: "Palíndromo" }
 *               description:       { type: string }
 *               difficulty:        { $ref: '#/components/schemas/Dificultad' }
 *               category:          { $ref: '#/components/schemas/Categoria' }
 *               experience_reward: { type: integer, example: 100 }
 *               instructions:      { type: string }
 *               examples:          { type: array, items: { type: object } }
 *               hints:             { type: array, items: { type: object } }
 *     responses:
 *       '201':
 *         description: Reto creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reto' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/', autenticar, ControladorReto.crear);

/**
 * @openapi
 * /challenges/execute:
 *   post:
 *     tags: [Retos]
 *     summary: Ejecutar código (usuario autenticado)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [language, code]
 *             properties:
 *               language: { type: string, example: "javascript" }
 *               code:     { type: string, example: "console.log('hola')" }
 *               stdin:    { type: string }
 *     responses:
 *       '200':
 *         description: Resultado de la ejecución
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ResultadoEjecucion' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '504': { description: Timeout de ejecución }
 */
router.post('/execute', autenticar, ControladorReto.ejecutarCodigo);

/**
 * @openapi
 * /challenges/{challengeId}:
 *   get:
 *     tags: [Retos]
 *     summary: Obtener reto por ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: Datos del reto
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reto' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.get('/:challengeId', ControladorReto.obtenerPorId);

/**
 * @openapi
 * /challenges/{challengeId}:
 *   delete:
 *     tags: [Retos]
 *     summary: Eliminar reto
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Reto eliminado }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:challengeId', autenticar, ControladorReto.eliminar);

/**
 * @openapi
 * /challenges/{challengeId}/progress:
 *   post:
 *     tags: [Retos]
 *     summary: Actualizar progreso en un reto
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:        { $ref: '#/components/schemas/EstadoProgreso' }
 *               user_solution: { type: string }
 *     responses:
 *       '200':
 *         description: Progreso actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProgresoReto' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/:challengeId/progress', autenticar, ControladorReto.actualizarProgreso);

/**
 * @openapi
 * /challenges/{challengeId}/progress:
 *   get:
 *     tags: [Retos]
 *     summary: Obtener progreso del usuario en un reto
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: Estado del progreso
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProgresoReto' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/:challengeId/progress', autenticar, ControladorReto.obtenerProgreso);

export default router;
