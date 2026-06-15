import { Op } from 'sequelize';
import { ProyectoShowcase, FeedbackProyecto, VotoProyecto, Usuario } from '../modelos/Modelos.js';
import { ServicioXP } from './ServicioXP.js';
import { ServicioLogros } from './ServicioLogros.js';
import { ServicioEmblemas } from './ServicioEmblemas.js';

const DIMENSIONES = ['codigo', 'diseno', 'idea', 'documentacion'];
const XP_PUBLICAR = 40;

export class ServicioShowcase {

    static async listar(filtros: { tech?: string } = {}) {
        const where: any = {};
        if (filtros.tech) where.tech_stack = { [Op.contains]: [filtros.tech] };
        const proyectos = await ProyectoShowcase.findAll({
            where,
            include: [{ model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] }],
            order: [['featured', 'DESC'], ['upvote_count', 'DESC'], ['created_at', 'DESC']],
            limit: 100,
        });
        return (proyectos as any[]).map(p => this.resumen(p));
    }

    static async obtener(projectId: string, viewerId: string) {
        const p: any = await ProyectoShowcase.findByPk(projectId, {
            include: [
                { model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] },
                { model: FeedbackProyecto, as: 'feedback', include: [{ model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] }] },
            ],
        });
        if (!p) return null;

        const feedback = (p.feedback ?? []) as any[];
        const porDimension: Record<string, { count: number; avg: number }> = {};
        for (const dim of DIMENSIONES) {
            const items = feedback.filter(f => f.dimension === dim);
            porDimension[dim] = {
                count: items.length,
                avg: items.length ? Math.round((items.reduce((s, f) => s + f.rating, 0) / items.length) * 10) / 10 : 0,
            };
        }

        const heVotado = !!(await VotoProyecto.findOne({ where: { project_id: projectId, user_id: viewerId } }));

        return {
            project_id: p.project_id,
            author: p.autor ? { user_id: p.autor.user_id, username: p.autor.username, avatar_url: p.autor.avatar_url ?? null } : null,
            is_owner: p.author_id === viewerId,
            title: p.title,
            summary: p.summary,
            description: p.description ?? [],
            repo_url: p.repo_url,
            demo_url: p.demo_url,
            tech_stack: p.tech_stack ?? [],
            cover_image_url: p.cover_image_url,
            featured: p.featured,
            upvote_count: p.upvote_count,
            i_upvoted: heVotado,
            feedback_summary: porDimension,
            feedback: feedback
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map(f => ({
                    feedback_id: f.feedback_id,
                    dimension: f.dimension,
                    rating: f.rating,
                    comment: f.comment,
                    author: f.autor ? { user_id: f.autor.user_id, username: f.autor.username, avatar_url: f.autor.avatar_url ?? null } : null,
                })),
        };
    }

    static async crear(userId: string, datos: any) {
        const proyecto = await ProyectoShowcase.create({
            author_id: userId,
            title: String(datos.title ?? '').slice(0, 160),
            summary: String(datos.summary ?? '').slice(0, 280),
            description: Array.isArray(datos.description) ? datos.description : [],
            repo_url: datos.repo_url ?? null,
            demo_url: datos.demo_url ?? null,
            tech_stack: Array.isArray(datos.tech_stack) ? datos.tech_stack.slice(0, 15) : [],
            cover_image_url: datos.cover_image_url ?? null,
        });
        const total = await ProyectoShowcase.count({ where: { author_id: userId } });
        if (total === 1) await ServicioXP.otorgarXP(userId, XP_PUBLICAR);
        return proyecto;
    }

    static async actualizar(userId: string, projectId: string, datos: any) {
        const p = await ProyectoShowcase.findByPk(projectId);
        if (!p) throw new Error('Proyecto no encontrado');
        if (p.author_id !== userId) throw new Error('Sin permisos');
        const updates: any = {};
        for (const campo of ['title', 'summary', 'description', 'repo_url', 'demo_url', 'tech_stack', 'cover_image_url']) {
            if (datos[campo] !== undefined) updates[campo] = datos[campo];
        }
        await p.update(updates);
        return p;
    }

    static async eliminar(userId: string, projectId: string, esStaff: boolean) {
        const p = await ProyectoShowcase.findByPk(projectId);
        if (!p) return false;
        if (p.author_id !== userId && !esStaff) throw new Error('Sin permisos');
        await FeedbackProyecto.destroy({ where: { project_id: projectId } });
        await VotoProyecto.destroy({ where: { project_id: projectId } });
        await p.destroy();
        return true;
    }

    static async feedback(userId: string, projectId: string, datos: { dimension: string; rating: number; comment?: string }) {
        if (!DIMENSIONES.includes(datos.dimension)) throw new Error('Dimensión inválida');
        const rating = Math.max(1, Math.min(5, Number(datos.rating)));
        const p = await ProyectoShowcase.findByPk(projectId);
        if (!p) throw new Error('Proyecto no encontrado');
        if (p.author_id === userId) throw new Error('No puedes reseñar tu propio proyecto');

        const existente = await FeedbackProyecto.findOne({ where: { project_id: projectId, author_id: userId, dimension: datos.dimension } });
        if (existente) {
            await existente.update({ rating, comment: datos.comment ?? null });
            return existente;
        }
        return FeedbackProyecto.create({ project_id: projectId, author_id: userId, dimension: datos.dimension, rating, comment: datos.comment ?? null });
    }

    static async toggleUpvote(userId: string, projectId: string) {
        const p = await ProyectoShowcase.findByPk(projectId);
        if (!p) throw new Error('Proyecto no encontrado');
        const voto = await VotoProyecto.findOne({ where: { project_id: projectId, user_id: userId } });
        if (voto) {
            await voto.destroy();
            await p.update({ upvote_count: Math.max(0, p.upvote_count - 1) });
            return { upvoted: false, upvote_count: p.upvote_count };
        }
        await VotoProyecto.create({ project_id: projectId, user_id: userId });
        await p.update({ upvote_count: p.upvote_count + 1 });
        if (p.upvote_count >= 10) {
            await ServicioLogros.verificarYDesbloquear(p.author_id, 'showcase_upvotes', p.upvote_count);
        }
        return { upvoted: true, upvote_count: p.upvote_count };
    }

    static async destacar(projectId: string, featured: boolean) {
        const p = await ProyectoShowcase.findByPk(projectId);
        if (!p) throw new Error('Proyecto no encontrado');
        await p.update({ featured });
        if (featured) await ServicioEmblemas.otorgar(p.author_id, 'showcase', 'Proyecto destacado', { project_id: projectId });
        return p;
    }

    private static resumen(p: any) {
        return {
            project_id: p.project_id,
            title: p.title,
            summary: p.summary,
            tech_stack: p.tech_stack ?? [],
            cover_image_url: p.cover_image_url,
            featured: p.featured,
            upvote_count: p.upvote_count,
            author: p.autor ? { user_id: p.autor.user_id, username: p.autor.username, avatar_url: p.autor.avatar_url ?? null } : null,
        };
    }
}
