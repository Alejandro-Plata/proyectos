import { Request, Response } from 'express';
import { Usuario } from '../modelos/Modelos.js';
import { hashContrasena, verificarContrasena } from '../utils/autenticacion.js';
import { ServicioLogros } from '../servicios/ServicioLogros.js';
import { subirArchivo, eliminarArchivo } from '../servicios/ServicioStorage.js';

export class ControladorPerfil {

    static obtenerMiPerfil = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user?.user_id;

            const usuario = await Usuario.findByPk(idUsuario, {
                attributes: {
                    exclude: ['created_at', 'updated_at']
                },
            });

            if (!usuario) {
                return res.status(404).json({
                    msg: "Usuario no encontrado",
                    debug_id_buscado: idUsuario
                });
            }

            const userResponse = usuario.toJSON();
            const hasPassword = !!(userResponse as any).password && (userResponse as any).password !== '';
            delete (userResponse as any).password;
            (userResponse as any).has_password = hasPassword;

            res.json(userResponse);

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error al obtener el perfil" });
        }
    };

    static subirAvatar = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user?.user_id;
            if (!req.file) {
                return res.status(400).json({ msg: 'No se subió ninguna imagen' });
            }

            const usuario = await Usuario.findByPk(idUsuario);
            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            // Si el avatar anterior estaba en nuestro bucket, lo eliminamos.
            await eliminarArchivo(usuario.avatar_url);

            const avatarUrl = await subirArchivo(req.file, 'avatars', 'avatar');
            usuario.avatar_url = avatarUrl;
            await usuario.save();

            const unlockedAchievements = await ServicioLogros.verificarYDesbloquear(idUsuario!, 'avatar_changed', 1);

            res.json({ msg: 'Avatar actualizado correctamente', avatar_url: avatarUrl, unlockedAchievements });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al subir el avatar' });
        }
    };

    static actualizarPerfil = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user?.user_id;
            const {
                username,
                bio,
                avatar_url,
                github_url,
                linkedin_url
            } = req.body;

            const usuario = await Usuario.findByPk(idUsuario);

            if (!usuario) {
                return res.status(404).json({
                    msg: "Usuario no encontrado",
                    debug_id_buscado: idUsuario
                });
            }

            if (username && username !== usuario.username) {
                const usernameExists = await Usuario.findOne({ where: { username } });
                if (usernameExists) {
                    return res.status(400).json({ msg: "El nombre de usuario ya está en uso" });
                }
                usuario.username = username;
            }

            const hadAvatar = !!usuario.avatar_url;
            if (bio !== undefined) usuario.bio = bio;
            if (avatar_url !== undefined) usuario.avatar_url = avatar_url;
            if (github_url !== undefined) usuario.github_url = github_url;
            if (linkedin_url !== undefined) usuario.linkedin_url = linkedin_url;

            await usuario.save();

            let unlockedAchievements: any[] = [];
            if (!hadAvatar && usuario.avatar_url) {
                unlockedAchievements = await ServicioLogros.verificarYDesbloquear(idUsuario!, 'avatar_changed', 1);
            }

            const userResponse = usuario.toJSON();
            const hasPassword = !!(userResponse as any).password && (userResponse as any).password !== '';
            delete (userResponse as any).password;
            (userResponse as any).has_password = hasPassword;

            res.json({
                msg: "Perfil actualizado correctamente",
                user: userResponse,
                unlockedAchievements,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error al actualizar el perfil" });
        }
    };

    static cambiarContrasena = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user?.user_id;
            const { current_password, new_password } = req.body;

            const usuario = await Usuario.findByPk(idUsuario);

            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            if (!usuario.password) {
                return res.status(400).json({
                    msg: 'Tu cuenta usa inicio de sesión con Google/GitHub. No tienes contraseña local configurada.'
                });
            }

            const isValid = await verificarContrasena(current_password, usuario.password);
            if (!isValid) {
                return res.status(401).json({ msg: 'La contraseña actual es incorrecta' });
            }

            const isSamePassword = await verificarContrasena(new_password, usuario.password);
            if (isSamePassword) {
                return res.status(400).json({ msg: 'La nueva contraseña no puede ser igual a la contraseña actual' });
            }

            const nuevaContrasena = await hashContrasena(new_password);
            usuario.password = nuevaContrasena;
            await usuario.save();

            res.json({ msg: 'Contraseña actualizada correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al cambiar la contraseña' });
        }
    };

    static eliminarCuenta = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user?.user_id;

            const usuario = await Usuario.findByPk(idUsuario);
            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            await usuario.destroy();

            res.json({ msg: "Cuenta eliminada correctamente" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error al eliminar la cuenta" });
        }
    };
}

