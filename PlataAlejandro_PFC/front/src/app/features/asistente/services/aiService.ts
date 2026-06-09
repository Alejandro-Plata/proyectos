import type { ChatMessage } from '../types/types';
import { authHeaders } from '../../../services/apiClient';
import { URL_BASE_API } from '../../../config/api';
const CHAT_ENDPOINT = `${URL_BASE_API}/assistant/chat`;

export const aiService = {
    sendMessage: async (
        messages: ChatMessage[],
    ): Promise<string> => {

        const res = await fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ messages }),
        });

        if (!res.ok) {
            const errBody = await res.text();
            console.error('Error desde el backend:', errBody);
            throw new Error('Error al comunicarse con el servidor');
        }

        const data = await res.json();
        
        if (!data.reply) throw new Error('Respuesta vacía o inválida del servidor');
        
        return data.reply;
    },
};