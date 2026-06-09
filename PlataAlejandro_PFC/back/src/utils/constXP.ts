export const CONFIGURACION_XP = {
    BASE_XP: 100,
    LINEAR_INCREMENT: 50,
    EXPONENTIAL_FACTOR: 1.15,
    LINEAR_PHASE_END: 10,
} as const;

export const RECOMPENSAS_XP_RETO: Record<string, number> = {
    FACIL: 25,
    MEDIO: 50,
    DIFICIL: 100,
    EXPERTO: 150,
};

export const RECOMPENSA_XP_NOTA = 15;
export const COMENTARIOS_POR_XP = 5;   // Cada 5 comentarios se otorga XP
export const LOGRO_XP_COMENTARIO = 10;    // XP ganada
export const XP_SOLUCION_MARCADA = 30;

/**
 * XP necesario para pasar del nivel N al nivel N+1.
 * - Niveles 1–10: lineal
 * - Niveles 11+: cuasi-exponencial
 */
export function xpRequiredForLevel(level: number): number {
    const { BASE_XP, LINEAR_INCREMENT, EXPONENTIAL_FACTOR, LINEAR_PHASE_END } = CONFIGURACION_XP;

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
