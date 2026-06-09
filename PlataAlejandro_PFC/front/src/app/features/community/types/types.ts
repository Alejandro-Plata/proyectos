import type { ReactNode } from "react";

export type CategoriaHilo = 'doubt' | 'discussion' | 'job' | 'promo' | 'teamup';

export interface AutorHilo {
    id: string;
    name: string;
    avatar: string;
    rank: string;
    rankGradient: string;
}

export interface Hilo {
    id: string;
    title: string;
    excerpt: string;
    content: ParteContenido[];
    author: AutorHilo;
    category: CategoriaHilo;
    likes: number;
    comments: number;
    isSolved?: boolean;
    timestamp: string;
    viewCount?: number;
    userVote: 1 | -1 | 0;
}

export interface ComentarioForo {
    id: string;
    author: AutorHilo;
    content: string;
    likes: number;
    timestamp: string;
    replies: ComentarioForo[];
    isOfficialSolution?: boolean;
    parentId?: string | null;
}

export interface ParteContenido {
    type: 'text' | 'code' | 'definition' | 'image';
    value: string;
    language?: string;
    title?: string;
}

export interface PropsElementoComentario {
    comment: ComentarioForo;
    depth?: number;
    onMarkSolution?: () => void;
    onDelete?: (commentId: string) => void;
    postId?: string;
    onReplySubmit?: (parentId: string, content: string) => Promise<void>;
}

export interface PropsPildoraMobile {
    active: boolean;
    onClick: () => void;
    label: string;
    dotColor?: string;
}

export interface PropsElementoNavegacion {
    active: boolean;
    onClick: () => void;
    label: string;
    icon: ReactNode;
    activeColor?: string;
}

export interface PropsEditorRespuesta {
    placeholder?: string;
    autoFocus?: boolean;
    onCancel?: () => void;
    compact?: boolean;
    onSubmit?: (content: string) => Promise<void>;
}

export interface PerfilPublico {
    user_id: string;
    username: string;
    avatar_url?: string;
    bio?: string;
    github_url?: string;
    linkedin_url?: string;
    current_level: number;
    experience_points: number;
    created_at: string;
}

export interface PublicacionPublica {
    post_id: string;
    title: string;
    post_type: string;
    upvote_count: number;
    created_at: string;
}

export interface ApiAutor {
    user_id: string;
    username: string;
    avatar_url?: string;
}

export interface ApiComentario {
    user_comment_id: string;
    content: string;
    created_at: string;
    author: ApiAutor;
    replies?: ApiComentario[];
    parent_user_comment_id?: string | null;
    is_solution?: boolean;
}

export interface ApiPublicacion {
    post_id: string;
    title: string;
    content: ParteContenido[];
    post_type: string;
    upvote_count: number;
    view_count: number;
    created_at: string;
    author: ApiAutor;
    user_comments?: ApiComentario[];
    comment_count?: number;
}

// Backward-compat aliases
export type ThreadCategory = CategoriaHilo;
export type ThreadAuthor = AutorHilo;
export type Thread = Hilo;
export type ForumComment = ComentarioForo;
export type ContentPart = ParteContenido;
export type CommentItemProps = PropsElementoComentario;
export type MobilPillProps = PropsPildoraMobile;
export type NavItemProps = PropsElementoNavegacion;
export type ReplyEditorProps = PropsEditorRespuesta;
export type PublicProfile = PerfilPublico;
export type PublicPost = PublicacionPublica;
export type ApiAuthor = ApiAutor;
export type ApiComment = ApiComentario;
export type ApiPost = ApiPublicacion;
