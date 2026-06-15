/**
 * seedComunidad.ts — Siembra datos mock para las funciones de comunidad añadidas
 * recientemente: emblemas, torneos (+leaderboard), mecenazgo (mentorías),
 * Salón de los Héroes (showcase + feedback + upvotes), endosos y Caza al bichillo.
 *
 * Crea además un pequeño elenco de usuarios de demostración (contraseña: 123456).
 * Es idempotente: se puede ejecutar varias veces sin duplicar.
 *
 * Ejecutar: npm run seed:comunidad
 */
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { db } from '../config/db.js';
import {
    Usuario, Reto, Emblema,
    Torneo, RetoTorneo, ParticipanteTorneo, ResolucionTorneo,
    PerfilMentor, Mentoria,
    ProyectoShowcase, FeedbackProyecto, VotoProyecto,
    Endoso, CazaTroll,
} from '../modelos/Modelos.js';
import { RolUsuario } from '../types/types.js';
import { BANCO_BICHILLOS } from '../servicios/ServicioCazaTroll.js';

const dias = (n: number) => new Date(Date.now() + n * 86_400_000);

// ── Usuarios de demostración ──────────────────────────────────────────────
interface UsuarioSemilla {
    username: string;
    bio: string;
    current_level: number;
    experience_points: number;
    total_solutions: number;
    github_url?: string;
    linkedin_url?: string;
}

const USUARIOS: UsuarioSemilla[] = [
    { username: 'bjorn',    bio: 'Backend con Node y Postgres. Aprendiendo Rust.',           current_level: 14, experience_points: 4200, total_solutions: 28, github_url: 'https://github.com/bjorn', linkedin_url: 'https://linkedin.com/in/bjorn' },
    { username: 'lagertha', bio: 'Frontend React/TypeScript. Me gusta el buen diseño.',       current_level: 12, experience_points: 3600, total_solutions: 21, github_url: 'https://github.com/lagertha' },
    { username: 'ivar',     bio: 'Algoritmos y estructuras de datos. Competitive programming.', current_level: 11, experience_points: 3100, total_solutions: 19 },
    { username: 'ubbe',     bio: 'Fullstack en formación. Construyendo mi primer SaaS.',       current_level: 6,  experience_points: 1200, total_solutions: 7 },
    { username: 'floki',    bio: 'Curioso de todo: Go, sistemas y un poco de caos.',           current_level: 8,  experience_points: 1900, total_solutions: 11, github_url: 'https://github.com/floki' },
];

async function asegurarUsuarios(): Promise<Record<string, Usuario>> {
    const hash = await bcrypt.hash('123456', 10);
    const out: Record<string, Usuario> = {};
    for (const u of USUARIOS) {
        const [usuario] = await Usuario.findOrCreate({
            where: { username: u.username },
            defaults: {
                username: u.username,
                email: `${u.username}@valhalla.local`,
                password: hash,
                bio: u.bio,
                current_level: u.current_level,
                experience_points: u.experience_points,
                total_solutions: u.total_solutions,
                github_url: u.github_url ?? null,
                linkedin_url: u.linkedin_url ?? null,
                role: RolUsuario.USUARIO,
            } as any,
        });
        out[u.username] = usuario;
    }
    return out;
}

// ── Emblemas ────────────────────────────────────────────────────────────────
async function sembrarEmblemas(users: Record<string, Usuario>) {
    const emblemas: { user: string; kind: string; label: string }[] = [
        { user: 'bjorn',    kind: 'tournament', label: 'Temporada 2026-S1' },
        { user: 'bjorn',    kind: 'mentor',     label: 'Mentor' },
        { user: 'lagertha', kind: 'showcase',   label: 'Proyecto destacado' },
        { user: 'ivar',     kind: 'tournament', label: 'Temporada 2026-S1' },
        { user: 'floki',    kind: 'mentor',     label: 'Mentor' },
    ];
    let n = 0;
    for (const e of emblemas) {
        const uid = users[e.user]?.user_id;
        if (!uid) continue;
        const existe = await Emblema.findOne({ where: { user_id: uid, kind: e.kind, label: e.label } });
        if (existe) continue;
        await Emblema.create({ user_id: uid, kind: e.kind, label: e.label, meta: {} } as any);
        n++;
    }
    return n;
}

// ── Torneos ───────────────────────────────────────────────────────────────
async function sembrarTorneos(users: Record<string, Usuario>, admin: Usuario) {
    const retos = await Reto.findAll({ attributes: ['challenge_id', 'title'], limit: 4 });
    const retoIds = retos.map((r: any) => r.challenge_id);

    const definiciones = [
        { title: 'Justa de Primavera', description: 'Torneo de retos cronometrados de la temporada 2026-S1.', mode: 'challenges', season: '2026-S1', status: 'active',   starts_at: dias(-2), ends_at: dias(5),  reward_xp: 300 },
        { title: 'Caza Mayor de Bichillos', description: 'Torneo en modo Caza al bichillo: cada bug resuelto suma puntos.', mode: 'troll', season: '2026-S1', status: 'active', starts_at: dias(-1), ends_at: dias(6), reward_xp: 250 },
        { title: 'Gran Torneo de Invierno', description: 'La próxima gran competición. ¡Prepárate!', mode: 'challenges', season: '2026-S2', status: 'upcoming', starts_at: dias(7),  ends_at: dias(14), reward_xp: 400 },
        { title: 'Justa de Apertura', description: 'El primer torneo de la academia. Ya finalizado.', mode: 'challenges', season: '2025-S2', status: 'finished', starts_at: dias(-30), ends_at: dias(-20), reward_xp: 200 },
    ];

    let creados = 0;
    for (const d of definiciones) {
        let torneo = await Torneo.findOne({ where: { title: d.title } });
        if (!torneo) {
            torneo = await Torneo.create({ ...d, created_by: admin.user_id } as any);
            creados++;
        }

        // Vincular retos reales (solo a los torneos de modo 'challenges')
        if (d.mode === 'challenges' && retoIds.length) {
            for (const cid of retoIds.slice(0, 3)) {
                await RetoTorneo.findOrCreate({
                    where: { tournament_id: torneo.tournament_id, challenge_id: cid },
                    defaults: { tournament_id: torneo.tournament_id, challenge_id: cid, points: 100 } as any,
                });
            }
        }

        // Participantes + leaderboard (en torneos activos y finalizados)
        if (d.status === 'active' || d.status === 'finished') {
            const tabla = [
                { user: 'bjorn',    score: 300, solved: 3 },
                { user: 'ivar',     score: 200, solved: 2 },
                { user: 'lagertha', score: 100, solved: 1 },
                { user: 'floki',    score: 100, solved: 1 },
            ];
            let offset = 0;
            for (const fila of tabla) {
                const uid = users[fila.user]?.user_id;
                if (!uid) continue;
                await ParticipanteTorneo.findOrCreate({
                    where: { tournament_id: torneo.tournament_id, user_id: uid },
                    defaults: {
                        tournament_id: torneo.tournament_id,
                        user_id: uid,
                        score: fila.score,
                        solved_count: fila.solved,
                        last_solved_at: new Date(Date.now() - (offset++ * 60_000)),
                    } as any,
                });
                // Registrar resoluciones coherentes (modo challenges)
                if (d.mode === 'challenges') {
                    for (const cid of retoIds.slice(0, fila.solved)) {
                        await ResolucionTorneo.findOrCreate({
                            where: { tournament_id: torneo.tournament_id, user_id: uid, challenge_id: cid },
                            defaults: { tournament_id: torneo.tournament_id, user_id: uid, challenge_id: cid } as any,
                        });
                    }
                }
            }
        }
    }
    return creados;
}

// ── Mecenazgo (mentorías) ────────────────────────────────────────────────
async function sembrarMecenazgo(users: Record<string, Usuario>) {
    const mentores = [
        { user: 'bjorn',    languages: ['javascript', 'typescript', 'node'], bio: 'Te ayudo con backend, APIs y bases de datos.', capacity: 4 },
        { user: 'lagertha', languages: ['javascript', 'typescript', 'react'], bio: 'Mentoría de frontend y buenas prácticas de UI.', capacity: 3 },
        { user: 'ivar',     languages: ['python', 'cpp'], bio: 'Algoritmia y preparación de entrevistas técnicas.', capacity: 2 },
    ];
    for (const m of mentores) {
        const uid = users[m.user]?.user_id;
        if (!uid) continue;
        const [perfil] = await PerfilMentor.findOrCreate({
            where: { user_id: uid },
            defaults: { user_id: uid, is_available: true, languages: m.languages, bio_mentor: m.bio, capacity: m.capacity } as any,
        });
        await perfil.update({ is_available: true, languages: m.languages, bio_mentor: m.bio, capacity: m.capacity });
    }

    // Algunas mentorías: una pendiente y una activa
    const relaciones = [
        { mentor: 'bjorn',    apprentice: 'ubbe',  status: 'active',  goal: 'Montar una API REST con Express y Postgres.' },
        { mentor: 'lagertha', apprentice: 'floki', status: 'pending', goal: 'Mejorar mis componentes React y el manejo de estado.' },
        { mentor: 'ivar',     apprentice: 'ubbe',  status: 'pending', goal: 'Practicar algoritmos para entrevistas.' },
    ];
    let creadas = 0;
    for (const r of relaciones) {
        const mid = users[r.mentor]?.user_id;
        const aid = users[r.apprentice]?.user_id;
        if (!mid || !aid) continue;
        const existe = await Mentoria.findOne({ where: { mentor_id: mid, apprentice_id: aid, status: { [Op.in]: ['pending', 'active'] } } });
        if (existe) continue;
        await Mentoria.create({ mentor_id: mid, apprentice_id: aid, status: r.status, goal: r.goal } as any);
        creadas++;
    }
    return creadas;
}

// ── Salón de los Héroes (showcase) ─────────────────────────────────────────
async function sembrarShowcase(users: Record<string, Usuario>) {
    const proyectos = [
        {
            author: 'lagertha', featured: true, upvotes: ['bjorn', 'ivar', 'ubbe', 'floki'],
            title: 'Valhalla Tasks — gestor de tareas con drag & drop',
            summary: 'App de tableros estilo Kanban con React, Zustand y persistencia local.',
            tech_stack: ['React', 'TypeScript', 'Zustand', 'TailwindCSS'],
            repo_url: 'https://github.com/lagertha/valhalla-tasks',
            demo_url: 'https://valhalla-tasks.vercel.app',
            description: [
                { type: 'text', value: 'Un gestor de tareas con tableros, columnas y arrastrar y soltar. Lo construí para practicar gestión de estado compleja sin Redux.' },
                { type: 'text', value: 'Lo más difícil fue el drag & drop accesible y la sincronización optimista con localStorage.' },
            ],
            feedback: [
                { from: 'bjorn', dimension: 'codigo', rating: 5, comment: 'Código muy limpio y bien tipado.' },
                { from: 'ivar',  dimension: 'diseno', rating: 4, comment: 'La UI es agradable, quizá demasiados gradientes.' },
                { from: 'ubbe',  dimension: 'idea',   rating: 5, comment: 'Muy útil, lo usaría a diario.' },
            ],
        },
        {
            author: 'bjorn', featured: false, upvotes: ['lagertha', 'floki'],
            title: 'NorseAuth — microservicio de autenticación JWT',
            summary: 'API de auth con refresh tokens, OAuth y rate limiting lista para producción.',
            tech_stack: ['Node.js', 'Express', 'PostgreSQL', 'JWT'],
            repo_url: 'https://github.com/bjorn/norse-auth',
            description: [
                { type: 'text', value: 'Servicio de autenticación reutilizable: registro, login, refresh tokens, OAuth con Google/GitHub y recuperación de contraseña.' },
                { type: 'code', value: 'app.post("/login", validate(loginSchema), controllers.login);' },
            ],
            feedback: [
                { from: 'ivar',     dimension: 'codigo',        rating: 5, comment: 'Buena separación de capas.' },
                { from: 'lagertha', dimension: 'documentacion', rating: 4, comment: 'El README ayuda mucho a arrancar.' },
            ],
        },
        {
            author: 'ubbe', featured: false, upvotes: ['bjorn'],
            title: 'SagaCLI — generador de proyectos por terminal',
            summary: 'Mi primera CLI en Node para crear el esqueleto de proyectos fullstack.',
            tech_stack: ['Node.js', 'Commander', 'Inquirer'],
            repo_url: 'https://github.com/ubbe/saga-cli',
            description: [
                { type: 'text', value: 'Una CLI que pregunta qué stack quieres y genera la estructura de carpetas. Aprendí a publicar paquetes en npm.' },
            ],
            feedback: [
                { from: 'bjorn', dimension: 'idea', rating: 4, comment: 'Buen primer proyecto, sigue así.' },
            ],
        },
    ];

    let creados = 0;
    for (const p of proyectos) {
        const autorId = users[p.author]?.user_id;
        if (!autorId) continue;
        let proyecto = await ProyectoShowcase.findOne({ where: { title: p.title } });
        if (!proyecto) {
            proyecto = await ProyectoShowcase.create({
                author_id: autorId,
                title: p.title,
                summary: p.summary,
                description: p.description,
                repo_url: p.repo_url ?? null,
                demo_url: (p as any).demo_url ?? null,
                tech_stack: p.tech_stack,
                featured: p.featured,
            } as any);
            creados++;
        }

        // Upvotes
        for (const u of p.upvotes) {
            const uid = users[u]?.user_id;
            if (!uid) continue;
            await VotoProyecto.findOrCreate({
                where: { project_id: proyecto.project_id, user_id: uid },
                defaults: { project_id: proyecto.project_id, user_id: uid } as any,
            });
        }
        const total = await VotoProyecto.count({ where: { project_id: proyecto.project_id } });
        await proyecto.update({ upvote_count: total });

        // Feedback por dimensiones
        for (const f of p.feedback) {
            const uid = users[f.from]?.user_id;
            if (!uid) continue;
            await FeedbackProyecto.findOrCreate({
                where: { project_id: proyecto.project_id, author_id: uid, dimension: f.dimension },
                defaults: { project_id: proyecto.project_id, author_id: uid, dimension: f.dimension, rating: f.rating, comment: f.comment } as any,
            });
        }
    }
    return creados;
}

// ── Endosos de habilidades ──────────────────────────────────────────────
async function sembrarEndosos(users: Record<string, Usuario>) {
    const endosos = [
        { from: 'ivar',     to: 'bjorn',    skill: 'javascript' },
        { from: 'lagertha', to: 'bjorn',    skill: 'node' },
        { from: 'ubbe',     to: 'bjorn',    skill: 'javascript' },
        { from: 'bjorn',    to: 'lagertha', skill: 'react' },
        { from: 'floki',    to: 'lagertha', skill: 'typescript' },
        { from: 'bjorn',    to: 'ivar',     skill: 'python' },
        { from: 'lagertha', to: 'ivar',     skill: 'python' },
    ];
    let n = 0;
    for (const e of endosos) {
        const fid = users[e.from]?.user_id;
        const tid = users[e.to]?.user_id;
        if (!fid || !tid) continue;
        const [, creado] = await Endoso.findOrCreate({
            where: { endorser_id: fid, endorsed_id: tid, skill: e.skill },
            defaults: { endorser_id: fid, endorsed_id: tid, skill: e.skill } as any,
        });
        if (creado) n++;
    }
    return n;
}

// ── Caza al bichillo (historial) ───────────────────────────────────────────
async function sembrarCaza(users: Record<string, Usuario>) {
    const asignaciones = [
        { user: 'bjorn',    idx: 0, solved: true },
        { user: 'ivar',     idx: 2, solved: true },
        { user: 'lagertha', idx: 1, solved: true },
        { user: 'ubbe',     idx: 4, solved: false },
    ];
    let n = 0;
    for (const a of asignaciones) {
        const uid = users[a.user]?.user_id;
        const bug = BANCO_BICHILLOS[a.idx];
        if (!uid || !bug) continue;
        const existe = await CazaTroll.findOne({ where: { user_id: uid, buggy_code: bug.buggy_code } });
        if (existe) continue;
        await CazaTroll.create({
            user_id: uid,
            language: bug.language,
            original_code: bug.original_code,
            buggy_code: bug.buggy_code,
            bug_line: bug.bug_line,
            bug_explanation: bug.bug_explanation,
            solved: a.solved,
        } as any);
        n++;
    }
    return n;
}

async function sembrar() {
    try {
        await db.authenticate();
        // Garantiza que existan las tablas nuevas (showcase, endosos, etc.)
        // por si la BD aún no se ha sincronizado con los modelos recientes.
        await db.sync();

        const admin = await Usuario.findOne({ where: { role: RolUsuario.ADMIN } });
        if (!admin) {
            console.error('No hay ningún usuario ADMIN. Ejecuta antes "npm run seed:admins".');
            process.exit(1);
        }

        const users = await asegurarUsuarios();
        console.log(`Usuarios demo: ${Object.keys(users).length} listos.`);

        const emblemas = await sembrarEmblemas(users);
        const torneos = await sembrarTorneos(users, admin);
        const mentorias = await sembrarMecenazgo(users);
        const showcase = await sembrarShowcase(users);
        const endosos = await sembrarEndosos(users);
        const cazas = await sembrarCaza(users);

        console.log('Comunidad sembrada:');
        console.log(`  · Emblemas nuevos:   ${emblemas}`);
        console.log(`  · Torneos nuevos:    ${torneos}`);
        console.log(`  · Mentorías nuevas:  ${mentorias}`);
        console.log(`  · Proyectos nuevos:  ${showcase}`);
        console.log(`  · Endosos nuevos:    ${endosos}`);
        console.log(`  · Cazas (historial): ${cazas}`);

        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('\nError al sembrar la comunidad:', error);
        await db.close().catch(() => {});
        process.exit(1);
    }
}

sembrar();
