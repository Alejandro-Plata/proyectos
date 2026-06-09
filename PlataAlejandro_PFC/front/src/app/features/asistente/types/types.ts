export type RolChat = 'user' | 'assistant' | 'system';

export interface MensajeChat {
    id: string;
    role: RolChat;
    content: string;
    timestamp: string;
}

export type EstadoAsistente = 'idle' | 'thinking' | 'streaming' | 'error';

export interface ContextoAsistente {
    source?: string;
    currentTopic?: string;
    language?: string;
    currentCode?: string;
}

export interface ConfigServicioIA {
    apiUrl: string;
    apiKey?: string;
    model: string;
}

// Backward-compat aliases
export type ChatRole = RolChat;
export type ChatMessage = MensajeChat;
export type AssistantStatus = EstadoAsistente;
export type AssistantContext = ContextoAsistente;
export type AiServiceConfig = ConfigServicioIA;
