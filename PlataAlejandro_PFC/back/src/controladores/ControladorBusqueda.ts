import { Request, Response } from 'express';
import { Usuario, Publicacion } from '../modelos/Modelos.js';
import { Op } from 'sequelize';

export class ControladorBusquedaUsuario {

    static buscar = async (req: Request, res: Response) => {
        try {
            const consulta = req.query.q as string;
            const idUsuario = req.user!.user_id;

            if (!consulta || consulta.trim().length < 2) {
                return res.json([]);
            }

            const usuarios = await Usuario.findAll({
                where: {
                    username: { [Op.iLike]: `%${consulta}%` },
                    user_id: { [Op.ne]: idUsuario },
                },
                attributes: ['user_id', 'username', 'avatar_url'],
                limit: 10,
            });

            res.json(usuarios);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al buscar usuarios' });
        }
    };

    static obtenerPerfilPublico = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            const usuario = await Usuario.findByPk(userId, {
                attributes: ['user_id', 'username', 'avatar_url', 'bio', 'github_url', 'linkedin_url', 'current_level', 'experience_points', 'created_at'],
            });

            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            const postsCount = await Publicacion.count({ where: { author_id: userId } });
            const recentPosts = await Publicacion.findAll({
                where: { author_id: userId },
                attributes: ['post_id', 'title', 'post_type', 'upvote_count', 'created_at'],
                order: [['created_at', 'DESC']],
                limit: 5,
            });

            res.json({ user: usuario, postsCount, recentPosts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener el perfil del usuario' });
        }
    };

    static sugerencias = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;

            const usuarios = await Usuario.findAll({
                where: { user_id: { [Op.ne]: idUsuario } },
                attributes: ['user_id', 'username', 'avatar_url'],
                order: [['created_at', 'DESC']],
                limit: 50,
            });

            // Mezclar aleatoriamente y devolver máximo 8
            const shuffled = usuarios.sort(() => Math.random() - 0.5).slice(0, 8);
            res.json(shuffled);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener sugerencias' });
        }
    };
}

