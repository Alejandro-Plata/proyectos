export const XP_CONFIG = {
    BASE_XP: 100,
    LINEAR_INCREMENT: 50,
    EXPONENTIAL_FACTOR: 1.15,
    LINEAR_PHASE_END: 10,
} as const;

export const CHALLENGE_XP_REWARDS = {
    FACIL: 25,
    MEDIO: 50,
    DIFICIL: 100,
    EXPERTO: 150,
} as const;

export const NOTE_XP_REWARD = 15;
export const COMMENTS_PER_XP_REWARD = 5;
export const COMMENT_MILESTONE_XP = 10;
export const SOLUTION_MARKED_XP = 30;

export const XP_MODAL_MESSAGES = {
    LEVEL_UP_TITLE: '¡Subida de nivel!',
    XP_GAINED_TITLE: '¡XP Obtenido!',
    LEVEL_UP_SUBTITLE: '¡Has alcanzado un nuevo nivel!',
    XP_GAINED_SUBTITLE: '¡Sigue así, guerrero!',
    NEXT_LEVEL_LABEL: 'Siguiente nivel',
    CURRENT_LEVEL_LABEL: 'Nivel actual',
} as const;

export type ChallengeDifficulty = keyof typeof CHALLENGE_XP_REWARDS;

// niveles 1–10: lineal · niveles 11+: cuasi-exponencial
export function xpRequiredForLevel(level: number): number {
    const { BASE_XP, LINEAR_INCREMENT, EXPONENTIAL_FACTOR, LINEAR_PHASE_END } = XP_CONFIG;

    if (level <= LINEAR_PHASE_END) {
        return BASE_XP + (level - 1) * LINEAR_INCREMENT;
    }

    const lastLinearXP = BASE_XP + (LINEAR_PHASE_END - 1) * LINEAR_INCREMENT;
    return Math.round(lastLinearXP * Math.pow(EXPONENTIAL_FACTOR, level - LINEAR_PHASE_END));
}

export function xpTotalForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += xpRequiredForLevel(i);
    }
    return total;
}

export function calculateLevelFromXP(totalXP: number): {
    level: number;
    currentLevelXP: number;
    requiredForNextLevel: number;
    progressPercent: number;
} {
    let level = 1;
    let xpRemaining = totalXP;

    while (true) {
        const required = xpRequiredForLevel(level);
        if (xpRemaining < required) {
            return {
                level,
                currentLevelXP: xpRemaining,
                requiredForNextLevel: required,
                progressPercent: Math.min(100, Math.round((xpRemaining / required) * 100)),
            };
        }
        xpRemaining -= required;
        level++;
    }
}
