import { API_BASE, authHeaders } from '../../../services/apiClient';
import type { ContentPart } from '../types/types';

export const forumService = {
    async getPosts(params?: { post_type?: string; search?: string; page?: number }) {
        const qs = new URLSearchParams();
        if (params?.post_type) qs.set('post_type', params.post_type);
        if (params?.search) qs.set('search', params.search);
        if (params?.page) qs.set('page', String(params.page));
        const res = await fetch(`${API_BASE}/posts?${qs}`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Error al cargar posts');
        return res.json();
    },

    async getPost(postId: string) {
        const res = await fetch(`${API_BASE}/posts/${postId}`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Post no encontrado');
        return res.json();
    },

    async createPost(payload: { title: string; content: string | ContentPart[]; post_type: string }) {
        const content = typeof payload.content === 'string'
            ? [{ type: 'text' as const, value: payload.content }]
            : payload.content;
        const res = await fetch(`${API_BASE}/posts`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ ...payload, content }),
        });
        if (!res.ok) throw new Error('Error al crear el post');
        return res.json();
    },

    async createComment(postId: string, payload: { content: string; parent_user_comment_id?: string | null }) {
        const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error al publicar comentario');
        return res.json();
    },

    async votePost(postId: string, value: 1 | -1 | 0) {
        const res = await fetch(`${API_BASE}/posts/${postId}/vote`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ value }),
        });
        if (!res.ok) throw new Error('Error al votar');
        return res.json();
    },

    async getUserPublicProfile(userId: string) {
        const res = await fetch(`${API_BASE}/users/${userId}`, { headers: authHeaders() });
        if (!res.ok) throw new Error('Usuario no encontrado');
        return res.json();
    },

    async markCommentAsSolution(postId: string, commentId: string) {
        const res = await fetch(
            `${API_BASE}/posts/${postId}/comments/${commentId}/solution`,
            { method: 'POST', headers: authHeaders() }
        );
        if (!res.ok) throw new Error('Error al marcar como solución');
        return res.json();
    },

    async reportPost(postId: string, reason: string) {
        const res = await fetch(`${API_BASE}/posts/${postId}/report`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ reason }),
        });
        if (!res.ok) throw new Error('Error al reportar');
        return res.json();
    },

    async voteComment(postId: string, commentId: string, value: 1 | -1 | 0) {
        const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}/vote`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ value }),
        });
        if (!res.ok) throw new Error('Error al votar en comentario');
        return res.json();
    },

    async deletePost(postId: string) {
        const res = await fetch(`${API_BASE}/posts/${postId}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Error al eliminar el post');
        return res.json();
    },

    async deleteComment(postId: string, commentId: string) {
        const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error('Error al eliminar el comentario');
        return res.json();
    },
};
