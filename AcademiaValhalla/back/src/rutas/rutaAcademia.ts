import { Router } from 'express';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorAcademia } from '../controladores/ControladorAcademia.js';

const router = Router();

/**
 * @openapi
 * /academy:
 *   get:
 *     tags: [Academia]
 *     summary: Listar todos los contenidos publicados
 *     security: []
 *     responses:
 *       '200':
 *         description: Lista de contenidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/ContenidoAcademia' }
 */
router.get('/', ControladorAcademia.obtenerTodos);

/**
 * @openapi
 * /academy/{slug}:
 *   get:
 *     tags: [Academia]
 *     summary: Obtener contenido por slug
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string, example: "intro-typescript" }
 *     responses:
 *       '200':
 *         description: Contenido encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContenidoAcademia' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.get('/:slug', ControladorAcademia.obtenerPorSlug);

/**
 * @openapi
 * /academy:
 *   post:
 *     tags: [Academia]
 *     summary: Crear contenido didáctico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, slug, body, type]
 *             properties:
 *               title:        { type: string, example: "Introducción a TypeScript" }
 *               slug:         { type: string, example: "intro-typescript" }
 *               description:  { type: string }
 *               body:         { type: array, items: { type: object } }
 *               type:         { $ref: '#/components/schemas/TipoContenido' }
 *               is_published: { type: boolean }
 *               order_index:  { type: integer }
 *     responses:
 *       '201':
 *         description: Contenido creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContenidoAcademia' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '409': { $ref: '#/components/responses/Conflict' }
 */
router.post('/', autenticar, ControladorAcademia.crear);

/**
 * @openapi
 * /academy/{contentId}:
 *   patch:
 *     tags: [Academia]
 *     summary: Actualizar contenido didáctico
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:        { type: string }
 *               description:  { type: string }
 *               body:         { type: array, items: { type: object } }
 *               is_published: { type: boolean }
 *               order_index:  { type: integer }
 *     responses:
 *       '200':
 *         description: Contenido actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContenidoAcademia' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.patch('/:contentId', autenticar, ControladorAcademia.actualizar);

/**
 * @openapi
 * /academy/{contentId}:
 *   delete:
 *     tags: [Academia]
 *     summary: Eliminar contenido didáctico
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Contenido eliminado }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:contentId', autenticar, ControladorAcademia.eliminar);

export default router;
