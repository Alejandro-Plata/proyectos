export type Rareza = 'common' | 'rare' | 'epic' | 'legendary';

export interface Trofeo {
    achievement_id: string;
    title: string;
    description: string;
    rarity: Rareza;
    emblem_url: string | null;
    xp_reward: number;
    threshold: number;
    trigger_type: string;
    is_unlocked: boolean;
    unlocked_at: string | null;
    progress: number; // 0–100
}

export interface EventoAgenda {
    id: string;
    day: string;
    time: string;
    title: string;
    type: string;
    colorClass: string;
}

export interface Emblema {
    name: string;
    image: string;
    description: string;
    dateEarned: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Actividad {
    id: string;
    mission: string;
    status: 'completed' | 'in_progress';
    xpEarned?: number;
}

export interface PropsAgenda {
    events: EventoAgenda[];
}

export interface PropsBarraNivel {
    user: {
        level: number;
        currentXp: number;
        nextLevelXp: number;
    };
    xpPercentage: number;
}

export interface PropsActividadReciente {
    activities: Actividad[];
}

// Dashboard (datos reales de la BD)
export interface EstadisticasDashboard {
    challengesCompleted: number;
    challengesInProgress: number;
    totalChallenges: number;
    notesCount: number;
    postsCount: number;
}

export interface ActividadDashboard {
    challenge_id: string;
    title: string;
    difficulty: string;
    xpReward: number;
    status: 'SIN_EMPEZAR' | 'EN_PROGRESO' | 'COMPLETADO' | 'ABANDONADO';
    completed_at: string | null;
    last_attempt_at: string;
}

// Backward-compat aliases
export type Rarity = Rareza;
export type Trophy = Trofeo;
export type AgendaEvent = EventoAgenda;
export type Emblem = Emblema;
export type Activity = Actividad;
export type AgendaProps = PropsAgenda;
export type LevelBarProps = PropsBarraNivel;
export type RecentActivityProps = PropsActividadReciente;
export type DashboardStats = EstadisticasDashboard;
export type DashboardActivity = ActividadDashboard;
