import { Request, Response } from 'express';
import { ServicioSagas } from '../servicios/ServicioSagas.js';

export class ControladorSagas {

    static crear = async (req: Request, res: Response) => {
        try {
            const goal: string = req.body?.goal?.trim();
            if (!goal || goal.length < 4) {
                return res.status(400).json({ msg: 'Describe un objetivo de aprendizaje válido.' });
            }
            const saga = await ServicioSagas.generar(req.user!.user_id, goal);
            const detalle = await ServicioSagas.obtener(req.user!.user_id, saga.saga_id);
            res.status(201).json(detalle);
        } catch (error: any) {
            console.error('[sagas.crear]', error?.message ?? error);
            res.status(502).json({ msg: error?.message ?? 'No se pudo generar el roadmap' });
        }
    };

    static listar = async (req: Request, res: Response) => {
        try {
            res.json(await ServicioSagas.listar(req.user!.user_id));
        } catch (error) {
            console.error('[sagas.listar]', error);
            res.status(500).json({ msg: 'Error al listar los roadmaps' });
        }
    };

    static obtener = async (req: Request, res: Response) => {
        try {
            const detalle = await ServicioSagas.obtener(req.user!.user_id, req.params.sagaId);
            if (!detalle) return res.status(404).json({ msg: 'RoadMap no encontrado' });
            res.json(detalle);
        } catch (error) {
            console.error('[sagas.obtener]', error);
            res.status(500).json({ msg: 'Error al obtener el roadmap' });
        }
    };

    static actualizarHito = async (req: Request, res: Response) => {
        try {
            const { sagaId, milestoneId } = req.params;
            const { status } = req.body;
            const ok = await ServicioSagas.actualizarHito(req.user!.user_id, sagaId, milestoneId, status);
            if (!ok) return res.status(400).json({ msg: 'No se pudo actualizar el hito' });
            res.json({ msg: 'Hito actualizado' });
        } catch (error) {
            console.error('[sagas.actualizarHito]', error);
            res.status(500).json({ msg: 'Error al actualizar el hito' });
        }
    };

    static eliminar = async (req: Request, res: Response) => {
        try {
            const ok = await ServicioSagas.eliminar(req.user!.user_id, req.params.sagaId);
            if (!ok) return res.status(404).json({ msg: 'RoadMap no encontrado' });
            res.json({ msg: 'RoadMap eliminado' });
        } catch (error) {
            console.error('[sagas.eliminar]', error);
            res.status(500).json({ msg: 'Error al eliminar el roadmap' });
        }
    };
}
