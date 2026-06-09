import { Router } from 'express';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorPublicacion } from '../controladores/ControladorPublicacion.js';
import { subirImagenPost } from '../config/subidaArchivos.js';

const router = Router();

/**
 * @openapi
 * /posts:
 *   get:
 *     tags: [Publicaciones]
 *     summary: Listar publicaciones del foro
 *     security: []
 *     parameters:
 *       - in: query
 *         name: post_type
 *         schema: { $ref: '#/components/schemas/TipoPublicacion' }
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       '200':
 *         description: Lista de publicaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Publicacion' }
 */
router.get('/', ControladorPublicacion.obtenerTodos);

/**
 * @openapi
 * /posts/{postId}:
 *   get:
 *     tags: [Publicaciones]
 *     summary: Obtener publicación por ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: Datos de la publicación
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Publicacion' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.get('/:postId', autenticar, ControladorPublicacion.obtenerPorId);

/**
 * @openapi
 * /posts:
 *   post:
 *     tags: [Publicaciones]
 *     summary: Crear publicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, post_type]
 *             properties:
 *               title:     { type: string, example: "¿Cómo optimizar queries?" }
 *               content:   { type: array, items: { type: object } }
 *               post_type: { $ref: '#/components/schemas/TipoPublicacion' }
 *               tags:      { type: array, items: { type: string } }
 *     responses:
 *       '201':
 *         description: Publicación creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Publicacion' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/', autenticar, ControladorPublicacion.crear);

/**
 * @openapi
 * /posts/{postId}:
 *   patch:
 *     tags: [Publicaciones]
 *     summary: Editar publicación propia
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:   { type: string }
 *               content: { type: array, items: { type: object } }
 *     responses:
 *       '200':
 *         description: Publicación actualizada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Publicacion' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.patch('/:postId', autenticar, ControladorPublicacion.actualizar);

/**
 * @openapi
 * /posts/{postId}:
 *   delete:
 *     tags: [Publicaciones]
 *     summary: Eliminar publicación
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Publicación eliminada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.delete('/:postId', autenticar, ControladorPublicacion.eliminar);

/**
 * @openapi
 * /posts/{postId}/comments:
 *   post:
 *     tags: [Publicaciones]
 *     summary: Añadir comentario a una publicación
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:                { type: string }
 *               parent_user_comment_id: { type: string, format: uuid }
 *     responses:
 *       '201':
 *         description: Comentario creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Comentario' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/:postId/comments', autenticar, ControladorPublicacion.crearComentario);

/**
 * @openapi
 * /posts/{postId}/comments/{commentId}:
 *   delete:
 *     tags: [Publicaciones]
 *     summary: Eliminar comentario
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Comentario eliminado }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.delete('/:postId/comments/:commentId', autenticar, ControladorPublicacion.eliminarComentario);

/**
 * @openapi
 * /posts/{postId}/comments/{commentId}/solution:
 *   post:
 *     tags: [Publicaciones]
 *     summary: Marcar comentario como solución
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Comentario marcado como solución }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/:postId/comments/:commentId/solution', autenticar, ControladorPublicacion.marcarComoSolucion);

/**
 * @openapi
 * /posts/{postId}/comments/{commentId}/vote:
 *   post:
 *     tags: [Publicaciones]
 *     summary: Votar un comentario
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [value]
 *             properties:
 *               value: { type: integer, enum: [1, -1], example: 1 }
 *     responses:
 *       '200': { description: Voto registrado }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/:postId/comments/:commentId/vote', autenticar, ControladorPublicacion.votarComentario);

/**
 * @openapi
 * /posts/{postId}/vote:
 *   post:
 *     tags: [Publicaciones]
 *     summary: Votar una publicación
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [value]
 *             properties:
 *               value: { type: integer, enum: [1, -1], example: 1 }
 *     responses:
 *       '200': { description: Voto registrado }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/:postId/vote', autenticar, ControladorPublicacion.votar);

/**
 * @openapi
 * /posts/{postId}/report:
 *   post:
 *     tags: [Publicaciones]
 *     summary: Reportar una publicación
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason: { type: string, example: "Contenido inapropiado" }
 *     responses:
 *       '200': { description: Reporte enviado }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/:postId/report', autenticar, ControladorPublicacion.reportarPublicacion);

router.post('/upload-image', autenticar, subirImagenPost.single('image'), ControladorPublicacion.subirImagen);

export default router;
