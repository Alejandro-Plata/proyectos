import { Router } from "express";
import { autenticar } from "../middleware/middlewareAuth.js";
import { ControladorNotaUsuario as ControladorNota } from "../controladores/ControladorNota.js";
import { subirImagenNota } from "../config/subidaArchivos.js";

const router = Router();

/**
 * @openapi
 * /notes:
 *   post:
 *     tags: [Notas]
 *     summary: Crear nota personal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, summary, language, content]
 *             properties:
 *               title:    { type: string, example: "Closures en JavaScript" }
 *               summary:  { type: string }
 *               language: { type: string, example: "javascript" }
 *               tags:     { type: array, items: { type: string } }
 *               difficulty: { type: string }
 *               content:
 *                 type: array
 *                 items: { $ref: '#/components/schemas/BloqueContenido' }
 *     responses:
 *       '201':
 *         description: Nota creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Nota' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/', autenticar, ControladorNota.crearNota);

/**
 * @openapi
 * /notes:
 *   get:
 *     tags: [Notas]
 *     summary: Listar todas mis notas
 *     responses:
 *       '200':
 *         description: Lista de notas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Nota' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/', autenticar, ControladorNota.obtenerTodasMisNotas);

/**
 * @openapi
 * /notes/community:
 *   get:
 *     tags: [Notas]
 *     summary: Listar notas aprobadas por la comunidad
 *     responses:
 *       '200':
 *         description: Notas públicas aprobadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Nota' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/community', autenticar, ControladorNota.obtenerNotasComunidad);

router.post('/upload-image', autenticar, subirImagenNota.single('image'), ControladorNota.subirImagen);

/**
 * @openapi
 * /notes/{noteId}:
 *   get:
 *     tags: [Notas]
 *     summary: Obtener nota por ID
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: Nota encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Nota' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.get(`/:noteId`, autenticar, ControladorNota.obtenerNotaPorId);

/**
 * @openapi
 * /notes/{noteId}:
 *   patch:
 *     tags: [Notas]
 *     summary: Actualizar nota
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:            { type: string }
 *               summary:          { type: string }
 *               content:          { type: array, items: { $ref: '#/components/schemas/BloqueContenido' } }
 *               community_status: { type: string, enum: [personal, pending, approved, rejected] }
 *     responses:
 *       '200':
 *         description: Nota actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Nota' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.patch('/:noteId', autenticar, ControladorNota.actualizarNota);

/**
 * @openapi
 * /notes/{noteId}:
 *   delete:
 *     tags: [Notas]
 *     summary: Eliminar nota
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Nota eliminada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.delete('/:noteId', autenticar, ControladorNota.eliminarNota);

export default router;
