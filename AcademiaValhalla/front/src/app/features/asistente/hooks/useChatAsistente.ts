import { useState, useCallback, useRef, useEffect } from 'react';
import type { MensajeChat as ChatMessage, EstadoAsistente as AssistantStatus, ContextoAsistente as AssistantContext } from '../types/types';
import type { BorradorApunte } from '../services/aiService';
import { aiService } from '../services/aiService';

const generarId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Mínimo de mensajes para que merezca la pena destilar memoria/apunte.
const MIN_PARA_DESTILAR = 4;

interface OpcionesUseChatAsistente {
    context?: AssistantContext;
}

export const useChatAsistente = (opciones?: OpcionesUseChatAsistente) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<AssistantStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [distilling, setDistilling] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Ref con los mensajes más recientes para destilar memoria al desmontar.
    const messagesRef = useRef<ChatMessage[]>([]);
    messagesRef.current = messages;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // A1 · Al cerrar/abandonar la sesión, destila la memoria (fire-and-forget).
    useEffect(() => {
        return () => {
            if (messagesRef.current.length >= MIN_PARA_DESTILAR) {
                aiService.distillSession(messagesRef.current);
            }
        };
    }, []);

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim() || status === 'thinking') return;

            const userMessage: ChatMessage = {
                id: generarId(),
                role: 'user',
                content: content.trim(),
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setStatus('thinking');
            setError(null);

            try {
                const allMessages = [...messages, userMessage];
                const response = await aiService.sendMessage(allMessages);

                const assistantMessage: ChatMessage = {
                    id: generarId(),
                    role: 'assistant',
                    content: response,
                    timestamp: new Date().toISOString(),
                };

                setMessages((prev) => [...prev, assistantMessage]);
                setStatus('idle');
            } catch (err) {
                setStatus('error');
                setError(err instanceof Error ? err.message : 'Error desconocido');

                setMessages((prev) => [
                    ...prev,
                    {
                        id: generarId(),
                        role: 'assistant',
                        content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Inténtalo de nuevo.',
                        timestamp: new Date().toISOString(),
                    },
                ]);
            }
        },
        [messages, status, opciones?.context]
    );

    const clearChat = useCallback(() => {
        // A1 · destila la memoria antes de descartar la conversación
        if (messages.length >= MIN_PARA_DESTILAR) aiService.distillSession(messages);
        setMessages([]);
        setStatus('idle');
        setError(null);
    }, [messages]);

    // A5 · convierte la conversación actual en un borrador de apunte
    const distillToNote = useCallback(async (): Promise<BorradorApunte | null> => {
        if (messages.length < 2) return null;
        setDistilling(true);
        try {
            return await aiService.distillNote(messages);
        } finally {
            setDistilling(false);
        }
    }, [messages]);

    const canDistill = messages.length >= MIN_PARA_DESTILAR;

    return {
        messages,
        status,
        error,
        sendMessage,
        clearChat,
        distillToNote,
        distilling,
        canDistill,
        messagesEndRef,
        abortControllerRef,
    };
};
