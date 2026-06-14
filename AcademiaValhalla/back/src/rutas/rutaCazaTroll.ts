import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorCazaTroll } from '../controladores/ControladorCazaTroll.js';

const router = Router();

const limiteInicio = rateLimit({
    windowMs: 60 * 60_000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => (req as any).user?.user_id ?? req.ip,
    message: { msg: 'Demasiadas cazas iniciadas. Inténtalo más tarde.' },
});

// A4 · Caza del Troll
router.post('/', autenticar, limiteInicio, ControladorCazaTroll.iniciar);
router.post('/:huntId/hint', autenticar, ControladorCazaTroll.pista);
router.post('/:huntId/solve', autenticar, ControladorCazaTroll.resolver);

export default router;
