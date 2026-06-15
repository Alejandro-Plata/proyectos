import { Request, Response } from 'express';
import { ServicioMaestrias } from '../servicios/ServicioMaestrias.js';
import { ServicioEmblemas } from '../servicios/ServicioEmblemas.js';

export class ControladorMaestrias {

    static emblemas = async (req: Request, res: Response) => {
        try {
            res.json(await ServicioEmblemas.listar(req.params.userId));
        } catch (e) {
            console.error('[maestrias.emblemas]', e);
            res.status(500).json({ msg: 'Error al obtener emblemas' });
        }
    };

    static maestria = async (req: Request, res: Response) => {
        try {
            res.json(await ServicioMaestrias.calcular(req.params.userId));
        } catch (e) {
            console.error('[maestrias.maestria]', e);
            res.status(500).json({ msg: 'Error al calcular maestrías' });
        }
    };

    static endosos = async (req: Request, res: Response) => {
        try {
            res.json(await ServicioMaestrias.endosos(req.params.userId, req.user!.user_id));
        } catch (e) {
            console.error('[maestrias.endosos]', e);
            res.status(500).json({ msg: 'Error al obtener endosos' });
        }
    };

    static endosar = async (req: Request, res: Response) => {
        try {
            await ServicioMaestrias.endosar(req.user!.user_id, req.params.userId, req.body?.skill);
            res.json(await ServicioMaestrias.endosos(req.params.userId, req.user!.user_id));
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'Error al endosar' });
        }
    };

    static quitarEndoso = async (req: Request, res: Response) => {
        try {
            await ServicioMaestrias.quitarEndoso(req.user!.user_id, req.params.userId, req.params.skill);
            res.json(await ServicioMaestrias.endosos(req.params.userId, req.user!.user_id));
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'Error' });
        }
    };

    static tarjetaPublica = async (req: Request, res: Response) => {
        try {
            const card = await ServicioMaestrias.tarjetaPublica(req.params.username);
            if (!card) return res.status(404).json({ msg: 'Perfil no encontrado' });
            res.json(card);
        } catch (e) {
            console.error('[maestrias.tarjeta]', e);
            res.status(500).json({ msg: 'Error' });
        }
    };
}
