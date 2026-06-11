export interface PayloadCambiarContrasena {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export interface RespuestaCambiarContrasena {
    msg: string;
}

export interface ErroresCampo {
    username?: string;
    bio?: string;
    github_url?: string;
    linkedin_url?: string;
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
}

export interface CuentaVinculada {
    provider: 'google' | 'github';
    linked: boolean;
    label: string;
}

// Backward-compat aliases
export type ChangePasswordPayload = PayloadCambiarContrasena;
export type ChangePasswordResponse = RespuestaCambiarContrasena;
export type FieldErrors = ErroresCampo;
export type LinkedAccount = CuentaVinculada;
