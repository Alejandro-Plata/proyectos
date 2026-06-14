import { Request, Response } from 'express';
import { ServicioCazaTroll } from '../servicios/ServicioCazaTroll.js';

export class ControladorCazaTroll {

    static iniciar = async (req: Request, res: Response) => {
        try {
            const reto = await ServicioCazaTroll.iniciar(req.user!.user_id, req.body?.tema);
            res.status(201).json(reto);
        } catch (error: any) {
            console.error('[caza.iniciar]', error?.message ?? error);
            res.status(502).json({ msg: error?.message ?? 'No se pudo iniciar la caza' });
        }
    };

    static pista = async (req: Request, res: Response) => {
        try {
            const { huntId } = req.params;
            const { line } = req.body;
            if (!Number.isFinite(line)) return res.status(400).json({ msg: 'Se requiere "line"' });
            const r = await ServicioCazaTroll.pista(huntId, req.user!.user_id, Number(line));
            res.json(r);
        } catch (error: any) {
            console.error('[caza.pista]', error?.message ?? error);
            res.status(404).json({ msg: error?.message ?? 'Error' });
        }
    };

    static resolver = async (req: Request, res: Response) => {
        try {
            const { huntId } = req.params;
            const { line, explanation } = req.body;
            if (!Number.isFinite(line)) return res.status(400).json({ msg: 'Se requiere "line"' });
            const r = await ServicioCazaTroll.resolver(huntId, req.user!.user_id, Number(line), explanation ?? '');
            res.json(r);
        } catch (error: any) {
            console.error('[caza.resolver]', error?.message ?? error);
            res.status(404).json({ msg: error?.message ?? 'Error' });
        }
    };
}
