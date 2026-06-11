import { Transaction } from 'sequelize';
import {
    Reto, LenguajeProgramacion, LenguajeReto,
    Etiqueta, EtiquetaReto, Publicacion, EtiquetaPublicacion, SolicitudContenido,
} from '../modelos/Modelos.js';
import { Dificultad, Categoria, TipoPublicacion } from '../types/types.js';

const DIFFICULTY_MAP: Record<string, Dificultad> = {
    'Fácil': Dificultad.FACIL, 'easy': Dificultad.FACIL,
    'Intermedio': Dificultad.MEDIO, 'medium': Dificultad.MEDIO,
    'Difícil': Dificultad.DIFICIL, 'hard': Dificultad.DIFICIL,
};

const XP_MAP: Record<string, number> = {
    [Dificultad.FACIL]: 50,
    [Dificultad.MEDIO]: 100,
    [Dificultad.DIFICIL]: 200,
    [Dificultad.EXPERTO]: 300,
};

const CATEGORY_MAP: Record<string, Categoria> = {
    'algoritmos': Categoria.ALGORITMOS,
    'frontend': Categoria.FRONTEND,
    'backend': Categoria.BACKEND,
    'database': Categoria.DATABASE,
    'devops': Categoria.DEVOPS,
};

async function resolverOCrearEtiqueta(nombre: string, t: Transaction): Promise<string> {
    const [etiqueta] = await Etiqueta.findOrCreate({
        where: { name: nombre.toLowerCase().trim() },
        defaults: { name: nombre.toLowerCase().trim() },
        transaction: t,
    });
    return (etiqueta as any).tag_id;
}

export async function aprobarRetoDesdeSolicitud(
    solicitud: SolicitudContenido,
    t: Transaction
): Promise<{ id: string; url: string }> {
    const metadata = (solicitud as any).metadata ?? {};

    const difficulty = DIFFICULTY_MAP[metadata.difficulty] ?? Dificultad.MEDIO;
    const experience_reward = XP_MAP[difficulty] ?? 100;

    const categoryRaw = (metadata.category ?? '').toLowerCase().trim();
    const category = CATEGORY_MAP[categoryRaw] ?? Categoria.ALGORITMOS;

    const reto = await Reto.create({
        title: solicitud.title,
        description: solicitud.description,
        difficulty,
        category,
        experience_reward,
        instructions: metadata.instructions ?? null,
        example_output: metadata.example_output ?? null,
        examples: Array.isArray(metadata.examples) ? metadata.examples : [],
        hints: Array.isArray(metadata.hints) ? metadata.hints : [],
        created_by: (solicitud as any).author_id,
    }, { transaction: t });

    const retoId = (reto as any).challenge_id as string;

    const variantesEntrada: any[] = Array.isArray(metadata.variants) && metadata.variants.length > 0
        ? metadata.variants
        : metadata.language
            ? [{
                language: metadata.language,
                starter_code: metadata.starter_code,
                solution_code: metadata.solution_code,
                test_code: metadata.validation_code ?? metadata.test_code,
            }]
            : [];

    for (const variante of variantesEntrada) {
        const langName = String(variante.language ?? '').toLowerCase().trim();
        if (!langName) continue;

        const lang = await LenguajeProgramacion.findOne({
            where: { name: langName },
            transaction: t,
        });
        if (!lang) {
            throw Object.assign(
                new Error(`Lenguaje "${variante.language}" no existe. Créalo en /admin/languages primero.`),
                { code: 'LANGUAGE_NOT_FOUND', field: 'language' }
            );
        }
        await LenguajeReto.create({
            challenge_id: retoId,
            language_id: (lang as any).language_id,
            initial_code: variante.starter_code ?? '',
            solution_code: variante.solution_code ?? '',
            validation_code: variante.validation_code ?? variante.test_code ?? '',
        }, { transaction: t });
    }

    if (Array.isArray(metadata.tags) && metadata.tags.length > 0) {
        for (const tagName of metadata.tags) {
            const tagId = await resolverOCrearEtiqueta(String(tagName), t);
            await EtiquetaReto.create({ challenge_id: retoId, tag_id: tagId }, { transaction: t });
        }
    }

    return { id: retoId, url: `/dashboard/challenges/${retoId}` };
}

export async function aprobarNotaDesdeSolicitud(
    solicitud: SolicitudContenido,
    t: Transaction
): Promise<{ id: string; url: string }> {
    const metadata = (solicitud as any).metadata ?? {};

    const post = await Publicacion.create({
        author_id: (solicitud as any).author_id,
        title: solicitud.title,
        content: Array.isArray(metadata.content) ? metadata.content : [],
        post_type: TipoPublicacion.RECURSO,
    }, { transaction: t });

    const postId = (post as any).post_id as string;

    if (Array.isArray(metadata.tags) && metadata.tags.length > 0) {
        for (const tagName of metadata.tags) {
            const tagId = await resolverOCrearEtiqueta(String(tagName), t);
            await EtiquetaPublicacion.create({ post_id: postId, tag_id: tagId }, { transaction: t });
        }
    }

    return { id: postId, url: `/dashboard/community/posts/${postId}` };
}
