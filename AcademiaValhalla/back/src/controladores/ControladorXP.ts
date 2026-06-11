import { Request, Response } from 'express';
import { ServicioXP } from '../servicios/ServicioXP.js';
import { Usuario } from '../modelos/Modelos.js';
import { calculateLevelFromXP } from '../utils/constXP.js';

export class ControladorXP {
    static obtenerInfoNivel = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const usuario = await Usuario.findByPk(idUsuario);
            if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

            const infoNivel = calculateLevelFromXP(usuario.experience_points);

            return res.json({
                totalXP: usuario.experience_points,
                ...infoNivel,
            });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };
    
    static otorgarXP = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { xpAmount } = req.body;

            if (!xpAmount || xpAmount <= 0) {
                return res.status(400).json({ error: 'xpAmount debe ser mayor que 0' });
            }

            const resultado = await ServicioXP.otorgarXP(idUsuario, xpAmount);
            return res.json(resultado);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };
}

