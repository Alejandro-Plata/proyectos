import { QueryTypes } from 'sequelize';
import { db } from '../config/db.js';

export interface ApunteRelevante {
    note_id: string;
    title: string;
    summary: string;
    language: string;
    rank: number;
}

export interface RetoFallado {
    challenge_id: string;
    title: string;
    difficulty: string;
}

/**
 * Recuperación de contexto (RAG) — Fase 1: búsqueda léxica con Postgres FTS.
 * Sustituible por pgvector + embeddings en el futuro sin cambiar la interfaz.
 */
export class ServicioRecuperacion {
    /** Apuntes propios o de comunidad aprobados más relevantes para una consulta. */
    static async apuntesRelevantes(userId: string, consulta: string, limite = 4): Promise<ApunteRelevante[]> {
        if (!consulta?.trim()) return [];
        try {
            const rows = await db.query<ApunteRelevante>(
                `SELECT note_id, title, summary, language,
                        ts_rank(to_tsvector('spanish', coalesce(title,'') || ' ' || coalesce(summary,'')),
                                plainto_tsquery('spanish', :q)) AS rank
                   FROM user_notes
                  WHERE (user_id = :uid OR community_status = 'approved')
                    AND to_tsvector('spanish', coalesce(title,'') || ' ' || coalesce(summary,''))
                        @@ plainto_tsquery('spanish', :q)
                  ORDER BY rank DESC
                  LIMIT :lim`,
                { replacements: { uid: userId, q: consulta, lim: limite }, type: QueryTypes.SELECT }
            );
            return rows;
        } catch (e) {
            console.error('[ServicioRecuperacion.apuntesRelevantes]', (e as any)?.message ?? e);
            return [];
        }
    }

    /** Retos que el usuario empezó o abandonó y no completó (señal de debilidad). */
    static async retosFallados(userId: string, limite = 5): Promise<RetoFallado[]> {
        try {
            const rows = await db.query<RetoFallado>(
                `SELECT c.challenge_id, c.title, c.difficulty
                   FROM user_challenge_progress p
                   JOIN challenges c ON c.challenge_id = p.challenge_id
                  WHERE p.user_id = :uid
                    AND p.status IN ('EN_PROGRESO', 'ABANDONADO')
                  ORDER BY p.last_attempt_at DESC
                  LIMIT :lim`,
                { replacements: { uid: userId, lim: limite }, type: QueryTypes.SELECT }
            );
            return rows;
        } catch (e) {
            console.error('[ServicioRecuperacion.retosFallados]', (e as any)?.message ?? e);
            return [];
        }
    }
}
