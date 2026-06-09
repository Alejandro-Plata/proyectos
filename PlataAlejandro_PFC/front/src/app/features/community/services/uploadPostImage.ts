import { API_BASE, getToken } from '../../../services/apiClient';

export async function uploadPostImage(file: File): Promise<string> {
    const form = new FormData();
    form.append('image', file);
    const token = getToken();
    const res = await fetch(`${API_BASE}/posts/upload-image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
    });
    if (!res.ok) throw new Error('Error al subir imagen');
    const data: { url: string } = await res.json();
    return data.url;
}
