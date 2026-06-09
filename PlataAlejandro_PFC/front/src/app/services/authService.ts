import type { LoginPayload, RegisterPayload, User } from '../context/types/types';
import { API_BASE } from '../config/api';

const STORAGE_KEY = 'user';
const API_BASE_URL = `${API_BASE}/`;

export const authService = {

    login: async (data: LoginPayload): Promise<User> => {

        const { username, password } = data;

        const response = await fetch(`${API_BASE_URL}auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const userInfo = await response.json();

        if (!response.ok) {
            if (userInfo.errors && Array.isArray(userInfo.errors)) {
                throw new Error(userInfo.errors[0].msg);
            }
            throw new Error(userInfo.message || userInfo.error || 'No se pudo iniciar sesión');
        }

        const userWithToken: User = {
            ...userInfo.user,
            token: userInfo.token
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithToken));

        return userWithToken;

    },

    register: async (data: RegisterPayload) => {
        const response = await fetch(`${API_BASE_URL}auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            if (result.errors && Array.isArray(result.errors)) {
                throw new Error(result.errors[0].msg);
            }
            throw new Error(result.message || result.error || 'Error en el registro');
        }

        const userWithToken: User = {
            ...result.user,
            token: result.token
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithToken));
        return userWithToken;

    },

    logout: async (): Promise<void> => {
        try {
            await fetch(`${API_BASE_URL}auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.warn("Logout error", error);
        } finally {
            localStorage.removeItem(STORAGE_KEY);
        }
    },

    getCurrentUser: (): User | undefined | null => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (err: unknown) {
            if (err instanceof Error) {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
        }
    },

    getProfile: async (): Promise<User> => {
        const storedUser = authService.getCurrentUser();
        const token = storedUser?.token;

        if (!token) throw new Error("No token found");

        const response = await fetch(`${API_BASE_URL}me/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Error fetching profile');
        return await response.json();
    },

    loginWithGoogle: () => {
        window.location.href = `${API_BASE_URL}auth/google`;
    },

    loginWithGitHub: () => {
        window.location.href = `${API_BASE_URL}auth/github`;
    },

    validateToken: async (token: string): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}auth/validate`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Token inválido');
        const data = await response.json();
        const userWithToken: User = { ...data.user, token };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithToken));
        return userWithToken;
    },

    requestPasswordReset: async (email: string): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al enviar el código');
        return data;
    },

    verifyResetCode: async (email: string, code: string): Promise<{ resetToken: string }> => {
        const response = await fetch(`${API_BASE_URL}auth/verify-reset-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Código inválido');
        return data;
    },

    resetPassword: async (resetToken: string, newPassword: string): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resetToken, newPassword }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al restablecer la contraseña');
        return data;
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const storedUser = authService.getCurrentUser();
        const token = storedUser?.token;

        if (!token) throw new Error("No se encontró token");

        const response = await fetch(`${API_BASE_URL}me/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.msg || 'Error actualizando perfil');
        }

        const userWithToken: User = { ...result.user, token };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithToken));
        return userWithToken;
    }
};