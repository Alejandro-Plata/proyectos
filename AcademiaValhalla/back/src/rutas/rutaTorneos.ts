import { Router } from 'express';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorTorneos } from '../controladores/ControladorTorneos.js';

const router = Router();

router.get('/', autenticar, ControladorTorneos.listar);
router.post('/', autenticar, ControladorTorneos.crear);             // ADMIN/MOD
router.get('/:id', autenticar, ControladorTorneos.obtener);
router.get('/:id/leaderboard', autenticar, ControladorTorneos.leaderboard);
router.post('/:id/join', autenticar, ControladorTorneos.unirse);
router.post('/:id/finish', autenticar, ControladorTorneos.finalizar); // ADMIN/MOD

export default router;
