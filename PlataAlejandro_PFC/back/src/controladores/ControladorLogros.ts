import { Request, Response } from 'express';
import { ServicioLogros } from '../servicios/ServicioLogros.js';

export class ControladorLogros {
    static obtenerLogrosUsuario = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const achievements = await ServicioLogros.obtenerLogrosUsuario(idUsuario);
            return res.json(achievements);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };
}

