import { Request, Response } from 'express';
import { ContenidoAcademia, Usuario } from '../modelos/Modelos.js';
import { Op } from 'sequelize';

export class ControladorAcademia {

    static obtenerTodos = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = (page - 1) * limit;

            const where: any = { is_published: true };
            if (req.query.type) where.type = req.query.type;
            if (req.query.search) {
                where.title = { [Op.iLike]: `%${req.query.search}%` };
            }

            const { count, rows } = await ContenidoAcademia.findAndCountAll({
                where,
                include: [
                    { model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] },
                ],
                limit,
                offset,
                order: [['order_index', 'ASC']],
            });

            res.json({
                data: rows,
                total: count,
                page,
                totalPages: Math.ceil(count / limit),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener contenido' });
        }
    };

    static obtenerPorSlug = async (req: Request, res: Response) => {
        try {
            const { slug } = req.params;

            const content = await ContenidoAcademia.findOne({
                where: { slug, is_published: true },
                include: [
                    { model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] },
                ],
            });

            if (!content) {
                return res.status(404).json({ msg: 'Contenido no encontrado' });
            }

            res.json(content);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener el contenido' });
        }
    };

    /* Crear contenido (solo admin) */
    static crear = async (req: Request, res: Response) => {
        try {
            const userRole = req.user!.role;
            if (userRole !== 'ADMIN') {
                return res.status(403).json({ msg: 'Solo administradores pueden crear contenido' });
            }

            const idUsuario = req.user!.user_id;
            const { title, slug, description, body, type, is_published, order_index } = req.body;

            const content = await ContenidoAcademia.create({
                title,
                slug,
                description,
                body,
                type: type || 'LECCION',
                is_published: is_published || false,
                order_index: order_index || 0,
                author_id: idUsuario,
            });

            res.status(201).json({ msg: 'Contenido creado', content });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al crear contenido' });
        }
    };

    /* Actualizar contenido (solo admin) */
    static actualizar = async (req: Request, res: Response) => {
        try {
            if (req.user!.role !== 'ADMIN') {
                return res.status(403).json({ msg: 'Solo administradores' });
            }

            const { contentId } = req.params;
            const content = await ContenidoAcademia.findByPk(contentId);
            if (!content) return res.status(404).json({ msg: 'No encontrado' });

            // Mitigación §3.4 SEGURIDAD.md — whitelist explícita.
            const { title, slug, content: cuerpo, content_type, difficulty, tags, is_published } = req.body;
            const cambios: any = {};
            if (title         !== undefined) cambios.title         = title;
            if (slug          !== undefined) cambios.slug          = slug;
            if (cuerpo        !== undefined) cambios.content       = cuerpo;
            if (content_type  !== undefined) cambios.content_type  = content_type;
            if (difficulty    !== undefined) cambios.difficulty    = difficulty;
            if (tags          !== undefined) cambios.tags          = tags;
            if (is_published  !== undefined) cambios.is_published  = is_published;

            await content.update(cambios);
            res.json({ msg: 'Contenido actualizado', content });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al actualizar' });
        }
    };

    /* Eliminar contenido (solo admin) */
    static eliminar = async (req: Request, res: Response) => {
        try {
            if (req.user!.role !== 'ADMIN') {
                return res.status(403).json({ msg: 'Solo administradores' });
            }

            const { contentId } = req.params;
            const content = await ContenidoAcademia.findByPk(contentId);
            if (!content) return res.status(404).json({ msg: 'No encontrado' });

            await content.destroy();
            res.json({ msg: 'Contenido eliminado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar' });
        }
    };
}

