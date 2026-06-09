import { Usuario } from '../modelos/Modelos.js';
import { calculateLevelFromXP } from '../utils/constXP.js';

export interface ResultadoRecompensaXP {
    xpGained: number;
    previousXP: number;
    newTotalXP: number;
    previousLevel: number;
    newLevel: number;
    leveledUp: boolean;
    currentLevelXP: number;
    requiredForNextLevel: number;
    progressPercent: number;
}

export class ServicioXP {
    static async otorgarXP(userId: string, xpAmount: number): Promise<ResultadoRecompensaXP> {
        const user = await Usuario.findByPk(userId);
        if (!user) throw new Error('Usuario no encontrado');

        const previousXP = user.experience_points;
        const previousLevel = user.current_level;
        const newTotalXP = previousXP + xpAmount;

        const levelInfo = calculateLevelFromXP(newTotalXP);

        await user.update({
            experience_points: newTotalXP,
            current_level: levelInfo.level,
        });

        return {
            xpGained: xpAmount,
            previousXP,
            newTotalXP,
            previousLevel,
            newLevel: levelInfo.level,
            leveledUp: levelInfo.level > previousLevel,
            currentLevelXP: levelInfo.currentLevelXP,
            requiredForNextLevel: levelInfo.requiredForNextLevel,
            progressPercent: levelInfo.progressPercent,
        };
    }
}

