import { API_BASE, authHeaders } from '../../../services/apiClient';
import type { ChangePasswordPayload, ChangePasswordResponse } from '../types/types';
import type { LogroDesbloqueado } from '../../../hooks/useDesbloqueoLogro';

interface SubirAvatarResponse {
    msg: string;
    avatar_url: string;
    unlockedAchievements?: LogroDesbloqueado[];
}

export const servicioAjustes = {

    subirAvatar: async (file: File): Promise<SubirAvatarResponse> => {
        const formData = new FormData();
        formData.append('avatar', file);

        let token = '';
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userObj = JSON.parse(userStr);
                token = userObj.token || '';
            }
        } catch (e) {
            console.error('Error parsing user token', e);
        }

        const response = await fetch(`${API_BASE}/me/avatar`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.msg || 'Error al subir la imagen');
        }

        return result;
    },

    cambiarContrasena: async (data: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
        const response = await fetch(`${API_BASE}/me/password`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({
                current_password: data.current_password,
                new_password: data.new_password,
            }),
        });

        const text = await response.text();
        let result: any = {};
        try {
            result = JSON.parse(text);
        } catch {
            throw new Error('Error del servidor. Asegúrate de que el backend está actualizado y vuelve a intentarlo.');
        }

        if (!response.ok) {
            throw new Error(result.msg || 'Error al cambiar la contraseña');
        }

        return result;
    },

    eliminarCuenta: async (): Promise<void> => {
        const response = await fetch(`${API_BASE}/me/profile`, {
            method: 'DELETE',
            headers: authHeaders(),
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.msg || 'Error al eliminar la cuenta');
        }
    },

    desvincularProveedor: async (provider: 'google' | 'github'): Promise<void> => {
        const response = await fetch(`${API_BASE}/auth/unlink/${provider}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.msg || `Error al desvincular ${provider}`);
        }
    },
};
