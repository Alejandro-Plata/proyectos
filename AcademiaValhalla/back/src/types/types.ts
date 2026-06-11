export interface BloqueContenidoNota {
    type: "text" | "code";
    value: string;
    language?: string;
    filename?: string;
}

export interface CargoJWT {
    id: string; // UUID
    iat?: number;
    exp?: number;
}

export enum RolUsuario {
    INVITADO = 'INVITADO',
    USUARIO = 'USUARIO',
    MODERADOR = 'MODERADOR',
    ADMIN = 'ADMIN'
}

export enum Dificultad {
    FACIL = 'FACIL',
    MEDIO = 'MEDIO',
    DIFICIL = 'DIFICIL',
    EXPERTO = 'EXPERTO'
}

export enum TipoPublicacion {
    PREGUNTA = 'PREGUNTA',
    ARTICULO = 'ARTICULO',
    PROYECTO = 'PROYECTO',
    DISCUSION = 'DISCUSION',
    RECURSO = 'RECURSO',
    EMPLEO = 'EMPLEO',
    TEAMUP = 'TEAMUP',
}

export enum Categoria {
    ALGORITMOS = 'ALGORITMOS',
    FRONTEND = 'FRONTEND',
    BACKEND = 'BACKEND',
    DATABASE = 'DATABASE',
    DEVOPS = 'DEVOPS'
}

export enum EstadoProgreso {
    SIN_EMPEZAR = 'SIN_EMPEZAR',
    EN_PROGRESO = 'EN_PROGRESO',
    COMPLETADO = 'COMPLETADO',
    ABANDONADO = 'ABANDONADO'
}

export enum TipoContenido {
    CURSO = 'CURSO',
    MODULO = 'MODULO',
    LECCION = 'LECCION',
    CHEAT_SHEET = 'CHEAT_SHEET'
}

export interface ContextoAsistente {
    userLevel?: 'principiante' | 'intermedio' | 'avanzado';
    currentLanguage?: string;
    currentTopic?: string;
}
