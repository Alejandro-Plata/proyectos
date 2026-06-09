import type {
    AdminStats, AdminUser, AdminChallenge, AdminNote,
    ContentRequest, ReportedPost, UpdateUserPayload,
    ReviewRequestPayload, ReviewResponse, AdminFilters, PaginatedResponse,
    AdminAchievement, PublicacionAdmin, ComentarioAdmin,
} from '../types/types';

import { API_BASE, authHeadersWithToken as authHeaders } from '../../../services/apiClient';

export const obtenerEstadisticasAdmin = async (token: string): Promise<AdminStats> => {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Error al obtener estadísticas');
    return res.json();
};

// Alias para compatibilidad
export const fetchAdminStats = obtenerEstadisticasAdmin;

export const obtenerUsuarios = async (
    token: string,
    filters: AdminFilters
): Promise<PaginatedResponse<AdminUser>> => {
    const params = new URLSearchParams({
        page: String(filters.page),
        limit: String(filters.limit),
        ...(filters.search && { search: filters.search }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
    });
    const res = await fetch(`${API_BASE}/admin/users?${params}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Error al obtener usuarios');
    return res.json();
};

export const fetchUsers = obtenerUsuarios;

export const actualizarUsuario = async (
    token: string,
    userId: string,
    payload: UpdateUserPayload
): Promise<AdminUser> => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al actualizar usuario');
    return res.json();
};

export const updateUser = actualizarUsuario;

export const eliminarUsuario = async (token: string, userId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al eliminar usuario');
};

export const deleteUser = eliminarUsuario;

export const obtenerRetosAdmin = async (
    token: string,
    filters: AdminFilters
): Promise<PaginatedResponse<AdminChallenge>> => {
    const params = new URLSearchParams({
        page: String(filters.page),
        limit: String(filters.limit),
        ...(filters.search && { search: filters.search }),
    });
    const res = await fetch(`${API_BASE}/admin/challenges?${params}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Error al obtener challenges');
    return res.json();
};

export const fetchAdminChallenges = obtenerRetosAdmin;

export const eliminarReto = async (token: string, challengeId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/challenges/${challengeId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al eliminar challenge');
};

export const deleteChallenge = eliminarReto;

export const fetchAdminNotes = async (
    token: string,
    filters: AdminFilters
): Promise<PaginatedResponse<AdminNote>> => {
    const params = new URLSearchParams({
        page: String(filters.page),
        limit: String(filters.limit),
        ...(filters.search && { search: filters.search }),
    });
    const res = await fetch(`${API_BASE}/admin/notes?${params}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Error al obtener apuntes');
    return res.json();
};

export const fetchAdminNoteById = async (token: string, noteId: string): Promise<{
    id: string; title: string; language: string; difficulty: string; tags: string[];
    content: Array<{ type: 'text' | 'code'; value: string; language?: string }>;
    community_status: string; submitted_by?: string; author_avatar?: string; created_at: string;
}> => {
    const res = await fetch(`${API_BASE}/admin/notes/${noteId}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Error al obtener apunte');
    return res.json();
};

export const deleteNote = async (token: string, noteId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/notes/${noteId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al eliminar apunte');
};

export const reviewNote = async (
    token: string,
    noteId: string,
    action: 'approve' | 'reject'
): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/notes/${noteId}/review`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error('Error al revisar apunte');
};

export const fetchContentRequests = async (
    token: string,
    filters: AdminFilters & { status?: string; content_type?: string }
): Promise<PaginatedResponse<ContentRequest>> => {
    const params = new URLSearchParams({
        page: String(filters.page),
        limit: String(filters.limit),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.content_type && { content_type: filters.content_type }),
    });
    const res = await fetch(`${API_BASE}/admin/content-requests?${params}`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al obtener solicitudes');
    return res.json();
};

export const reviewContentRequest = async (
    token: string,
    requestId: string,
    payload: ReviewRequestPayload
): Promise<ReviewResponse> => {
    const res = await fetch(`${API_BASE}/admin/content-requests/${requestId}/review`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.msg ?? 'Error al revisar solicitud');
    }
    return res.json();
};

export const fetchReportedPosts = async (
    token: string,
    filters: AdminFilters
): Promise<PaginatedResponse<ReportedPost>> => {
    const params = new URLSearchParams({
        page: String(filters.page),
        limit: String(filters.limit),
    });
    const res = await fetch(`${API_BASE}/admin/reported-posts?${params}`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al obtener posts reportados');
    return res.json();
};

export const resolveReport = async (
    token: string,
    reportId: string,
    action: 'dismissed' | 'removed'
): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/reported-posts/${reportId}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ status: action }),
    });
    if (!res.ok) throw new Error('Error al resolver reporte');
};

export const fetchAdminPosts = async (
    token: string,
    filters: AdminFilters
): Promise<PaginatedResponse<PublicacionAdmin>> => {
    const params = new URLSearchParams({
        page: String(filters.page),
        limit: String(filters.limit),
        ...(filters.search && { search: filters.search }),
    });
    const res = await fetch(`${API_BASE}/admin/posts?${params}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Error al obtener publicaciones');
    return res.json();
};

export const fetchPostComments = async (
    token: string,
    postId: string
): Promise<{ data: ComentarioAdmin[] }> => {
    const res = await fetch(`${API_BASE}/admin/posts/${postId}/comments`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Error al obtener comentarios');
    return res.json();
};

export const deleteAdminPost = async (token: string, postId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al eliminar publicación');
};

export const deleteAdminComment = async (token: string, commentId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al eliminar comentario');
};

export const fetchAdminAchievements = async (
    token: string,
    filters: { search?: string; page?: number; limit?: number }
): Promise<{ total: number; achievements: AdminAchievement[] }> => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const res = await fetch(`${API_BASE}/admin/achievements?${params}`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al obtener logros');
    return res.json();
};

export const createAchievement = async (
    token: string,
    data: FormData
): Promise<AdminAchievement> => {
    const res = await fetch(`${API_BASE}/admin/achievements`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
    });
    if (!res.ok) throw new Error('Error al crear logro');
    return res.json();
};

export const updateAchievement = async (
    token: string,
    achievementId: string,
    data: FormData
): Promise<AdminAchievement> => {
    const res = await fetch(`${API_BASE}/admin/achievements/${achievementId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
    });
    if (!res.ok) throw new Error('Error al actualizar logro');
    return res.json();
};

export const deleteAchievement = async (
    token: string,
    achievementId: string
): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/achievements/${achievementId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Error al eliminar logro');
};

export const updateAchievementStatus = async (
    token: string,
    achievementId: string,
    status: 'pending' | 'published'
): Promise<AdminAchievement> => {
    const res = await fetch(`${API_BASE}/admin/achievements/${achievementId}/status`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado del logro');
    return res.json();
};
