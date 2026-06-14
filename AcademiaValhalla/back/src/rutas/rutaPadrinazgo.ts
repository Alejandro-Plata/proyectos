import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorPadrinazgo } from '../controladores/ControladorPadrinazgo.js';

const router = Router();

// Limita el envío de solicitudes (anti-spam).
const limiteSolicitudes = rateLimit({
    windowMs: 60 * 60_000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => (req as any).user?.user_id ?? req.ip,
    message: { msg: 'Demasiadas solicitudes. Inténtalo más tarde.' },
});

router.get('/mentor/eligibility', autenticar, ControladorPadrinazgo.estadoMentor);
router.post('/mentor', autenticar, ControladorPadrinazgo.activarMentor);
router.delete('/mentor', autenticar, ControladorPadrinazgo.desactivarMentor);

router.get('/mentors', autenticar, ControladorPadrinazgo.listarMentores);
router.get('/mine', autenticar, ControladorPadrinazgo.mias);

router.post('/requests', autenticar, limiteSolicitudes, ControladorPadrinazgo.solicitar);
router.patch('/requests/:id', autenticar, ControladorPadrinazgo.responder);
router.patch('/:id/end', autenticar, ControladorPadrinazgo.finalizar);

export default router;
