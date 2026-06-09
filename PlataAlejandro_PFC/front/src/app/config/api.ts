export const URL_BASE_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';
export const URL_WEBSOCKET = import.meta.env.VITE_WS_URL ?? 'http://localhost:3000';

// Aliases para compatibilidad con importaciones existentes
export const API_BASE = URL_BASE_API;
export const WS_URL = URL_WEBSOCKET;
