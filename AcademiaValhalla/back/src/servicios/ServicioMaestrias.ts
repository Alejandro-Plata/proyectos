import { QueryTypes } from 'sequelize';
import { db } from '../config/db.js';
import { Endoso, Usuario } from '../modelos/Modelos.js';

export type TipoSkill = 'language' | 'category';
export interface Maestria { skill: string; kind: TipoSkill; score: number; level: string }

function nivel(score: number): string {
    if (score >= 35) return 'Maestro';
    if (score >= 15) return 'Avanzado';
    if (score >= 5) return 'Competente';
    return 'Iniciado';
}

const PESO_DIFICULTAD = `CASE c.difficulty WHEN 'FACIL' THEN 1 WHEN 'MEDIO' THEN 2 WHEN 'DIFICIL' THEN 3 WHEN 'EXPERTO' THEN 4 ELSE 1 END`;

export class ServicioMaestrias {

    static async calcular(userId: string): Promise<Maestria[]> {
        const [porLenguaje, porCategoria, porNotas] = await Promise.all([
            db.query<{ language: string; weighted: number }>(
                `SELECT pl.name AS language, SUM(${PESO_DIFICULTAD}) AS weighted
                   FROM user_challenge_progress p
                   JOIN challenges c ON c.challenge_id = p.challenge_id
                   JOIN challenge_languages cl ON cl.challenge_id = c.challenge_id
                   JOIN programming_languages pl ON pl.language_id = cl.language_id
                  WHERE p.user_id = :uid AND p.status = 'COMPLETADO'
                  GROUP BY pl.name`,
                { replacements: { uid: userId }, type: QueryTypes.SELECT }
            ).catch(() => []),
            db.query<{ category: string; weighted: number }>(
                `SELECT c.category AS category, SUM(${PESO_DIFICULTAD}) AS weighted
                   FROM user_challenge_progress p
                   JOIN challenges c ON c.challenge_id = p.challenge_id
                  WHERE p.user_id = :uid AND p.status = 'COMPLETADO'
                  GROUP BY c.category`,
                { replacements: { uid: userId }, type: QueryTypes.SELECT }
            ).catch(() => []),
            db.query<{ language: string; weighted: number }>(
                `SELECT language, SUM(CASE WHEN community_status = 'approved' THEN 2 ELSE 1 END) AS weighted
                   FROM user_notes WHERE user_id = :uid GROUP BY language`,
                { replacements: { uid: userId }, type: QueryTypes.SELECT }
            ).catch(() => []),
        ]);

        const lenguajes = new Map<string, number>();
        for (const r of porLenguaje as any[]) lenguajes.set(r.language, (lenguajes.get(r.language) ?? 0) + Number(r.weighted) * 5);
        for (const r of porNotas as any[]) {
            if (!r.language || r.language === 'general') continue;
            lenguajes.set(r.language, (lenguajes.get(r.language) ?? 0) + Number(r.weighted) * 3);
        }

        const maestrias: Maestria[] = [];
        for (const [skill, score] of lenguajes) {
            if (score <= 0) continue;
            maestrias.push({ skill, kind: 'language', score: Math.round(score), level: nivel(score) });
        }
        for (const r of porCategoria as any[]) {
            const score = Number(r.weighted) * 5;
            if (score <= 0) continue;
            maestrias.push({ skill: r.category, kind: 'category', score: Math.round(score), level: nivel(score) });
        }

        return maestrias.sort((a, b) => b.score - a.score);
    }

    static async endosos(userId: string, viewerId?: string) {
        const filas = await Endoso.findAll({ where: { endorsed_id: userId } });
        const conteo: Record<string, number> = {};
        const mios = new Set<string>();
        for (const e of filas as any[]) {
            conteo[e.skill] = (conteo[e.skill] ?? 0) + 1;
            if (viewerId && e.endorser_id === viewerId) mios.add(e.skill);
        }
        return Object.entries(conteo)
            .map(([skill, count]) => ({ skill, count, endorsed_by_me: mios.has(skill) }))
            .sort((a, b) => b.count - a.count);
    }

    static async endosar(endorserId: string, endorsedId: string, skill: string) {
        const limpio = (skill ?? '').trim().slice(0, 50);
        if (!limpio) throw new Error('Habilidad inválida');
        if (endorserId === endorsedId) throw new Error('No puedes endosarte a ti mismo');
        await Endoso.findOrCreate({
            where: { endorser_id: endorserId, endorsed_id: endorsedId, skill: limpio },
            defaults: { endorser_id: endorserId, endorsed_id: endorsedId, skill: limpio },
        });
    }

    static async quitarEndoso(endorserId: string, endorsedId: string, skill: string) {
        await Endoso.destroy({ where: { endorser_id: endorserId, endorsed_id: endorsedId, skill } });
    }

    static async tarjetaPublica(username: string) {
        const usuario: any = await Usuario.findOne({
            where: { username },
            attributes: ['user_id', 'username', 'avatar_url', 'bio', 'current_level', 'experience_points', 'github_url', 'linkedin_url'],
        });
        if (!usuario) return null;
        const [maestrias, endosos] = await Promise.all([
            this.calcular(usuario.user_id),
            this.endosos(usuario.user_id),
        ]);
        return {
            username: usuario.username,
            avatar_url: usuario.avatar_url ?? null,
            bio: usuario.bio ?? null,
            level: usuario.current_level,
            xp: usuario.experience_points,
            github_url: usuario.github_url ?? null,
            linkedin_url: usuario.linkedin_url ?? null,
            top_skills: maestrias.slice(0, 6),
            endorsements: endosos.slice(0, 8),
        };
    }
}
