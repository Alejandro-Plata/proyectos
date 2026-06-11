import { Server as SocketIOServer, Socket } from 'socket.io';
import { Mensaje, Conversacion, ParticipanteConversacion } from '../modelos/Modelos.js';
import { Op } from 'sequelize';

const connectedUsers = new Map<string, string>();

export function registrarManejadoresSocket(io: SocketIOServer, socket: Socket): void {
    const userId: string = socket.data.userId;
    const username: string = socket.data.user.username;

    connectedUsers.set(userId, socket.id);
    socket.join(userId);
    socket.broadcast.emit('user_online', { user_id: userId });

    joinUserConversationRooms(socket, userId);

    socket.on('send_message', async (payload: {
        conversation_id: string;
        content: string;
        reply_to_id?: string;
    }) => {
        try {
            const { conversation_id, content, reply_to_id } = payload;
            if (!content?.trim()) return;

            const participant = await ParticipanteConversacion.findOne({
                where: { conversation_id, user_id: userId },
            });
            if (!participant) {
                socket.emit('error', { message: 'No perteneces a esta conversación' });
                return;
            }

            let replyContent: string | null = null;
            let replySenderId: string | null = null;
            if (reply_to_id) {
                const original = await Mensaje.findByPk(reply_to_id, { attributes: ['content', 'sender_id'] });
                if (original) {
                    replyContent  = (original as any).content;
                    replySenderId = (original as any).sender_id;
                }
            }

            const message = await Mensaje.create({
                conversation_id,
                sender_id: userId,
                content: content.trim(),
                reply_to_id: reply_to_id ?? null,
            });

            await Conversacion.update(
                { last_message: content.trim(), last_message_time: new Date(), last_message_sender_id: userId },
                { where: { conversation_id } },
            );

            await ParticipanteConversacion.increment('unread_count', {
                where: { conversation_id, user_id: { [Op.ne]: userId } },
            });

            let replySenderUsername: string | null = null;
            if (replySenderId) {
                const { Usuario } = await import('../modelos/Modelos.js');
                const sender = await Usuario.findByPk(replySenderId, { attributes: ['username'] });
                replySenderUsername = (sender as any)?.username ?? null;
            }

            io.to(conversation_id).emit('new_message', {
                id: message.message_id,
                conversation_id,
                sender_id: userId,
                content: content.trim(),
                timestamp: message.createdAt,
                read: false,
                reply_to_id: reply_to_id ?? null,
                reply_to_content: replyContent,
                reply_to_sender: replySenderUsername,
            });
        } catch (error) {
            console.error('[Socket.IO] Error al enviar mensaje:', error);
            socket.emit('error', { message: 'Error al enviar el mensaje' });
        }
    });

    socket.on('mark_read', async ({ conversation_id }: { conversation_id: string }) => {
        try {
            await Mensaje.update(
                { read: true },
                { where: { conversation_id, sender_id: { [Op.ne]: userId }, read: false } },
            );
            await ParticipanteConversacion.update(
                { unread_count: 0 },
                { where: { conversation_id, user_id: userId } },
            );
            io.to(conversation_id).emit('message_read', { conversation_id, reader_id: userId });
        } catch (error) {
            console.error('[Socket.IO] Error al marcar como leído:', error);
        }
    });

    socket.on('typing', ({ conversation_id }: { conversation_id: string }) => {
        socket.to(conversation_id).emit('typing', { conversation_id, user_id: userId });
    });

    socket.on('stop_typing', ({ conversation_id }: { conversation_id: string }) => {
        socket.to(conversation_id).emit('stop_typing', { conversation_id, user_id: userId });
    });

    socket.on('disconnect', () => {
        connectedUsers.delete(userId);
        socket.broadcast.emit('user_offline', { user_id: userId });
    });
}

export function obtenerUsuariosConectados(): Map<string, string> {
    return connectedUsers;
}

async function joinUserConversationRooms(socket: Socket, userId: string): Promise<void> {
    try {
        const participations = await ParticipanteConversacion.findAll({
            where: { user_id: userId },
            attributes: ['conversation_id'],
        });
        for (const p of participations) socket.join(p.conversation_id);
    } catch (error) {
        console.error('[Socket.IO] Error al unir a rooms:', error);
    }
}
