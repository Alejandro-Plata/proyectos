import { Request, Response } from 'express';
import {
    Conversacion,
    ParticipanteConversacion,
    Mensaje,
    Usuario,
} from '../modelos/Modelos.js';
import { Op } from 'sequelize';
import { subirArchivo } from '../servicios/ServicioStorage.js';

// ── Helpers ────────────────────────────────────────────────────

const SUPABASE_URL_PREFIX = process.env.SUPABASE_URL ?? '';

function validarMagicBytes(buffer: Buffer, mime: string): boolean {
    if (mime.startsWith('image/jpeg'))  return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    if (mime.startsWith('image/png'))   return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    if (mime.startsWith('image/webp'))  return buffer.slice(8, 12).toString('ascii') === 'WEBP';
    if (mime.startsWith('image/gif'))   return buffer.slice(0, 3).toString('ascii') === 'GIF';
    if (mime.startsWith('audio/ogg'))   return buffer.slice(0, 4).toString('ascii') === 'OggS';
    if (mime.startsWith('audio/mpeg') || mime === 'audio/mp3') {
        return (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) || (buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0);
    }
    if (mime.startsWith('audio/webm') || mime.startsWith('video/webm')) {
        return buffer[0] === 0x1A && buffer[1] === 0x45 && buffer[2] === 0xDF && buffer[3] === 0xA3;
    }
    if (mime.startsWith('video/mp4') || mime === 'audio/mp4' || mime === 'audio/x-m4a') {
        return buffer.slice(4, 8).toString('ascii') === 'ftyp';
    }
    // Permissive fallback for other audio/video types
    return true;
}

function placeholderUltimoMensaje(messageType: string, content?: string): string {
    const caption = content?.trim();
    if (messageType === 'text') return caption ?? '';
    if (messageType === 'image') return caption ? `📷 ${caption}` : '📷 Foto';
    if (messageType === 'video') return caption ? `🎥 ${caption}` : '🎥 Vídeo';
    if (messageType === 'audio') return caption ? `🎤 ${caption}` : '🎤 Audio';
    return caption ?? '';
}

async function buildConversacionesResponse(misParticipaciones: any[], idUsuario: string) {
    if (misParticipaciones.length === 0) return [];

    const grupoIds = misParticipaciones
        .filter((p: any) => p.conversacion?.is_group)
        .map((p: any) => p.conversation_id);
    const directoIds = misParticipaciones
        .filter((p: any) => !p.conversacion?.is_group)
        .map((p: any) => p.conversation_id);

    const [otrosParticipantes, participantesGrupo] = await Promise.all([
        directoIds.length > 0
            ? ParticipanteConversacion.findAll({
                where: { conversation_id: { [Op.in]: directoIds }, user_id: { [Op.ne]: idUsuario } },
                include: [{ model: Usuario, as: 'usuario', attributes: ['user_id', 'username', 'avatar_url'] }],
            })
            : [],
        grupoIds.length > 0
            ? ParticipanteConversacion.findAll({
                where: { conversation_id: { [Op.in]: grupoIds } },
                include: [{ model: Usuario, as: 'usuario', attributes: ['user_id', 'username', 'avatar_url'] }],
            })
            : [],
    ]);

    return misParticipaciones
        .map((p: any) => {
            const conv = p.conversacion;
            if (!conv) return null;

            const base = {
                id: conv.conversation_id,
                last_message: conv.last_message ?? '',
                last_message_time: conv.last_message_time ?? conv.createdAt,
                last_message_sender_id: conv.last_message_sender_id ?? null,
                unread_count: p.unread_count ?? 0,
                is_archived: p.is_archived ?? false,
            };

            if (conv.is_group) {
                const miembros = (participantesGrupo as any[])
                    .filter((gp: any) => gp.conversation_id === conv.conversation_id)
                    .map((gp: any) => ({
                        user_id: gp.usuario?.user_id ?? '',
                        username: gp.usuario?.username ?? '',
                        avatar_url: gp.usuario?.avatar_url ?? null,
                        is_online: false,
                        role: gp.role ?? 'member',
                    }));
                return {
                    ...base,
                    is_group: true,
                    name: conv.name,
                    avatar_url: conv.avatar_url ?? null,
                    participants: miembros,
                    participant_count: miembros.length,
                };
            } else {
                const other = (otrosParticipantes as any[]).find(
                    (op: any) => op.conversation_id === p.conversation_id
                );
                const otroUsuario = other?.usuario;
                return {
                    ...base,
                    is_group: false,
                    participant: {
                        user_id: otroUsuario?.user_id ?? '',
                        username: otroUsuario?.username ?? 'Desconocido',
                        avatar_url: otroUsuario?.avatar_url ?? null,
                        is_online: false,
                    },
                };
            }
        })
        .filter(Boolean)
        .sort((a: any, b: any) =>
            new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
        );
}

// ── Controlador ────────────────────────────────────────────────

export class ControladorMensaje {

    static obtenerConversaciones = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const participaciones = await ParticipanteConversacion.findAll({
                where: { user_id: idUsuario },
                include: [{ model: Conversacion, as: 'conversacion' }],
            });
            const activas = participaciones.filter((p: any) => !p.is_archived);
            res.json(await buildConversacionesResponse(activas, idUsuario));
        } catch (error: any) {
            console.error('[obtenerConversaciones]', error?.message ?? error);
            res.status(500).json({ msg: 'Error al obtener conversaciones' });
        }
    };

    static obtenerMensajes = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { conversationId } = req.params;

            const participante = await ParticipanteConversacion.findOne({
                where: { conversation_id: conversationId, user_id: idUsuario },
            });
            if (!participante) return res.status(403).json({ msg: 'No tienes acceso a esta conversación' });

            const mensajes = await Mensaje.findAll({
                where: { conversation_id: conversationId },
                order: [['created_at', 'ASC']],
                attributes: ['message_id', 'conversation_id', 'sender_id', 'content', 'message_type', 'attachment_url', 'attachment_meta', 'read', 'created_at', 'reply_to_id'],
            });

            const replyIds = mensajes.map((m: any) => m.reply_to_id).filter(Boolean);
            const mapaRespuestas: Record<string, { content?: string; username: string; message_type: string }> = {};

            if (replyIds.length > 0) {
                const originales = await Mensaje.findAll({
                    where: { message_id: { [Op.in]: replyIds } },
                    attributes: ['message_id', 'content', 'message_type', 'sender_id'],
                    include: [{ model: Usuario, as: 'emisor', attributes: ['username'] }],
                });
                for (const orig of originales as any[]) {
                    mapaRespuestas[orig.message_id] = {
                        content: orig.content,
                        username: orig.emisor?.username ?? '',
                        message_type: orig.message_type ?? 'text',
                    };
                }
            }

            const result = mensajes.map((m: any) => {
                const reply = m.reply_to_id ? mapaRespuestas[m.reply_to_id] : null;
                const replyContent = reply
                    ? (reply.message_type !== 'text'
                        ? placeholderUltimoMensaje(reply.message_type, reply.content)
                        : reply.content)
                    : null;
                return {
                    id: m.message_id,
                    conversation_id: m.conversation_id,
                    sender_id: m.sender_id,
                    content: m.content ?? null,
                    message_type: m.message_type ?? 'text',
                    attachment_url: m.attachment_url ?? null,
                    attachment_meta: m.attachment_meta ?? null,
                    timestamp: m.created_at,
                    read: m.read,
                    reply_to_id: m.reply_to_id ?? null,
                    reply_to_content: replyContent,
                    reply_to_sender: reply?.username ?? null,
                };
            });

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener mensajes' });
        }
    };

    static crearConversacion = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { participant_id } = req.body;

            if (!participant_id) return res.status(400).json({ msg: 'participant_id es requerido' });
            if (participant_id === idUsuario) return res.status(400).json({ msg: 'No puedes crear una conversación contigo mismo' });

            const otroUsuario = await Usuario.findByPk(participant_id, {
                attributes: ['user_id', 'username', 'avatar_url'],
            });
            if (!otroUsuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

            // Look for existing DIRECT (non-group) conversation
            const misParticipaciones = await ParticipanteConversacion.findAll({
                where: { user_id: idUsuario },
                attributes: ['conversation_id'],
                include: [{ model: Conversacion, as: 'conversacion', where: { is_group: false }, required: true }],
            });

            if (misParticipaciones.length > 0) {
                const convIds = misParticipaciones.map((p: any) => p.conversation_id);
                const coincidencia = await ParticipanteConversacion.findOne({
                    where: { conversation_id: { [Op.in]: convIds }, user_id: participant_id },
                });
                if (coincidencia) {
                    const conv = await Conversacion.findByPk(coincidencia.conversation_id);
                    const miParticipacion = await ParticipanteConversacion.findOne({
                        where: { conversation_id: coincidencia.conversation_id, user_id: idUsuario },
                    });
                    return res.json({
                        id: conv!.conversation_id,
                        is_group: false,
                        participant: {
                            user_id: (otroUsuario as any).user_id,
                            username: (otroUsuario as any).username,
                            avatar_url: (otroUsuario as any).avatar_url ?? null,
                            is_online: false,
                        },
                        last_message: conv!.last_message ?? '',
                        last_message_time: conv!.last_message_time ?? (conv as any).createdAt,
                        last_message_sender_id: conv!.last_message_sender_id ?? null,
                        unread_count: (miParticipacion as any)?.unread_count ?? 0,
                    });
                }
            }

            const conv = await Conversacion.create({ is_group: false });
            await ParticipanteConversacion.bulkCreate([
                { conversation_id: conv.conversation_id, user_id: idUsuario, role: 'member' },
                { conversation_id: conv.conversation_id, user_id: participant_id, role: 'member' },
            ]);

            const usuarioIniciador = await Usuario.findByPk(idUsuario, { attributes: ['user_id', 'username', 'avatar_url'] });

            const io = req.app.get('io');
            if (io) {
                io.to(participant_id).emit('new_conversation', {
                    id: conv.conversation_id,
                    is_group: false,
                    participant: {
                        user_id: (usuarioIniciador as any)!.user_id,
                        username: (usuarioIniciador as any)!.username,
                        avatar_url: (usuarioIniciador as any)!.avatar_url ?? null,
                        is_online: false,
                    },
                    last_message: '',
                    last_message_time: (conv as any).createdAt,
                    last_message_sender_id: null,
                    unread_count: 0,
                });
            }

            res.status(201).json({
                id: conv.conversation_id,
                is_group: false,
                participant: {
                    user_id: (otroUsuario as any).user_id,
                    username: (otroUsuario as any).username,
                    avatar_url: (otroUsuario as any).avatar_url ?? null,
                    is_online: false,
                },
                last_message: '',
                last_message_time: (conv as any).createdAt,
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
            const participaciones = await ParticipanteConversacion.findAll({
                where: { user_id: idUsuario },
                include: [{ model: Conversacion, as: 'conversacion' }],
            });
            const archivadas = participaciones.filter((p: any) => p.is_archived === true);
            res.json(await buildConversacionesResponse(archivadas, idUsuario));
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener conversaciones archivadas' });
        }
    };

    static archivarConversacion = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { conversationId } = req.params;
            const [n] = await ParticipanteConversacion.update(
                { is_archived: true },
                { where: { conversation_id: conversationId, user_id: idUsuario } }
            );
            if (!n) return res.status(404).json({ msg: 'Conversación no encontrada' });
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

    // ── Adjuntos ────────────────────────────────────────────────

    static subirAdjunto = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { conversation_id } = req.body;
            const file = req.file;

            if (!file) return res.status(400).json({ msg: 'No se subió ningún archivo' });
            if (!conversation_id) return res.status(400).json({ msg: 'conversation_id requerido' });

            const participante = await ParticipanteConversacion.findOne({
                where: { conversation_id, user_id: idUsuario },
            });
            if (!participante) return res.status(403).json({ msg: 'No perteneces a esta conversación' });

            if (!validarMagicBytes(file.buffer, file.mimetype)) {
                return res.status(400).json({ msg: 'El contenido del archivo no coincide con su tipo' });
            }

            const isImage = file.mimetype.startsWith('image/');
            const isAudio = file.mimetype.startsWith('audio/');
            if (isImage && file.size > 5 * 1024 * 1024) return res.status(400).json({ msg: 'Imagen: máximo 5 MB' });
            if (isAudio && file.size > 10 * 1024 * 1024) return res.status(400).json({ msg: 'Audio: máximo 10 MB' });

            const url = await subirArchivo(file, `chat/${conversation_id}`, 'msg');
            res.json({ url, meta: { size: file.size, mime: file.mimetype } });
        } catch (error: any) {
            const msg = error?.message ?? 'Error al subir el archivo';
            console.error('[subirAdjunto]', msg);
            res.status(500).json({ msg });
        }
    };

    // ── Grupos ─────────────────────────────────────────────────

    static crearGrupo = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { name, participant_ids } = req.body;

            if (!name?.trim()) return res.status(400).json({ msg: 'El nombre del grupo es requerido' });
            if (!Array.isArray(participant_ids) || participant_ids.length < 2) {
                return res.status(400).json({ msg: 'Se necesitan al menos 2 participantes' });
            }
            if (participant_ids.length > 50) return res.status(400).json({ msg: 'Máximo 50 participantes' });

            const conv = await Conversacion.create({ is_group: true, name: name.trim(), created_by: idUsuario });
            const allIds: string[] = [idUsuario, ...participant_ids.filter((id: string) => id !== idUsuario)];

            await ParticipanteConversacion.bulkCreate(
                allIds.map((uid: string) => ({
                    conversation_id: conv.conversation_id,
                    user_id: uid,
                    role: uid === idUsuario ? 'owner' : 'member',
                }))
            );

            const users = await Usuario.findAll({
                where: { user_id: { [Op.in]: allIds } },
                attributes: ['user_id', 'username', 'avatar_url'],
            });

            const participants = users.map((u: any) => ({
                user_id: u.user_id,
                username: u.username,
                avatar_url: u.avatar_url ?? null,
                is_online: false,
                role: u.user_id === idUsuario ? 'owner' : 'member',
            }));

            const groupResponse = {
                id: conv.conversation_id,
                is_group: true,
                name: conv.name,
                avatar_url: null,
                participants,
                participant_count: participants.length,
                last_message: '',
                last_message_time: (conv as any).createdAt,
                last_message_sender_id: null,
                unread_count: 0,
            };

            const io = req.app.get('io');
            if (io) {
                for (const uid of participant_ids) {
                    io.to(uid).emit('new_conversation', groupResponse);
                    io.in(uid).socketsJoin(conv.conversation_id);
                }
            }

            res.status(201).json(groupResponse);
        } catch (error: any) {
            console.error('[crearGrupo]', error?.message ?? error);
            res.status(500).json({ msg: 'Error al crear el grupo' });
        }
    };

    static actualizarGrupo = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { groupId } = req.params;
            const { name } = req.body;
            const file = req.file;

            const participante = await ParticipanteConversacion.findOne({
                where: { conversation_id: groupId, user_id: idUsuario, role: { [Op.in]: ['owner', 'admin'] } },
            });
            if (!participante) return res.status(403).json({ msg: 'Sin permisos para editar el grupo' });

            const updates: Record<string, any> = {};
            if (name?.trim()) updates.name = name.trim();
            if (file) updates.avatar_url = await subirArchivo(file, `chat/${groupId}`, 'group-avatar');

            await Conversacion.update(updates, { where: { conversation_id: groupId, is_group: true } });
            res.json({ msg: 'Grupo actualizado' });
        } catch (error: any) {
            console.error('[actualizarGrupo]', error?.message ?? error);
            res.status(500).json({ msg: 'Error al actualizar el grupo' });
        }
    };

    static agregarParticipantes = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { groupId } = req.params;
            const { user_ids } = req.body;

            if (!Array.isArray(user_ids) || user_ids.length === 0) {
                return res.status(400).json({ msg: 'user_ids requerido' });
            }

            const participante = await ParticipanteConversacion.findOne({
                where: { conversation_id: groupId, user_id: idUsuario, role: { [Op.in]: ['owner', 'admin'] } },
            });
            if (!participante) return res.status(403).json({ msg: 'Sin permisos para añadir participantes' });

            const existentes = await ParticipanteConversacion.findAll({
                where: { conversation_id: groupId },
                attributes: ['user_id'],
            });
            const idsExistentes = new Set(existentes.map((p: any) => p.user_id));
            const nuevos = user_ids.filter((id: string) => !idsExistentes.has(id));

            if (nuevos.length > 0) {
                await ParticipanteConversacion.bulkCreate(
                    nuevos.map((uid: string) => ({ conversation_id: groupId, user_id: uid, role: 'member' }))
                );

                const users = await Usuario.findAll({
                    where: { user_id: { [Op.in]: nuevos } },
                    attributes: ['user_id', 'username', 'avatar_url'],
                });

                const io = req.app.get('io');
                if (io) {
                    const conv = await Conversacion.findByPk(groupId);
                    const todosParticipantes = await ParticipanteConversacion.findAll({
                        where: { conversation_id: groupId },
                        include: [{ model: Usuario, as: 'usuario', attributes: ['user_id', 'username', 'avatar_url'] }],
                    });
                    const participantsData = (todosParticipantes as any[]).map((p: any) => ({
                        user_id: p.usuario?.user_id ?? '',
                        username: p.usuario?.username ?? '',
                        avatar_url: p.usuario?.avatar_url ?? null,
                        is_online: false,
                        role: p.role,
                    }));
                    const groupResponse = {
                        id: groupId,
                        is_group: true,
                        name: (conv as any)?.name,
                        avatar_url: (conv as any)?.avatar_url ?? null,
                        participants: participantsData,
                        participant_count: participantsData.length,
                        last_message: (conv as any)?.last_message ?? '',
                        last_message_time: (conv as any)?.last_message_time ?? (conv as any)?.createdAt,
                        last_message_sender_id: (conv as any)?.last_message_sender_id ?? null,
                        unread_count: 0,
                    };
                    for (const uid of nuevos) {
                        io.to(uid).emit('new_conversation', groupResponse);
                        io.in(uid).socketsJoin(groupId);
                    }
                    io.to(groupId).emit('group_updated', groupResponse);
                }
            }

            res.json({ msg: 'Participantes añadidos' });
        } catch (error: any) {
            console.error('[agregarParticipantes]', error?.message ?? error);
            res.status(500).json({ msg: 'Error al añadir participantes' });
        }
    };

    static eliminarParticipante = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { groupId, userId } = req.params;
            const isSelf = userId === idUsuario;

            if (!isSelf) {
                const rol = await ParticipanteConversacion.findOne({
                    where: { conversation_id: groupId, user_id: idUsuario, role: { [Op.in]: ['owner', 'admin'] } },
                });
                if (!rol) return res.status(403).json({ msg: 'Sin permisos para expulsar participantes' });
            }

            if (isSelf) {
                const esOwner = await ParticipanteConversacion.findOne({
                    where: { conversation_id: groupId, user_id: idUsuario, role: 'owner' },
                });
                if (esOwner) {
                    const admin = await ParticipanteConversacion.findOne({
                        where: { conversation_id: groupId, user_id: { [Op.ne]: idUsuario }, role: 'admin' },
                        order: [['conversation_id', 'ASC']],
                    });
                    if (admin) {
                        await ParticipanteConversacion.update({ role: 'owner' }, { where: { conversation_id: groupId, user_id: (admin as any).user_id } });
                    } else {
                        const miembro = await ParticipanteConversacion.findOne({
                            where: { conversation_id: groupId, user_id: { [Op.ne]: idUsuario }, role: 'member' },
                        });
                        if (miembro) {
                            await ParticipanteConversacion.update({ role: 'owner' }, { where: { conversation_id: groupId, user_id: (miembro as any).user_id } });
                        }
                    }
                }
            }

            await ParticipanteConversacion.destroy({ where: { conversation_id: groupId, user_id: userId } });

            const remaining = await ParticipanteConversacion.count({ where: { conversation_id: groupId } });
            if (remaining === 0) {
                await Conversacion.destroy({ where: { conversation_id: groupId } });
            }

            const io = req.app.get('io');
            if (io) {
                io.to(userId).emit('removed_from_group', { conversation_id: groupId });
                io.in(userId).socketsLeave(groupId);
                if (remaining > 0) io.to(groupId).emit('group_participant_removed', { conversation_id: groupId, user_id: userId });
            }

            res.json({ msg: isSelf ? 'Has salido del grupo' : 'Participante expulsado' });
        } catch (error: any) {
            console.error('[eliminarParticipante]', error?.message ?? error);
            res.status(500).json({ msg: 'Error al eliminar participante' });
        }
    };

    static actualizarRolParticipante = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { groupId, userId } = req.params;
            const { role } = req.body;

            if (!['admin', 'member'].includes(role)) return res.status(400).json({ msg: 'Rol inválido' });

            const esOwner = await ParticipanteConversacion.findOne({
                where: { conversation_id: groupId, user_id: idUsuario, role: 'owner' },
            });
            if (!esOwner) return res.status(403).json({ msg: 'Solo el owner puede cambiar roles' });

            await ParticipanteConversacion.update({ role }, { where: { conversation_id: groupId, user_id: userId } });
            res.json({ msg: 'Rol actualizado' });
        } catch (error: any) {
            console.error('[actualizarRolParticipante]', error?.message ?? error);
            res.status(500).json({ msg: 'Error al actualizar rol' });
        }
    };
}
