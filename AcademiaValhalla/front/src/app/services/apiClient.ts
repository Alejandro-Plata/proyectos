export { API_BASE, WS_URL } from '../config/api';

export const getToken = (): string | null => {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw).token : null;
    } catch {
        return null;
    }
};

export const authHeaders = (): HeadersInit => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const authHeadersWithToken = (token: string): HeadersInit => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
});
