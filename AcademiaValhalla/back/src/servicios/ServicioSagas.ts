import { Op } from 'sequelize';
import { Saga, HitoSaga, NotaUsuario, Reto, ProgresoRetoUsuario } from '../modelos/Modelos.js';
import { ServicioIA, MODELO } from './ServicioIA.js';

type TipoHito = 'note' | 'challenge' | 'project' | 'checkpoint';

interface HitoGenerado {
    type: TipoHito;
    ref_hint?: string | null;
    title: string;
    description?: string;
}
interface SagaGenerada {
    title: string;
    milestones: HitoGenerado[];
}

interface EntradaCatalogo {
    kind: 'note' | 'challenge';
    id: string;
    title: string;
    meta: string;
}

const PROMPT_SAGA = `Diseña un itinerario de aprendizaje ("roadmap") en español para el objetivo del usuario.
Solo puedes enlazar recursos del CATÁLOGO proporcionado: usa EXACTAMENTE su título en el campo "ref_hint".
Ordena los hitos de lo más básico a lo más avanzado. Intercala un hito de tipo "checkpoint" cada 3-4 hitos para consolidar, y termina con un hito de tipo "project" integrador.
Devuelve SOLO un JSON con esta forma:
{ "title": "título del roadmap",
  "milestones": [
    { "type": "note|challenge|project|checkpoint",
      "ref_hint": "título exacto del catálogo o null si no hay recurso adecuado",
      "title": "título del hito",
      "description": "qué se aprende o se hace en este hito" }
  ] }
Genera entre 6 y 12 hitos. No incluyas nada fuera del JSON.`;

const normalizar = (s: string) => (s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export class ServicioSagas {

    /** Catálogo de recursos enlazables: apuntes de comunidad aprobados + retos. */
    private static async construirCatalogo(): Promise<{ texto: string; mapa: Map<string, EntradaCatalogo> }> {
        const [notas, retos] = await Promise.all([
            NotaUsuario.findAll({
                where: { community_status: 'approved' },
                attributes: ['note_id', 'title', 'language', 'tags'],
                limit: 200,
            }),
            Reto.findAll({ attributes: ['challenge_id', 'title', 'difficulty'], limit: 200 }),
        ]);

        const mapa = new Map<string, EntradaCatalogo>();
        const lineas: string[] = [];

        for (const n of notas as any[]) {
            const entrada: EntradaCatalogo = {
                kind: 'note', id: n.note_id, title: n.title,
                meta: `apunte · ${n.language ?? 'general'}`,
            };
            mapa.set(normalizar(n.title), entrada);
            lineas.push(`[apunte] ${n.title} (${n.language ?? 'general'})`);
        }
        for (const r of retos as any[]) {
            const entrada: EntradaCatalogo = {
                kind: 'challenge', id: r.challenge_id, title: r.title,
                meta: `reto · ${r.difficulty}`,
            };
            mapa.set(normalizar(r.title), entrada);
            lineas.push(`[reto] ${r.title} (${r.difficulty})`);
        }

        return { texto: lineas.join('\n') || '(catálogo vacío)', mapa };
    }

    /** Genera una saga para un objetivo y la persiste con sus hitos resueltos. */
    static async generar(userId: string, goal: string): Promise<Saga> {
        const { texto, mapa } = await this.construirCatalogo();

        const generada = await ServicioIA.json<SagaGenerada>({
            modelo: MODELO.potente,
            system: PROMPT_SAGA,
            messages: [{ role: 'user', content: `Objetivo: ${goal}\n\nCATÁLOGO:\n${texto}` }],
            validar: (x): x is SagaGenerada => x && typeof x.title === 'string' && Array.isArray(x.milestones),
            maxTokens: 2500,
        });

        const saga = await Saga.create({ user_id: userId, goal, title: generada.title || `RoadMap: ${goal}` });

        const tiposValidos: TipoHito[] = ['note', 'challenge', 'project', 'checkpoint'];
        let position = 0;
        for (const m of generada.milestones) {
            const type: TipoHito = tiposValidos.includes(m.type) ? m.type : 'checkpoint';

            // Resolución de la referencia al catálogo (solo para note/challenge)
            let ref_id: string | null = null;
            if ((type === 'note' || type === 'challenge') && m.ref_hint) {
                const encontrado = mapa.get(normalizar(m.ref_hint));
                if (encontrado) ref_id = encontrado.id;
            }

            await HitoSaga.create({
                saga_id: saga.saga_id,
                position: position++,
                type,
                ref_id,
                title: m.title?.slice(0, 255) || 'Hito',
                description: m.description ?? null,
            });
        }

        return saga;
    }

    static async listar(userId: string): Promise<any[]> {
        const sagas = await Saga.findAll({
            where: { user_id: userId },
            include: [{ model: HitoSaga, as: 'hitos' }],
            order: [['created_at', 'DESC']],
        });
        return sagas.map((s: any) => {
            const hitos = s.hitos ?? [];
            const total = hitos.length || 1;
            const hechos = hitos.filter((h: any) => h.status === 'done').length;
            return {
                saga_id: s.saga_id, title: s.title, goal: s.goal,
                progress: Math.round((hechos / total) * 100),
                milestone_count: hitos.length,
            };
        });
    }

    /** Detalle de la saga con hitos ordenados; auto-marca retos ya completados. */
    static async obtener(userId: string, sagaId: string): Promise<any | null> {
        const saga = await Saga.findOne({
            where: { saga_id: sagaId, user_id: userId },
            include: [{ model: HitoSaga, as: 'hitos' }],
        });
        if (!saga) return null;

        const hitos = ((saga as any).hitos ?? []).sort((a: any, b: any) => a.position - b.position);

        // Auto-resolver hitos de tipo reto cuyo reto ya está completado
        const retoIds = hitos.filter((h: any) => h.type === 'challenge' && h.ref_id).map((h: any) => h.ref_id);
        if (retoIds.length) {
            const completados = await ProgresoRetoUsuario.findAll({
                where: { user_id: userId, challenge_id: { [Op.in]: retoIds }, status: 'COMPLETADO' },
                attributes: ['challenge_id'],
            });
            const setCompletados = new Set(completados.map((p: any) => p.challenge_id));
            for (const h of hitos) {
                if (h.type === 'challenge' && h.ref_id && setCompletados.has(h.ref_id) && h.status === 'pending') {
                    h.status = 'done';
                    await HitoSaga.update({ status: 'done' }, { where: { milestone_id: h.milestone_id } });
                }
            }
        }

        const total = hitos.length || 1;
        const hechos = hitos.filter((h: any) => h.status === 'done').length;

        return {
            saga_id: saga.saga_id,
            title: saga.title,
            goal: saga.goal,
            progress: Math.round((hechos / total) * 100),
            milestones: hitos.map((h: any) => ({
                milestone_id: h.milestone_id,
                position: h.position,
                type: h.type,
                ref_id: h.ref_id,
                title: h.title,
                description: h.description,
                status: h.status,
            })),
        };
    }

    static async actualizarHito(userId: string, sagaId: string, hitoId: string, status: string): Promise<boolean> {
        if (!['pending', 'done', 'skipped'].includes(status)) return false;
        const saga = await Saga.findOne({ where: { saga_id: sagaId, user_id: userId } });
        if (!saga) return false;
        const [n] = await HitoSaga.update({ status }, { where: { milestone_id: hitoId, saga_id: sagaId } });
        return n > 0;
    }

    static async eliminar(userId: string, sagaId: string): Promise<boolean> {
        const saga = await Saga.findOne({ where: { saga_id: sagaId, user_id: userId } });
        if (!saga) return false;
        await HitoSaga.destroy({ where: { saga_id: sagaId } });
        await saga.destroy();
        return true;
    }
}
