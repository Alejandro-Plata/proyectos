import jwt from 'jsonwebtoken';
import { Usuario } from '../modelos/Modelos.js';
import type { Socket } from 'socket.io';
import type { ExtendedError } from 'socket.io';

export async function middlewareSocketAuth(
    socket: Socket,
    next: (err?: ExtendedError) => void
): Promise<void> {
    try {
        const token =
            (socket.handshake.auth?.token as string) ||
            (socket.handshake.query?.token as string);

        if (!token) {
            return next(new Error('Autenticación requerida: token no proporcionado'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const user = await Usuario.findByPk(decoded.id);
        if (!user) {
            return next(new Error('Usuario no encontrado'));
        }

        socket.data.user = user;
        socket.data.userId = user.user_id;

        next();
    } catch (error) {
        next(new Error('Token no válido o expirado'));
    }
}
