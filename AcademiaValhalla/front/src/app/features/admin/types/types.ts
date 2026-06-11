export interface EstadisticasAdmin {
    totalUsers: number;
    activeUsersToday: number;
    totalChallenges: number;
    totalGlobalNotes: number;
    pendingRequests: number;
    reportedPosts: number;
}

export interface UsuarioAdmin {
    user_id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'MODERADOR' | 'USUARIO';
    current_level: number;
    experience_points: number;
    avatar_url?: string;
    is_banned: boolean;
    created_at: string;
    last_login_at?: string;
}

export interface PayloadActualizarUsuario {
    role?: 'ADMIN' | 'MODERADOR' | 'USUARIO';
    is_banned?: boolean;
}

export interface RetoAdmin {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    language: string;
    tags: string[];
    is_global: boolean;
    submitted_by?: string;
    created_at: string;
}

export interface ApunteAdmin {
    id: string;
    title: string;
    language: string;
    difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
    tags: string[];
    source: 'personal' | 'community';
    submitted_by?: string;
    created_at: string;
}

export type EstadoSolicitud = 'pending' | 'approved' | 'rejected';

export type TipoContenidoSolicitud = 'challenge' | 'note';

export interface SolicitudContenido {
    id: string;
    author_id: string;
    author_username: string;
    author_avatar_url?: string;
    content_type: TipoContenidoSolicitud;
    status: EstadoSolicitud;
    title: string;
    description: string;
    submitted_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    rejection_reason?: string;

    resource_id?: string;
    resource_type?: 'challenge' | 'note';

    challenge_data?: {
        difficulty: 'easy' | 'medium' | 'hard';
        language: string;
        category?: string;
        tags: string[];
        instructions?: string;
        example_output?: string;
        starter_code: string;
        test_code: string;
        solution_code: string;
        hints?: Array<{ order: number; text: string }>;
        examples?: Array<{ input: string; expected_output: string; explanation?: string }>;
    };

    note_data?: {
        language: string;
        difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
        tags: string[];
        content: Array<{ type: 'text' | 'code'; value: string; language?: string }>;
        definitions?: Array<{ term: string; description: string }>;
    };
}

export interface PayloadRevision {
    action: 'approve' | 'reject';
    rejection_reason?: string;
}

export interface RespuestaRevision {
    msg: string;
    request: SolicitudContenido;
    resource?: { type: 'challenge' | 'note'; id: string; url: string };
}

export interface PublicacionReportada {
    id: string;
    post_id: string;
    post_title: string;
    post_author: string;
    reporter_username: string;
    reason: string;
    reported_at: string;
    status: 'pending' | 'dismissed' | 'removed';
}

export interface PublicacionAdmin {
    id: string;
    title: string;
    post_type: string;
    author: string;
    comment_count: number;
    created_at: string;
}

export interface ComentarioAdmin {
    id: string;
    content: string;
    author: string;
    is_solution: boolean;
    created_at: string;
}

export interface FiltrosAdmin {
    search: string;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface RespuestaPaginada<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}

// ─── Logros ───────────────────────────────────────────────

export type TipoDisparadorLogro =
    | 'challenge_count'
    | 'note_count'
    | 'comment_count'
    | 'solutions_given'
    | 'level_reached'
    | 'streak_days'
    | 'xp_total'
    | 'custom';

export const TRIGGER_TYPE_LABELS: Record<TipoDisparadorLogro, string> = {
    challenge_count: 'Retos completados',
    note_count: 'Notas subidas',
    comment_count: 'Comentarios escritos',
    solutions_given: 'Respuestas aceptadas',
    level_reached: 'Nivel alcanzado',
    streak_days: 'Días de racha',
    xp_total: 'XP total',
    custom: 'Manual (admin)',
};

export const RARITY_LABELS: Record<string, string> = {
    common: 'Común',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Legendario',
};

export interface LogroAdmin {
    achievement_id: string;
    title: string;
    description: string;
    trigger_type: TipoDisparadorLogro;
    threshold: number;
    xp_reward: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    emblem_url: string | null;
    is_active: boolean;
    display_order: number;
    status: 'pending' | 'published';
    created_at: string;
}

export const ACHIEVEMENT_STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente',
    published: 'Publicado',
};

// Backward-compat aliases
export type AdminStats = EstadisticasAdmin;
export type AdminUser = UsuarioAdmin;
export type UpdateUserPayload = PayloadActualizarUsuario;
export type AdminChallenge = RetoAdmin;
export type AdminNote = ApunteAdmin;
export type RequestStatus = EstadoSolicitud;
export type RequestContentType = TipoContenidoSolicitud;
export type ContentRequest = SolicitudContenido;
export type ReviewRequestPayload = PayloadRevision;
export type ReviewResponse = RespuestaRevision;
export type ReportedPost = PublicacionReportada;
export type AdminFilters = FiltrosAdmin;
export type PaginatedResponse<T> = RespuestaPaginada<T>;
export type AchievementTriggerType = TipoDisparadorLogro;
export type AdminAchievement = LogroAdmin;
