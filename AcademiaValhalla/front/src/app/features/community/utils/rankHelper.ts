interface RankInfo {
    rank: string;
    rankGradient: string;
}

export function getRankInfo(level: number = 1): RankInfo {
    if (level >= 30) return { rank: 'Leyenda',    rankGradient: 'from-yellow-300 to-orange-500' };
    if (level >= 20) return { rank: 'Maestro',    rankGradient: 'from-purple-400 to-pink-500' };
    if (level >= 15) return { rank: 'Experto',    rankGradient: 'from-red-400 to-rose-600' };
    if (level >= 10) return { rank: 'Avanzado',   rankGradient: 'from-blue-400 to-cyan-500' };
    if (level >= 5)  return { rank: 'Intermedio', rankGradient: 'from-emerald-400 to-teal-500' };
    return             { rank: 'Novato',     rankGradient: 'from-emerald-300 to-teal-500' };
}

/** Progreso dentro del tramo de rango actual (0-100). */
export function getLevelProgress(level: number): number {
    if (level >= 30) return Math.min(100, ((level - 30) / 10) * 100);
    if (level >= 20) return ((level - 20) / 10) * 100;
    if (level >= 15) return ((level - 15) / 5) * 100;
    if (level >= 10) return ((level - 10) / 5) * 100;
    if (level >= 5)  return ((level - 5)  / 5) * 100;
    return ((level - 1) / 4) * 100;
}

/** Colores hex del gradiente para usar en SVG. */
export function getRankColors(level: number): { from: string; to: string } {
    if (level >= 30) return { from: '#fde047', to: '#f97316' };
    if (level >= 20) return { from: '#c084fc', to: '#ec4899' };
    if (level >= 15) return { from: '#f87171', to: '#e11d48' };
    if (level >= 10) return { from: '#60a5fa', to: '#06b6d4' };
    if (level >= 5)  return { from: '#34d399', to: '#14b8a6' };
    return { from: '#6ee7b7', to: '#14b8a6' };
}
