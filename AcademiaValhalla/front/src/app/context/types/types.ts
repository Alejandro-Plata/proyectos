export type Tema = 'light' | 'dark';

export interface TipoContextoTema {
    theme: Tema;
    toggleTheme: () => void;
    isDarkMode: boolean;
}

/***** User Context *****/

export interface Usuario {
    user_id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'MODERADOR' | 'USUARIO';
    current_level: number;
    experience_points: number;
    streak_days: number;
    avatar_url?: string;
    bio?: string;
    github_url?: string;
    linkedin_url?: string;
    token?: string;
    google_id?: string;
    github_id?: string;
    has_password?: boolean;
    is_banned?: boolean;
}

export interface PayloadRegistro {
    username: string;
    email: string;
    password: string;
}

export interface PayloadLogin {
    username: string;
    password: string;
}

export interface TipoContextoUsuario {
    user: Usuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (data: PayloadLogin) => Promise<void>;
    register: (data: PayloadRegistro) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<Usuario>) => Promise<void>;
    refreshUser: () => Promise<void>;
}

// Backward-compat aliases
export type Theme = Tema;
export type ThemeContextType = TipoContextoTema;
export type User = Usuario;
export type RegisterPayload = PayloadRegistro;
export type LoginPayload = PayloadLogin;
export type UserContextType = TipoContextoUsuario;
