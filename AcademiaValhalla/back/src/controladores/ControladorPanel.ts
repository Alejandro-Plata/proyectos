import { Request, Response } from 'express';
import { Usuario, ProgresoRetoUsuario, Reto, NotaUsuario, Publicacion } from '../modelos/Modelos.js';
import { EstadoProgreso } from '../types/types.js';

export class ControladorPanel {

    static obtenerEstadisticasPanel = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;

            const [
                challengesCompleted,
                challengesInProgress,
                totalChallenges,
                notesCount,
                postsCount,
                recentProgress
            ] = await Promise.all([
                ProgresoRetoUsuario.count({
                    where: { user_id: idUsuario, status: EstadoProgreso.COMPLETADO }
                }),
                ProgresoRetoUsuario.count({
                    where: { user_id: idUsuario, status: EstadoProgreso.EN_PROGRESO }
                }),
                Reto.count(),
                NotaUsuario.count({ where: { user_id: idUsuario } }),
                Publicacion.count({ where: { author_id: idUsuario } }),
                ProgresoRetoUsuario.findAll({
                    where: { user_id: idUsuario },
                    include: [{
                        model: Reto,
                        attributes: ['title', 'difficulty', 'experience_reward']
                    }],
                    order: [['last_attempt_at', 'DESC']],
                    limit: 10
                })
            ]);

            const recentActivity = recentProgress.map((p: any) => ({
                challenge_id: p.challenge_id,
                title: p.challenge?.title || 'Reto eliminado',
                difficulty: p.challenge?.difficulty || 'BASICO',
                xpReward: p.challenge?.experience_reward || 0,
                status: p.status,
                completed_at: p.completed_at,
                last_attempt_at: p.getDataValue('last_attempt_at')
            }));

            res.json({
                stats: {
                    challengesCompleted,
                    challengesInProgress,
                    totalChallenges,
                    notesCount,
                    postsCount
                },
                recentActivity
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener estadísticas del dashboard' });
        }
    };
}

