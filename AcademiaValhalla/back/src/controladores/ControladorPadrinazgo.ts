import { Request, Response } from 'express';
import { ServicioPadrinazgo } from '../servicios/ServicioPadrinazgo.js';

export class ControladorPadrinazgo {

    static estadoMentor = async (req: Request, res: Response) => {
        try {
            const elegible = await ServicioPadrinazgo.puedeSerMentor(req.user!.user_id);
            res.json({ eligible: elegible });
        } catch (e) {
            console.error('[padrinazgo.estadoMentor]', e);
            res.status(500).json({ msg: 'Error' });
        }
    };

    static activarMentor = async (req: Request, res: Response) => {
        try {
            const perfil = await ServicioPadrinazgo.activarMentor(req.user!.user_id, req.body);
            res.json(perfil);
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'No se pudo activar el perfil de mentor' });
        }
    };

    static desactivarMentor = async (req: Request, res: Response) => {
        try {
            await ServicioPadrinazgo.desactivarMentor(req.user!.user_id);
            res.json({ msg: 'Perfil de mentor desactivado' });
        } catch (e) {
            res.status(500).json({ msg: 'Error' });
        }
    };

    static listarMentores = async (req: Request, res: Response) => {
        try {
            const { language, level } = req.query as Record<string, string>;
            const mentores = await ServicioPadrinazgo.listarMentores(
                { language, level: level ? Number(level) : undefined },
                req.user!.user_id,
            );
            res.json(mentores);
        } catch (e) {
            console.error('[padrinazgo.listarMentores]', e);
            res.status(500).json({ msg: 'Error al listar mentores' });
        }
    };

    static solicitar = async (req: Request, res: Response) => {
        try {
            const { mentor_id, goal } = req.body;
            const m = await ServicioPadrinazgo.solicitar(req.user!.user_id, mentor_id, goal);
            res.status(201).json(m);
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'No se pudo enviar la solicitud' });
        }
    };

    static responder = async (req: Request, res: Response) => {
        try {
            const aceptar = req.body?.action === 'accept';
            const io = req.app.get('io');
            const m = await ServicioPadrinazgo.responder(req.user!.user_id, req.params.id, aceptar, io);
            res.json(m);
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'Error al responder' });
        }
    };

    static finalizar = async (req: Request, res: Response) => {
        try {
            const m = await ServicioPadrinazgo.finalizar(req.user!.user_id, req.params.id);
            res.json(m);
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'Error al finalizar' });
        }
    };

    static mias = async (req: Request, res: Response) => {
        try {
            res.json(await ServicioPadrinazgo.mias(req.user!.user_id));
        } catch (e) {
            console.error('[padrinazgo.mias]', e);
            res.status(500).json({ msg: 'Error' });
        }
    };
}
