import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { autenticar } from '../middleware/middlewareAuth.js';
import { ControladorShowcase } from '../controladores/ControladorShowcase.js';
import { subirImagenNota } from '../config/subidaArchivos.js';

function multerHandler(upload: multer.Multer, field: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        upload.single(field)(req, res, (err) => {
            if (err) return res.status(400).json({ msg: err.message ?? 'Error de subida' });
            next();
        });
    };
}

const router = Router();

router.get('/', autenticar, ControladorShowcase.listar);
router.post('/', autenticar, ControladorShowcase.crear);
router.post('/cover', autenticar, multerHandler(subirImagenNota, 'image'), ControladorShowcase.subirPortada);
router.get('/:id', autenticar, ControladorShowcase.obtener);
router.patch('/:id', autenticar, ControladorShowcase.actualizar);
router.delete('/:id', autenticar, ControladorShowcase.eliminar);
router.post('/:id/feedback', autenticar, ControladorShowcase.feedback);
router.post('/:id/upvote', autenticar, ControladorShowcase.upvote);
router.patch('/:id/feature', autenticar, ControladorShowcase.destacar);

export default router;
