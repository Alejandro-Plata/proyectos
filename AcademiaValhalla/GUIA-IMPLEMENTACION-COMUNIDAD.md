# Guía de implementación — Comunidad (B7, B8, B9, B10)

> Guía técnica para implementar las mejoras de comunidad de `IDEAS-MEJORAS-IA-COMUNIDAD.md`:
> **B7** Torneos y temporadas · **B8** Padrinazgo (mentoría) — *sin* matching por IA · **B9** Salón de los Héroes (showcase) · **B10** Perfiles con maestrías y endosos.
>
> Anclada en la infraestructura real:
> - **ORM:** `sequelize-typescript` (decoradores), Postgres. El esquema se crea solo con `db.sync({ alter: true })`; migraciones SQL opcionales en `src/scripts/`.
> - **Rutas:** `ControladorX` + `rutaX`, montadas en `server.ts` bajo `/api/v1/...`.
> - **Modelos clave:** `Usuario` (`experience_points`, `current_level`, `streak_days`, `total_comments`, `total_solutions`, `bio`, `github_url`, `linkedin_url`, relaciones `progresoRetos`, `publicaciones`, `logrosUsuario`), `Reto` (`challenge_id`, `difficulty`, `category`, `experience_reward`, M2M `lenguajes`/`etiquetas`, `test_cases`), `ProgresoRetoUsuario` (`status`, `completed_at`), `NotaUsuario`, `Publicacion` (`post_type` incluye `PROYECTO`/`TEAMUP`), `Conversacion`/`ParticipanteConversacion`, `Logro`/`LogroUsuario`.
> - **Servicios reutilizables:** `ServicioXP.otorgarXP(userId, xp)`, `ServicioLogros.verificarYDesbloquear(userId, tipo, valor)`, verificación de código server-side con **Judge0** (`POST /challenges/:id/verify`), mensajería directa (`messagingService.startConversation` / `Conversacion`).
> - **Front:** `features/<x>/{services,components,pages,hooks,types}`; `App.tsx` rutas; `useNavbar.ts` para el menú; `getAvatarUrl`, `getRankInfo` (`rankHelper`), `forumService`.

---

## 0. Piezas compartidas (construir primero)

### 0.1 Emblemas de perfil (unifica recompensas de B7/B8/B9)
Varias funciones otorgan distinciones visibles en el perfil (emblema de temporada, insignia de mentor, proyecto destacado). En vez de columnas sueltas, una tabla común:

```sql
CREATE TABLE IF NOT EXISTS user_emblems (
    emblem_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    kind       VARCHAR(30) NOT NULL,   -- 'season' | 'mentor' | 'showcase' | 'tournament'
    label      VARCHAR(80) NOT NULL,   -- "Temporada 2026-S1", "Mentor", ...
    meta       JSONB DEFAULT '{}',     -- { color, icon, ref_id }
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_emblems_user ON user_emblems(user_id);
```
`ServicioEmblemas.otorgar(userId, kind, label, meta)` + `listar(userId)`. Lo consume **B10** (tarjeta de perfil) y lo alimentan **B7/B8/B9**.

### 0.2 Convenciones
- Backend nuevo: `rutaX.ts` + `ControladorX.ts` + `ServicioX.ts`, registrar en `server.ts`.
- Frontend nuevo: `features/<x>/`, ruta en `App.tsx`, entrada en `useNavbar.ts`.
- **Anti-trampa**: toda validación de "resuelto" pasa por el servidor (Judge0), nunca por el cliente.
- Moderación: reutilizar el sistema de reportes existente (`ReportePublicacion`) donde aplique.

---

## B7 — Torneos y temporadas ("Las Justas de Valhalla")

**Objetivo.** Dar un latido a la comunidad: torneos con cadencia (semanal/estacional) de retos cronometrados, **leaderboard en vivo**, premios (XP, emblema de temporada, logro) y coleccionismo por temporadas. Modos: **individual** y **caza-bichillo competitivo**. (El modo *por clanes* queda para cuando exista B3.)

### Modelo de datos
```sql
CREATE TABLE IF NOT EXISTS tournaments (
    tournament_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        VARCHAR(160) NOT NULL,
    description  TEXT,
    mode         VARCHAR(20) NOT NULL DEFAULT 'challenges',  -- 'challenges' | 'troll'
    season       VARCHAR(20),               -- '2026-S1'
    status       VARCHAR(20) NOT NULL DEFAULT 'upcoming',    -- 'upcoming'|'active'|'finished'
    starts_at    TIMESTAMPTZ NOT NULL,
    ends_at      TIMESTAMPTZ NOT NULL,
    reward_xp    INTEGER NOT NULL DEFAULT 100,
    created_by   UUID REFERENCES users(user_id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tournament_challenges (
    tournament_id UUID REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    challenge_id  UUID REFERENCES challenges(challenge_id) ON DELETE CASCADE,
    points        INTEGER NOT NULL DEFAULT 100,
    PRIMARY KEY (tournament_id, challenge_id)
);
CREATE TABLE IF NOT EXISTS tournament_participants (
    tournament_id UUID REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    user_id       UUID REFERENCES users(user_id) ON DELETE CASCADE,
    score         INTEGER NOT NULL DEFAULT 0,
    solved_count  INTEGER NOT NULL DEFAULT 0,
    last_solved_at TIMESTAMPTZ,             -- desempate: antes = mejor
    joined_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (tournament_id, user_id)
);
CREATE TABLE IF NOT EXISTS tournament_solves (   -- evita doble puntuación
    tournament_id UUID, user_id UUID, challenge_id UUID,
    solved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (tournament_id, user_id, challenge_id)
);
```
Modelos `Torneo`, `RetoTorneo`, `ParticipanteTorneo`, `ResolucionTorneo` (registrar en `db.ts`).

### Backend — `ServicioTorneos`
- `crear(adminId, datos)` — solo ADMIN/MODERADOR; define retos y fechas.
- `unirse(userId, torneoId)` — crea `ParticipanteTorneo` si el torneo está `active`.
- **`registrarResolucion(userId, challengeId)`** — *el corazón*. Se invoca tras una verificación correcta. Busca torneos `active` que contengan ese reto y en los que el usuario participe; si no había `ResolucionTorneo` previa, suma `points`, incrementa `solved_count` y actualiza `last_solved_at`.
- `leaderboard(torneoId)` — `ORDER BY score DESC, last_solved_at ASC`.
- `finalizar(torneoId)` — calcula top N → `ServicioXP.otorgarXP`, `ServicioEmblemas.otorgar(uid,'season', 'Temporada '+season)`, `ServicioLogros.verificarYDesbloquear(uid,'tournament_win', n)`. Status → `finished`.

**Hook de puntuación (clave).** En `ControladorReto.verificar` (el endpoint A2 que ya valida con Judge0), tras marcar `COMPLETADO`:
```ts
if (passed) {
  // ...XP/logros existentes...
  await ServicioTorneos.registrarResolucion(idUsuario, challengeId);
}
```
Para el modo `troll`, hook equivalente en `ServicioCazaTroll.resolver` cuando `acierto`.

**Cadencia/temporadas.** Un planificador ligero abre/cierra torneos:
- Opción A (recomendada): `node-cron` en el arranque del servidor → cada minuto comprueba `tournaments` y cambia `upcoming→active→finished` según fechas, llamando a `finalizar` al cerrar.
- Opción B: chequeo perezoso en cada `GET /tournaments` (sin dependencia nueva).

### Endpoints (`rutaTorneos` → `/api/v1/tournaments`)
`GET /` (lista, `?status=&season=`) · `GET /:id` (detalle + retos + mi participación) · `POST /:id/join` · `GET /:id/leaderboard` · `POST /` `PATCH /:id` `POST /:id/finish` (ADMIN).

### Frontend — `features/torneos`
- `PaginaTorneos`: pestañas Activo / Próximos / Pasados; tarjeta con **cuenta atrás**.
- `PaginaTorneoDetalle`: lista de retos (con estado resuelto, enlace a `/dashboard/challenges`), **leaderboard en vivo** (polling cada ~10 s o **Socket.io** —ya existe `createWebSocket`—), countdown.
- `torneosService` (list, get, join, leaderboard).
- Ruta `dashboard/torneos` + entrada en menú. El emblema de temporada se muestra en el perfil (B10).

**Integración:** Reto + ProgresoRetoUsuario + Judge0 (sin confiar en el cliente) + ServicioXP/Logros + emblemas (§0.1).
**Esfuerzo:** Alto.

---

## B8 — Padrinazgo (mentoría) — *sin sugerencia por IA*

**Objetivo.** Emparejar mentor↔aprendiz **manualmente**: el aprendiz **navega y filtra** mentores disponibles por lenguaje/nivel y envía una solicitud; el mentor acepta/rechaza. Al aceptar se abre un **canal de mensajería directa** (reutiliza la mensajería existente). El mentor gana reputación + logro; el aprendiz, guía humana.

### Modelo de datos
```sql
CREATE TABLE IF NOT EXISTS mentor_profiles (
    user_id     UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    is_available BOOLEAN NOT NULL DEFAULT true,
    languages   TEXT[] NOT NULL DEFAULT '{}',  -- en los que ofrece mentoría
    bio_mentor  TEXT,
    capacity    INTEGER NOT NULL DEFAULT 3,    -- máximo de aprendices activos
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS mentorships (
    mentorship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id     UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    apprentice_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status        VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending|active|ended|rejected
    goal          TEXT,
    conversation_id UUID,                       -- canal directo al aceptar
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at      TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_mentorship_active
    ON mentorships(mentor_id, apprentice_id) WHERE status IN ('pending','active');
```

### Backend — `ServicioPadrinazgo`
- **Criterio para ser mentor** (server-side): `current_level >= 10` (rango "Avanzado" en `rankHelper`) **o** `total_solutions >= 15`. Si no cumple, 403.
- `activarMentor(userId, {languages, bio, capacity})` / `desactivarMentor(userId)`.
- `listarMentores({language?, level?})` — `mentor_profiles` con `is_available` + `Usuario` (nivel, rango, avatar) + **plazas libres** (`capacity - aprendices_activos`). Excluye al propio usuario y a los que no tienen plazas.
- `solicitar(apprenticeId, mentorId, goal)` — valida: no es uno mismo, el mentor tiene plaza, no existe par activo/pendiente. Crea `mentorship` `pending`.
- `responder(mentorId, mentorshipId, accept)` — si `accept`: abre/recupera **conversación directa** (`Conversacion` 1:1 reutilizando la lógica de `startConversation`), guarda `conversation_id`, status `active`. Si no: `rejected`.
- `finalizar(userId, mentorshipId)` — status `ended`; en la **primera** mentoría completada del mentor → `ServicioLogros` (logro "Mentor") + `ServicioEmblemas.otorgar(mentorId,'mentor','Mentor')` + opcional `total_solutions += bonus`.
- `mias(userId)` — como mentor (solicitudes entrantes + activas) y como aprendiz.

### Endpoints (`rutaPadrinazgo` → `/api/v1/mentorship`)
`POST /mentor` (activar) · `DELETE /mentor` (desactivar) · `GET /mentors?language=&level=` · `POST /requests {mentor_id, goal}` · `PATCH /requests/:id {action:'accept'|'reject'}` · `GET /mine` · `PATCH /:id/end`.

### Frontend — `features/padrinazgo`
- **Buscar mentor**: lista filtrable (lenguaje, nivel/rango) con tarjeta de mentor (avatar, rango, lenguajes, plazas) y botón "Solicitar" (modal con objetivo).
- **Ser mentor**: formulario para activar el perfil (lenguajes, bio, capacidad) — visible solo si cumple criterio.
- **Mis mentorías**: bandeja de solicitudes (aceptar/rechazar) y mentorías activas con botón "Abrir chat" → navega a `/dashboard/messages` con la conversación.
- `padrinazgoService` + ruta `dashboard/padrinazgo` + entrada en menú.

**Integración:** mensajería (canal 1:1), Logros + emblemas, `rankHelper` para mostrar rango. **Sin IA.**
**Esfuerzo:** Medio.

---

## B9 — Salón de los Héroes (showcase de proyectos)

**Objetivo.** Publicar proyectos/portfolios construidos aprendiendo, con **feedback estructurado por dimensiones** (no solo likes: una mini "code review" por secciones) y una **vitrina de destacados**. Cierra el viaje aprender → construir → mostrar y da prueba social.

### Modelo de datos
> Se podría reutilizar `Publicacion` con `post_type = 'PROYECTO'`, pero el feedback por rúbrica y los campos (repo/demo/stack) piden modelo propio; reutilizamos sí el patrón de bloques de contenido de los apuntes para la descripción.
```sql
CREATE TABLE IF NOT EXISTS showcase_projects (
    project_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id    UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title        VARCHAR(160) NOT NULL,
    summary      VARCHAR(280) NOT NULL,
    description  JSONB NOT NULL DEFAULT '[]',  -- bloques { type, value, language, title }
    repo_url     VARCHAR(300),
    demo_url     VARCHAR(300),
    tech_stack   TEXT[] NOT NULL DEFAULT '{}',
    cover_image_url VARCHAR(400),
    featured     BOOLEAN NOT NULL DEFAULT false,
    upvote_count INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS project_feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID REFERENCES showcase_projects(project_id) ON DELETE CASCADE,
    author_id   UUID REFERENCES users(user_id) ON DELETE CASCADE,
    dimension   VARCHAR(20) NOT NULL,   -- 'codigo'|'diseno'|'idea'|'documentacion'
    rating      SMALLINT NOT NULL,      -- 1..5
    comment     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS project_upvotes (
    project_id UUID, user_id UUID,
    PRIMARY KEY (project_id, user_id)
);
```

### Backend — `ServicioShowcase`
- CRUD de proyectos del autor (subida de imagen reutilizando el storage existente —Supabase— como en apuntes/mensajería).
- `listar({tech?, featured?})` — destacados primero, luego por `upvote_count`/recientes.
- `obtener(id)` — proyecto + feedback **agregado por dimensión** (media de rating y nº de reseñas por dimensión) + lista de comentarios.
- `feedback(userId, id, {dimension, rating, comment})` — una reseña por (usuario, dimensión); no permitir al autor reseñarse.
- `upvote(userId, id)` — toggle en `project_upvotes`, recalcula `upvote_count`.
- `destacar(adminId, id, bool)` — ADMIN/MOD; al destacar → `ServicioEmblemas.otorgar(autor,'showcase','Proyecto destacado')`.
- Recompensas: `ServicioXP` al publicar el primer proyecto; logro al superar N upvotes.

### Endpoints (`rutaShowcase` → `/api/v1/showcase`)
`GET /` · `POST /` · `GET /:id` · `PATCH /:id` `DELETE /:id` (autor) · `POST /:id/feedback` · `POST /:id/upvote` · `PATCH /:id/feature` (ADMIN).

### Frontend — `features/showcase`
- **Galería** (`PaginaShowcase`): carrusel de **destacados** arriba + grid de tarjetas (portada, chips de stack, upvotes, badge "Destacado").
- **Detalle** (`PaginaProyecto`): contenido en bloques + enlaces repo/demo + **sección de feedback** agrupada por dimensión con medias (barras 1-5) y formulario de reseña.
- **Crear/editar**: reutiliza el editor de bloques de apuntes (mismo `BloqueContenido`) + campos repo/demo/stack/portada.
- `showcaseService` + ruta `dashboard/showcase` + entrada en menú (sección Comunidad).

**Integración:** bloques de contenido de apuntes, storage existente, votos/feedback propios, XP/Logros/emblemas, reportes para moderación.
**Esfuerzo:** Medio-Alto.

---

## B10 — Perfiles con maestrías y endosos

**Objetivo.** Enriquecer el perfil con un **mapa de maestrías** (lenguajes/temas que domina, derivado de retos + apuntes + reputación) y **endosos entre pares** por habilidad, más una **tarjeta de perfil compartible** (apoya la búsqueda de empleo del usuario).

### Maestrías (derivadas — no se almacenan, se calculan)
Fuentes ya existentes:
- **Retos completados** por lenguaje/categoría: `ProgresoRetoUsuario (status='COMPLETADO')` ⋈ `Reto` (`lenguajes`, `category`, `difficulty`).
- **Apuntes** por lenguaje: `NotaUsuario` (`language`, `community_status='approved'` pondera más).
- **Reputación**: `total_solutions`, respuestas aceptadas (`markCommentAsSolution`), upvotes.

`ServicioMaestrias.calcular(userId)` produce un mapa:
```ts
// score por skill = w1*retosCompletados(ponderado por dificultad)
//                  + w2*apuntes + w3*señales de reputación
// nivel = umbralizar score → 'Iniciado'|'Competente'|'Avanzado'|'Maestro'
return [{ skill: 'javascript', kind: 'language', score, level }, { skill:'BACKEND', kind:'category', ... }]
```
Coste bajo (datos acotados) → se calcula al ver el perfil; opcional cachear en `user_mastery` si crece.

### Endosos
```sql
CREATE TABLE IF NOT EXISTS skill_endorsements (
    endorsement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endorser_id  UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    endorsed_id  UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    skill        VARCHAR(50) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (endorser_id, endorsed_id, skill)
);
```
`ServicioMaestrias`:
- `endosar(endorserId, endorsedId, skill)` — valida: no es uno mismo, `skill` ∈ lenguajes/categorías conocidos. Rate-limit anti-spam.
- `quitarEndoso(...)`.
- `endosos(userId, viewerId)` — recuento por skill + si el viewer ya endosó.

### Endpoints
`GET /users/:id/mastery` · `GET /users/:id/endorsements` · `POST /users/:id/endorsements {skill}` · `DELETE /users/:id/endorsements/:skill` · `GET /public/profile-card/:username` (**público**, para compartir).

### Frontend
- **Extender** la página existente `features/community/pages/UserProfilePage` con:
  - **Mapa de maestrías**: barras/radar por skill con etiqueta de nivel (colores de `rankHelper`).
  - **Endosos**: chips de skill con recuento + botón "Endosar" para visitantes (toggle).
  - **Emblemas** (§0.1) y rango (`getRankInfo`).
- **Tarjeta compartible** (`/u/:username` o `/perfil/:userId/card`): vista pública y compacta (rango, top skills, top logros/emblemas, enlaces `github_url`/`linkedin_url`) pensada para captura/LinkedIn. **Opt-in** (el usuario decide hacerla pública).
- `masteryService` (o ampliar `forumService`).

**Integración:** ProgresoRetoUsuario + Reto + NotaUsuario + `total_solutions` + `rankHelper` + Logros/emblemas. Conecta con el trabajo de portfolio/LinkedIn del usuario (búsqueda de empleo).
**Esfuerzo:** Medio.

---

## Orden de implementación recomendado

```
0  Emblemas de perfil (user_emblems)  ← lo usan B7, B8, B9 y lo muestra B10
        │
        ▼
B10  Maestrías + endosos      (extiende el perfil existente; reutiliza casi todo)
        │
        ▼
B8   Padrinazgo               (reutiliza mensajería; medio)
        │
        ▼
B9   Salón de los Héroes      (showcase + feedback; medio-alto)
        │
        ▼
B7   Torneos y temporadas     (scoring + scheduling; el "latido", el más caro)
```
Razonamiento: B10 da valor inmediato (perfil/empleo) reutilizando datos ya presentes; B7 se deja al final porque introduce planificación (cron) y el hook de puntuación, y se beneficia de que B10/emblemas ya existan para mostrar premios.

---

## Riesgos transversales y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| **Trampas en torneos/maestrías** (B7/B10) | "Resuelto" siempre validado en servidor con **Judge0**; nunca confiar en el cliente. |
| **Doble puntuación** (B7) | Tabla `tournament_solves` con PK compuesta; sumar solo en la primera resolución. |
| **Planificación/temporadas** (B7) | `node-cron` o chequeo perezoso en `GET`; cuidar zona horaria al definir `starts_at/ends_at`. |
| **Carga del leaderboard en vivo** (B7) | Polling moderado (~10 s) o reutilizar **Socket.io** para empujar cambios. |
| **Abuso de mentoría** (B8) | Criterio server-side para ser mentor, `capacity`, índice único de par activo, cierre de mentorías inactivas. |
| **Spam de proyectos/endosos** (B9/B10) | Reutilizar reportes/moderación; rate-limit en endosos y feedback; una reseña por (usuario, dimensión). |
| **Privacidad de la tarjeta pública** (B10) | Opt-in explícito; exponer solo campos elegidos por el usuario. |
| **Dependencia de B3 (clanes)** (B7 modo clanes) | Implementar B7 solo con modos *individual* y *troll*; el modo por clanes se añade cuando exista B3. |

---

## Checklist de "hecho" por función

- [ ] **0** `user_emblems` + `ServicioEmblemas` (otorgar/listar).
- [ ] **B10** `ServicioMaestrias` (cálculo), `skill_endorsements`, endpoints, ampliación de `UserProfilePage`, tarjeta pública opt-in.
- [ ] **B8** `mentor_profiles`/`mentorships`, criterio de mentor, flujo solicitar/aceptar, canal de chat, `features/padrinazgo`, logro+emblema.
- [ ] **B9** `showcase_projects`/`project_feedback`/`project_upvotes`, `ServicioShowcase`, galería+detalle+editor, destacar (ADMIN), emblema.
- [ ] **B7** tablas de torneos, `ServicioTorneos`, **hook de puntuación** en `verificar`/`caza-bichillo`, leaderboard en vivo, planificador (cron), premios (XP+emblema+logro), `features/torneos`.
