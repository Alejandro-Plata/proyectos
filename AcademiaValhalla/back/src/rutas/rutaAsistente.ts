import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorAsistente } from '../controladores/ControladorAsistente.js';

const router = Router();

// Limita las rutas generativas (coste de IA) por usuario autenticado.
const limiteIA = rateLimit({
    windowMs: 60_000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => (req as any).user?.user_id ?? req.ip,
    message: { error: 'Demasiadas peticiones a la IA. Espera un momento.' },
});

// Chat (A1: inyecta memoria del aprendiz en el system prompt)
router.post('/chat', autenticar, limiteIA, ControladorAsistente.chatear);

// A1 · Perfil de aprendizaje
router.get('/profile', autenticar, ControladorAsistente.obtenerPerfil);
router.patch('/profile', autenticar, ControladorAsistente.actualizarPerfil);
router.delete('/profile', autenticar, ControladorAsistente.borrarPerfil);
router.post('/profile/distill', autenticar, limiteIA, ControladorAsistente.destilarSesion);

// A3 · Revisión socrática de código
router.post('/review', autenticar, limiteIA, ControladorAsistente.revisarCodigo);

// A5 · Destilar conversación en apunte
router.post('/distill-note', autenticar, limiteIA, ControladorAsistente.destilarApunte);

export default router;
