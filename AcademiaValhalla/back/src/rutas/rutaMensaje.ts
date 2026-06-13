import { Router } from 'express';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorMensaje } from '../controladores/ControladorMensaje.js';
import { subirAdjuntoMensaje, subirAvatar } from '../config/subidaArchivos.js';

const router = Router();

// ── Conversaciones ─────────────────────────────────────────────

router.get('/conversations', autenticar, ControladorMensaje.obtenerConversaciones);
router.get('/conversations/archived', autenticar, ControladorMensaje.obtenerConversacionesArchivadas);
router.post('/conversations', autenticar, ControladorMensaje.crearConversacion);
router.patch('/conversations/:conversationId/archive', autenticar, ControladorMensaje.archivarConversacion);
router.patch('/conversations/:conversationId/unarchive', autenticar, ControladorMensaje.desarchivarConversacion);
router.delete('/conversations/:conversationId', autenticar, ControladorMensaje.cerrarConversacion);

// ── Adjuntos ───────────────────────────────────────────────────

router.post('/adjuntos', autenticar, subirAdjuntoMensaje.single('file'), ControladorMensaje.subirAdjunto);

// ── Grupos ─────────────────────────────────────────────────────

router.post('/grupos', autenticar, ControladorMensaje.crearGrupo);
router.patch('/grupos/:groupId', autenticar, subirAvatar.single('avatar'), ControladorMensaje.actualizarGrupo);
router.post('/grupos/:groupId/participantes', autenticar, ControladorMensaje.agregarParticipantes);
router.delete('/grupos/:groupId/participantes/:userId', autenticar, ControladorMensaje.eliminarParticipante);
router.patch('/grupos/:groupId/participantes/:userId', autenticar, ControladorMensaje.actualizarRolParticipante);

// ── Mensajes ───────────────────────────────────────────────────

router.get('/:conversationId', autenticar, ControladorMensaje.obtenerMensajes);

export default router;
