import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    Usuario, Reto, LenguajeReto, LenguajeProgramacion,
    Publicacion, ContenidoAcademia, NotaUsuario,
    Etiqueta, SolicitudContenido, ReportePublicacion,
    Logro, LogroUsuario, ComentarioUsuario,
} from '../modelos/Modelos.js';
import { Op } from 'sequelize';
import { db } from '../config/db.js';
import { validarPayloadReto, validarPayloadNota } from '../utils/validarPayloadContenido.js';
import { aprobarRetoDesdeSolicitud, aprobarNotaDesdeSolicitud } from '../servicios/ServicioAprobacionContenido.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ControladorAdmin {

    static obtenerEstadisticas = async (req: Request, res: Response) => {
        try {
            const [totalUsers, totalChallenges, totalPosts, totalGlobalNotes, pendingRequests, reportedPosts] = await Promise.all([
                Usuario.count(),
                Reto.count(),
                Publicacion.count(),
                ContenidoAcademia.count(),
                SolicitudContenido.count({ where: { status: 'pending' } }),
                ReportePublicacion.count({ where: { status: 'pending' } }),
            ]);

            res.json({
                totalUsers,
                activeUsersToday: 0,
                totalChallenges,
                totalPosts,
                totalGlobalNotes,
                pendingRequests,
                reportedPosts,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener estadísticas' });
        }
    };

    static obtenerUsuarios = async (req: Request, res: Response) => {
        try {
            const pagina = parseInt(req.query.page as string) || 1;
            const limite = parseInt(req.query.limit as string) || 20;
            const offset = (pagina - 1) * limite;
            const busqueda = req.query.search as string;

            const filtro: any = {};
            if (busqueda) {
                filtro[Op.or] = [
                    { username: { [Op.iLike]: `%${busqueda}%` } },
                    { email: { [Op.iLike]: `%${busqueda}%` } },
                ];
            }

            const { count: total, rows: filas } = await Usuario.findAndCountAll({
                where: filtro,
                attributes: { exclude: ['password'] },
                limit: limite,
                offset,
                order: [['created_at', 'DESC']],
            });

            res.json({ data: filas, total, page: pagina, totalPages: Math.ceil(total / limite) });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener usuarios' });
        }
    };

    static actualizarUsuario = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { role, is_banned } = req.body;

            const usuario = await Usuario.findByPk(userId);
            if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

            if (role !== undefined) usuario.role = role;
            if (is_banned !== undefined) (usuario as any).is_banned = is_banned;
            await usuario.save();

            const respuestaUsuario = usuario.toJSON();
            delete (respuestaUsuario as any).password;
            res.json(respuestaUsuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al actualizar usuario' });
        }
    };

    static eliminarUsuario = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const eliminados = await Usuario.destroy({ where: { user_id: userId } });
            if (eliminados === 0) return res.status(404).json({ msg: 'Usuario no encontrado' });
            res.json({ msg: 'Usuario eliminado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar usuario' });
        }
    };

    static obtenerRetos = async (req: Request, res: Response) => {
        try {
            const pagina = parseInt(req.query.page as string) || 1;
            const limite = parseInt(req.query.limit as string) || 20;
            const offset = (pagina - 1) * limite;
            const busqueda = req.query.search as string;

            const filtro: any = {};
            if (busqueda) filtro.title = { [Op.iLike]: `%${busqueda}%` };

            const { count: total, rows: filas } = await Reto.findAndCountAll({
                where: filtro,
                include: [
                    { model: Etiqueta, through: { attributes: [] }, attributes: ['name'] },
                    { model: Usuario, as: 'autor', attributes: ['username'] },
                ],
                limit: limite,
                offset,
                order: [['created_at', 'DESC']],
                subQuery: false,
            });

            const difficultyMap: Record<string, string> = {
                FACIL: 'easy', MEDIO: 'medium', DIFICIL: 'hard', EXPERTO: 'hard',
            };

            const data = filas.map((c: any) => ({
                id: c.challenge_id,
                title: c.title,
                difficulty: difficultyMap[c.difficulty] ?? 'medium',
                language: '',
                tags: c.etiquetas?.map((t: any) => t.name) ?? [],
                is_global: true,
                submitted_by: c.autor?.username,
                created_at: c.created_at,
            }));

            res.json({ data, total, page: pagina, totalPages: Math.ceil(total / limite) });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener challenges' });
        }
    };

    static eliminarReto = async (req: Request, res: Response) => {
        try {
            const { challengeId } = req.params;
            const eliminados = await Reto.destroy({ where: { challenge_id: challengeId } });
            if (eliminados === 0) return res.status(404).json({ msg: 'Reto no encontrado' });
            res.json({ msg: 'Reto eliminado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar reto' });
        }
    };

    /* Solo muestra notas pendientes de revisión */
    static obtenerNotas = async (req: Request, res: Response) => {
        try {
            const pagina = parseInt(req.query.page as string) || 1;
            const limite = parseInt(req.query.limit as string) || 20;
            const offset = (pagina - 1) * limite;
            const busqueda = req.query.search as string;

            const filtro: any = { community_status: 'pending' };
            if (busqueda) filtro.title = { [Op.iLike]: `%${busqueda}%` };

            const { count: total, rows: filas } = await NotaUsuario.findAndCountAll({
                where: filtro,
                include: [{ model: Usuario, as: 'autorNota', attributes: ['username'] }],
                limit: limite,
                offset,
                order: [['created_at', 'DESC']],
                subQuery: false,
            });

            const data = filas.map((n: any) => ({
                id: n.note_id,
                title: n.title,
                language: n.language,
                difficulty: n.difficulty,
                tags: n.tags,
                community_status: n.community_status,
                submitted_by: n.autorNota?.username,
                created_at: n.created_at,
            }));

            res.json({ data, total, page: pagina, totalPages: Math.ceil(total / limite) });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener apuntes' });
        }
    };

    static revisarNota = async (req: Request, res: Response) => {
        try {
            const { noteId } = req.params;
            const { action } = req.body; 

            const nota = await NotaUsuario.findByPk(noteId, {
                include: [{ model: Usuario, as: 'autorNota', attributes: ['username'] }],
            }) as any;

            if (!nota) return res.status(404).json({ msg: 'Apunte no encontrado' });

            if (action === 'approve') {
                await Publicacion.create({
                    user_id: nota.user_id,
                    title: nota.title,
                    content: nota.content,
                    post_type: 'RECURSO',
                } as any);
                await nota.update({ community_status: 'approved' });
                return res.json({ msg: 'Apunte aprobado y publicado en la comunidad' });
            }

            if (action === 'reject') {
                await nota.update({ community_status: 'rejected' });
                return res.json({ msg: 'Apunte rechazado' });
            }

            res.status(400).json({ msg: 'Acción no válida. Usa "approve" o "reject"' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al revisar el apunte' });
        }
    };

    static obtenerNotaPorId = async (req: Request, res: Response) => {
        try {
            const { noteId } = req.params;
            const nota = await NotaUsuario.findByPk(noteId, {
                include: [{ model: Usuario, as: 'autorNota', attributes: ['username', 'avatar_url'] }],
            }) as any;
            if (!nota) return res.status(404).json({ msg: 'Apunte no encontrado' });
            res.json({
                id: nota.note_id,
                title: nota.title,
                language: nota.language,
                difficulty: nota.difficulty,
                tags: nota.tags,
                content: nota.content,
                community_status: nota.community_status,
                submitted_by: nota.autorNota?.username,
                author_avatar: nota.autorNota?.avatar_url,
                created_at: nota.created_at,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener apunte' });
        }
    };

    static eliminarNota = async (req: Request, res: Response) => {
        try {
            const { noteId } = req.params;
            const eliminados = await NotaUsuario.destroy({ where: { note_id: noteId } });
            if (eliminados === 0) return res.status(404).json({ msg: 'Apunte no encontrado' });
            res.json({ msg: 'Apunte eliminado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar apunte' });
        }
    };

    static crearSolicitudContenido = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { type, title, description, metadata } = req.body;

            if (!type || !title || !description) {
                return res.status(400).json({ msg: 'type, title y description son obligatorios' });
            }

            const solicitud = await SolicitudContenido.create({
                author_id: idUsuario,
                content_type: type,
                title,
                description,
                metadata: metadata ?? {},
            });

            res.status(201).json({ msg: 'Solicitud enviada', request: solicitud });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al crear solicitud' });
        }
    };

    static obtenerSolicitudesContenido = async (req: Request, res: Response) => {
        try {
            const pagina = parseInt(req.query.page as string) || 1;
            const limite = parseInt(req.query.limit as string) || 20;
            const offset = (pagina - 1) * limite;
            const { status, content_type } = req.query;

            const filtro: any = {};
            if (status) filtro.status = status;
            if (content_type) filtro.content_type = content_type;

            const { count: total, rows: filas } = await SolicitudContenido.findAndCountAll({
                where: filtro,
                include: [
                    { model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] },
                ],
                limit: limite,
                offset,
                order: [['created_at', 'DESC']],
            });

            const data = filas.map((r: any) => ({
                id: r.request_id,
                author_id: r.author_id,
                author_username: r.autor?.username ?? '',
                author_avatar_url: r.autor?.avatar_url,
                content_type: r.content_type,
                status: r.status,
                title: r.title,
                description: r.description,
                submitted_at: r.created_at,
                reviewed_by: r.reviewed_by,
                reviewed_at: r.reviewed_at,
                rejection_reason: r.rejection_reason,
                resource_id: r.resource_id,
                resource_type: r.resource_type,
                challenge_data: r.content_type === 'challenge' ? r.metadata : undefined,
                note_data: r.content_type === 'note' ? r.metadata : undefined,
            }));

            res.json({ data, total, page: pagina, totalPages: Math.ceil(total / limite) });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener solicitudes' });
        }
    };

    static revisarSolicitudContenido = async (req: Request, res: Response) => {
        const { requestId } = req.params;
        const { action, rejection_reason } = req.body;
        const idRevisor = req.user!.user_id;

        const solicitud = await SolicitudContenido.findByPk(requestId);
        if (!solicitud) return res.status(404).json({ msg: 'Solicitud no encontrada' });
        if (solicitud.status !== 'pending') {
            return res.status(409).json({ msg: 'Esta solicitud ya fue revisada' });
        }

        if (action === 'reject') {
            if (!rejection_reason || String(rejection_reason).trim().length < 5) {
                return res.status(400).json({ msg: 'rejection_reason debe tener al menos 5 caracteres' });
            }
            await solicitud.update({
                status: 'rejected',
                rejection_reason: rejection_reason.trim(),
                reviewed_by: idRevisor,
                reviewed_at: new Date(),
            });
            return res.json({ msg: 'Solicitud rechazada', request: solicitud });
        }

        if (action !== 'approve') {
            return res.status(400).json({ msg: 'action debe ser "approve" o "reject"' });
        }

        const metadata = (solicitud as any).metadata ?? {};

        if (solicitud.content_type === 'challenge') {
            const error = validarPayloadReto(metadata);
            if (error) return res.status(400).json({ msg: `Payload inválido: ${error}` });
        } else if (solicitud.content_type === 'note') {
            const error = validarPayloadNota(metadata);
            if (error) return res.status(400).json({ msg: `Payload inválido: ${error}` });
        }

        try {
            const resource = await db.transaction(async (t) => {
                let recurso: { id: string; url: string };

                if (solicitud.content_type === 'challenge') {
                    recurso = await aprobarRetoDesdeSolicitud(solicitud, t);
                } else {
                    recurso = await aprobarNotaDesdeSolicitud(solicitud, t);
                }

                await solicitud.update({
                    status: 'approved',
                    reviewed_by: idRevisor,
                    reviewed_at: new Date(),
                    resource_id: recurso.id,
                    resource_type: solicitud.content_type,
                }, { transaction: t });

                return recurso;
            });

            return res.json({
                msg: 'Solicitud aprobada',
                request: solicitud,
                resource: {
                    type: solicitud.content_type,
                    id: resource.id,
                    url: resource.url,
                },
            });
        } catch (error: any) {
            console.error('[revisarSolicitudContenido]', error);
            if (error.code === 'LANGUAGE_NOT_FOUND') {
                return res.status(400).json({ msg: error.message, code: error.code });
            }
            return res.status(500).json({ msg: 'Error al aprobar la solicitud', detail: error.message });
        }
    };

    static obtenerPublicacionesReportadas = async (req: Request, res: Response) => {
        try {
            const pagina = parseInt(req.query.page as string) || 1;
            const limite = parseInt(req.query.limit as string) || 20;
            const offset = (pagina - 1) * limite;

            const { count: total, rows: filas } = await ReportePublicacion.findAndCountAll({
                include: [
                    {
                        model: Publicacion,
                        as: 'publicacion',
                        attributes: ['post_id', 'title'],
                        include: [{ model: Usuario, as: 'autor', attributes: ['username'] }],
                    },
                    { model: Usuario, as: 'reportador', attributes: ['username'] },
                ],
                limit: limite,
                offset,
                order: [['reported_at', 'DESC']],
            });

            const data = filas.map((r: any) => ({
                id: r.report_id,
                post_id: r.post_id,
                post_title: r.publicacion?.title ?? '',
                post_author: r.publicacion?.autor?.username ?? '',
                reporter_username: r.reportador?.username ?? '',
                reason: r.reason,
                reported_at: r.reported_at,
                status: r.status,
            }));

            res.json({ data, total, page: pagina, totalPages: Math.ceil(total / limite) });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener reportes' });
        }
    };

    static resolverReporte = async (req: Request, res: Response) => {
        try {
            const { reportId } = req.params;
            const { status } = req.body;

            const reporte = await ReportePublicacion.findByPk(reportId);
            if (!reporte) return res.status(404).json({ msg: 'Reporte no encontrado' });

            await reporte.update({ status });

            if (status === 'removed') {
                await Publicacion.destroy({ where: { post_id: reporte.post_id } });
            }

            res.json({ msg: 'Reporte resuelto' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al resolver reporte' });
        }
    };

    static eliminarPublicacion = async (req: Request, res: Response) => {
        try {
            const { postId } = req.params;
            const eliminados = await Publicacion.destroy({ where: { post_id: postId } });
            if (eliminados === 0) return res.status(404).json({ msg: 'Post no encontrado' });
            res.json({ msg: 'Post eliminado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar post' });
        }
    };

    static obtenerTodasPublicaciones = async (req: Request, res: Response) => {
        try {
            const pagina = parseInt(req.query.page as string) || 1;
            const limite = parseInt(req.query.limit as string) || 20;
            const offset = (pagina - 1) * limite;
            const busqueda = req.query.search as string;

            const filtro: any = {};
            if (busqueda) filtro.title = { [Op.iLike]: `%${busqueda}%` };

            const { count: total, rows: filas } = await Publicacion.findAndCountAll({
                where: filtro,
                include: [{ model: Usuario, as: 'autor', attributes: ['username'] }],
                limit: limite,
                offset,
                order: [['created_at', 'DESC']],
                distinct: true,
            });

            const postIds = filas.map((p: any) => p.post_id);
            const conteos = postIds.length ? await ComentarioUsuario.findAll({
                where: { post_id: postIds },
                attributes: ['post_id', [db.fn('COUNT', db.col('user_comment_id')), 'count']],
                group: ['post_id'],
                raw: true,
            }) : [];
            const mapaConteos: Record<string, number> = {};
            (conteos as any[]).forEach((c: any) => { mapaConteos[c.post_id] = parseInt(c.count) || 0; });

            const data = filas.map((p: any) => ({
                id: p.post_id,
                title: p.title,
                post_type: p.post_type,
                author: p.autor?.username ?? 'Desconocido',
                comment_count: mapaConteos[p.post_id] ?? 0,
                created_at: p.created_at,
            }));

            res.json({ data, total, page: pagina, totalPages: Math.ceil(total / limite) });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener publicaciones' });
        }
    };

    static obtenerComentariosPublicacion = async (req: Request, res: Response) => {
        try {
            const { postId } = req.params;
            const comentarios = await ComentarioUsuario.findAll({
                where: { post_id: postId },
                include: [{ model: Usuario, as: 'autor', attributes: ['username'] }],
                order: [['createdAt', 'ASC']],
            });
            const data = (comentarios as any[]).map((c) => ({
                id: c.user_comment_id,
                content: c.content,
                author: c.autor?.username ?? 'Desconocido',
                is_solution: c.is_solution,
                created_at: c.createdAt,
            }));
            res.json({ data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener comentarios' });
        }
    };

    static eliminarComentarioAdmin = async (req: Request, res: Response) => {
        try {
            const { commentId } = req.params;
            const eliminados = await ComentarioUsuario.destroy({ where: { user_comment_id: commentId } });
            if (eliminados === 0) return res.status(404).json({ msg: 'Comentario no encontrado' });
            res.json({ msg: 'Comentario eliminado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar comentario' });
        }
    };

    static obtenerLogros = async (req: Request, res: Response) => {
        try {
            const pagina = parseInt(req.query.page as string) || 1;
            const limite = parseInt(req.query.limit as string) || 20;
            const busqueda = (req.query.search as string) || '';

            const filtro: any = {};
            if (busqueda) {
                filtro.title = { [Op.iLike]: `%${busqueda}%` };
            }

            const { count: total, rows: filas } = await Logro.findAndCountAll({
                where: filtro,
                order: [['display_order', 'ASC'], ['created_at', 'DESC']],
                limit: limite,
                offset: (pagina - 1) * limite,
            });

            return res.json({ total, achievements: filas });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    static crearLogro = async (req: Request, res: Response) => {
        try {
            const { title, description, trigger_type, threshold, xp_reward, rarity, display_order } = req.body;

            if (!title || !description || !trigger_type || threshold == null || xp_reward == null || !rarity) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }

            const emblem_url = req.file ? `/uploads/emblems/${req.file.filename}` : null;

            const logro = await Logro.create({
                title,
                description,
                trigger_type,
                threshold: parseInt(threshold),
                xp_reward: parseInt(xp_reward),
                rarity,
                emblem_url,
                display_order: parseInt(display_order) || 0,
                is_active: req.body.is_active === 'false' ? false : true,
                status: req.body.status === 'published' ? 'published' : 'pending',
            });

            return res.status(201).json(logro);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    static actualizarLogro = async (req: Request, res: Response) => {
        try {
            const { achievementId } = req.params;
            const logro = await Logro.findByPk(achievementId);
            if (!logro) return res.status(404).json({ error: 'Logro no encontrado' });

            const actualizaciones: any = {};
            const campos = ['title', 'description', 'trigger_type', 'threshold', 'xp_reward', 'rarity', 'display_order', 'is_active', 'status'];

            for (const campo of campos) {
                if (req.body[campo] !== undefined) {
                    actualizaciones[campo] = ['threshold', 'xp_reward', 'display_order'].includes(campo)
                        ? parseInt(req.body[campo])
                        : campo === 'is_active'
                            ? req.body[campo] === 'true' || req.body[campo] === true
                            : campo === 'status'
                                ? (['pending', 'published'].includes(req.body[campo]) ? req.body[campo] : 'pending')
                                : req.body[campo];
                }
            }

            if (req.file) {
                if (logro.emblem_url) {
                    const fs = await import('fs/promises');
                    const oldPath = path.join(__dirname, '../../public', logro.emblem_url);
                    await fs.unlink(oldPath).catch(() => {});
                }
                actualizaciones.emblem_url = `/uploads/emblems/${req.file.filename}`;
            }

            await logro.update(actualizaciones);
            return res.json(logro);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    static actualizarEstadoLogro = async (req: Request, res: Response) => {
        try {
            const { achievementId } = req.params;
            const { status } = req.body;

            if (!['pending', 'published'].includes(status)) {
                return res.status(400).json({ msg: 'Status inválido. Debe ser "pending" o "published"' });
            }

            const logro = await Logro.findByPk(achievementId);
            if (!logro) return res.status(404).json({ msg: 'Logro no encontrado' });

            logro.status = status;
            await logro.save();

            return res.json(logro);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    static eliminarLogro = async (req: Request, res: Response) => {
        try {
            const { achievementId } = req.params;
            const logro = await Logro.findByPk(achievementId);
            if (!logro) return res.status(404).json({ error: 'Logro no encontrado' });

            await LogroUsuario.destroy({ where: { achievement_id: achievementId } });

            if (logro.emblem_url) {
                const fs = await import('fs/promises');
                const filePath = path.join(__dirname, '../../public', logro.emblem_url);
                await fs.unlink(filePath).catch(() => {});
            }

            await logro.destroy();
            return res.json({ message: 'Logro eliminado correctamente' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };
}

