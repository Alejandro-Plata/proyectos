import { WS_URL } from '../config/api';

export function getAvatarUrl(username: string, avatarUrl?: string | null): string {
    if (avatarUrl) {
        if (avatarUrl.startsWith('/uploads')) {
            return `${WS_URL}${avatarUrl}`;
        }
        return avatarUrl;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
}

export function getEmblemUrl(emblemUrl?: string | null): string | null {
    if (!emblemUrl) return null;
    if (emblemUrl.startsWith('/uploads')) {
        return `${WS_URL}${emblemUrl}`;
    }
    return emblemUrl;
}

// prefija /uploads/... con el host del backend; URLs absolutas y blob: se devuelven intactas
export function resolveAssetUrl(url?: string | null): string {
    if (!url) return '';
    if (url.startsWith('/uploads')) {
        return `${WS_URL}${url}`;
    }
    return url;
}
