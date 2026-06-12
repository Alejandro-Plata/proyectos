import { Request, Response } from 'express';
import { NotaUsuario, Usuario } from '../modelos/Modelos.js';
import { ServicioXP } from '../servicios/ServicioXP.js';
import { ServicioLogros } from '../servicios/ServicioLogros.js';
import { RECOMPENSA_XP_NOTA } from '../utils/constXP.js';
import { subirArchivo } from '../servicios/ServicioStorage.js';

export class ControladorNotaUsuario {

    static subirImagen = async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ msg: 'No se subió ninguna imagen' });
        }
        const url = await subirArchivo(req.file, 'notes', 'note');
        res.status(201).json({ url });
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
            const datosActualizacion = req.body;

            const nota = await NotaUsuario.findOne({
                where: { note_id: idNota, user_id: idUsuario }
            });

            if (!nota) {
                return res.status(404).json({ msg: "Nota no encontrada" });
            }

            await nota.update(datosActualizacion);

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

            return res.json(nota);

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
            if (language) {
                filtro.language = language;
            }

            const notas = await NotaUsuario.findAll({
                where: filtro,
                order: [['updated_at', 'DESC']]
            });

            res.json(notas);

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

            const eliminados = await NotaUsuario.destroy({
                where: {
                    note_id: idNota,
                    user_id: idUsuario
                }
            });

            if (eliminados === 0) {
                return res.status(404).json({ msg: "Nota no encontrada o no tienes permisos" });
            }

            res.json({ msg: "Nota eliminada correctamente" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error al eliminar la nota" });
        }
    };
}

