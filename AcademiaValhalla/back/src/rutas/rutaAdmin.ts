import { Router } from 'express';
import { autenticar, autorizar } from '../middleware/middlewareAuth.js';
import { ControladorAdmin } from '../controladores/ControladorAdmin.js';
import { ControladorNotaUsuario } from '../controladores/ControladorNota.js';
import { subirEscudo } from '../config/subidaArchivos.js';

const router = Router();

const adminOnly = [autenticar, autorizar('ADMIN')];
const modOrAdmin = [autenticar, autorizar('ADMIN', 'MODERADOR')];

/**
 * @openapi
 * /admin/content-requests:
 *   post:
 *     tags: [Admin]
 *     summary: Proponer nuevo contenido (cualquier usuario autenticado)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, type]
 *             properties:
 *               title:       { type: string }
 *               description: { type: string }
 *               type:        { $ref: '#/components/schemas/TipoContenido' }
 *     responses:
 *       '201': { description: Solicitud enviada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/content-requests', autenticar, ControladorAdmin.crearSolicitudContenido);

/**
 * @openapi
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Estadísticas globales de la plataforma (ADMIN)
 *     responses:
 *       '200':
 *         description: Métricas de uso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_users:      { type: integer }
 *                 total_challenges: { type: integer }
 *                 total_posts:      { type: integer }
 *                 total_notes:      { type: integer }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.get('/stats', ...adminOnly, ControladorAdmin.obtenerEstadisticas);

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Listar usuarios (ADMIN / MODERADOR)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Usuario' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.get('/users', ...modOrAdmin, ControladorAdmin.obtenerUsuarios);

/**
 * @openapi
 * /admin/users/{userId}:
 *   patch:
 *     tags: [Admin]
 *     summary: Actualizar usuario — banear, cambiar rol (ADMIN / MODERADOR)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_banned: { type: boolean }
 *               role:      { type: string, enum: [USER, MODERADOR, ADMIN] }
 *     responses:
 *       '200':
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.patch('/users/:userId', ...modOrAdmin, ControladorAdmin.actualizarUsuario);

/**
 * @openapi
 * /admin/users/{userId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Eliminar usuario (ADMIN)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Usuario eliminado }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.delete('/users/:userId', ...adminOnly, ControladorAdmin.eliminarUsuario);

/**
 * @openapi
 * /admin/challenges:
 *   get:
 *     tags: [Admin]
 *     summary: Listar todos los retos (ADMIN)
 *     responses:
 *       '200':
 *         description: Lista de retos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Reto' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.get('/challenges', ...adminOnly, ControladorAdmin.obtenerRetos);

/**
 * @openapi
 * /admin/challenges/{challengeId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Eliminar reto (ADMIN)
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Reto eliminado }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.delete('/challenges/:challengeId', ...adminOnly, ControladorAdmin.eliminarReto);

/**
 * @openapi
 * /admin/notes:
 *   get:
 *     tags: [Admin]
 *     summary: Listar notas pendientes de revisión (ADMIN)
 *     responses:
 *       '200':
 *         description: Lista de notas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Nota' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.get('/notes', ...adminOnly, ControladorAdmin.obtenerNotas);

/**
 * @openapi
 * /admin/notes/{noteId}:
 *   get:
 *     tags: [Admin]
 *     summary: Obtener nota por ID (ADMIN)
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
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.get('/notes/:noteId', ...adminOnly, ControladorAdmin.obtenerNotaPorId);

/**
 * @openapi
 * /admin/notes/{noteId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Eliminar nota (ADMIN)
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Nota eliminada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.delete('/notes/:noteId', ...adminOnly, ControladorAdmin.eliminarNota);

/**
 * @openapi
 * /admin/notes/{noteId}/review:
 *   post:
 *     tags: [Admin]
 *     summary: Revisar nota de comunidad — aprobar o rechazar (ADMIN)
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
 *             required: [action]
 *             properties:
 *               action:  { type: string, enum: [approve, reject] }
 *               comment: { type: string }
 *     responses:
 *       '200': { description: Nota revisada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.post('/notes/:noteId/review', ...adminOnly, ControladorAdmin.revisarNota);

/**
 * @openapi
 * /admin/content-requests:
 *   get:
 *     tags: [Admin]
 *     summary: Listar solicitudes de contenido (ADMIN)
 *     responses:
 *       '200':
 *         description: Lista de solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:          { type: string, format: uuid }
 *                   title:       { type: string }
 *                   description: { type: string }
 *                   type:        { $ref: '#/components/schemas/TipoContenido' }
 *                   status:      { type: string, enum: [pending, approved, rejected] }
 *                   created_at:  { type: string, format: date-time }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.get('/content-requests', ...adminOnly, ControladorAdmin.obtenerSolicitudesContenido);

/**
 * @openapi
 * /admin/content-requests/{requestId}/review:
 *   post:
 *     tags: [Admin]
 *     summary: Revisar solicitud de contenido (ADMIN)
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action:  { type: string, enum: [approve, reject] }
 *               comment: { type: string }
 *     responses:
 *       '200': { description: Solicitud revisada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.post('/content-requests/:requestId/review', ...adminOnly, ControladorAdmin.revisarSolicitudContenido);

/**
 * @openapi
 * /admin/posts/{postId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Eliminar publicación del foro (ADMIN / MODERADOR)
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Publicación eliminada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.delete('/posts/:postId', ...modOrAdmin, ControladorAdmin.eliminarPublicacion);

router.get('/posts', ...modOrAdmin, ControladorAdmin.obtenerTodasPublicaciones);
router.get('/posts/:postId/comments', ...modOrAdmin, ControladorAdmin.obtenerComentariosPublicacion);
router.delete('/comments/:commentId', ...modOrAdmin, ControladorAdmin.eliminarComentarioAdmin);

/**
 * @openapi
 * /admin/reported-posts:
 *   get:
 *     tags: [Admin]
 *     summary: Listar publicaciones reportadas (ADMIN / MODERADOR)
 *     responses:
 *       '200':
 *         description: Lista de reportes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:         { type: string, format: uuid }
 *                   post:       { $ref: '#/components/schemas/Publicacion' }
 *                   reason:     { type: string }
 *                   status:     { type: string, enum: [pending, resolved, dismissed] }
 *                   created_at: { type: string, format: date-time }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.get('/reported-posts', ...modOrAdmin, ControladorAdmin.obtenerPublicacionesReportadas);

/**
 * @openapi
 * /admin/reported-posts/{reportId}:
 *   patch:
 *     tags: [Admin]
 *     summary: Resolver reporte de publicación (ADMIN / MODERADOR)
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [resolved, dismissed] }
 *     responses:
 *       '200': { description: Reporte resuelto }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.patch('/reported-posts/:reportId', ...modOrAdmin, ControladorAdmin.resolverReporte);

/**
 * @openapi
 * /admin/achievements:
 *   get:
 *     tags: [Admin]
 *     summary: Listar todos los logros (ADMIN)
 *     responses:
 *       '200':
 *         description: Lista de logros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Logro' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.get('/achievements', ...adminOnly, ControladorAdmin.obtenerLogros);

/**
 * @openapi
 * /admin/achievements:
 *   post:
 *     tags: [Admin]
 *     summary: Crear logro con imagen de escudo (ADMIN)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, emblem]
 *             properties:
 *               name:        { type: string }
 *               description: { type: string }
 *               xp_reward:   { type: integer }
 *               emblem:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del escudo del logro
 *     responses:
 *       '201':
 *         description: Logro creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Logro' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
router.post('/achievements', ...adminOnly, subirEscudo.single('emblem'), ControladorAdmin.crearLogro);

/**
 * @openapi
 * /admin/achievements/{achievementId}/status:
 *   patch:
 *     tags: [Admin]
 *     summary: Activar o desactivar logro (ADMIN)
 *     parameters:
 *       - in: path
 *         name: achievementId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [is_active]
 *             properties:
 *               is_active: { type: boolean }
 *     responses:
 *       '200': { description: Estado actualizado }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.patch('/achievements/:achievementId/status', ...adminOnly, ControladorAdmin.actualizarEstadoLogro);

/**
 * @openapi
 * /admin/achievements/{achievementId}:
 *   patch:
 *     tags: [Admin]
 *     summary: Actualizar logro (ADMIN)
 *     parameters:
 *       - in: path
 *         name: achievementId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:        { type: string }
 *               description: { type: string }
 *               xp_reward:   { type: integer }
 *               emblem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Logro actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Logro' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.patch('/achievements/:achievementId', ...adminOnly, subirEscudo.single('emblem'), ControladorAdmin.actualizarLogro);

/**
 * @openapi
 * /admin/achievements/{achievementId}:
 *   delete:
 *     tags: [Admin]
 *     summary: Eliminar logro (ADMIN)
 *     parameters:
 *       - in: path
 *         name: achievementId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Logro eliminado }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.delete('/achievements/:achievementId', ...adminOnly, ControladorAdmin.eliminarLogro);

// ====== Revisiones de notas aprobadas ======
router.get('/note-revisions', ...modOrAdmin, ControladorNotaUsuario.listarRevisionesPendientes);
router.patch('/note-revisions/:revisionId', ...modOrAdmin, ControladorNotaUsuario.resolverRevision);

export default router;
