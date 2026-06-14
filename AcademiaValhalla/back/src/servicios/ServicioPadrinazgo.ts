import { Op } from 'sequelize';
import {
    PerfilMentor, Mentoria, Usuario, Conversacion, ParticipanteConversacion,
} from '../modelos/Modelos.js';
import { ServicioLogros } from './ServicioLogros.js';
import { ServicioEmblemas } from './ServicioEmblemas.js';

const MENTOR_MIN_LEVEL = 10;       // rango "Avanzado"
const MENTOR_MIN_SOLUTIONS = 15;

export class ServicioPadrinazgo {

    static cumpleCriterioMentor(u: any): boolean {
        return (u?.current_level ?? 0) >= MENTOR_MIN_LEVEL || (u?.total_solutions ?? 0) >= MENTOR_MIN_SOLUTIONS;
    }

    static async puedeSerMentor(userId: string): Promise<boolean> {
        const u = await Usuario.findByPk(userId, { attributes: ['current_level', 'total_solutions'] });
        return this.cumpleCriterioMentor(u);
    }

    static async activarMentor(userId: string, datos: { languages?: string[]; bio_mentor?: string; capacity?: number }) {
        if (!(await this.puedeSerMentor(userId))) {
            throw new Error('Todavía no cumples los requisitos para ser mentor (nivel 10 o 15 soluciones).');
        }
        const [perfil] = await PerfilMentor.findOrCreate({ where: { user_id: userId }, defaults: { user_id: userId } });
        await perfil.update({
            is_available: true,
            languages: Array.isArray(datos.languages) ? datos.languages.slice(0, 10) : perfil.languages,
            bio_mentor: datos.bio_mentor ?? perfil.bio_mentor,
            capacity: Math.max(1, Math.min(20, datos.capacity ?? perfil.capacity ?? 3)),
        });
        return perfil;
    }

    static async desactivarMentor(userId: string) {
        await PerfilMentor.update({ is_available: false }, { where: { user_id: userId } });
    }

    private static async aprendicesActivos(mentorId: string): Promise<number> {
        return Mentoria.count({ where: { mentor_id: mentorId, status: { [Op.in]: ['pending', 'active'] } } });
    }

    static async listarMentores(filtros: { language?: string; level?: number }, viewerId: string) {
        const perfiles = await PerfilMentor.findAll({
            where: { is_available: true, user_id: { [Op.ne]: viewerId } },
            include: [{ model: Usuario, as: 'usuario', attributes: ['user_id', 'username', 'avatar_url', 'current_level', 'total_solutions', 'bio'] }],
        });

        const out: any[] = [];
        for (const p of perfiles as any[]) {
            if (filtros.language && !(p.languages ?? []).map((l: string) => l.toLowerCase()).includes(filtros.language.toLowerCase())) continue;
            if (filtros.level && (p.usuario?.current_level ?? 0) < filtros.level) continue;
            const ocupadas = await this.aprendicesActivos(p.user_id);
            const libres = (p.capacity ?? 3) - ocupadas;
            if (libres <= 0) continue;
            out.push({
                user_id: p.user_id,
                username: p.usuario?.username,
                avatar_url: p.usuario?.avatar_url ?? null,
                level: p.usuario?.current_level ?? 1,
                languages: p.languages ?? [],
                bio_mentor: p.bio_mentor,
                slots_free: libres,
            });
        }
        return out;
    }

    static async solicitar(apprenticeId: string, mentorId: string, goal?: string) {
        if (apprenticeId === mentorId) throw new Error('No puedes apadrinarte a ti mismo');

        const perfil = await PerfilMentor.findOne({ where: { user_id: mentorId, is_available: true } });
        if (!perfil) throw new Error('Este mentor no está disponible');
        if ((await this.aprendicesActivos(mentorId)) >= perfil.capacity) throw new Error('El mentor no tiene plazas libres');

        const existente = await Mentoria.findOne({
            where: { mentor_id: mentorId, apprentice_id: apprenticeId, status: { [Op.in]: ['pending', 'active'] } },
        });
        if (existente) throw new Error('Ya tienes una solicitud o mentoría activa con este mentor');

        return Mentoria.create({ mentor_id: mentorId, apprentice_id: apprenticeId, goal: goal ?? null, status: 'pending' });
    }

    static async responder(mentorId: string, mentorshipId: string, aceptar: boolean, io?: any) {
        const m = await Mentoria.findOne({ where: { mentorship_id: mentorshipId, mentor_id: mentorId, status: 'pending' } });
        if (!m) throw new Error('Solicitud no encontrada');

        if (!aceptar) {
            await m.update({ status: 'rejected' });
            return m;
        }

        const conversationId = await this.asegurarConversacionDirecta(m.mentor_id, m.apprentice_id, io);
        await m.update({ status: 'active', conversation_id: conversationId });
        return m;
    }

    static async finalizar(userId: string, mentorshipId: string) {
        const m = await Mentoria.findOne({
            where: { mentorship_id: mentorshipId, status: 'active', [Op.or]: [{ mentor_id: userId }, { apprentice_id: userId }] },
        });
        if (!m) throw new Error('Mentoría no encontrada');
        await m.update({ status: 'ended', ended_at: new Date() });

        // Recompensa al mentor por su primera mentoría completada
        const completadas = await Mentoria.count({ where: { mentor_id: m.mentor_id, status: 'ended' } });
        if (completadas === 1) {
            await ServicioEmblemas.otorgar(m.mentor_id, 'mentor', 'Mentor');
        }
        await ServicioLogros.verificarYDesbloquear(m.mentor_id, 'mentorship_count', completadas);
        return m;
    }

    static async mias(userId: string) {
        const comoMentor = await Mentoria.findAll({
            where: { mentor_id: userId, status: { [Op.in]: ['pending', 'active'] } },
            include: [{ model: Usuario, as: 'aprendiz', attributes: ['user_id', 'username', 'avatar_url'] }],
            order: [['created_at', 'DESC']],
        });
        const comoAprendiz = await Mentoria.findAll({
            where: { apprentice_id: userId, status: { [Op.in]: ['pending', 'active'] } },
            include: [{ model: Usuario, as: 'mentor', attributes: ['user_id', 'username', 'avatar_url'] }],
            order: [['created_at', 'DESC']],
        });
        const map = (m: any, otro: any) => ({
            mentorship_id: m.mentorship_id,
            status: m.status,
            goal: m.goal,
            conversation_id: m.conversation_id,
            other: otro ? { user_id: otro.user_id, username: otro.username, avatar_url: otro.avatar_url ?? null } : null,
        });
        return {
            as_mentor: (comoMentor as any[]).map(m => map(m, m.aprendiz)),
            as_apprentice: (comoAprendiz as any[]).map(m => map(m, m.mentor)),
        };
    }

    /** Crea (o recupera) la conversación directa 1:1 entre dos usuarios. */
    private static async asegurarConversacionDirecta(userA: string, userB: string, io?: any): Promise<string> {
        // Buscar conversación directa existente entre ambos
        const misConv = await ParticipanteConversacion.findAll({
            where: { user_id: userA },
            attributes: ['conversation_id'],
            include: [{ model: Conversacion, as: 'conversacion', where: { is_group: false }, required: true }],
        });
        if (misConv.length) {
            const ids = misConv.map((p: any) => p.conversation_id);
            const match = await ParticipanteConversacion.findOne({ where: { conversation_id: { [Op.in]: ids }, user_id: userB } });
            if (match) return match.conversation_id;
        }

        const conv = await Conversacion.create({ is_group: false });
        await ParticipanteConversacion.bulkCreate([
            { conversation_id: conv.conversation_id, user_id: userA, role: 'member' },
            { conversation_id: conv.conversation_id, user_id: userB, role: 'member' },
        ]);

        if (io) {
            try {
                const [ua, ub] = await Promise.all([
                    Usuario.findByPk(userA, { attributes: ['user_id', 'username', 'avatar_url'] }),
                    Usuario.findByPk(userB, { attributes: ['user_id', 'username', 'avatar_url'] }),
                ]);
                io.in(userA).socketsJoin(conv.conversation_id);
                io.in(userB).socketsJoin(conv.conversation_id);
                const shape = (otro: any) => ({
                    id: conv.conversation_id, is_group: false,
                    participant: { user_id: otro.user_id, username: otro.username, avatar_url: otro.avatar_url ?? null, is_online: false },
                    last_message: '', last_message_time: (conv as any).created_at, last_message_sender_id: null, unread_count: 0,
                });
                if (ub) io.to(userA).emit('new_conversation', shape(ub));
                if (ua) io.to(userB).emit('new_conversation', shape(ua));
            } catch (e) {
                console.error('[asegurarConversacionDirecta] WS', (e as any)?.message);
            }
        }
        return conv.conversation_id;
    }
}
