import type { Request, Response } from "express";
import { Usuario, CodigoRestablecimiento } from "../modelos/Modelos.js";
import { verificarContrasena, hashContrasena } from "../utils/autenticacion.js";
import { generarJWT, verificarJWT } from "../utils/jwt.js";
import { Op } from "sequelize";
import { db } from "../config/db.js";
import { enviarCodigoReset } from "../config/mailer.js";

export class ControladorAuth {

    static crearCuenta = async (req: Request, res: Response) => {
        try {
            const { password, username, email } = req.body;

            const userExists = await Usuario.findOne({ where: { [Op.or]: [{ username }, { email }] } });

            if (userExists) {
                const error = new Error('El usuario ya está registrado');
                return res.status(409).json({ error: error.message });
            }

            const contrasenHasheada = await hashContrasena(password);

            const style = 'notionists';
            const seed = username.trim().replace(/\s+/g, '-');
            const randomAvatarUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

            const usuario = new Usuario({
                password: contrasenHasheada,
                username,
                email,
                avatar_url: randomAvatarUrl,
                role: 'USUARIO',
                experience_points: 0,
                current_level: 1
            });

            await usuario.save();

            const token = generarJWT(usuario.user_id);

            return res.status(201).json({
                message: 'Cuenta creada exitosamente',
                token,
                user: {
                    user_id: usuario.user_id,
                    username: usuario.username,
                    email: usuario.email,
                    avatar_url: usuario.avatar_url,
                    role: usuario.role,
                    current_level: usuario.current_level,
                    experience_points: usuario.experience_points
                }
            });

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error en el servidor al crear la cuenta' });
        }
    }

    static iniciarSesion = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            const usuario = await Usuario.findOne({ where: { username }, attributes: { include: ['password'] } });

            if (!usuario) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({ error: error.message });
            }

            const isPasswordCorrect = await verificarContrasena(password, usuario.password);

            if (!isPasswordCorrect) {
                const error = new Error('Contraseña incorrecta');
                return res.status(401).json({ error: error.message });
            }

            if ((usuario as any).is_banned) {
                return res.status(403).json({ error: 'Tu cuenta ha sido suspendida por comportamiento inapropiado.' });
            }

            const token = generarJWT(usuario.user_id);

            return res.status(200).json({
                message: 'Login exitoso',
                token,
                user: {
                    user_id: usuario.user_id,
                    username: usuario.username,
                    email: usuario.email,
                    avatar_url: usuario.avatar_url,
                    bio: usuario.bio,
                    role: usuario.role,
                    current_level: usuario.current_level,
                    experience_points: usuario.experience_points
                }
            });

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error en el servidor al iniciar sesión' });
        }
    }

    static obtenerUsuario = async (req: Request, res: Response) => {
        return res.json((req as any).user);
    }

    static cerrarSesion = (req: Request, res: Response) => {
        res.json({ message: 'Sesión cerrada correctamente' });
    }

    static solicitarRestablecimiento = async (req: Request, res: Response) => {
        // Mitigación §3.3 SEGURIDAD.md — Ejecutamos el hash siempre (también cuando
        // el email no existe) para nivelar el tiempo de respuesta y evitar
        // enumeración de cuentas por timing attack.
        const RESPUESTA_NEUTRA = { message: 'Si el email está registrado, recibirás un código.' };
        try {
            const { email } = req.body;
            const usuario = await Usuario.findOne({ where: { email } });

            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const hashCodigo = await hashContrasena(code);   // siempre, exista o no el usuario

            if (!usuario) {
                return res.json(RESPUESTA_NEUTRA);
            }

            await CodigoRestablecimiento.update(
                { used: true },
                { where: { user_id: usuario.user_id, used: false } }
            );

            await CodigoRestablecimiento.create({
                user_id: usuario.user_id,
                code_hash: hashCodigo,
                expires_at: new Date(Date.now() + 10 * 60 * 1000),
                created_at: new Date(),
            });

            await enviarCodigoReset(usuario.email, code, usuario.username);

            return res.json(RESPUESTA_NEUTRA);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    };

    static verificarCodigoRestablecimiento = async (req: Request, res: Response) => {
        try {
            const { email, code } = req.body;
            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) return res.status(400).json({ error: 'Código inválido o expirado' });

            const resetEntry = await CodigoRestablecimiento.findOne({
                where: {
                    user_id: usuario.user_id,
                    used: false,
                    expires_at: { [Op.gt]: new Date() },
                },
                order: [['created_at', 'DESC']],
            });

            if (!resetEntry) return res.status(400).json({ error: 'Código inválido o expirado' });

            const isValid = await verificarContrasena(code, resetEntry.code_hash);
            if (!isValid) return res.status(400).json({ error: 'Código inválido o expirado' });

            const tokenRestablecimiento = generarJWT(usuario.user_id, '5m');

            resetEntry.used = true;
            await resetEntry.save();

            return res.json({ resetToken: tokenRestablecimiento });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    };

    static restablecerContrasena = async (req: Request, res: Response) => {
        try {
            const { resetToken, newPassword } = req.body;

            const decoded = verificarJWT(resetToken);
            if (!decoded) return res.status(400).json({ error: 'Token inválido o expirado' });

            const usuario = await Usuario.findByPk(decoded.id);
            if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

            if (usuario.password) {
                const isSamePassword = await verificarContrasena(newPassword, usuario.password);
                if (isSamePassword) {
                    return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la contraseña actual' });
                }
            }

            const nuevaContrasena = await hashContrasena(newPassword);
            usuario.password = nuevaContrasena;
            await usuario.save();

            return res.json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    };

}

