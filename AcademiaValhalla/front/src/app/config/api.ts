// En desarrollo, .env.local fija estas variables a localhost.
// En producción (Vercel), si no están definidas se usa el backend de Render por defecto.
export const URL_BASE_API = import.meta.env.VITE_API_URL ?? 'https://valhalla-back.onrender.com/api/v1';
export const URL_WEBSOCKET = import.meta.env.VITE_WS_URL ?? 'https://valhalla-back.onrender.com';

// Aliases para compatibilidad con importaciones existentes
export const API_BASE = URL_BASE_API;
export const WS_URL = URL_WEBSOCKET;
