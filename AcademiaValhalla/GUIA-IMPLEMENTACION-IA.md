# Guía de implementación — Funciones de IA (A1–A5, A7)

> Guía técnica para implementar las mejoras de IA descritas en `IDEAS-MEJORAS-IA-COMUNIDAD.md`:
> **A1** Mentor con memoria · **A2** Forja de retos · **A3** Revisión socrática · **A4** Caza del Troll · **A5** Destilador de apuntes · **A7** Sagas.
>
> Anclada en la infraestructura real del proyecto:
> - **LLM:** Groq SDK (`groq-sdk`), modelo actual `llama-3.1-8b-instant`. Controlador `ControladorAsistente.chatear` → `/assistant/chat`. Prompt en `config/promptSistema.ts` (`buildSystemPrompt`). Asistente: *Freya*.
> - **ORM:** `sequelize-typescript` (decoradores `@Table/@Column`), Postgres. Migraciones SQL al estilo de `src/scripts/migracionMensajeria.sql`.
> - **Ejecución de código:** Judge0 vía `ServicioCodeArena.executeCode(slug, code, { stdin, cpuTimeLimit, wallTimeLimit })`.
> - **Modelos clave:** `Usuario` (`experience_points`, `current_level`, `streak_days`), `Reto` (`examples`, `hints`, `experience_reward`, `examples` JSONB), `ProgresoRetoUsuario` (`status`, `user_solution`), `NotaUsuario` (`content: Bloque[]`, `community_status`), `RevisionNota`.
> - **XP:** `ServicioXP.otorgarXP(userId, xp)`.
> - **Bloque de apunte:** `{ type: 'text'|'code'|'image'|'definition', value, title?, language?, filename? }`.
> - **Front:** `features/<x>/{components,hooks,services,pages,types,config}`; servicios usan `authHeaders()` y `API_BASE` de `services/apiClient`.

---

## 0. Infraestructura compartida (construir primero)

Estas tres piezas las consumen casi todas las funciones. Implementarlas como base evita duplicación.

### 0.1 `ServicioIA` — wrapper de Groq reutilizable

Hoy Groq solo se invoca dentro del controlador del chat. Centralizamos el acceso para poder: (a) pedir **salidas JSON estructuradas** (A2, A3, A4, A5, A7), (b) elegir modelo según la tarea, (c) controlar coste y reintentos.

`back/src/servicios/ServicioIA.ts`
```ts
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Tareas rutinarias → barato/rápido. Generación/revisión → potente.
export const MODELO = {
  rapido:  'llama-3.1-8b-instant',
  potente: 'llama-3.3-70b-versatile',
} as const;

interface OpcionesChat {
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  modelo?: string;
  temperature?: number;
  maxTokens?: number;
}

export class ServicioIA {
  /** Texto libre (chat). */
  static async chat(o: OpcionesChat): Promise<string> {
    const r = await groq.chat.completions.create({
      model: o.modelo ?? MODELO.rapido,
      temperature: o.temperature ?? 0.5,
      max_tokens: o.maxTokens ?? 1024,
      messages: [{ role: 'system', content: o.system }, ...o.messages],
    });
    return r.choices[0]?.message?.content ?? '';
  }

  /** Salida JSON validada. Groq soporta response_format json_object. */
  static async json<T>(o: OpcionesChat & { validar?: (x: any) => x is T }): Promise<T> {
    const r = await groq.chat.completions.create({
      model: o.modelo ?? MODELO.potente,
      temperature: o.temperature ?? 0.3,
      max_tokens: o.maxTokens ?? 2048,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: o.system }, ...o.messages],
    });
    const raw = r.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);
    if (o.validar && !o.validar(parsed)) throw new Error('La IA devolvió un JSON con forma inválida');
    return parsed as T;
  }
}
```
> Refactor: `ControladorAsistente.chatear` pasa a usar `ServicioIA.chat({ system: buildSystemPrompt, messages })`.

### 0.2 Recuperación de contexto (RAG) — estrategia en dos fases

Groq **no ofrece embeddings**. Plan pragmático:

- **Fase 1 (recomendada para empezar):** búsqueda léxica con **Postgres Full-Text Search** (`tsvector`) sobre `user_notes` (y retos). Cero dependencias nuevas, suficiente para "recupera mis 3 apuntes más relevantes".
- **Fase 2 (cuando haga falta semántica real):** `pgvector` + embeddings de un proveedor externo (p. ej. `text-embedding-3-small` de OpenAI, baratísimo). Solo entonces se añade la columna `embedding vector(1536)`.

Servicio común `back/src/servicios/ServicioRecuperacion.ts`:
```ts
// Fase 1: FTS sobre apuntes del usuario + apuntes de comunidad aprobados
export async function recuperarApuntesRelevantes(userId: string, consulta: string, limite = 4) {
  const [rows] = await sequelize.query(`
    SELECT note_id, title, summary, language,
           ts_rank(to_tsvector('spanish', title||' '||summary), plainto_tsquery('spanish', :q)) AS rank
    FROM user_notes
    WHERE (user_id = :uid OR community_status = 'approved')
      AND to_tsvector('spanish', title||' '||summary) @@ plainto_tsquery('spanish', :q)
    ORDER BY rank DESC LIMIT :lim
  `, { replacements: { uid: userId, q: consulta, lim: limite } });
  return rows;
}
```
Migración (índice FTS):
```sql
CREATE INDEX IF NOT EXISTS idx_notes_fts
  ON user_notes USING GIN (to_tsvector('spanish', title || ' ' || summary));
```

### 0.3 Convenciones

- **Backend:** nuevo módulo `features` lógico → `rutaX.ts` + `ControladorX.ts` + `ServicioX.ts`; registrar la ruta en `src/api/index.ts`.
- **Migraciones:** un `.sql` por función en `src/scripts/` (patrón `migracionMensajeria.sql`); ejecutar manualmente o vía script de arranque.
- **Frontend:** carpeta por función en `features/`; servicio con `authHeaders()`; páginas `Desktop`/`Mobile`.
- **Coste/abuso:** todas las rutas IA con `autenticar` + **rate limit** por usuario (p. ej. `express-rate-limit`, 20 req/min en endpoints generativos).

---

## A1 — Mentor con memoria (*"El Cuervo que recuerda"*)

**Objetivo.** Que Freya conozca al usuario (nivel, lenguajes, errores recurrentes, apuntes/retos) y lo use para personalizar y referenciar su propio material.

### Modelo de datos
`back/src/scripts/migracion_a1_memoria.sql`
```sql
CREATE TABLE IF NOT EXISTS learning_profiles (
  user_id        UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  languages      JSONB NOT NULL DEFAULT '{}',      -- { "javascript": 0.7, "java": 0.3 }
  concepts_seen  JSONB NOT NULL DEFAULT '[]',      -- ["closures","recursion",...]
  recurring_errors JSONB NOT NULL DEFAULT '[]',    -- [{ "tag":"off-by-one","count":4 }]
  session_summaries JSONB NOT NULL DEFAULT '[]',   -- [{ "at":"...","text":"..." }] (cap 20)
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
Modelo `PerfilAprendizaje` (sequelize-typescript) análogo, con `@Column(DataType.JSONB)`.

### Backend
1. **Construcción de contexto** (`ServicioMemoria.ts`):
   - `obtenerPerfil(userId)` → fila o default.
   - `construirContextoSistema(userId, ultimoMensaje)`: arma un bloque de texto con (a) resumen del perfil, (b) `recuperarApuntesRelevantes(...)` (0.2), (c) últimos retos fallados (`ProgresoRetoUsuario` con `status != completado`). Devuelve string para anteponer a `buildSystemPrompt`.
2. **Inyección en el chat:** `ControladorAsistente.chatear` llama a `construirContextoSistema` y pasa `system: buildSystemPrompt + '\n\n## Contexto del aprendiz\n' + contexto`.
3. **Actualización post-sesión:** al cerrar conversación (o cada N mensajes), `ServicioMemoria.destilarSesion(userId, messages)`:
   - `ServicioIA.json({ modelo: rapido, system: PROMPT_DESTILAR_PERFIL, messages })` → `{ concepts:[], errors:[], summary:"" }`.
   - Fusiona en el perfil (merge de lenguajes, push de resumen con cap 20, incremento de contadores de error).
4. **Endpoints:** `GET /assistant/profile` (ver), `DELETE /assistant/profile` (borrar → privacidad), `PATCH /assistant/profile` (editar manual).

**Prompt de destilado** (`PROMPT_DESTILAR_PERFIL`):
```
Analiza esta conversación entre un aprendiz y su tutor. Devuelve SOLO un JSON:
{ "concepts": [conceptos que el aprendiz practicó],
  "errors": [{ "tag": "etiqueta-corta", "evidence": "frase breve" }],
  "languages": { "lenguaje": confianza_0_a_1 },
  "summary": "2 frases en español, en segunda persona, sobre qué trabajó y dónde flaqueó" }
No incluyas nada fuera del JSON.
```

### Frontend
- `features/asistente`: nuevo panel **"Lo que Freya sabe de ti"** (`PerfilAprendizajePanel.tsx`) con secciones editables y botón **Borrar memoria**.
- `aiService`: `getProfile()`, `deleteProfile()`, `updateProfile(patch)`.
- En `useChatAsistente`: al desmontar/cerrar, `POST /assistant/profile/distill` con el historial (fire-and-forget).
- En `MensajeAsistente`: renderizar enlaces internos cuando la IA cite un apunte (`[[note:<id>]]` → `Link` a `/dashboard/notes/<id>`); definir esa convención en el prompt de sistema.

### UX
Freya, ante una duda, responde y añade: *"Esto conecta con tu apunte **Closures** — ¿recuerdas el problema del scope que anotaste?"*. El usuario abre su propio material.

### Coste / privacidad
- Destilado = 1 llamada barata por sesión.
- **Transparencia obligatoria**: panel visible + borrado total. Documentar en política de datos.

**Esfuerzo:** Alto. **Es prerrequisito de A2, A4 y A7 (todas leen el perfil).**

---

## A2 — Forja de retos personalizados (*"El Yunque"*)

**Objetivo.** Generar retos a medida (enunciado + plantilla + **tests ejecutables**) atacando debilidades del usuario, integrados con el motor de retos y Judge0.

### Modelo de datos
Reutiliza `challenges` añadiendo procedencia; los tests viven en `examples`/validación como ya hace `ControladorReto`.
```sql
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS generated_by_ai BOOLEAN DEFAULT false;
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS generated_for  UUID REFERENCES users(user_id);
-- test cases verificables (stdin/stdout esperado) en JSONB:
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS test_cases JSONB DEFAULT '[]';
```
`test_cases`: `[{ "stdin": "...", "expected_stdout": "...", "hidden": true }]`.

### Backend — `ServicioForjaRetos.ts`
1. `generar(userId, tema?)`:
   - Determina el tema desde el perfil (A1) si no se pasa: el error/concepto más recurrente.
   - `ServicioIA.json({ modelo: potente, system: PROMPT_FORJA, messages:[{role:'user', content: tema+nivel}] })` →
     ```json
     { "title":"", "language":"javascript", "difficulty":"Intermedio",
       "instructions":"", "starter_code":"",
       "reference_solution":"", "test_cases":[{"stdin":"","expected_stdout":""}] }
     ```
2. **Auto-validación (clave):** ejecutar `reference_solution` contra cada `test_case` con `executeCode`. Si algún test no cuadra → **descartar y reintentar** (máx 2). Así nunca se entrega un reto roto.
3. Persistir como `Reto` con `generated_by_ai=true`, `generated_for=userId`, `experience_reward` según dificultad.
4. Endpoint `POST /challenges/forge` `{ tema? }` → reto creado.

**Verificación de la solución del usuario:** reutilizar el flujo existente de `ProgresoRetoUsuario` + `executeCode`, comparando stdout con `test_cases` (los `hidden` no se muestran).

**Prompt de forja** (`PROMPT_FORJA`):
```
Eres un diseñador de ejercicios de programación. Crea UN reto autocontenido sobre: {tema}, nivel {nivel}.
El programa debe leer de STDIN y escribir en STDOUT (para poder testear por E/S).
Devuelve SOLO este JSON: { title, language, difficulty, instructions,
  starter_code (plantilla con TODOs, sin resolver),
  reference_solution (solución COMPLETA y correcta),
  test_cases: [{stdin, expected_stdout}] (3-5 casos, incluye bordes) }.
La reference_solution debe pasar todos los test_cases.
```

### Frontend
- En `features/retos`: botón **"Fórjame un reto"** (en vacío de lista o tras fallar). Llama `challengesService.forge(tema?)` y navega al reto generado (reutiliza `ChallengePage`).
- Sugerencia proactiva en el dashboard: *"Has fallado 3 retos de recursión. ¿Forjamos uno a tu medida?"* (lee perfil A1).
- Logro "Superviviente del Yunque" al completar N retos forjados (`ServicioLogros`).

### Coste / abuso
- Generación + auto-validación = 1 llamada potente + 1–5 ejecuciones Judge0. **Rate-limit estricto** (p. ej. 5/día) y caché por (tema,nivel).

**Esfuerzo:** Alto. **Depende de A1 (para elegir tema).**

---

## A3 — Revisión de código socrática (*"El Espejo de Mímir"*)

**Objetivo.** Revisar el código del usuario **sin reescribirlo**, con anotaciones inline en Monaco, pistas escalonadas y respeto a la regla "no des la solución".

### Modelo de datos
Ninguno obligatorio (stateless). Opcional: cachear revisiones por hash del código.

### Backend — `POST /assistant/review`
`{ code, language, context? }` →
```ts
const review = await ServicioIA.json({
  modelo: MODELO.potente,
  system: PROMPT_REVISION,
  messages: [{ role:'user', content: `Lenguaje: ${language}\n\`\`\`\n${code}\n\`\`\`` }],
});
// review: { findings: [{ line, severity, hint, concept }] }
```
**Prompt de revisión** (`PROMPT_REVISION`):
```
Eres un revisor de código socrático. NO reescribas el código ni des la solución.
Para cada problema, devuelve una observación que GUÍE al autor a descubrirlo.
Severidades: "bug" | "estilo" | "rendimiento" | "seguridad".
Devuelve SOLO: { "findings": [ { "line": <nº 1-based>, "severity": "...",
  "hint": "pregunta o pista breve, en español, sin dar la respuesta",
  "concept": "concepto a repasar (1-3 palabras)" } ] }.
Si el código está bien, devuelve findings: [].
```

### Frontend (Monaco)
- Reutiliza `MonacoEditorDesktop`. Con la respuesta, pintar **decorations** en el gutter por línea (color según severidad) y **markers** (`monaco.editor.setModelMarkers`).
- Al hacer clic en una marca: panel lateral con la pista. **Pistas escalonadas (integración A8 opcional):** botón "Pista mayor" revela más, con coste de XP.
- Botón **"Verifícalo de nuevo"** tras editar (re-llama al endpoint).
- Componente nuevo `RevisionCodigoPanel.tsx` dentro de `features/asistente` o como modo del editor de retos.

### UX
El usuario pega su código → ve marcas en las líneas 12 y 19: *"¿Qué ocurre en la línea 19 si `arr` está vacío?"*. Corrige y reverifica. Nunca recibe el código hecho.

**Esfuerzo:** Medio. **Independiente** (no requiere A1, aunque mejora con él).

---

## A4 — Caza del Troll (*Forja Inversa* / depuración gamificada)

**Objetivo.** La IA introduce un bug deliberado en código correcto; el usuario debe encontrarlo y explicarlo. La IA solo da "frío/caliente".

### Modelo de datos
`back/src/scripts/migracion_a4_caza.sql`
```sql
CREATE TABLE IF NOT EXISTS troll_hunts (
  hunt_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(user_id) ON DELETE CASCADE,
  language    VARCHAR(50),
  buggy_code  TEXT NOT NULL,
  bug_line    INT  NOT NULL,
  bug_explanation TEXT NOT NULL,   -- oculto hasta resolver
  solved      BOOLEAN DEFAULT false,
  duration_ms INT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Backend — `ServicioCazaTroll.ts`
1. `iniciar(userId, tema?)`:
   - Toma un fragmento **correcto** (de un apunte/reto del usuario o uno canónico por tema).
   - `ServicioIA.json({ system: PROMPT_INTRODUCIR_BUG })` → `{ buggy_code, bug_line, bug_explanation }`.
   - **Auto-verificación:** ejecutar el original (pasa) y el buggy (debe fallar o dar salida distinta) con `executeCode`; si no, reintentar.
   - Persistir hunt; devolver solo `buggy_code` + `language` (sin `bug_line`).
2. `pista(huntId)`: respuesta tipo "frío/caliente" comparando la línea sospechada del usuario con `bug_line` (lógica simple servidor, sin IA).
3. `resolver(huntId, { lineGuess, explanation })`:
   - Acierto de línea + explicación válida (validada por `ServicioIA.json` corto) → marca `solved`, guarda `duration_ms`, otorga XP (`ServicioXP`), comprueba logro "Cazatrolls".

**Prompt** (`PROMPT_INTRODUCIR_BUG`):
```
Te doy código correcto. Introduce UN único bug sutil y realista (off-by-one,
mutación de estado, condición invertida, async/await olvidado, etc.).
NO cambies el formato ni añadas comentarios que delaten el fallo.
Devuelve SOLO: { "buggy_code": "...", "bug_line": <nº>, "bug_explanation": "..." }.
```

### Frontend
- Nueva sub-sección en `features/retos` o `features/asistente`: `CazaTrollPage` (Desktop/Mobile).
- Monaco en modo lectura con selección de línea; cronómetro; botones "Sospecho de esta línea" y "Pista".
- Al resolver: revelar `bug_explanation`, tiempo, XP. **Leaderboard semanal** (puente con Comunidad B7).

**Esfuerzo:** Medio. **Reutiliza** Judge0 + Monaco + XP.

---

## A5 — Destilador de apuntes (*"El Escriba"*)

**Objetivo.** Convertir una conversación con Freya en un **borrador de apunte** estructurado, listo para editar/guardar y, opcionalmente, publicar en comunidad.

### Modelo de datos
Ninguno nuevo: produce un `NotaUsuario` con el flujo existente (`notesService`, `RevisionNota`).

### Backend — `POST /assistant/distill-note`
`{ messages }` →
```ts
const nota = await ServicioIA.json({
  modelo: MODELO.potente,
  system: PROMPT_DESTILAR_APUNTE,
  messages,
});
// nota: { title, summary, language, tags, difficulty, content: Bloque[] }
return res.json(nota); // NO se persiste aún; el usuario edita y guarda
```
**Prompt** (`PROMPT_DESTILAR_APUNTE`) — fuerza el **esquema de bloques real** del editor:
```
Convierte esta conversación en un apunte de estudio en español. Devuelve SOLO:
{ "title": "", "summary": "1-2 frases", "language": "javascript|java|...|general",
  "tags": ["..."], "difficulty": "Básico|Intermedio|Avanzado",
  "content": [ bloques ] }
Cada bloque es uno de:
  { "type":"text", "value":"explicación en markdown" }
  { "type":"code", "value":"código", "language":"js", "title":"opcional" }
  { "type":"definition", "title":"término", "value":"definición" }
Incluye al final un bloque text titulado "Errores que cometí" si los hubo.
No inventes contenido que no esté en la conversación.
```

### Frontend
- En `ChatAsistente`: botón **"Convertir en apunte"** (visible si hay ≥4 mensajes).
- `aiService.distillNote(messages)` → navega al **editor de notas existente** precargado con el borrador (`/dashboard/notes/new` con estado inicial, o `useEditorNota` aceptando un borrador inicial).
- El usuario edita y guarda con `notesService.create`; puede pedir publicación (`requestCommunity`) → flujo `RevisionNota` ya existente.

### UX
Cierras una sesión donde por fin entendiste los `Promise`. Un clic → apunte estructurado con tu ejemplo y tu sección "Errores que cometí". Lo guardas; mañana lo repasas (engancha con A6 SRS).

**Esfuerzo:** Bajo-Medio. **Quick win de alto valor** (alimenta Comunidad y SRS).

---

## A7 — Saga de aprendizaje (roadmap generativo)

**Objetivo.** A partir de un objetivo del usuario, generar y mantener un **itinerario** ordenado (apuntes + retos + checkpoints) que se adapta al progreso.

### Modelo de datos
`back/src/scripts/migracion_a7_sagas.sql`
```sql
CREATE TABLE IF NOT EXISTS sagas (
  saga_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(user_id) ON DELETE CASCADE,
  goal       TEXT NOT NULL,
  title      VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS saga_milestones (
  milestone_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saga_id    UUID REFERENCES sagas(saga_id) ON DELETE CASCADE,
  position   INT NOT NULL,
  type       VARCHAR(20) NOT NULL,    -- 'note' | 'challenge' | 'project' | 'checkpoint'
  ref_id     UUID,                    -- note_id / challenge_id si aplica
  title      VARCHAR(255) NOT NULL,
  description TEXT,
  status     VARCHAR(20) DEFAULT 'pending'  -- pending | done | skipped
);
```

### Backend — `ServicioSagas.ts`
1. `generar(userId, goal)`:
   - Recupera **inventario disponible**: apuntes de comunidad aprobados y retos existentes (título+tags+dificultad) — el "catálogo" que la IA puede enlazar.
   - `ServicioIA.json({ modelo: potente, system: PROMPT_SAGA, messages:[{role:'user', content: goal + catálogo resumido}] })` →
     ```json
     { "title":"", "milestones":[
       { "type":"note|challenge|project|checkpoint", "ref_hint":"título exacto del catálogo o null",
         "title":"", "description":"" } ] }
     ```
   - **Resolución de referencias:** mapear `ref_hint` a `note_id`/`challenge_id` reales por coincidencia exacta/FTS. Si no existe, queda como hito "manual" (o, futuro, dispara A2 para forjar el reto que falta).
   - Persistir saga + milestones.
2. `progreso`: marcar hito `done` automáticamente cuando el usuario completa el reto/apunte vinculado (hook en `actualizarProgreso` de retos y en lectura de apuntes), o manual.
3. Endpoints: `POST /sagas` `{ goal }`, `GET /sagas`, `GET /sagas/:id`, `PATCH /sagas/:id/milestones/:mid` (estado).

**Prompt** (`PROMPT_SAGA`):
```
Diseña un itinerario de aprendizaje en español para el objetivo: "{goal}".
Solo puedes enlazar recursos de este CATÁLOGO (usa el título exacto en ref_hint):
{catalogo}
Ordena de lo básico a lo avanzado. Intercala "checkpoint" cada 3-4 hitos para
consolidar, y termina con un hito "project" integrador.
Devuelve SOLO: { "title": "", "milestones": [ {type, ref_hint, title, description} ] }.
Si no hay recurso adecuado en el catálogo, pon ref_hint: null y describe el hito.
```

### Frontend — `features/sagas` (nuevo)
- `SagaCreatePage`: input de objetivo → `sagasService.create(goal)`.
- `SagaMapPage` (Desktop/Mobile): vista de **mapa/constelación** (lista vertical con líneas + nodos por estado; los nodos `note`/`challenge` enlazan a su página). Barra de progreso %, XP por hito.
- `sagasService`: `create`, `getAll`, `getById`, `setMilestoneStatus`.
- Entrada desde el dashboard ("Tu Saga activa") y desde Freya: *"¿Quieres que te trace una Saga para esto?"* (botón que prefilla el objetivo).

### UX
"Quiero aprender backend con Node" → mapa con 12 hitos enlazando apuntes y retos reales; al completar un reto, su nodo se ilumina. Da dirección, el mayor problema del autodidacta.

**Esfuerzo:** Alto. **Sinérgico con A2** (forjar hitos que falten) y con Comunidad (sagas curadas).

---

## Orden de implementación recomendado

```
Fase 0  Infraestructura: ServicioIA + ServicioRecuperacion(FTS) + rate-limit
            │
   ┌────────┼─────────────────────────────┐
   ▼        ▼                              ▼
A5 Destilador   A3 Revisión socrática    A1 Mentor con memoria
(quick win)     (independiente)          (pilar)
                                            │
                              ┌─────────────┼─────────────┐
                              ▼             ▼             ▼
                         A2 Forja      A4 Caza Troll   A7 Sagas
                         de retos                      (usa A2 a futuro)
```

1. **Infra (0.1–0.3)** — desbloquea todo.
2. **A5** y **A3** — rápidos, alto valor, sin dependencias.
3. **A1** — pilar; habilita personalización.
4. **A2**, **A4**, **A7** — apoyadas en A1 + Judge0.

---

## Riesgos transversales y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| **Coste de IA** sube con A1/A2/A7 | Modelo barato para destilados/perfil; potente solo en generación/revisión; rate-limit por usuario; caché por (tema,hash). |
| **Retos/bugs generados rotos** (A2, A4) | **Auto-validación con Judge0** antes de entregar; reintentos; descarte. |
| **JSON inválido del LLM** | `response_format: json_object` + validadores en `ServicioIA.json`; reintento 1 vez. |
| **La IA "regala" la solución** (rompe la filosofía) | Prompts explícitos (A3/A4); revisión nunca reescribe; pistas escalonadas con coste (A8). |
| **Privacidad del perfil (A1)** | Panel visible + borrado total + edición manual; documentar. |
| **Inyección de prompt** vía código/mensajes del usuario | Encerrar input del usuario en bloques delimitados; instrucciones de sistema con prioridad; no ejecutar instrucciones embebidas. |
| **Abuso de generación** (spam de retos/sagas) | Cuotas diarias; coste en XP opcional para forjar. |

---

## Checklist de "hecho" por función

- [ ] **0** `ServicioIA`, `ServicioRecuperacion` (FTS + índice), rate-limit, refactor de `ControladorAsistente`.
- [ ] **A1** tabla `learning_profiles`, `ServicioMemoria`, inyección en chat, destilado post-sesión, panel + borrado.
- [ ] **A2** columnas en `challenges`, `ServicioForjaRetos` con auto-validación Judge0, endpoint + botón, logro.
- [ ] **A3** endpoint `/assistant/review`, decorations/markers en Monaco, panel de pistas, "verificar de nuevo".
- [ ] **A4** tabla `troll_hunts`, `ServicioCazaTroll`, verificación de bug con Judge0, página + cronómetro + XP.
- [ ] **A5** endpoint `/assistant/distill-note`, botón en chat, precarga del editor de notas existente.
- [ ] **A7** tablas `sagas`/`saga_milestones`, `ServicioSagas` con resolución de referencias, `features/sagas` (mapa), enganche de progreso con retos/apuntes.
