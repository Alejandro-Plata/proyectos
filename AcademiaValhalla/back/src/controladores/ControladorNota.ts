import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { NotaUsuario, Usuario, RevisionNota } from '../modelos/Modelos.js';
import { ServicioXP } from '../servicios/ServicioXP.js';
import { ServicioLogros } from '../servicios/ServicioLogros.js';
import { RECOMPENSA_XP_NOTA } from '../utils/constXP.js';
import { subirArchivo, eliminarArchivo } from '../servicios/ServicioStorage.js';

const CAMPOS_EDITABLES = ['title', 'description', 'summary', 'language', 'tags', 'difficulty', 'content'] as const;

function urlsDeImagenes(content: any[]): string[] {
    return (content ?? [])
        .filter(b => b?.type === 'image' && typeof b.value === 'string' && b.value.startsWith('https://'))
        .map(b => b.value);
}

export class ControladorNotaUsuario {

    static subirImagen = async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ msg: 'No se subió ninguna imagen' });
        }
        try {
            const url = await subirArchivo(req.file, 'notes', 'note');
            res.status(201).json({ url });
        } catch (error: any) {
            console.error('[subirImagen]', error?.message ?? error);
            res.status(500).json({ msg: error?.message ?? 'Error al subir la imagen' });
        }
    };

    static crearNota = async (req: Request, res: Response) => {
        try {
            const {
                title,
                description,
                summary,
                language,
                tags,
                difficulty,
                content,
                share_to_community,
            } = req.body;

            const idUsuario = req.user!.user_id;

            const nuevaNota = await NotaUsuario.create({
                user_id: idUsuario,
                title,
                description: description || '',
                summary: summary || '',
                language: language || 'General',
                tags: tags || [],
                difficulty: difficulty || 'Básico',
                content: content,
                community_status: share_to_community ? 'pending' : 'personal',
            } as any);

            const recompensaXP = await ServicioXP.otorgarXP(idUsuario, RECOMPENSA_XP_NOTA);

            const totalNotas = await NotaUsuario.count({ where: { user_id: idUsuario } });
            const logrosDesbloqueados = await ServicioLogros.verificarYDesbloquear(
                idUsuario, 'note_count', totalNotas
            );

            return res.status(201).json({
                msg: "Nota creada correctamente",
                note: nuevaNota,
                xpReward: recompensaXP,
                unlockedAchievements: logrosDesbloqueados,
                communityPending: share_to_community ? true : false,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Hubo un error al guardar la nota" });
        }
    };

    static actualizarNota = async (req: Request, res: Response) => {
        try {
            const { noteId: idNota } = req.params;
            const idUsuario = req.user!.user_id;

            // Lista blanca: nunca aceptar community_status ni user_id del body
            const datos: Record<string, any> = {};
            for (const campo of CAMPOS_EDITABLES) {
                if (campo in req.body) datos[campo] = req.body[campo];
            }

            const nota = await NotaUsuario.findOne({
                where: { note_id: idNota, user_id: idUsuario }
            });

            if (!nota) {
                return res.status(404).json({ msg: "Nota no encontrada" });
            }

            // Notas aprobadas en comunidad → revisión pendiente
            if (nota.community_status === 'approved') {
                await RevisionNota.upsert({
                    note_id: (nota as any).note_id,
                    author_id: idUsuario,
                    payload: datos,
                    status: 'pending',
                    reviewed_by: null,
                    review_comment: null,
                } as any, { conflictFields: ['note_id', 'status'] } as any);
                return res.status(202).json({
                    msg: 'Cambios enviados a revisión. La versión publicada no cambia hasta su aprobación.',
                    revisionPending: true,
                });
            }

            // Borrar imágenes de Supabase que el usuario haya quitado
            if (datos.content) {
                const antes = new Set(urlsDeImagenes(nota.content as any[]));
                const despues = new Set(urlsDeImagenes(datos.content));
                const eliminadas = [...antes].filter(u => !despues.has(u));
                await Promise.allSettled(eliminadas.map(u => eliminarArchivo(u)));
            }

            await nota.update(datos);
            return res.status(200).json({ msg: "Nota actualizada correctamente", note: nota });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error al actualizar la nota" });
        }
    };

    static obtenerNotaPorId = async (req: Request, res: Response) => {
        try {
            const { noteId: idNota } = req.params;
            const idUsuario = req.user!.user_id;

            const nota = await NotaUsuario.findOne({
                where: { note_id: idNota, user_id: idUsuario }
            });

            if (!nota) {
                return res.status(404).json({ msg: "Nota no encontrada" });
            }

            // Incluir revisión pendiente si existe
            const revisionPendiente = await RevisionNota.findOne({
                where: { note_id: (nota as any).note_id, status: 'pending' },
                attributes: ['revision_id', 'created_at'],
            });

            const revisionRechazada = await RevisionNota.findOne({
                where: { note_id: (nota as any).note_id, status: 'rejected' },
                order: [['created_at', 'DESC']],
                attributes: ['revision_id', 'review_comment', 'created_at'],
            });

            return res.json({
                ...( nota as any).toJSON(),
                pendingRevision: revisionPendiente ?? null,
                rejectedRevision: revisionRechazada ?? null,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error al obtener la nota" });
        }
    };

    static obtenerTodasMisNotas = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { language } = req.query;

            const filtro: any = { user_id: idUsuario };
            if (language) filtro.language = language;

            const notas = await NotaUsuario.findAll({
                where: filtro,
                include: [{
                    model: RevisionNota,
                    as: 'revisiones',
                    required: false,
                    where: { status: { [Op.in]: ['pending', 'rejected'] } },
                    attributes: ['revision_id', 'status', 'review_comment', 'created_at'],
                }],
                order: [['updated_at', 'DESC']],
            });

            const resultado = notas.map((nota: any) => {
                const n = nota.toJSON();
                const revisiones: any[] = n.revisiones ?? [];
                const pendingRevision = revisiones.find((r: any) => r.status === 'pending') ?? null;
                const rejectedRevision = revisiones
                    .filter((r: any) => r.status === 'rejected')
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] ?? null;
                const { revisiones: _, ...rest } = n;
                return { ...rest, pendingRevision, rejectedRevision };
            });

            res.json(resultado);

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error al obtener tus notas" });
        }
    };

    static obtenerNotasComunidad = async (req: Request, res: Response) => {
        try {
            const { language } = req.query;
            const filtro: any = { community_status: 'approved' };
            if (language) filtro.language = language;

            const notas = await NotaUsuario.findAll({
                where: filtro,
                include: [{ model: Usuario, as: 'autorNota', attributes: ['username', 'avatar_url'] }],
                order: [['updated_at', 'DESC']],
            });

            res.json(notas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener notas de comunidad' });
        }
    };

    static eliminarNota = async (req: Request, res: Response) => {
        try {
            const { noteId: idNota } = req.params;
            const idUsuario = req.user!.user_id;

            const nota = await NotaUsuario.findOne({
                where: { note_id: idNota, user_id: idUsuario }
            });

            if (!nota) {
                return res.status(404).json({ msg: "Nota no encontrada o no tienes permisos" });
            }

            const urls = urlsDeImagenes(nota.content as any[]);
            await nota.destroy();
            await Promise.allSettled(urls.map(u => eliminarArchivo(u)));

            res.json({ msg: "Nota eliminada correctamente" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error al eliminar la nota" });
        }
    };

    // ====== Métodos para admin/moderador ======

    static listarRevisionesPendientes = async (_req: Request, res: Response) => {
        try {
            const revisiones = await RevisionNota.findAll({
                where: { status: 'pending' },
                include: [
                    { model: NotaUsuario, as: 'nota' },
                    { model: Usuario, as: 'autor', attributes: ['user_id', 'username', 'avatar_url'] },
                ],
                order: [['created_at', 'ASC']],
            });
            res.json(revisiones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al listar revisiones' });
        }
    };

    static resolverRevision = async (req: Request, res: Response) => {
        try {
            const { revisionId } = req.params;
            const { action, comment } = req.body as { action: 'approve' | 'reject'; comment?: string };
            const revisadoPor = req.user!.user_id;

            const revision = await RevisionNota.findByPk(revisionId, {
                include: [{ model: NotaUsuario, as: 'nota' }],
            });

            if (!revision) return res.status(404).json({ msg: 'Revisión no encontrada' });
            if ((revision as any).status !== 'pending') return res.status(400).json({ msg: 'La revisión ya fue resuelta' });

            if (action === 'approve') {
                const nota = (revision as any).nota as NotaUsuario;
                const payload = (revision as any).payload as any;

                // Borrar imágenes sustituidas al aprobar
                if (payload.content) {
                    const antes = new Set(urlsDeImagenes(nota.content as any[]));
                    const despues = new Set(urlsDeImagenes(payload.content));
                    const eliminadas = [...antes].filter(u => !despues.has(u));
                    await Promise.allSettled(eliminadas.map(u => eliminarArchivo(u)));
                }

                await nota.update(payload);
                await (revision as any).update({ status: 'approved', reviewed_by: revisadoPor, review_comment: comment ?? null });
                return res.json({ msg: 'Revisión aprobada y nota actualizada' });
            } else {
                // Limpiar imágenes nuevas del payload rechazado
                const payload = (revision as any).payload as any;
                if (payload.content) {
                    const nota = (revision as any).nota as NotaUsuario;
                    const actuales = new Set(urlsDeImagenes(nota.content as any[]));
                    const nuevas = urlsDeImagenes(payload.content).filter(u => !actuales.has(u));
                    await Promise.allSettled(nuevas.map(u => eliminarArchivo(u)));
                }
                await (revision as any).update({ status: 'rejected', reviewed_by: revisadoPor, review_comment: comment ?? null });
                return res.json({ msg: 'Revisión rechazada' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al resolver la revisión' });
        }
    };
}

