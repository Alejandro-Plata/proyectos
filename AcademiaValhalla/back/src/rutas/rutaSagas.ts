import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorSagas } from '../controladores/ControladorSagas.js';

const router = Router();

// La generación de sagas consume IA: límite por usuario.
const limiteGenerar = rateLimit({
    windowMs: 60 * 60_000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => (req as any).user?.user_id ?? req.ip,
    message: { msg: 'Has generado demasiados roadmaps. Inténtalo más tarde.' },
});

router.get('/', autenticar, ControladorSagas.listar);
router.post('/', autenticar, limiteGenerar, ControladorSagas.crear);
router.get('/:sagaId', autenticar, ControladorSagas.obtener);
router.delete('/:sagaId', autenticar, ControladorSagas.eliminar);
router.patch('/:sagaId/milestones/:milestoneId', autenticar, ControladorSagas.actualizarHito);

export default router;
