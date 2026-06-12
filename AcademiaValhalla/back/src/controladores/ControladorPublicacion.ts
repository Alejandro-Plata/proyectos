import { Request, Response } from 'express';
import { Publicacion, ComentarioUsuario, Voto, Usuario, Etiqueta, EtiquetaPublicacion, ReportePublicacion } from '../modelos/Modelos.js';
import { Op, literal } from 'sequelize';
import { ServicioXP } from '../servicios/ServicioXP.js';
import { ServicioLogros } from '../servicios/ServicioLogros.js';
import { COMENTARIOS_POR_XP, LOGRO_XP_COMENTARIO, XP_SOLUCION_MARCADA } from '../utils/constXP.js';
import { subirArchivo } from '../servicios/ServicioStorage.js';

export class ControladorPublicacion {

    static subirImagen = async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ msg: 'No se subió ninguna imagen' });
        }
        const url = await subirArchivo(req.file, 'posts', 'post');
        res.status(201).json({ url });
    };

    static obtenerTodos = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = (page - 1) * limit;

            const where: any = {};
            if (req.query.post_type) where.post_type = req.query.post_type;
            if (req.query.search) {
                where.title = { [Op.iLike]: `%${req.query.search}%` };
            }

            const count = await Publicacion.count({ where });

            const rows = await Publicacion.findAll({
                where,
                include: [
                    { model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] },
                ],
                attributes: {
                    include: [
                        [literal('(SELECT COUNT(*)::int FROM user_comments WHERE user_comments.post_id = "Publicacion"."post_id")'), 'comment_count'],
                        [literal('(SELECT EXISTS(SELECT 1 FROM user_comments WHERE user_comments.post_id = "Publicacion"."post_id" AND user_comments.is_solution = true))'), 'has_solution'],
                    ],
                },
                limit,
                offset,
                order: [['created_at', 'DESC']],
            });

            res.json({
                data: rows,
                total: count,
                page,
                totalPages: Math.ceil(count / limit),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener posts' });
        }
    };

    static obtenerPorId = async (req: Request, res: Response) => {
        try {
            const { postId } = req.params;

            const publicacion = await Publicacion.findByPk(postId, {
                include: [
                    { model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] },
                    {
                        model: ComentarioUsuario,
                        as: 'comentarios',
                        include: [
                            { model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] },
                            {
                                model: ComentarioUsuario,
                                as: 'respuestas',
                                include: [
                                    { model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] },
                                ],
                            },
                        ],
                        where: { parent_user_comment_id: null },
                        required: false,
                    },
                    { model: Etiqueta, as: 'etiquetas', through: { attributes: [] } },
                    { model: Voto, as: 'votos', required: false },
                ],
            });

            if (!publicacion) {
                return res.status(404).json({ msg: 'Post no encontrado' });
            }

            await publicacion.increment('view_count');

            let votoUsuario: number | null = null;
            if (req.user) {
                const voto = await Voto.findOne({
                    where: { post_id: postId, user_id: req.user.user_id },
                });
                votoUsuario = voto ? voto.value : null;
            }

            res.json({ ...publicacion.toJSON(), userVote: votoUsuario });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener el post' });
        }
    };

    static crear = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { title, content, post_type, slug, tags } = req.body;

            const normalizedContent = typeof content === 'string'
                ? [{ type: 'text', value: content }]
                : content;

            const publicacion = await Publicacion.create({
                author_id: idUsuario,
                title,
                content: normalizedContent,
                post_type,
                slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            });

            if (tags && Array.isArray(tags)) {
                for (const tagId of tags) {
                    await EtiquetaPublicacion.create({ post_id: publicacion.post_id, tag_id: tagId });
                }
            }

            const totalPosts = await Publicacion.count({ where: { author_id: idUsuario } });
            const unlockedAchievements = await ServicioLogros.verificarYDesbloquear(idUsuario, 'post_count', totalPosts);

            res.status(201).json({ msg: 'Post creado correctamente', post: publicacion, unlockedAchievements });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al crear el post' });
        }
    };

    static actualizar = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { postId } = req.params;

            const publicacion = await Publicacion.findByPk(postId);
            if (!publicacion) return res.status(404).json({ msg: 'Post no encontrado' });
            if (publicacion.author_id !== idUsuario) return res.status(403).json({ msg: 'No autorizado' });

            // Mitigación §3.4 SEGURIDAD.md — whitelist explícita de campos editables.
            // Previene mass assignment: campos como author_id, upvote_count, view_count
            // o created_at nunca pueden cambiar por esta vía.
            const { title, content, post_type } = req.body;
            const cambios: any = {};
            if (title !== undefined)     cambios.title = title;
            if (content !== undefined)   cambios.content = content;
            if (post_type !== undefined) cambios.post_type = post_type;

            await publicacion.update(cambios);
            res.json({ msg: 'Post actualizado', post: publicacion });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al actualizar el post' });
        }
    };

    static eliminar = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const userRole = req.user!.role;
            const { postId } = req.params;

            const publicacion = await Publicacion.findByPk(postId);
            if (!publicacion) return res.status(404).json({ msg: 'Post no encontrado' });
            if (publicacion.author_id !== idUsuario && userRole !== 'ADMIN' && userRole !== 'MODERADOR') {
                return res.status(403).json({ msg: 'No autorizado' });
            }

            await publicacion.destroy();
            res.json({ msg: 'Post eliminado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar el post' });
        }
    };

    static crearComentario = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { postId } = req.params;
            const { content, parent_user_comment_id } = req.body;

            if (!content || content.trim().length < 10) {
                return res.status(400).json({ msg: 'El comentario debe tener al menos 10 caracteres.' });
            }

            const publicacion = await Publicacion.findByPk(postId);
            if (!publicacion) return res.status(404).json({ msg: 'Post no encontrado' });

            const comentario = await ComentarioUsuario.create({
                post_id: postId,
                author_id: idUsuario,
                content,
                parent_user_comment_id: parent_user_comment_id || null,
            });

            // Incrementar contador de comentarios
            const usuario = await Usuario.findByPk(idUsuario);
            const newTotal = (usuario!.total_comments || 0) + 1;
            await usuario!.update({ total_comments: newTotal });

            // XP por cada 5 comentarios (uno de los logros)
            let xpReward = null;
            if (newTotal % COMENTARIOS_POR_XP === 0) {
                xpReward = await ServicioXP.otorgarXP(idUsuario, LOGRO_XP_COMENTARIO);
            }

            // Verificar si se ha cumplido un logro de comentarios 
            const unlockedAchievements = await ServicioLogros.verificarYDesbloquear(
                idUsuario,
                'comment_count',
                newTotal
            );

            res.status(201).json({ msg: 'Comentario creado', comment: comentario, xpReward, unlockedAchievements });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al crear comentario' });
        }
    };

    static marcarComoSolucion = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { postId, commentId } = req.params;

            const publicacion = await Publicacion.findByPk(postId);
            if (!publicacion) return res.status(404).json({ msg: 'Post no encontrado' });
            if (publicacion.author_id !== idUsuario) {
                return res.status(403).json({ msg: 'Solo el autor del post puede marcar una solución' });
            }

            const comentario = await ComentarioUsuario.findOne({
                where: { user_comment_id: commentId, post_id: postId },
            });
            if (!comentario) return res.status(404).json({ msg: 'Comentario no encontrado' });

            if (comentario.author_id === idUsuario) {
                return res.status(400).json({ msg: 'No puedes marcar tu propio comentario como solución' });
            }

            // Desmarcar solución previa
            await ComentarioUsuario.update(
                { is_solution: false },
                { where: { post_id: postId, is_solution: true } }
            );

            await comentario.update({ is_solution: true });

            // Incrementar contador de soluciones del autor del comentario
            const autorComentario = await Usuario.findByPk(comentario.author_id);
            const newSolutionTotal = (autorComentario!.total_solutions || 0) + 1;
            await autorComentario!.update({ total_solutions: newSolutionTotal });

            const xpReward = await ServicioXP.otorgarXP(comentario.author_id, XP_SOLUCION_MARCADA);

            const unlockedAchievements = await ServicioLogros.verificarYDesbloquear(
                comentario.author_id,
                'solutions_given',
                newSolutionTotal
            );

            return res.json({
                comment: { ...comentario.toJSON(), is_solution: true },
                xpRewardForAuthor: xpReward,
                unlockedAchievements,
            });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ msg: 'Error al marcar solución', error: error.message });
        }
    };

    static eliminarComentario = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const userRole = req.user!.role;
            const { commentId } = req.params;

            const comentario = await ComentarioUsuario.findByPk(commentId);
            if (!comentario) return res.status(404).json({ msg: 'Comentario no encontrado' });
            if (comentario.author_id !== idUsuario && userRole !== 'ADMIN' && userRole !== 'MODERADOR') {
                return res.status(403).json({ msg: 'No autorizado' });
            }

            await comentario.destroy();
            res.json({ msg: 'Comentario eliminado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar comentario' });
        }
    };

    static votar = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { postId } = req.params;
            const { value } = req.body;

            if (![1, -1, 0].includes(value)) {
                return res.status(400).json({ msg: 'Valor de voto inválido (1, -1 o 0)' });
            }

            const votoExistente = await Voto.findOne({
                where: { post_id: postId, user_id: idUsuario },
            });

            if (value === 0) {
                if (votoExistente) {
                    const oldValue = votoExistente.value;
                    await votoExistente.destroy();
                    await Publicacion.increment('upvote_count', {
                        by: -oldValue,
                        where: { post_id: postId },
                    });
                }
            } else if (votoExistente) {
                const diff = value - votoExistente.value;
                votoExistente.value = value;
                await votoExistente.save();
                await Publicacion.increment('upvote_count', {
                    by: diff,
                    where: { post_id: postId },
                });
            } else {
                await Voto.create({ post_id: postId, user_id: idUsuario, value });
                await Publicacion.increment('upvote_count', {
                    by: value,
                    where: { post_id: postId },
                });

                if (value === 1) {
                    const post = await Publicacion.findByPk(postId, { attributes: ['author_id', 'upvote_count'] });
                    if (post && post.upvote_count === 1 && post.author_id !== idUsuario) {
                        await ServicioLogros.verificarYDesbloquear(post.author_id, 'post_featured', 1);
                    }
                }
            }

            res.json({ msg: 'Voto registrado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al votar' });
        }
    };

    static reportarPublicacion = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { postId } = req.params;
            const { reason } = req.body;

            if (!reason || reason.trim().length < 3) {
                return res.status(400).json({ msg: 'El motivo del reporte es obligatorio' });
            }

            const publicacion = await Publicacion.findByPk(postId);
            if (!publicacion) return res.status(404).json({ msg: 'Post no encontrado' });

            // Evitar duplicados del mismo usuario sobre el mismo post
            const reporte = await ReportePublicacion.findOne({
                where: { post_id: postId, reporter_id: idUsuario, status: 'pending' },
            });
            if (reporte) {
                return res.status(409).json({ msg: 'Ya has reportado esta publicación' });
            }

            await ReportePublicacion.create({
                post_id: postId,
                reporter_id: idUsuario,
                reason: reason.trim(),
                status: 'pending',
            });

            res.json({ msg: 'Reporte enviado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al reportar' });
        }
    };

    static votarComentario = async (req: Request, res: Response) => {
        try {
            const { commentId } = req.params;
            const { value } = req.body;

            if (![1, -1, 0].includes(value)) {
                return res.status(400).json({ msg: 'Valor de voto inválido (1, -1 o 0)' });
            }

            const comentario = await ComentarioUsuario.findByPk(commentId);
            if (!comentario) return res.status(404).json({ msg: 'Comentario no encontrado' });

            res.json({ msg: 'Voto en comentario registrado', value });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al votar en comentario' });
        }
    };
}

