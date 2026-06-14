import { useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { MessagingContext, type MessagingContextType } from './MessagingContext';
import { messagingService, createWebSocket } from '../features/messaging/services/messagingService';
import { useUser } from './UserContext';
import type { Conversation, ConversationGroup, Message, WsEvent, MessageType } from '../features/messaging/types/types';

export const MessagingProvider = ({ children }: { children: ReactNode }) => {
    const { user, isAuthenticated } = useUser();

    const [conversaciones, setConversaciones] = useState<Conversation[]>([]);
    const [conversacionActiva, setConversacionActiva] = useState<Conversation | null>(null);
    const [mensajes, setMensajes] = useState<Message[]>([]);
    const [idUsuarioEscribiendo, setIdUsuarioEscribiendo] = useState<string | null>(null);
    const [estaCargando, setEstaCargando] = useState(false);

    const refConvActiva = useRef(conversacionActiva);
    refConvActiva.current = conversacionActiva;
    const refUsuario = useRef(user);
    refUsuario.current = user;
    const refMensajes = useRef(mensajes);
    refMensajes.current = mensajes;

    const ws = useMemo(() => createWebSocket(), []);

    const totalSinLeer = useMemo(
        () => conversaciones.reduce((sum, c) => sum + c.unread_count, 0),
        [conversaciones]
    );

    useEffect(() => {
        if (!isAuthenticated || !user?.token) return;
        ws.connect(user.token);
        setEstaCargando(true);
        messagingService.getConversations()
            .then(setConversaciones)
            .catch(console.error)
            .finally(() => setEstaCargando(false));
        return () => {
            ws.disconnect();
            setConversaciones([]);
            setConversacionActiva(null);
            setMensajes([]);
            setIdUsuarioEscribiendo(null);
        };
    }, [isAuthenticated, user?.token, ws]);

    const refFetchConv = useRef<Set<string>>(new Set());

    useEffect(() => {
        const unsubscribe = ws.subscribe((event: WsEvent) => {
            switch (event.type) {
                case 'new_message': {
                    const msg = event.payload;
                    const idUsuarioActual = refUsuario.current?.user_id;
                    const idActivo = refConvActiva.current?.id;

                    if (msg.conversation_id === idActivo) {
                        setMensajes((prev) => {
                            if (msg.sender_id === idUsuarioActual) {
                                // Reemplaza el mensaje optimista (texto por contenido, media por tipo)
                                const idxTemp = prev.findIndex(
                                    (m) => m.id.startsWith('temp-')
                                        && m.message_type === msg.message_type
                                        && (msg.message_type === 'text' ? m.content === msg.content : true)
                                );
                                if (idxTemp !== -1) {
                                    const previo = prev[idxTemp];
                                    if (previo.attachment_url?.startsWith('blob:')) {
                                        URL.revokeObjectURL(previo.attachment_url);
                                    }
                                    const actualizado = [...prev];
                                    actualizado[idxTemp] = msg;
                                    return actualizado;
                                }
                            }
                            if (prev.some((m) => m.id === msg.id)) return prev;
                            return [...prev, msg];
                        });
                    }

                    setConversaciones((prev) => {
                        const existe = prev.some((c) => c.id === msg.conversation_id);
                        if (!existe) {
                            if (!refFetchConv.current.has(msg.conversation_id)) {
                                refFetchConv.current.add(msg.conversation_id);
                                messagingService.getConversations()
                                    .then((fresh) => {
                                        setConversaciones(fresh);
                                        refFetchConv.current.delete(msg.conversation_id);
                                    })
                                    .catch(() => { refFetchConv.current.delete(msg.conversation_id); });
                            }
                            return prev;
                        }
                        const actualizado = prev.map((c) =>
                            c.id === msg.conversation_id
                                ? {
                                    ...c,
                                    last_message: msg.content ?? (msg.message_type === 'image' ? '📷 Foto' : msg.message_type === 'video' ? '🎥 Vídeo' : msg.message_type === 'audio' ? '🎤 Audio' : ''),
                                    last_message_time: msg.timestamp,
                                    last_message_sender_id: msg.sender_id,
                                    unread_count: c.id === idActivo ? c.unread_count : c.unread_count + 1,
                                }
                                : c
                        );
                        const idx = actualizado.findIndex((c) => c.id === msg.conversation_id);
                        if (idx > 0) {
                            const [conv] = actualizado.splice(idx, 1);
                            actualizado.unshift(conv);
                        }
                        return actualizado;
                    });
                    break;
                }
                case 'new_conversation': {
                    const conv = event.payload;
                    setConversaciones((prev) => {
                        if (prev.some((c) => c.id === conv.id)) return prev;
                        return [conv, ...prev];
                    });
                    break;
                }
                case 'message_read': {
                    const { conversation_id } = event.payload;
                    setConversaciones((prev) =>
                        prev.map((c) => c.id === conversation_id ? { ...c, unread_count: 0 } : c)
                    );
                    break;
                }
                case 'user_online':
                case 'user_offline': {
                    const estaEnLinea = event.type === 'user_online';
                    const uid = event.payload.user_id;
                    setConversaciones((prev) =>
                        prev.map((c) => {
                            if (!c.is_group && c.participant.user_id === uid) {
                                return { ...c, participant: { ...c.participant, is_online: estaEnLinea } };
                            }
                            if (c.is_group && c.participants.some(p => p.user_id === uid)) {
                                return { ...c, participants: c.participants.map(p => p.user_id === uid ? { ...p, is_online: estaEnLinea } : p) };
                            }
                            return c;
                        })
                    );
                    if (refConvActiva.current?.is_group) {
                        const conv = refConvActiva.current as ConversationGroup;
                        if (conv.participants.some(p => p.user_id === uid)) {
                            setConversacionActiva(prev => prev?.is_group
                                ? { ...prev, participants: (prev as ConversationGroup).participants.map(p => p.user_id === uid ? { ...p, is_online: estaEnLinea } : p) }
                                : prev
                            );
                        }
                    }
                    break;
                }
                case 'typing':
                    if (event.payload.conversation_id === refConvActiva.current?.id) {
                        setIdUsuarioEscribiendo(event.payload.user_id);
                    }
                    break;
                case 'stop_typing':
                    setIdUsuarioEscribiendo((prev) =>
                        prev === event.payload.user_id ? null : prev
                    );
                    break;
                case 'removed_from_group': {
                    const { conversation_id } = event.payload;
                    setConversaciones((prev) => prev.filter((c) => c.id !== conversation_id));
                    if (refConvActiva.current?.id === conversation_id) setConversacionActiva(null);
                    break;
                }
                case 'group_updated': {
                    const updatedGroup = event.payload;
                    setConversaciones((prev) =>
                        prev.map((c) => c.id === updatedGroup.id ? { ...c, ...updatedGroup } : c)
                    );
                    if (refConvActiva.current?.id === updatedGroup.id) {
                        setConversacionActiva(prev => prev ? { ...prev, ...updatedGroup } : prev);
                    }
                    break;
                }
                case 'group_participant_removed': {
                    const { conversation_id, user_id } = event.payload;
                    setConversaciones((prev) =>
                        prev.map((c) => {
                            if (c.id !== conversation_id || !c.is_group) return c;
                            return { ...c, participants: c.participants.filter(p => p.user_id !== user_id) };
                        })
                    );
                    if (refConvActiva.current?.id === conversation_id && refConvActiva.current.is_group) {
                        setConversacionActiva((prev) =>
                            prev?.is_group
                                ? { ...prev, participants: (prev as ConversationGroup).participants.filter(p => p.user_id !== user_id), participant_count: (prev as ConversationGroup).participants.filter(p => p.user_id !== user_id).length }
                                : prev
                        );
                    }
                    break;
                }
            }
        });
        return unsubscribe;
    }, [ws]);

    const abrirConversacion = useCallback(
        async (conv: Conversation) => {
            setConversacionActiva(conv);
            setMensajes([]);
            setEstaCargando(true);
            try {
                const historial = await messagingService.getMessages(conv.id);
                setMensajes(historial);
                ws.send({ type: 'mark_read', payload: { conversation_id: conv.id } });
                setConversaciones((prev) =>
                    prev.map((c) => (c.id === conv.id ? { ...c, unread_count: 0 } : c))
                );
            } catch (err) {
                console.error('Error al cargar mensajes:', err);
            } finally {
                setEstaCargando(false);
            }
        },
        [ws]
    );

    const seleccionarConversacion = useCallback(
        async (conversacionId: string) => {
            const conv = conversaciones.find((c) => c.id === conversacionId);
            if (!conv) return;
            await abrirConversacion(conv);
        },
        [conversaciones, abrirConversacion]
    );

    const enviarMensaje = useCallback(
        (contenido: string, replyToId?: string) => {
            if (!conversacionActiva || !contenido.trim()) return;
            ws.send({
                type: 'send_message',
                payload: { conversation_id: conversacionActiva.id, content: contenido.trim(), reply_to_id: replyToId, message_type: 'text' },
            });
            const idEmisor = user?.user_id ?? '';
            const texto = contenido.trim();
            const msgRespuesta = replyToId ? refMensajes.current.find(m => m.id === replyToId) : null;

            const mensajeOptimista: Message = {
                id: `temp-${Date.now()}`,
                conversation_id: conversacionActiva.id,
                sender_id: idEmisor,
                content: texto,
                message_type: 'text',
                timestamp: new Date().toISOString(),
                read: false,
                reply_to_id: replyToId,
                reply_to_content: msgRespuesta?.content,
                reply_to_sender: msgRespuesta
                    ? (msgRespuesta.sender_id === idEmisor
                        ? refUsuario.current?.username
                        : !conversacionActiva.is_group
                            ? conversacionActiva.participant.username
                            : (conversacionActiva as ConversationGroup).participants.find(p => p.user_id === msgRespuesta.sender_id)?.username)
                    : undefined,
            };
            setMensajes((prev) => [...prev, mensajeOptimista]);
            setConversaciones((prev) => {
                const actualizado = prev.map((c) =>
                    c.id === conversacionActiva.id
                        ? { ...c, last_message: texto, last_message_time: mensajeOptimista.timestamp, last_message_sender_id: idEmisor }
                        : c
                );
                const idx = actualizado.findIndex((c) => c.id === conversacionActiva.id);
                if (idx > 0) {
                    const [conv] = actualizado.splice(idx, 1);
                    actualizado.unshift(conv);
                }
                return actualizado;
            });
        },
        [conversacionActiva, user?.user_id, ws]
    );

    const enviarMensajeMedia = useCallback(
        async (
            file: File,
            messageType: MessageType,
            caption?: string,
            replyToId?: string,
            onProgress?: (pct: number) => void
        ) => {
            if (!conversacionActiva) return;

            const convId = conversacionActiva.id;
            const idEmisor = user?.user_id ?? '';
            const captionText = caption?.trim() || undefined;
            const localUrl = URL.createObjectURL(file);
            const tempId = `temp-${Date.now()}`;
            const msgRespuesta = replyToId ? refMensajes.current.find(m => m.id === replyToId) : null;

            // 1) Mensaje optimista: visible al instante con la URL local (blob)
            const mensajeOptimista: Message = {
                id: tempId,
                conversation_id: convId,
                sender_id: idEmisor,
                content: captionText,
                message_type: messageType,
                attachment_url: localUrl,
                attachment_meta: { size: file.size, mime: file.type },
                timestamp: new Date().toISOString(),
                read: false,
                reply_to_id: replyToId,
                reply_to_content: msgRespuesta?.content,
                reply_to_sender: msgRespuesta
                    ? (msgRespuesta.sender_id === idEmisor
                        ? refUsuario.current?.username
                        : !conversacionActiva.is_group
                            ? conversacionActiva.participant.username
                            : (conversacionActiva as ConversationGroup).participants.find(p => p.user_id === msgRespuesta.sender_id)?.username)
                    : undefined,
            };

            setMensajes((prev) => [...prev, mensajeOptimista]);

            const preview = messageType === 'image' ? '📷 Foto'
                : messageType === 'video' ? '🎥 Vídeo'
                : messageType === 'audio' ? '🎤 Audio'
                : (captionText ?? '');
            setConversaciones((prev) => {
                const actualizado = prev.map((c) =>
                    c.id === convId
                        ? { ...c, last_message: preview, last_message_time: mensajeOptimista.timestamp, last_message_sender_id: idEmisor }
                        : c
                );
                const idx = actualizado.findIndex((c) => c.id === convId);
                if (idx > 0) {
                    const [conv] = actualizado.splice(idx, 1);
                    actualizado.unshift(conv);
                }
                return actualizado;
            });

            // 2) Subida en segundo plano; el eco del WS reconcilia el mensaje temporal
            try {
                const { url, meta } = await messagingService.subirAdjunto(convId, file, onProgress);
                ws.send({
                    type: 'send_message',
                    payload: {
                        conversation_id: convId,
                        content: captionText,
                        reply_to_id: replyToId,
                        message_type: messageType,
                        attachment_url: url,
                        attachment_meta: meta,
                    },
                });
                // Conserva la vista local pero adopta los metadatos del servidor (p. ej. durationSec)
                setMensajes((prev) => prev.map(m =>
                    m.id === tempId ? { ...m, attachment_meta: { ...m.attachment_meta, ...meta } } : m
                ));
            } catch (err) {
                // Revierte el mensaje optimista si falla la subida
                URL.revokeObjectURL(localUrl);
                setMensajes((prev) => prev.filter(m => m.id !== tempId));
                throw err;
            }
        },
        [conversacionActiva, user?.user_id, ws]
    );

    const marcarComoLeida = useCallback(() => {
        if (!conversacionActiva) return;
        ws.send({ type: 'mark_read', payload: { conversation_id: conversacionActiva.id } });
    }, [conversacionActiva, ws]);

    const enviarComando = useCallback(
        (command: Parameters<MessagingContextType['sendCommand']>[0]) => ws.send(command),
        [ws]
    );

    const iniciarConversacion = useCallback(
        async (idUsuarioDestino: string) => {
            const conv = await messagingService.startConversation(idUsuarioDestino);
            setConversaciones((prev) =>
                prev.some((c) => c.id === conv.id) ? prev : [conv, ...prev]
            );
            setConversacionActiva(conv);
        },
        []
    );

    const crearGrupo = useCallback(
        async (name: string, participantIds: string[]) => {
            const conv = await messagingService.createGroup(name, participantIds);
            setConversaciones((prev) =>
                prev.some((c) => c.id === conv.id) ? prev : [conv, ...prev]
            );
            setConversacionActiva(conv);
        },
        []
    );

    const actualizarGrupo = useCallback(async (groupId: string, data: { name?: string; avatar?: File }) => {
        // El backend emite group_updated por WS, que actualiza el estado
        await messagingService.updateGroup(groupId, data);
    }, []);

    const agregarParticipantesGrupo = useCallback(async (groupId: string, userIds: string[]) => {
        await messagingService.addGroupParticipants(groupId, userIds);
    }, []);

    const eliminarParticipanteGrupo = useCallback(async (groupId: string, userId: string) => {
        await messagingService.removeGroupParticipant(groupId, userId);
    }, []);

    const actualizarRolGrupo = useCallback(async (groupId: string, userId: string, role: 'admin' | 'member') => {
        await messagingService.updateGroupRole(groupId, userId, role);
    }, []);

    const salirDelGrupo = useCallback(async (groupId: string) => {
        const uid = refUsuario.current?.user_id;
        if (!uid) return;
        await messagingService.removeGroupParticipant(groupId, uid);
        // Respaldo local por si el WS removed_from_group no llega
        setConversaciones((prev) => prev.filter((c) => c.id !== groupId));
        if (refConvActiva.current?.id === groupId) setConversacionActiva(null);
    }, []);

    const archivarConversacion = useCallback(async (conversacionId: string) => {
        await messagingService.archiveConversation(conversacionId);
        setConversaciones((prev) => prev.filter((c) => c.id !== conversacionId));
        if (refConvActiva.current?.id === conversacionId) setConversacionActiva(null);
    }, []);

    const desarchivarConversacion = useCallback(async (conversacionId: string) => {
        await messagingService.unarchiveConversation(conversacionId);
    }, []);

    const cerrarConversacion = useCallback(async (conversacionId: string) => {
        await messagingService.closeConversation(conversacionId);
        setConversaciones((prev) => prev.filter((c) => c.id !== conversacionId));
        if (refConvActiva.current?.id === conversacionId) setConversacionActiva(null);
    }, []);

    const value: MessagingContextType = {
        conversations: conversaciones,
        activeConversation: conversacionActiva,
        messages: mensajes,
        totalUnread: totalSinLeer,
        typingUserId: idUsuarioEscribiendo,
        isLoading: estaCargando,
        selectConversation: seleccionarConversacion,
        openConversation: abrirConversacion,
        sendMessage: enviarMensaje,
        sendMediaMessage: enviarMensajeMedia,
        markAsRead: marcarComoLeida,
        sendCommand: enviarComando,
        startConversation: iniciarConversacion,
        createGroup: crearGrupo,
        updateGroup: actualizarGrupo,
        addGroupParticipants: agregarParticipantesGrupo,
        removeGroupParticipant: eliminarParticipanteGrupo,
        updateGroupRole: actualizarRolGrupo,
        leaveGroup: salirDelGrupo,
        archiveConversation: archivarConversacion,
        unarchiveConversation: desarchivarConversacion,
        closeConversation: cerrarConversacion,
    };

    return (
        <MessagingContext.Provider value={value}>
            {children}
        </MessagingContext.Provider>
    );
};
