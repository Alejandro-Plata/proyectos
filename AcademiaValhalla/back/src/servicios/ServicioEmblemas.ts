import { Emblema } from '../modelos/Modelos.js';

/**
 * §0 · Emblemas de perfil — distinciones visibles otorgadas por torneos (B7),
 * mentoría (B8) o proyectos destacados (B9). Las muestra el perfil (B10).
 */
export class ServicioEmblemas {
    static async otorgar(userId: string, kind: string, label: string, meta: Record<string, any> = {}): Promise<void> {
        // Evita duplicar el mismo emblema (mismo kind + label) para el usuario
        const existe = await Emblema.findOne({ where: { user_id: userId, kind, label } });
        if (existe) return;
        await Emblema.create({ user_id: userId, kind, label, meta });
    }

    static async listar(userId: string) {
        return Emblema.findAll({
            where: { user_id: userId },
            order: [['awarded_at', 'DESC']],
        });
    }
}
