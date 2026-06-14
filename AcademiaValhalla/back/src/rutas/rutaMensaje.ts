import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorMensaje } from '../controladores/ControladorMensaje.js';
import { subirAdjuntoMensaje, subirAvatar } from '../config/subidaArchivos.js';

function multerHandler(upload: multer.Multer, field: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        upload.single(field)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ msg: `Error de subida: ${err.message}` });
            }
            if (err) {
                return res.status(400).json({ msg: err.message ?? 'Tipo de archivo no permitido' });
            }
            next();
        });
    };
}

const router = Router();

// ── Conversaciones ─────────────────────────────────────────────

router.get('/conversations', autenticar, ControladorMensaje.obtenerConversaciones);
router.get('/conversations/archived', autenticar, ControladorMensaje.obtenerConversacionesArchivadas);
router.post('/conversations', autenticar, ControladorMensaje.crearConversacion);
router.patch('/conversations/:conversationId/archive', autenticar, ControladorMensaje.archivarConversacion);
router.patch('/conversations/:conversationId/unarchive', autenticar, ControladorMensaje.desarchivarConversacion);
router.delete('/conversations/:conversationId', autenticar, ControladorMensaje.cerrarConversacion);

// ── Adjuntos ───────────────────────────────────────────────────

router.post('/adjuntos', autenticar, multerHandler(subirAdjuntoMensaje, 'file'), ControladorMensaje.subirAdjunto);

// ── Grupos ─────────────────────────────────────────────────────

router.post('/grupos', autenticar, ControladorMensaje.crearGrupo);
router.patch('/grupos/:groupId', autenticar, multerHandler(subirAvatar, 'avatar'), ControladorMensaje.actualizarGrupo);
router.post('/grupos/:groupId/participantes', autenticar, ControladorMensaje.agregarParticipantes);
router.delete('/grupos/:groupId/participantes/:userId', autenticar, ControladorMensaje.eliminarParticipante);
router.patch('/grupos/:groupId/participantes/:userId', autenticar, ControladorMensaje.actualizarRolParticipante);

// ── Mensajes ───────────────────────────────────────────────────

router.get('/:conversationId', autenticar, ControladorMensaje.obtenerMensajes);

export default router;
