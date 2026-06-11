import { Router } from 'express';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorMensaje } from '../controladores/ControladorMensaje.js';

const router = Router();

/**
 * @openapi
 * /messages/conversations:
 *   get:
 *     tags: [Mensajería]
 *     summary: Listar conversaciones activas
 *     responses:
 *       '200':
 *         description: Lista de conversaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Conversacion' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/conversations', autenticar, ControladorMensaje.obtenerConversaciones);

/**
 * @openapi
 * /messages/conversations/archived:
 *   get:
 *     tags: [Mensajería]
 *     summary: Listar conversaciones archivadas
 *     responses:
 *       '200':
 *         description: Lista de conversaciones archivadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Conversacion' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/conversations/archived', autenticar, ControladorMensaje.obtenerConversacionesArchivadas);

/**
 * @openapi
 * /messages/conversations:
 *   post:
 *     tags: [Mensajería]
 *     summary: Crear nueva conversación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [participantId]
 *             properties:
 *               participantId: { type: string, format: uuid }
 *     responses:
 *       '201':
 *         description: Conversación creada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Conversacion' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '409': { $ref: '#/components/responses/Conflict' }
 */
router.post('/conversations', autenticar, ControladorMensaje.crearConversacion);

/**
 * @openapi
 * /messages/conversations/{conversationId}/archive:
 *   patch:
 *     tags: [Mensajería]
 *     summary: Archivar conversación
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Conversación archivada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.patch('/conversations/:conversationId/archive', autenticar, ControladorMensaje.archivarConversacion);

/**
 * @openapi
 * /messages/conversations/{conversationId}/unarchive:
 *   patch:
 *     tags: [Mensajería]
 *     summary: Desarchivar conversación
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Conversación desarchivada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.patch('/conversations/:conversationId/unarchive', autenticar, ControladorMensaje.desarchivarConversacion);

/**
 * @openapi
 * /messages/conversations/{conversationId}:
 *   delete:
 *     tags: [Mensajería]
 *     summary: Cerrar / abandonar conversación
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Conversación cerrada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.delete('/conversations/:conversationId', autenticar, ControladorMensaje.cerrarConversacion);

/**
 * @openapi
 * /messages/{conversationId}:
 *   get:
 *     tags: [Mensajería]
 *     summary: Obtener historial de mensajes de una conversación
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       '200':
 *         description: Lista de mensajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Mensaje' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/:conversationId', autenticar, ControladorMensaje.obtenerMensajes);

export default router;
