import { db } from '../config/db.js';
import { Logro } from '../modelos/Modelos.js';

const LOGROS: Array<{
    title: string;
    description: string;
    trigger_type: string;
    threshold: number;
    xp_reward: number;
    rarity: string;
    emblem_url: string | null;
    display_order: number;
    is_active: boolean;
    status: string;
}> = [
    {
        title: 'Primera voz',
        description: 'Publicaste tu primera entrada en el foro. ¡La comunidad te escucha!',
        trigger_type: 'post_count',
        threshold: 1,
        xp_reward: 50,
        rarity: 'common',
        emblem_url: '/images/emblems/capibara_foro.png',
        display_order: 10,
        is_active: true,
        status: 'published',
    },
    {
        title: 'Primer comentario',
        description: 'Dejaste tu primer comentario en el foro. ¡Así se construye la comunidad!',
        trigger_type: 'comment_count',
        threshold: 1,
        xp_reward: 25,
        rarity: 'common',
        emblem_url: '/images/emblems/capibara_foro.png',
        display_order: 11,
        is_active: true,
        status: 'published',
    },
    {
        title: 'En el candelero',
        description: 'Una de tus publicaciones recibió su primer voto positivo. ¡El foro te aprecia!',
        trigger_type: 'post_featured',
        threshold: 1,
        xp_reward: 100,
        rarity: 'rare',
        emblem_url: '/images/emblems/capibara_foro.png',
        display_order: 12,
        is_active: true,
        status: 'published',
    },
    {
        title: 'Primer código ejecutado',
        description: 'Completaste tu primer reto de programación. ¡El camino comienza aquí!',
        trigger_type: 'challenge_count',
        threshold: 1,
        xp_reward: 75,
        rarity: 'common',
        emblem_url: '/images/emblems/vaca_programa.png',
        display_order: 13,
        is_active: true,
        status: 'published',
    },
    {
        title: 'Cara nueva',
        description: 'Actualizaste tu foto de perfil. ¡Ahora todos saben quién eres!',
        trigger_type: 'avatar_changed',
        threshold: 1,
        xp_reward: 25,
        rarity: 'common',
        emblem_url: '/images/emblems/vaca_programa.png',
        display_order: 14,
        is_active: true,
        status: 'published',
    },
];

async function run() {
    await db.authenticate();

    for (const logro of LOGROS) {
        const existing = await Logro.findOne({
            where: { trigger_type: logro.trigger_type, threshold: logro.threshold, title: logro.title },
        });
        if (existing) {
            if (!existing.emblem_url && logro.emblem_url) {
                await existing.update({ emblem_url: logro.emblem_url });
            }
            continue;
        }
        await Logro.create(logro as any);
    }

    await db.close();
}

run().catch(err => { console.error(err); process.exit(1); });
