import { Request, Response } from 'express';
import {
    Conversacion,
    ParticipanteConversacion,
    Mensaje,
    Usuario,
} from '../modelos/Modelos.js';
import { Op } from 'sequelize';

export class ControladorMensaje {

    static obtenerConversaciones = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;

            const todasParticipaciones = await ParticipanteConversacion.findAll({
                where: { user_id: idUsuario },
                include: [{ model: Conversacion, as: 'conversacion' }],
            });

            const misParticipaciones = todasParticipaciones.filter((p: any) => !p.is_archived);

            if (misParticipaciones.length === 0) {
                return res.json([]);
            }

            const convIds = misParticipaciones.map((p: any) => p.conversation_id);

            const otrosParticipantes = await ParticipanteConversacion.findAll({
                where: {
                    conversation_id: { [Op.in]: convIds },
                    user_id: { [Op.ne]: idUsuario },
                },
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['user_id', 'username', 'avatar_url'],
                }],
            });

            const conversaciones = misParticipaciones
                .map((p: any) => {
                    const conv = p.conversacion;
                    const other = otrosParticipantes.find(
                        (op: any) => op.conversation_id === p.conversation_id
                    ) as any;
                    const otroUsuario = other?.usuario;

                    return {
                        id: conv.conversation_id,
                        participant: {
                            user_id: otroUsuario?.user_id ?? '',
                            username: otroUsuario?.username ?? 'Desconocido',
                            avatar_url: otroUsuario?.avatar_url ?? null,
                            is_online: false,
                        },
                        last_message: conv.last_message ?? '',
                        last_message_time: conv.last_message_time ?? conv.createdAt,
                        last_message_sender_id: conv.last_message_sender_id ?? null,
                        unread_count: p.unread_count ?? 0,
                    };
                })
                .sort((a: any, b: any) =>
                    new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
                );

            res.json(conversaciones);

        } catch (error: any) {
            console.error('[obtenerConversaciones]', error?.message ?? error);
            res.status(500).json({ msg: 'Error al obtener conversaciones', detail: error?.message });
        }
    };

    static obtenerMensajes = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { conversationId } = req.params;

            const participante = await ParticipanteConversacion.findOne({
                where: { conversation_id: conversationId, user_id: idUsuario },
            });

            if (!participante) {
                return res.status(403).json({ msg: 'No tienes acceso a esta conversación' });
            }

            const mensajes = await Mensaje.findAll({
                where: { conversation_id: conversationId },
                order: [['created_at', 'ASC']],
                attributes: ['message_id', 'conversation_id', 'sender_id', 'content', 'read', 'created_at', 'reply_to_id'],
            });

            const replyIds = mensajes.map((m: any) => m.reply_to_id).filter(Boolean);
            const mapaRespuestas: Record<string, { content: string; username: string }> = {};

            if (replyIds.length > 0) {
                const mensajesOriginales = await Mensaje.findAll({
                    where: { message_id: { [Op.in]: replyIds } },
                    attributes: ['message_id', 'content', 'sender_id'],
                    include: [{ model: Usuario, as: 'emisor', attributes: ['username'] }],
                });

                for (const orig of mensajesOriginales as any[]) {
                    mapaRespuestas[orig.message_id] = {
                        content: orig.content,
                        username: orig.emisor?.username ?? '',
                    };
                }
            }

            const mensajesFormateados = mensajes.map((m: any) => {
                const reply = m.reply_to_id ? mapaRespuestas[m.reply_to_id] : null;
                return {
                    id: m.message_id,
                    conversation_id: m.conversation_id,
                    sender_id: m.sender_id,
                    content: m.content,
                    timestamp: m.created_at,
                    read: m.read,
                    reply_to_id: m.reply_to_id ?? null,
                    reply_to_content: reply?.content ?? null,
                    reply_to_sender: reply?.username ?? null,
                };
            });

            res.json(mensajesFormateados);

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener mensajes' });
        }
    };

    static crearConversacion = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { participant_id } = req.body;

            if (!participant_id) {
                return res.status(400).json({ msg: 'participant_id es requerido' });
            }

            if (participant_id === idUsuario) {
                return res.status(400).json({ msg: 'No puedes crear una conversación contigo mismo' });
            }

            const otroUsuario = await Usuario.findByPk(participant_id, {
                attributes: ['user_id', 'username', 'avatar_url'],
            });

            if (!otroUsuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            const participacionExistente = await ParticipanteConversacion.findAll({
                where: { user_id: idUsuario },
                attributes: ['conversation_id'],
            });

            const convIdsExistentes = participacionExistente.map(
                (p: any) => p.conversation_id
            );

            if (convIdsExistentes.length > 0) {
                const coincidenciaExistente = await ParticipanteConversacion.findOne({
                    where: {
                        conversation_id: { [Op.in]: convIdsExistentes },
                        user_id: participant_id,
                    },
                });

                if (coincidenciaExistente) {
                    const conversacion = await Conversacion.findByPk(coincidenciaExistente.conversation_id);
                    return res.json({
                        id: conversacion!.conversation_id,
                        participant: {
                            user_id: otroUsuario.user_id,
                            username: otroUsuario.username,
                            avatar_url: otroUsuario.avatar_url ?? null,
                            is_online: false,
                        },
                        last_message: conversacion!.last_message ?? '',
                        last_message_time: conversacion!.last_message_time ?? conversacion!.createdAt,
                        last_message_sender_id: conversacion!.last_message_sender_id ?? null,
                        unread_count: 0,
                    });
                }
            }

            const conversacion = await Conversacion.create({});

            await ParticipanteConversacion.bulkCreate([
                { conversation_id: conversacion.conversation_id, user_id: idUsuario },
                { conversation_id: conversacion.conversation_id, user_id: participant_id },
            ]);

            const usuarioIniciador = await Usuario.findByPk(idUsuario, {
                attributes: ['user_id', 'username', 'avatar_url'],
            });

            const io = req.app.get('io');
            if (io) {
                io.to(participant_id).emit('new_conversation', {
                    id: conversacion.conversation_id,
                    participant: {
                        user_id: usuarioIniciador!.user_id,
                        username: usuarioIniciador!.username,
                        avatar_url: usuarioIniciador!.avatar_url ?? null,
                        is_online: false,
                    },
                    last_message: '',
                    last_message_time: conversacion.createdAt,
                    last_message_sender_id: null,
                    unread_count: 0,
                });
            }

            res.status(201).json({
                id: conversacion.conversation_id,
                participant: {
                    user_id: otroUsuario.user_id,
                    username: otroUsuario.username,
                    avatar_url: otroUsuario.avatar_url ?? null,
                    is_online: false,
                },
                last_message: '',
                last_message_time: conversacion.createdAt,
                last_message_sender_id: null,
                unread_count: 0,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al crear la conversación' });
        }
    };

    static obtenerConversacionesArchivadas = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;

            const todasParticipaciones = await ParticipanteConversacion.findAll({
                where: { user_id: idUsuario },
                include: [{ model: Conversacion, as: 'conversacion' }],
            });

            const misParticipaciones = todasParticipaciones.filter((p: any) => p.is_archived === true);

            if (misParticipaciones.length === 0) return res.json([]);

            const convIds = misParticipaciones.map((p: any) => p.conversation_id);

            const otrosParticipantes = await ParticipanteConversacion.findAll({
                where: { conversation_id: { [Op.in]: convIds }, user_id: { [Op.ne]: idUsuario } },
                include: [{ model: Usuario, as: 'usuario', attributes: ['user_id', 'username', 'avatar_url'] }],
            });

            const conversaciones = misParticipaciones
                .map((p: any) => {
                    const conv = p.conversacion;
                    const other = otrosParticipantes.find((op: any) => op.conversation_id === p.conversation_id) as any;
                    const otroUsuario = other?.usuario;
                    return {
                        id: conv.conversation_id,
                        participant: {
                            user_id: otroUsuario?.user_id ?? '',
                            username: otroUsuario?.username ?? 'Desconocido',
                            avatar_url: otroUsuario?.avatar_url ?? null,
                            is_online: false,
                        },
                        last_message: conv.last_message ?? '',
                        last_message_time: conv.last_message_time ?? conv.createdAt,
                        last_message_sender_id: conv.last_message_sender_id ?? null,
                        unread_count: p.unread_count ?? 0,
                        is_archived: true,
                    };
                })
                .sort((a: any, b: any) =>
                    new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
                );

            res.json(conversaciones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener conversaciones archivadas' });
        }
    };

    static archivarConversacion = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { conversationId } = req.params;

            const updated = await ParticipanteConversacion.update(
                { is_archived: true },
                { where: { conversation_id: conversationId, user_id: idUsuario } }
            );

            if (!updated[0]) return res.status(404).json({ msg: 'Conversación no encontrada' });
            res.json({ msg: 'Conversación archivada' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al archivar' });
        }
    };

    static desarchivarConversacion = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { conversationId } = req.params;

            await ParticipanteConversacion.update(
                { is_archived: false },
                { where: { conversation_id: conversationId, user_id: idUsuario } }
            );

            res.json({ msg: 'Conversación desarchivada' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al desarchivar' });
        }
    };

    static cerrarConversacion = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { conversationId } = req.params;

            await ParticipanteConversacion.destroy({
                where: { conversation_id: conversationId, user_id: idUsuario },
            });

            res.json({ msg: 'Conversación cerrada' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al cerrar la conversación' });
        }
    };
}

