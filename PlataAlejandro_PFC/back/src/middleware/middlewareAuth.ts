import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { Usuario } from '../modelos/Modelos.js';

// Extendemos Express.User para que sea nuestro modelo de Sequelize
declare global {
    namespace Express {
        interface User {
            user_id: string;
            username: string;
            email: string;
            role: string;
            avatar_url?: string | null;
        }
    }
}

/**
 * Middleware que verifica que el usuario tenga un rol específico.
 */
export const autorizar = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autorizado' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'No tienes permisos para esta acción' });
        }
        next();
    };
};

export const autenticar = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const token = bearer.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        const user = await Usuario.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        req.user = user as unknown as Express.User;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token no válido' });
    }
}
