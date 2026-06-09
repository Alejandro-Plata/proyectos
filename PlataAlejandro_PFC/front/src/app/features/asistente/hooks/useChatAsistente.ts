import { useState, useCallback, useRef, useEffect } from 'react';
import type { MensajeChat as ChatMessage, EstadoAsistente as AssistantStatus, ContextoAsistente as AssistantContext } from '../types/types';
import { aiService } from '../services/aiService';

const generarId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

interface OpcionesUseChatAsistente {
    context?: AssistantContext;
}

export const useChatAsistente = (opciones?: OpcionesUseChatAsistente) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<AssistantStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        setMessages([]);
        setStatus('idle');
        setError(null);
    }, []);

    return {
        messages,
        status,
        error,
        sendMessage,
        clearChat,
        messagesEndRef,
        abortControllerRef,
    };
};
