import { Request, Response } from 'express';
import {
    Reto,
    LenguajeReto,
    LenguajeProgramacion,
    ProgresoRetoUsuario,
    Etiqueta,
    EtiquetaReto,
} from '../modelos/Modelos.js';
import { Op } from 'sequelize';
import { ServicioXP } from '../servicios/ServicioXP.js';
import { ServicioLogros } from '../servicios/ServicioLogros.js';
import { RECOMPENSAS_XP_RETO } from '../utils/constXP.js';
import { executeCode as codeArenaExecute } from '../servicios/ServicioCodeArena.js';
import { CODE_ARENA_LANGUAGES as LENGUAJES_CODE_ARENA } from '../utils/codeArenaLanguages.js';

function mapearRetoAFrontend(reto: any) {
    const r = typeof reto.toJSON === 'function' ? reto.toJSON() : reto;
    const lenguajes = r.lenguajes ?? r.programmingLanguages ?? [];
    const etiquetas = r.etiquetas ?? r.tags ?? [];

    const variants = lenguajes.map((l: any) => {
        const through = l.LenguajeReto ?? l.lenguajeReto ?? l.challenge_languages ?? {};
        const initial = through.initial_code ?? '';
        const solution = through.solution_code ?? undefined;
        const validation = through.validation_code ?? '';

        return {
            id: `${r.challenge_id}-${l.name}`,
            language: l.name,
            starter_code: initial,
            solution_code: solution,
            execution_template: null,
            test_cases: validation ? [{
                id: `${r.challenge_id}-${l.name}-test`,
                name: 'Test principal',
                test_code: validation,
                is_hidden: false,
                sort_order: 1,
            }] : [],
        };
    });

    return {
        id: r.challenge_id,
        title: r.title,
        slug: r.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        description: r.description,
        difficulty: r.difficulty,
        tags: etiquetas.map((e: any) => e.name),
        xp_reward: r.experience_reward,
        example_output: r.example_output ?? undefined,
        available_languages: lenguajes.map((l: any) => l.name),
        variants,
    };
}

export class ControladorReto {

    static obtenerTodos = async (req: Request, res: Response) => {
        try {
            const filtro: any = {};
            if (req.query.difficulty) filtro.difficulty = req.query.difficulty;
            if (req.query.category) filtro.category = req.query.category;
            if (req.query.search) {
                filtro.title = { [Op.iLike]: `%${req.query.search}%` };
            }

            const filas = await Reto.findAll({
                where: filtro,
                include: [
                    {
                        model: LenguajeProgramacion,
                        through: { attributes: ['initial_code', 'solution_code', 'validation_code'] },
                    },
                    {
                        model: Etiqueta,
                        through: { attributes: [] },
                    },
                ],
                order: [['created_at', 'DESC']],
            });

            // Devolver array plano en el formato `Challenge[]` que consume el frontend.
            res.json(filas.map(mapearRetoAFrontend));

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener retos' });
        }
    };

    // Obtiene un reto completo con todos sus lenguajes y código 
    static obtenerPorId = async (req: Request, res: Response) => {
        try {
            const { challengeId } = req.params;

            const reto = await Reto.findByPk(challengeId, {
                include: [
                    {
                        model: LenguajeProgramacion,
                        through: { attributes: ['initial_code', 'solution_code', 'validation_code'] },
                    },
                    {
                        model: Etiqueta,
                        through: { attributes: [] },
                    },
                ],
            });

            if (!reto) {
                return res.status(404).json({ msg: 'Reto no encontrado' });
            }

            res.json(mapearRetoAFrontend(reto));

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener el reto' });
        }
    };

    static crear = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { title, description, difficulty, category, experience_reward,
                    instructions, example_output, languages, tags } = req.body;

            const reto = await Reto.create({
                title,
                description,
                difficulty,
                category,
                experience_reward,
                instructions,
                example_output,
                created_by: idUsuario,
            });

            if (languages && Array.isArray(languages)) {
                for (const lang of languages) {
                    await LenguajeReto.create({
                        challenge_id: reto.challenge_id,
                        language_id: lang.language_id,
                        initial_code: lang.initial_code,
                        solution_code: lang.solution_code,
                        validation_code: lang.validation_code,
                    });
                }
            }

            if (tags && Array.isArray(tags)) {
                for (const idEtiqueta of tags) {
                    await EtiquetaReto.create({
                        challenge_id: reto.challenge_id,
                        tag_id: idEtiqueta,
                    });
                }
            }

            res.status(201).json({ msg: 'Reto creado correctamente', challenge: reto });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al crear el reto' });
        }
    };

    static eliminar = async (req: Request, res: Response) => {
        try {
            const { challengeId } = req.params;
            const idUsuario = req.user!.user_id;
            const rolUsuario = req.user!.role;

            const reto = await Reto.findByPk(challengeId);
            if (!reto) {
                return res.status(404).json({ msg: 'Reto no encontrado' });
            }

            if (reto.created_by !== idUsuario && rolUsuario !== 'ADMIN' && rolUsuario !== 'MODERADOR') {
                return res.status(403).json({ msg: 'No tienes permisos para eliminar este reto' });
            }

            await reto.destroy();
            res.json({ msg: 'Reto eliminado correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al eliminar el reto' });
        }
    };

    static actualizarProgreso = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { challengeId: idReto } = req.params;
            const { status, user_solution } = req.body;

            const [progreso, creado] = await ProgresoRetoUsuario.findOrCreate({
                where: { user_id: idUsuario, challenge_id: idReto },
                defaults: {
                    user_id: idUsuario,
                    challenge_id: idReto,
                    status,
                    user_solution,
                    completed_at: status === 'COMPLETADO' ? new Date() : null,
                },
            });

            const yaEstabaCompletado = !creado && progreso.status === 'COMPLETADO';

            if (!creado) {
                progreso.status = status;
                if (user_solution !== undefined) progreso.user_solution = user_solution;
                if (status === 'COMPLETADO') progreso.completed_at = new Date();
                await progreso.save();
            }

            let recompensaXP = null;
            let logrosDesbloqueados: any[] = [];
            const esPrimeraCompletacion = status === 'COMPLETADO' && !yaEstabaCompletado;
            if (esPrimeraCompletacion) {
                const reto = await Reto.findByPk(idReto);
                const cantidadXP = (reto?.experience_reward)
                    || RECOMPENSAS_XP_RETO[reto?.difficulty ?? '']
                    || 25;
                recompensaXP = await ServicioXP.otorgarXP(idUsuario, cantidadXP);

                const retosCompletados = await ProgresoRetoUsuario.count({
                    where: { user_id: idUsuario, status: 'COMPLETADO' },
                });
                logrosDesbloqueados = await ServicioLogros.verificarYDesbloquear(
                    idUsuario, 'challenge_count', retosCompletados
                );
            }

            res.json({ msg: 'Progreso actualizado', progress: progreso, xpReward: recompensaXP, unlockedAchievements: logrosDesbloqueados });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al actualizar progreso' });
        }
    };

    static obtenerProgreso = async (req: Request, res: Response) => {
        try {
            const idUsuario = req.user!.user_id;
            const { challengeId: idReto } = req.params;

            const progreso = await ProgresoRetoUsuario.findOne({
                where: { user_id: idUsuario, challenge_id: idReto },
            });

            res.json(progreso || { status: 'SIN_EMPEZAR' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener progreso' });
        }
    };

    static ejecutarCodigo = async (req: Request, res: Response) => {
        try {
            const { language, code, stdin } = req.body;

            if (!language || typeof code !== 'string') {
                return res.status(400).json({ error: 'Se requieren los campos "language" y "code".' });
            }
            if (!LENGUAJES_CODE_ARENA[language.toLowerCase()]) {
                return res.status(400).json({
                    error: `Lenguaje "${language}" no soportado. Disponibles: ${Object.keys(LENGUAJES_CODE_ARENA).join(', ')}`,
                });
            }
            if (code.length > 50_000) {
                return res.status(400).json({ error: 'El código supera el límite de 50.000 caracteres.' });
            }

            const resultado = await codeArenaExecute(language, code, {
                stdin:         typeof stdin === 'string' ? stdin : undefined,
                cpuTimeLimit:  5,
                wallTimeLimit: 30,
            });

            return res.json({
                stdout:   resultado.stdout,
                stderr:   resultado.stderr,
                exitCode: resultado.exitCode,
                signal:   resultado.signal,
                timedOut: resultado.timedOut,
            });

        } catch (err: any) {
            console.error('[ejecutarCodigo]', err);
            if (err?.name === 'AbortError') {
                return res.status(504).json({ error: 'La ejecución superó el tiempo límite del servidor.' });
            }
            return res.status(502).json({ error: err?.message ?? 'Error interno al ejecutar el código.' });
        }
    };

    static execute = async (req: Request, res: Response) => {
        return ControladorReto.ejecutarCodigo(req, res);
    };
}

