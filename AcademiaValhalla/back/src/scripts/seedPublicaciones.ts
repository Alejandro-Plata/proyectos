/**
 * seedPublicaciones.ts — Siembra 15 publicaciones de foro con variedad de tipos.
 * Distribución: 4 PREGUNTA · 4 DISCUSION · 3 ARTICULO · 2 PROYECTO · 2 RECURSO
 * Ejecutar: npm run seed:publicaciones
 */
import { db } from '../config/db.js';
import {
    Publicacion, Etiqueta, EtiquetaPublicacion, Usuario,
} from '../modelos/Modelos.js';
import { RolUsuario, TipoPublicacion } from '../types/types.js';

interface ParteContenido {
    type: 'text' | 'code' | 'definition';
    value: string;
    language?: string;
    title?: string;
}

interface PublicacionSemilla {
    title: string;
    post_type: TipoPublicacion;
    tags: string[];
    content: ParteContenido[];
}

const texto = (value: string): ParteContenido => ({ type: 'text', value });
const codigo = (value: string, language = 'javascript'): ParteContenido => ({ type: 'code', value, language });
const definicion = (title: string, value: string): ParteContenido => ({ type: 'definition', title, value });

const PUBLICACIONES: PublicacionSemilla[] = [
    // ─── PREGUNTAS ───────────────────────────────────────────────
    {
        title: '¿Cómo funciona el event loop en JavaScript?',
        post_type: TipoPublicacion.PREGUNTA,
        tags: ['javascript', 'async', 'conceptos'],
        content: [
            texto('Estoy intentando entender cómo JavaScript maneja las operaciones asíncronas siendo un lenguaje de un solo hilo.\n\nHe leído sobre el event loop, la call stack y la task queue, pero no me queda claro cuándo se ejecutan las microtasks vs las macrotasks.'),
            codigo(`console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`),
            texto('¿Por qué el output es 1, 4, 3, 2 y no 1, 4, 2, 3? ¿La Promise siempre tiene prioridad sobre setTimeout?'),
        ],
    },
    {
        title: '¿Cuándo usar useCallback vs useMemo en React?',
        post_type: TipoPublicacion.PREGUNTA,
        tags: ['react', 'hooks', 'rendimiento'],
        content: [
            texto('Tengo dudas sobre cuándo es realmente necesario usar `useCallback` y `useMemo`. He visto código donde se envuelve prácticamente todo en estos hooks y no sé si es buena práctica o over-engineering.'),
            codigo(`// ¿Es necesario esto?\nconst handleClick = useCallback(() => {\n    setCount(c => c + 1);\n}, []);\n\n// ¿O basta con esto?\nconst handleClick = () => {\n    setCount(c => c + 1);\n};`, 'typescript'),
            texto('¿Hay alguna regla general para decidir? ¿Cuánto impacto real tiene en el rendimiento?'),
        ],
    },
    {
        title: 'Error CORS al hacer fetch desde el frontend',
        post_type: TipoPublicacion.PREGUNTA,
        tags: ['cors', 'backend', 'express'],
        content: [
            texto('Tengo mi backend en Express (puerto 3000) y mi frontend en Vite (puerto 5173). Al hacer una petición fetch me salta este error:'),
            codigo(`Access to fetch at 'http://localhost:3000/api/users'\nfrom origin 'http://localhost:5173' has been blocked by CORS policy:\nNo 'Access-Control-Allow-Origin' header is present.`),
            texto('Ya instalé el paquete `cors` pero sigue sin funcionar. Mi configuración actual:'),
            codigo(`import cors from 'cors';\napp.use(cors());`),
            texto('¿Puede ser que el orden de los middlewares importa? ¿O es tema del navegador cacheando la respuesta sin CORS?'),
        ],
    },
    {
        title: 'TypeScript: diferencia entre type e interface',
        post_type: TipoPublicacion.PREGUNTA,
        tags: ['typescript', 'conceptos'],
        content: [
            texto('Llevo unos meses con TypeScript y no tengo claro cuándo usar `type` y cuándo `interface`. He visto proyectos que usan exclusivamente uno u otro.\n\n¿Hay alguna diferencia práctica real más allá de la sintaxis? ¿Cuál es la convención más aceptada en la comunidad?'),
            codigo(`// ¿Esto?\ninterface User {\n    name: string;\n    age: number;\n}\n\n// ¿O esto?\ntype User = {\n    name: string;\n    age: number;\n};`, 'typescript'),
        ],
    },

    // ─── DISCUSIONES ─────────────────────────────────────────────
    {
        title: '¿Merece la pena aprender Rust en 2026?',
        post_type: TipoPublicacion.DISCUSION,
        tags: ['rust', 'carrera', 'lenguajes'],
        content: [
            texto('Vengo de JavaScript/TypeScript y estoy pensando en aprender un lenguaje de sistemas. Rust me llama la atención por su sistema de tipos y la seguridad de memoria, pero la curva de aprendizaje parece brutal.\n\n¿Alguien ha hecho la transición desde JS? ¿Ha merecido la pena a nivel laboral? He visto que cada vez más empresas lo piden para backend de alto rendimiento y herramientas de desarrollo (Vite, SWC, Turbopack...).'),
        ],
    },
    {
        title: 'Clean Architecture vs. arquitectura simple: ¿dónde está el límite?',
        post_type: TipoPublicacion.DISCUSION,
        tags: ['arquitectura', 'buenas-practicas', 'backend'],
        content: [
            texto('En mi empresa están implantando Clean Architecture en todos los proyectos, incluso los microservicios de 3 endpoints. El resultado: 15 archivos para un CRUD simple.\n\nEntiendo los beneficios para proyectos grandes (testabilidad, independencia de frameworks), pero ¿no es over-engineering para proyectos pequeños/medianos?\n\n¿Dónde ponéis vosotros el límite? ¿Hay algún criterio objetivo (tamaño del equipo, vida útil del proyecto) que usáis para decidir?'),
        ],
    },
    {
        title: 'IA y programación: ¿amenaza o herramienta?',
        post_type: TipoPublicacion.DISCUSION,
        tags: ['ia', 'carrera', 'futuro'],
        content: [
            texto('Con la llegada de herramientas como GitHub Copilot, Claude Code y otros asistentes de IA, he notado un cambio grande en cómo programo. Escribo código más rápido, pero me preocupa depender demasiado.\n\nPor un lado: la IA es una herramienta increíble que elimina tareas repetitivas y nos deja enfocarnos en la lógica de negocio.\n\nPor otro: si nunca escribes código desde cero, ¿realmente entiendes lo que estás construyendo?\n\n¿Cómo equilibráis el uso de IA con el aprendizaje real? Sobre todo para los que estamos empezando.'),
        ],
    },
    {
        title: 'Testing: ¿TDD o escribir tests después?',
        post_type: TipoPublicacion.DISCUSION,
        tags: ['testing', 'tdd', 'buenas-practicas'],
        content: [
            texto('En teoría TDD suena genial: escribes el test primero, defines el comportamiento esperado, y luego implementas hasta que pase. Pero en la práctica me resulta difícil cuando no tengo claro el diseño final.\n\nMi flujo actual: implemento primero, luego escribo tests. No es ideal porque a veces diseño cosas difíciles de testear.\n\n¿Alguien practica TDD de forma consistente? ¿Hay un punto intermedio pragmático que os funcione?'),
        ],
    },

    // ─── ARTÍCULOS ───────────────────────────────────────────────
    {
        title: 'Guía: Git workflow para equipos pequeños',
        post_type: TipoPublicacion.ARTICULO,
        tags: ['git', 'workflow', 'equipos'],
        content: [
            texto('Después de probar varias estrategias de Git en equipos de 2-5 personas, comparto el workflow que mejor nos ha funcionado. Es una versión simplificada de GitHub Flow.'),
            definicion('Ramas principales', '`main` — siempre desplegable. `develop` — solo si necesitas un entorno de staging. Para equipos pequeños, main suele bastar.'),
            definicion('Feature branches', 'Una rama por tarea. Nombre: `feat/descripcion-corta` o `fix/bug-descripcion`. Vida corta: máximo 2-3 días.'),
            texto('## El flujo paso a paso\n\n1. Crea tu rama desde main\n2. Commitea con mensajes descriptivos\n3. Abre PR cuando esté listo para review\n4. Al menos 1 aprobación para mergear\n5. Squash merge a main\n6. Elimina la rama'),
            codigo(`# Crear feature branch\ngit checkout -b feat/auth-google\n\n# Trabajo normal...\ngit add .\ngit commit -m "feat: add Google OAuth flow"\n\n# Push y PR\ngit push -u origin feat/auth-google`, 'bash'),
            texto('## Errores comunes\n\n- **Ramas zombi**: ramas que nadie mergea ni elimina. Solución: revisión semanal.\n- **PRs gigantes**: si tu PR tiene +500 líneas, probablemente debería ser 2-3 PRs.\n- **Merge commits innecesarios**: usa rebase o squash para mantener el historial limpio.'),
        ],
    },
    {
        title: 'Patrones de manejo de errores en TypeScript',
        post_type: TipoPublicacion.ARTICULO,
        tags: ['typescript', 'errores', 'patrones'],
        content: [
            texto('El manejo de errores en TypeScript va más allá del try/catch. Comparto tres patrones que uso según el contexto.'),
            definicion('Patrón Result', 'Inspirado en Rust. Una función devuelve un objeto con `ok: true` y data, o `ok: false` y error. Elimina excepciones imprevistas.'),
            codigo(`type Result<T, E = Error> =\n    | { ok: true; data: T }\n    | { ok: false; error: E };\n\nasync function fetchUser(id: string): Promise<Result<User>> {\n    try {\n        const res = await fetch(\`/api/users/\${id}\`);\n        if (!res.ok) return { ok: false, error: new Error(\`HTTP \${res.status}\`) };\n        return { ok: true, data: await res.json() };\n    } catch (e) {\n        return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };\n    }\n}\n\n// Uso\nconst result = await fetchUser('123');\nif (!result.ok) {\n    console.error(result.error.message);\n    return;\n}\nconsole.log(result.data.name);`, 'typescript'),
            definicion('Custom Error Classes', 'Para distinguir tipos de error en el catch. Útil cuando necesitas manejar cada caso de forma distinta.'),
            codigo(`class ValidationError extends Error {\n    constructor(public field: string, message: string) {\n        super(message);\n        this.name = 'ValidationError';\n    }\n}\n\nclass NotFoundError extends Error {\n    constructor(resource: string, id: string) {\n        super(\`\${resource} \${id} no encontrado\`);\n        this.name = 'NotFoundError';\n    }\n}`, 'typescript'),
            definicion('Error Boundaries (React)', 'Para errores de renderizado en componentes. Envuelve secciones de la UI para que un fallo no tumbe toda la app.'),
            texto('## Cuándo usar cada uno\n\n- **Result**: funciones de servicio/utilidad donde los errores son esperables.\n- **Custom Errors**: APIs/backends donde necesitas mapear errores a códigos HTTP.\n- **Error Boundaries**: UI, siempre en combinación con algún otro patrón en la lógica.'),
        ],
    },
    {
        title: 'Optimización de consultas SQL: índices y EXPLAIN',
        post_type: TipoPublicacion.ARTICULO,
        tags: ['sql', 'postgresql', 'rendimiento'],
        content: [
            texto('Una consulta que tarda 3 segundos puede bajar a 3ms con el índice correcto. Resumen práctico de cómo optimizar consultas en PostgreSQL.'),
            texto('## 1. Usa EXPLAIN ANALYZE\n\nAntes de optimizar, mide. `EXPLAIN ANALYZE` te dice exactamente qué hace PostgreSQL:'),
            codigo(`EXPLAIN ANALYZE\nSELECT * FROM users\nWHERE email = 'test@example.com';`, 'sql'),
            texto('Busca:\n- **Seq Scan**: está leyendo TODA la tabla. Si la tabla es grande, necesitas un índice.\n- **Index Scan**: bien, está usando un índice.\n- **Actual rows vs. Planned rows**: si difieren mucho, las estadísticas están desactualizadas (`ANALYZE tabla`).'),
            texto('## 2. Índices: cuáles crear\n\nRegla simple: crea índices en columnas que uses en `WHERE`, `JOIN` y `ORDER BY` frecuentemente.'),
            codigo(`-- Índice simple\nCREATE INDEX idx_users_email ON users(email);\n\n-- Índice parcial (solo filas que cumplen condición)\nCREATE INDEX idx_users_active ON users(email) WHERE active = true;\n\n-- Índice compuesto (orden importa)\nCREATE INDEX idx_posts_author_date ON posts(author_id, created_at DESC);`, 'sql'),
            texto('## 3. Errores comunes\n\n- **Demasiados índices**: cada INSERT/UPDATE actualiza TODOS los índices. No indexes todo.\n- **Índice en columna de baja cardinalidad**: un índice en `is_active` (true/false) rara vez ayuda.\n- **LIKE con comodín al inicio**: `WHERE name LIKE \'%juan%\'` NO usa índice. Usa full-text search.'),
        ],
    },

    // ─── PROYECTOS ───────────────────────────────────────────────
    {
        title: 'Mi primer proyecto: CLI para gestión de tareas en Node.js',
        post_type: TipoPublicacion.PROYECTO,
        tags: ['node', 'cli', 'proyecto-personal'],
        content: [
            texto('Comparto mi primer proyecto serio: una herramienta CLI para gestionar tareas desde la terminal. La hice para practicar Node.js y aprender a publicar paquetes en npm.'),
            texto('## Stack\n\n- Node.js (sin frameworks)\n- Commander.js para parsear argumentos\n- Chalk para colores en terminal\n- SQLite (mejor-sqlite3) para persistencia local'),
            codigo(`# Uso\n$ tasky add "Terminar proyecto de React"\n$ tasky list\n  1. [ ] Terminar proyecto de React\n  2. [✓] Configurar ESLint\n$ tasky done 1\n  ✓ Tarea completada`, 'bash'),
            texto('## Lo que aprendí\n\n- Cómo funciona `package.json > bin` para crear comandos globales\n- Manejo de archivos con `fs` y rutas con `path`\n- Testing de CLIs con `execa`\n- Publicar en npm (`npm publish`)\n\nEl repo está en mi perfil. Cualquier feedback es bienvenido.'),
        ],
    },
    {
        title: 'Proyecto: API REST de e-commerce con Express + PostgreSQL',
        post_type: TipoPublicacion.PROYECTO,
        tags: ['express', 'postgresql', 'api-rest', 'proyecto-personal'],
        content: [
            texto('He terminado una API REST completa para un e-commerce ficticio. La uso como proyecto de portfolio. Comparto la arquitectura por si a alguien le sirve de referencia.'),
            texto('## Funcionalidades\n\n- Auth completa (register, login, refresh tokens, reset password)\n- CRUD de productos con categorías y búsqueda\n- Carrito de compras persistente\n- Sistema de pedidos con estados\n- Subida de imágenes a Supabase Storage\n- Documentación Swagger\n- Rate limiting y validación con Zod'),
            codigo(`src/\n├── config/         # DB, auth, storage\n├── controllers/    # Lógica de endpoints\n├── middleware/     # Auth, validation, error handler\n├── models/         # Sequelize models\n├── routes/         # Definición de rutas\n├── services/       # Lógica de negocio\n├── utils/          # Helpers\n└── server.ts       # Entry point`, 'bash'),
            texto('## Decisiones técnicas\n\n- **Sequelize sobre queries raw**: para un proyecto de portfolio, la productividad importa más que el control total.\n- **JWT + refresh tokens**: el access token dura 15min, el refresh 7 días.\n- **Validación en middleware**: toda la validación con Zod antes de llegar al controller.\n\nSi alguien quiere hacer algo similar, puedo compartir el repo como template.'),
        ],
    },

    // ─── RECURSOS ────────────────────────────────────────────────
    {
        title: 'Recursos gratuitos para aprender diseño de sistemas',
        post_type: TipoPublicacion.RECURSO,
        tags: ['system-design', 'recursos', 'entrevistas'],
        content: [
            texto('Recopilación de recursos gratuitos que me han servido para preparar entrevistas de system design y para diseñar mejor en el día a día.'),
            texto('## Lecturas esenciales\n\n- **Designing Data-Intensive Applications** (Martin Kleppmann) — el libro de referencia. No es gratis pero vale cada euro.\n- **System Design Primer (GitHub)** — repositorio con resúmenes de los conceptos clave: escalabilidad, caching, load balancing, etc.\n- **ByteByteGo Newsletter** — Alex Xu publica diagramas excelentes cada semana.\n- **High Scalability Blog** — casos reales de cómo empresas escalan.'),
            texto('## Práctica\n\n- Empieza diseñando sistemas que ya conoces: ¿cómo funciona Twitter? ¿Un servicio de URLs cortas? ¿Un chat en tiempo real?\n- Dibuja siempre un diagrama antes de escribir código.\n- Pregúntate: ¿qué pasa si esto recibe 100x más tráfico?\n\n## Patrones que más salen en entrevistas\n\n1. Load balancing + horizontal scaling\n2. Caching (Redis, CDN)\n3. Message queues (RabbitMQ, Kafka)\n4. Database sharding y replicación\n5. Event-driven architecture'),
        ],
    },
    {
        title: 'Cheatsheet: comandos de terminal que uso a diario',
        post_type: TipoPublicacion.RECURSO,
        tags: ['terminal', 'linux', 'productividad'],
        content: [
            texto('Mi referencia rápida de comandos que uso constantemente. Pensada para devs que vienen de Windows y se están adaptando a la terminal.'),
            texto('## Navegación y archivos'),
            codigo(`# Moverse\ncd ~/projects          # ir a directorio\ncd -                   # volver al anterior\npwd                    # dónde estoy\n\n# Listar\nls -la                 # todo con detalles\nls *.ts                # solo TypeScript\ntree -L 2              # árbol de 2 niveles\n\n# Buscar\nfind . -name "*.ts"    # archivos por nombre\ngrep -r "TODO" src/    # texto en archivos\nwhich node             # ubicación de un comando`, 'bash'),
            texto('## Gestión de procesos'),
            codigo(`# Ver qué ocupa un puerto\nlsof -i :3000\n\n# Matar proceso\nkill -9 <PID>\n\n# Ejecutar en background\nnpm run dev &\n\n# Ver procesos node\nps aux | grep node`, 'bash'),
            texto('## Git (los que más uso)'),
            codigo(`git log --oneline -10         # últimos 10 commits\ngit stash                     # guardar cambios temporalmente\ngit stash pop                 # recuperar\ngit diff --staged             # ver qué vas a commitear\ngit reset HEAD~1              # deshacer último commit (mantiene cambios)\ngit cherry-pick <hash>        # traer un commit específico`, 'bash'),
            texto('## Pro tips\n\n- `Ctrl+R`: buscar en historial de comandos\n- `!!`: ejecutar último comando\n- `$_`: último argumento del comando anterior\n- Alias en `.bashrc`/`.zshrc` para comandos frecuentes'),
        ],
    },
];

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 80);
}

async function sembrar() {
    try {
        await db.authenticate();

        const admin = await Usuario.findOne({ where: { role: RolUsuario.ADMIN } });
        if (!admin) {
            console.error('No hay ningún usuario ADMIN. Ejecuta antes "npm run seed:admins".');
            process.exit(1);
        }

        let creadas = 0;
        for (const semilla of PUBLICACIONES) {
            const existente = await Publicacion.findOne({ where: { title: semilla.title } });
            if (existente) continue;

            const post = await Publicacion.create({
                author_id: admin.user_id,
                title: semilla.title,
                slug: slugify(semilla.title),
                content: semilla.content,
                post_type: semilla.post_type,
            } as any);

            for (const tagName of semilla.tags) {
                const [tag] = await Etiqueta.findOrCreate({ where: { name: tagName } });
                await EtiquetaPublicacion.findOrCreate({
                    where: { post_id: post.post_id, tag_id: tag.tag_id },
                });
            }

            creadas++;
        }

        console.log(`Publicaciones sembradas: ${creadas} nuevas de ${PUBLICACIONES.length} totales.`);
        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('\nError al sembrar publicaciones:', error);
        await db.close().catch(() => {});
        process.exit(1);
    }
}

sembrar();
