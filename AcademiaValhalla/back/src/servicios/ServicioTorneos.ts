import { Op } from 'sequelize';
import {
    Torneo, RetoTorneo, ParticipanteTorneo, ResolucionTorneo, Reto, Usuario,
} from '../modelos/Modelos.js';
import { ServicioXP } from './ServicioXP.js';
import { ServicioLogros } from './ServicioLogros.js';
import { ServicioEmblemas } from './ServicioEmblemas.js';

const PUNTOS_TROLL = 50;     // puntos por caza resuelta en modo 'troll'
const PREMIADOS_TOP = 3;     // cuántos del podio reciben premio al finalizar

export class ServicioTorneos {

    /** Reconcilia estados según fechas (upcoming→active→finished). Idempotente. */
    static async reconciliarEstados(): Promise<void> {
        const ahora = new Date();
        // activar los que ya empezaron
        await Torneo.update({ status: 'active' }, {
            where: { status: 'upcoming', starts_at: { [Op.lte]: ahora }, ends_at: { [Op.gt]: ahora } },
        });
        // finalizar los vencidos (uno a uno para repartir premios)
        const vencidos = await Torneo.findAll({
            where: { status: { [Op.in]: ['upcoming', 'active'] }, ends_at: { [Op.lte]: ahora } },
        });
        for (const t of vencidos) {
            await this.finalizar(t.tournament_id);
        }
    }

    static async listar(filtros: { status?: string; season?: string } = {}) {
        await this.reconciliarEstados();
        const where: any = {};
        if (filtros.status) where.status = filtros.status;
        if (filtros.season) where.season = filtros.season;
        const torneos = await Torneo.findAll({ where, order: [['starts_at', 'DESC']] });
        return Promise.all(torneos.map(async (t: any) => ({
            tournament_id: t.tournament_id,
            title: t.title,
            mode: t.mode,
            season: t.season,
            status: t.status,
            starts_at: t.starts_at,
            ends_at: t.ends_at,
            reward_xp: t.reward_xp,
            participant_count: await ParticipanteTorneo.count({ where: { tournament_id: t.tournament_id } }),
        })));
    }

    static async obtener(torneoId: string, userId: string) {
        await this.reconciliarEstados();
        const torneo: any = await Torneo.findByPk(torneoId);
        if (!torneo) return null;

        const retosLink = await RetoTorneo.findAll({ where: { tournament_id: torneoId } });
        const retoIds = retosLink.map((r: any) => r.challenge_id);
        const retos = await Reto.findAll({
            where: { challenge_id: { [Op.in]: retoIds } },
            attributes: ['challenge_id', 'title', 'difficulty'],
        });
        const resueltos = await ResolucionTorneo.findAll({ where: { tournament_id: torneoId, user_id: userId }, attributes: ['challenge_id'] });
        const setResueltos = new Set(resueltos.map((r: any) => r.challenge_id));
        const yoParticipo = !!(await ParticipanteTorneo.findOne({ where: { tournament_id: torneoId, user_id: userId } }));

        return {
            tournament_id: torneo.tournament_id,
            title: torneo.title,
            description: torneo.description,
            mode: torneo.mode,
            season: torneo.season,
            status: torneo.status,
            starts_at: torneo.starts_at,
            ends_at: torneo.ends_at,
            reward_xp: torneo.reward_xp,
            joined: yoParticipo,
            challenges: (retos as any[]).map(r => {
                const link: any = retosLink.find((l: any) => l.challenge_id === r.challenge_id);
                return {
                    challenge_id: r.challenge_id,
                    title: r.title,
                    difficulty: r.difficulty,
                    points: link?.points ?? 100,
                    solved: setResueltos.has(r.challenge_id),
                };
            }),
        };
    }

    static async unirse(torneoId: string, userId: string): Promise<void> {
        const torneo = await Torneo.findByPk(torneoId);
        if (!torneo) throw new Error('Torneo no encontrado');
        if (torneo.status !== 'active') throw new Error('El torneo no está activo');
        await ParticipanteTorneo.findOrCreate({
            where: { tournament_id: torneoId, user_id: userId },
            defaults: { tournament_id: torneoId, user_id: userId },
        });
    }

    static async leaderboard(torneoId: string) {
        const filas = await ParticipanteTorneo.findAll({
            where: { tournament_id: torneoId },
            include: [{ model: Usuario, as: 'usuario', attributes: ['user_id', 'username', 'avatar_url', 'current_level'] }],
            order: [['score', 'DESC'], ['last_solved_at', 'ASC']],
            limit: 100,
        });
        return (filas as any[]).map((p, i) => ({
            rank: i + 1,
            user_id: p.usuario?.user_id,
            username: p.usuario?.username,
            avatar_url: p.usuario?.avatar_url ?? null,
            level: p.usuario?.current_level ?? 1,
            score: p.score,
            solved_count: p.solved_count,
        }));
    }

    /**
     * B7 (corazón) · Registra que el usuario resolvió un reto.
     * Suma puntos en todos los torneos 'challenges' activos que contengan ese reto
     * y en los que el usuario participe. Idempotente vía tournament_solves.
     */
    static async registrarResolucion(userId: string, challengeId: string): Promise<void> {
        try {
            const links = await RetoTorneo.findAll({ where: { challenge_id: challengeId } });
            if (!links.length) return;

            for (const link of links as any[]) {
                const torneo = await Torneo.findByPk(link.tournament_id);
                if (!torneo || torneo.status !== 'active' || torneo.mode !== 'challenges') continue;

                const participa = await ParticipanteTorneo.findOne({
                    where: { tournament_id: link.tournament_id, user_id: userId },
                });
                if (!participa) continue;

                const [, creado] = await ResolucionTorneo.findOrCreate({
                    where: { tournament_id: link.tournament_id, user_id: userId, challenge_id: challengeId },
                    defaults: { tournament_id: link.tournament_id, user_id: userId, challenge_id: challengeId },
                });
                if (!creado) continue; // ya puntuado

                await participa.update({
                    score: participa.score + (link.points ?? 100),
                    solved_count: participa.solved_count + 1,
                    last_solved_at: new Date(),
                });
            }
        } catch (e) {
            console.error('[ServicioTorneos.registrarResolucion]', (e as any)?.message ?? e);
        }
    }

    /** Modo 'troll': cada caza resuelta suma puntos fijos en torneos troll activos. */
    static async registrarResolucionTroll(userId: string): Promise<void> {
        try {
            const torneos = await Torneo.findAll({ where: { status: 'active', mode: 'troll' } });
            for (const t of torneos as any[]) {
                const participa = await ParticipanteTorneo.findOne({ where: { tournament_id: t.tournament_id, user_id: userId } });
                if (!participa) continue;
                await participa.update({
                    score: participa.score + PUNTOS_TROLL,
                    solved_count: participa.solved_count + 1,
                    last_solved_at: new Date(),
                });
            }
        } catch (e) {
            console.error('[ServicioTorneos.registrarResolucionTroll]', (e as any)?.message ?? e);
        }
    }

    static async finalizar(torneoId: string): Promise<void> {
        const torneo = await Torneo.findByPk(torneoId);
        if (!torneo || torneo.status === 'finished') return;

        const podio = await ParticipanteTorneo.findAll({
            where: { tournament_id: torneoId, score: { [Op.gt]: 0 } },
            order: [['score', 'DESC'], ['last_solved_at', 'ASC']],
            limit: PREMIADOS_TOP,
        });

        let pos = 0;
        for (const p of podio as any[]) {
            pos++;
            const xp = Math.round(torneo.reward_xp / pos); // 1º completo, 2º mitad, 3º un tercio
            await ServicioXP.otorgarXP(p.user_id, xp);
            const etiqueta = torneo.season ? `Temporada ${torneo.season}` : torneo.title;
            await ServicioEmblemas.otorgar(p.user_id, 'tournament', etiqueta, { tournament_id: torneoId, position: pos });
            const ganados = await ParticipanteTorneo.count({ where: { user_id: p.user_id } }); // aproximación
            await ServicioLogros.verificarYDesbloquear(p.user_id, 'tournament_podium', ganados);
        }

        await torneo.update({ status: 'finished' });
    }

    // ── Administración ─────────────────────────────────────────
    static async crear(adminId: string, datos: any): Promise<Torneo> {
        const { title, description, mode, season, starts_at, ends_at, reward_xp, challenge_ids } = datos;
        const torneo = await Torneo.create({
            title, description: description ?? null,
            mode: mode === 'troll' ? 'troll' : 'challenges',
            season: season ?? null,
            starts_at: new Date(starts_at), ends_at: new Date(ends_at),
            reward_xp: reward_xp ?? 100,
            created_by: adminId,
            status: new Date(starts_at) <= new Date() ? 'active' : 'upcoming',
        });
        if (Array.isArray(challenge_ids)) {
            for (const cid of challenge_ids) {
                await RetoTorneo.findOrCreate({
                    where: { tournament_id: torneo.tournament_id, challenge_id: cid },
                    defaults: { tournament_id: torneo.tournament_id, challenge_id: cid },
                });
            }
        }
        return torneo;
    }
}
