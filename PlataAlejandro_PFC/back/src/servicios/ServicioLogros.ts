import { Logro, LogroUsuario, Usuario, ProgresoRetoUsuario, NotaUsuario, Publicacion } from '../modelos/Modelos.js';
import { ServicioXP, ResultadoRecompensaXP } from './ServicioXP.js';
import { Op } from 'sequelize';

export interface InfoLogroDesbloqueado {
    achievement: {
        achievement_id: string;
        title: string;
        description: string;
        rarity: string;
        emblem_url: string | null;
        xp_reward: number;
        trigger_type: string;
    };
    xpResult: ResultadoRecompensaXP | null;
    unlocked_at: Date;
}

export class ServicioLogros {
    static async verificarYDesbloquear(
        userId: string,
        triggerType: string,
        currentValue: number
    ): Promise<InfoLogroDesbloqueado[]> {
        const alreadyUnlocked = await LogroUsuario.findAll({
            where: { user_id: userId },
            attributes: ['achievement_id'],
        });
        const unlockedIds = alreadyUnlocked.map((ua) => ua.achievement_id);

        const eligibleAchievements = await Logro.findAll({
            where: {
                trigger_type: triggerType,
                is_active: true,
                threshold: { [Op.lte]: currentValue },
                ...(unlockedIds.length > 0
                    ? { achievement_id: { [Op.notIn]: unlockedIds } }
                    : {}),
            },
            order: [['threshold', 'ASC']],
        });

        if (eligibleAchievements.length === 0) return [];

        const results: InfoLogroDesbloqueado[] = [];

        for (const achievement of eligibleAchievements) {
                const userAchievement = await LogroUsuario.create({
                    user_id: userId,
                    achievement_id: achievement.achievement_id,
                    unlocked_at: new Date(),
                });

                let xpResult: ResultadoRecompensaXP | null = null;
                if (achievement.xp_reward > 0) {
                    xpResult = await ServicioXP.otorgarXP(userId, achievement.xp_reward);
                }

                results.push({
                    achievement: {
                        achievement_id: achievement.achievement_id,
                        title: achievement.title,
                        description: achievement.description,
                        rarity: achievement.rarity,
                        emblem_url: achievement.emblem_url,
                        xp_reward: achievement.xp_reward,
                        trigger_type: achievement.trigger_type,
                    },
                    xpResult,
                    unlocked_at: userAchievement.unlocked_at,
                });
        }

        if (results.length > 0) {
            const user = await Usuario.findByPk(userId);
            if (user && triggerType !== 'level_reached') {
                const levelAchievements = await ServicioLogros.verificarYDesbloquear(
                    userId,
                    'level_reached',
                    user.current_level
                );
                results.push(...levelAchievements);
            }
        }

        return results;
    }

    static async obtenerLogrosUsuario(userId: string) {
        const achievements = await Logro.findAll({
            where: { is_active: true },
            order: [['display_order', 'ASC']],
        });

        const userAchievements = await LogroUsuario.findAll({
            where: { user_id: userId },
        });
        const unlockedMap = new Map(
            userAchievements.map((ua) => [ua.achievement_id, ua.unlocked_at])
        );

        const user = await Usuario.findByPk(userId);
        if (!user) throw new Error('Usuario no encontrado');

        const challengeCount = await ProgresoRetoUsuario.count({
            where: { user_id: userId, status: 'COMPLETADO' },
        });

        const noteCount = await NotaUsuario.count({ where: { user_id: userId } });
        const postCount = await Publicacion.count({ where: { author_id: userId } });
        const hasFeaturedPost = await Publicacion.count({
            where: { author_id: userId, upvote_count: { [Op.gte]: 1 } },
        });
        const hasAvatar = user.avatar_url ? 1 : 0;

        const metricsMap: Record<string, number> = {
            challenge_count: challengeCount,
            note_count: noteCount,
            comment_count: user.total_comments || 0,
            solutions_given: user.total_solutions || 0,
            level_reached: user.current_level,
            streak_days: user.streak_days || 0,
            xp_total: user.experience_points,
            custom: 0,
            post_count: postCount,
            post_featured: hasFeaturedPost > 0 ? 1 : 0,
            avatar_changed: hasAvatar,
        };

        return achievements.map((a) => {
            const isUnlocked = unlockedMap.has(a.achievement_id);
            const currentMetric = metricsMap[a.trigger_type] || 0;
            const progress = isUnlocked
                ? 100
                : Math.min(100, Math.round((currentMetric / a.threshold) * 100));

            return {
                achievement_id: a.achievement_id,
                title: a.title,
                description: a.description,
                rarity: a.rarity,
                emblem_url: a.emblem_url,
                xp_reward: a.xp_reward,
                threshold: a.threshold,
                trigger_type: a.trigger_type,
                is_unlocked: isUnlocked,
                unlocked_at: unlockedMap.get(a.achievement_id) ?? null,
                progress,
            };
        });
    }
}
