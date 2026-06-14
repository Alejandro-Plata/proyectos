import { Request, Response } from 'express';
import { ServicioTorneos } from '../servicios/ServicioTorneos.js';

const esStaff = (rol?: string) => rol === 'ADMIN' || rol === 'MODERADOR';

export class ControladorTorneos {

    static listar = async (req: Request, res: Response) => {
        try {
            const { status, season } = req.query as Record<string, string>;
            res.json(await ServicioTorneos.listar({ status, season }));
        } catch (e) {
            console.error('[torneos.listar]', e);
            res.status(500).json({ msg: 'Error al listar torneos' });
        }
    };

    static obtener = async (req: Request, res: Response) => {
        try {
            const detalle = await ServicioTorneos.obtener(req.params.id, req.user!.user_id);
            if (!detalle) return res.status(404).json({ msg: 'Torneo no encontrado' });
            res.json(detalle);
        } catch (e) {
            console.error('[torneos.obtener]', e);
            res.status(500).json({ msg: 'Error al obtener el torneo' });
        }
    };

    static unirse = async (req: Request, res: Response) => {
        try {
            await ServicioTorneos.unirse(req.params.id, req.user!.user_id);
            res.json({ msg: 'Te has unido al torneo' });
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'No se pudo unir' });
        }
    };

    static leaderboard = async (req: Request, res: Response) => {
        try {
            res.json(await ServicioTorneos.leaderboard(req.params.id));
        } catch (e) {
            console.error('[torneos.leaderboard]', e);
            res.status(500).json({ msg: 'Error al obtener la clasificación' });
        }
    };

    static crear = async (req: Request, res: Response) => {
        try {
            if (!esStaff(req.user!.role)) return res.status(403).json({ msg: 'Sin permisos' });
            const torneo = await ServicioTorneos.crear(req.user!.user_id, req.body);
            res.status(201).json(torneo);
        } catch (e: any) {
            console.error('[torneos.crear]', e);
            res.status(400).json({ msg: e?.message ?? 'Error al crear el torneo' });
        }
    };

    static finalizar = async (req: Request, res: Response) => {
        try {
            if (!esStaff(req.user!.role)) return res.status(403).json({ msg: 'Sin permisos' });
            await ServicioTorneos.finalizar(req.params.id);
            res.json({ msg: 'Torneo finalizado' });
        } catch (e) {
            console.error('[torneos.finalizar]', e);
            res.status(500).json({ msg: 'Error al finalizar el torneo' });
        }
    };
}
