# Diseño — Mejoras de la sección de Apuntes (Notas)

> Documento de diseño técnico para Academia Valhalla. Cubre cuatro frentes:
>
> 1. **Cierre de la migración de imágenes a Supabase Storage** (qué falta exactamente).
> 2. **Editor WYSIWYG**: estilos aplicados en vivo dentro de los bloques de texto y definición.
> 3. **Tutorial interactivo** de primera visita con spotlight y fondo difuminado, reactivable.
> 4. **Edición de apuntes propios** (con moderación para los publicados en comunidad).
> 5. **Exportación a PDF** con estilos propios y formato DIN A4.
>
> Stack actual relevante: React 19 + Vite + Tailwind (front), Express + Sequelize + PostgreSQL (back),
> Supabase Storage para imágenes. Front desplegado en Vercel, back en Render (disco efímero).

---

## Índice

1. [Parte 1 — Migración a Supabase Storage: análisis de huecos](#parte-1)
2. [Parte 2 — Editor WYSIWYG en bloques de texto y definición](#parte-2)
3. [Parte 3 — Tutorial interactivo de la sección de notas](#parte-3)
4. [Parte 4 — Edición de apuntes propios y flujo de moderación](#parte-4)
5. [Parte 5 — Exportación a PDF en DIN A4](#parte-5)
6. [Plan de implementación por fases](#plan)
7. [Riesgos y decisiones pendientes](#riesgos)

---

<a name="parte-1"></a>
## Parte 1 — Migración a Supabase Storage: análisis de huecos

### 1.1 Qué está YA hecho (verificado en el código)

| Pieza | Estado | Evidencia |
|---|---|---|
| SDK `@supabase/supabase-js` | ✅ instalado (`^2.108.1`) | `back/package.json` |
| Cliente Supabase | ✅ | `back/src/config/supabase.ts` (`getSupabase()`, `BUCKET`) |
| Servicio de storage | ✅ | `back/src/servicios/ServicioStorage.ts` (`subirArchivo`, `eliminarArchivo`) |
| Multer en memoria | ✅ | `back/src/config/subidaArchivos.ts` usa `memoryStorage` |
| Controlador de logros (escudos) | ✅ sube y borra en Supabase | `ControladorAdmin.ts:601,644-645,684` |
| Controlador de perfil (avatares) | ✅ sube y borra | `ControladorPerfil.ts:52-54` |
| Controlador de notas (imágenes) | ✅ sube | `ControladorNota.ts:14` |
| Controlador de publicaciones | ✅ sube | `ControladorPublicacion.ts:15` |
| Script de migración de datos antiguos | ✅ escrito, cubre avatares, escudos, contenido de notas y posts | `back/src/scripts/migrarImagenesSupabase.ts` |
| Variables `SUPABASE_*` en `.env` local | ✅ presentes | `back/.env` |
| Front preparado (passthrough de URLs absolutas) | ✅ | `utils/getAvatarUrl.ts` / `resolveAssetUrl` |

### 1.2 Qué FALTA para cerrar la migración

#### A. Operativa (no es código, es ejecución/verificación)

- [ ] **Verificar el bucket** `valhalla` en el dashboard de Supabase: existe, es **público**, límite 5 MB.
- [ ] **Variables en Render**: confirmar que `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_BUCKET`
      están en *valhalla-back → Environment* (no se puede verificar desde el repo).
- [ ] **Ejecutar el script de migración** contra la BD de producción (en local, con `DATABASE_URL`
      apuntando a Neon/Render):
      ```powershell
      cd back
      npx tsx src/scripts/migrarImagenesSupabase.ts
      ```
      Es idempotente (`upsert: true`); si las imágenes ya se perdieron por el disco efímero, el script
      las marcará como "No existe en disco, se omite" y habrá que aceptar esa pérdida.
- [ ] **Smoke test post-deploy**: subir avatar, escudo, imagen en nota e imagen en post → comprobar que
      la URL guardada empieza por `https://...supabase.co/storage/...` y que **sobrevive a un redeploy**.

#### B. Código pendiente

**B.1 — Retirar el servido estático de `/uploads`** (`server.ts:70`)

```ts
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads'))); // ← eliminar
```

Solo después de ejecutar la migración del punto A. Mientras existan URLs `/uploads/...` en BD,
esta línea es la única forma de servirlas (y en Render ni siquiera funciona tras un reinicio).
Eliminar también el `import path` si queda sin uso.

**B.2 — Borrado de imágenes huérfanas al eliminar una nota** *(hueco real)*

`ControladorNota.eliminarNota` (línea 153) hace `NotaUsuario.destroy(...)` sin tocar el storage:
las imágenes embebidas en los bloques `type: 'image'` del `content` quedan huérfanas en Supabase
para siempre. Solución:

```ts
// ControladorNota.ts
import { eliminarArchivo } from '../servicios/ServicioStorage.js';

/** Extrae las URLs de Supabase de los bloques imagen del content. */
const urlsDeImagenes = (content: any[]): string[] =>
    (content ?? [])
        .filter(b => b?.type === 'image' && typeof b.value === 'string')
        .map(b => b.value);

static eliminarNota = async (req, res) => {
    const nota = await NotaUsuario.findOne({ where: { note_id: idNota, user_id: idUsuario } });
    if (!nota) return res.status(404).json({ msg: '...' });

    const urls = urlsDeImagenes(nota.content as any[]);
    await nota.destroy();
    // best-effort: no bloquear la respuesta si falla el borrado en storage
    await Promise.allSettled(urls.map(u => eliminarArchivo(u)));
    res.json({ msg: 'Nota eliminada correctamente' });
};
```

> `eliminarArchivo` ya ignora URLs que no son del bucket, así que es seguro para URLs externas.

**B.3 — Borrado de imágenes sustituidas al actualizar una nota**

`actualizarNota` reemplaza `content` sin comparar: si el usuario quitó una imagen, queda huérfana.
En el mismo controlador, antes del `update`:

```ts
const antes = new Set(urlsDeImagenes(nota.content as any[]));
const despues = new Set(urlsDeImagenes(datosActualizacion.content ?? nota.content));
const eliminadas = [...antes].filter(u => !despues.has(u));
// tras el update:
await Promise.allSettled(eliminadas.map(u => eliminarArchivo(u)));
```

Aplicar el mismo patrón a **publicaciones** (`ControladorPublicacion`) si tienen borrado/edición.

**B.4 — Huérfanas por abandono del editor** *(decisión de diseño)*

`CreateNoteDesktop.handleImageUpload` sube la imagen a Supabase **en el momento de seleccionarla**
(necesario para la previsualización persistente y el borrador). Si el usuario abandona sin guardar,
la imagen queda huérfana. Opciones:

| Opción | Pros | Contras |
|---|---|---|
| (a) Subir solo al guardar | cero huérfanas | rompe el borrador (`useDraft`) y la preview tras recargar; reescritura del flujo |
| (b) Aceptar huérfanas + **script de limpieza periódico** | sin cambios de flujo; simple | huérfanas temporales (irrelevante con 1 GB gratis) |
| (c) Tabla de "imágenes provisionales" con confirmación al guardar | exacto | complejidad alta para el beneficio |

**Recomendación: (b).** Crear `back/src/scripts/limpiarImagenesHuerfanas.ts`:

1. `storage.list('notes/')` y `list('posts/')` paginado → conjunto de rutas en el bucket.
2. Cargar todas las notas/posts y extraer las URLs usadas (el mismo regex `RE_UPLOADS`
   adaptado a URLs de Supabase, o `urlsDeImagenes`).
3. Borrar (`storage.remove`) los archivos del bucket **no referenciados** y con antigüedad > 48 h
   (margen para borradores en curso; `list` devuelve `created_at`).
4. Ejecutarlo manualmente cada cierto tiempo o como cron (GitHub Action mensual, por ejemplo).

**B.5 — (Opcional) Simplificar los helpers del front**

Cuando el 100 % de la BD tenga URLs de Supabase, `getAvatarUrl` / `getEmblemUrl` / `resolveAssetUrl`
pueden quedarse en passthrough puro. No urgente; no rompe nada dejarlos.

### 1.3 Checklist de cierre

- [ ] Bucket verificado público con límite 5 MB.
- [ ] Variables en Render confirmadas.
- [ ] Script de migración ejecutado contra producción.
- [ ] `express.static('/uploads')` eliminado de `server.ts`.
- [ ] `eliminarNota` borra imágenes embebidas (B.2).
- [ ] `actualizarNota` borra imágenes sustituidas (B.3).
- [ ] Script `limpiarImagenesHuerfanas.ts` creado y probado (B.4).
- [ ] Smoke test tras redeploy: las imágenes persisten.

---

<a name="parte-2"></a>
## Parte 2 — Editor WYSIWYG en bloques de texto y definición

### 2.1 Estado actual

- `NoteTextBlock.tsx`: `<textarea>` en crudo donde el usuario ve los marcadores
  (`**negrita**`, `*cursiva*`, `` `código` ``, `!!aviso!!`, `*'término'*`, `'literal'`, `# título`),
  con un botón para alternar a una previsualización renderizada por `renderContent.tsx`.
- `useNoteFormatToolbar.ts`: inserta marcadores en el textarea y define los atajos
  (Ctrl+B/I/`` ` ``/K, Ctrl+Shift+W/T/L, Ctrl+1/2/3).
- El **formato de persistencia** es el string con marcadores (campo `value` de cada bloque
  `text`/`definition` dentro del JSONB `content`). Ese mismo formato lo consumen:
  `renderContent` en el detalle de nota, la comunidad (posts, comentarios, `PreviewNotePost`)
  y los modales de revisión del admin.

### 2.2 Objetivo

El usuario escribe y **ve el estilo aplicado al instante** (negrita real, código con fondo,
aviso ámbar…), sin marcadores visibles y sin necesitar el botón de previsualización para el texto.
Los atajos y la toolbar actuales siguen funcionando.

### 2.3 Decisión de arquitectura: Tiptap con gramática propia

Tres opciones evaluadas:

| Opción | Descripción | Veredicto |
|---|---|---|
| `contentEditable` artesanal | Render propio + manejo manual de selección/caret | ❌ Gestión de selección, IME, undo/redo y pegado son un campo de minas; coste de mantenimiento alto |
| Overlay (textarea transparente sobre div estilizado) | El textarea sigue siendo la fuente | ❌ Imposible alinear caret cuando los estilos cambian métricas (títulos más grandes, padding del código inline) |
| **Tiptap (ProseMirror)** con marks/nodes propios | Editor rich-text real; serialización a nuestra gramática | ✅ **Elegida**: resuelve selección/undo/pegar/IME, extensible, ~buena DX con React |

**Principio clave: el formato de la BD no cambia.** Tiptap será solo la capa de edición;
al cargar se parsea `marcadores → documento ProseMirror` y en cada cambio se serializa
`documento → marcadores`. Así:

- Las notas existentes se abren sin migración de datos.
- `renderContent` sigue siendo el render canónico en detalle, comunidad, moderación y PDF.
- Si algún día se quiere abandonar Tiptap, los datos siguen siendo texto plano legible.

### 2.4 Mapeo gramática ⇄ esquema del editor

| Sintaxis almacenada | Elemento Tiptap | Estilo (reutilizar clases de `renderContent`) | Atajo |
|---|---|---|---|
| `**texto**` | Mark `bold` | `font-semibold text-slate-900 dark:text-slate-100` | Ctrl+B |
| `*texto*` | Mark `italic` | `italic text-slate-600 dark:text-slate-400 font-serif` | Ctrl+I |
| `` `texto` `` | Mark `inlineCode` | píldora esmeralda (mono, fondo, borde) | Ctrl+` |
| `!!texto!!` | Mark `warning` (custom) | fondo ámbar + borde inferior | Ctrl+Shift+W |
| `*'texto'*` | Mark `techTerm` (custom) | mono rosa | Ctrl+Shift+T |
| `'texto'` | Mark `literal` (custom) | teal, comillas visibles | Ctrl+Shift+L |
| URL `https://...` | Mark `link` (autolink) | subrayado esmeralda | Ctrl+K |
| `# / ## / ###` | Node `heading` niveles 1-3 | tamaños/bordes actuales | Ctrl+1/2/3 |
| salto de línea | Node `paragraph` / `hardBreak` | — | Enter |

Extensiones Tiptap necesarias: `Document`, `Paragraph`, `Text`, `Heading (levels 1-3)`,
`HardBreak`, `History`, `Placeholder`, más **4 marks custom** (`warning`, `techTerm`, `literal`
reutilizan el patrón de `Mark.create()`; `inlineCode` puede extender `Code`).
Marks estándar `Bold`, `Italic`, `Link` con `HTMLAttributes` que inyecten las clases Tailwind.

> **Input rules opcionales** (fase 2): teclear `**hola**` y que se convierta solo al cerrar el
> segundo `**`. Tiptap las trae de serie (`markInputRule`). Recomendado activarlas para usuarios
> acostumbrados a markdown, pero no es requisito.

### 2.5 Parser y serializador (el corazón del diseño)

Nuevos archivos en `front/src/app/features/notes/editor/`:

```
editor/
├── RichTextEditor.tsx        # componente <RichTextEditor value onChange placeholder />
├── extensions.ts             # marks/nodes custom + keymap
├── markerParser.ts           # string con marcadores → JSON ProseMirror
├── markerSerializer.ts       # JSON ProseMirror → string con marcadores
└── __tests__/roundtrip.test.ts
```

**`markerParser.ts`** — reutiliza la MISMA regex de `renderContent.tsx` (extraerla a
`utils/markerGrammar.ts` compartido para que editor y render nunca diverjan):

```
/(#{1,6} .*?(?=\n|$)|(?:\*\*.*?\*\*)|(?:__.*?__)|(?:`.*?`)|(?:\*'.*?'\*)|(?:\*.*?\*)|(?:!!.*?!!)|(?:'.*?')|(?:https:\/\/[^\s]+))/g
```

Algoritmo: dividir por líneas → cada línea que empieza por `#{1,6} ` es un `heading`;
el resto, párrafos. Dentro de cada línea, trocear con la regex y emitir nodos `text` con el
mark correspondiente (mismo orden de precedencia que `renderContent`: heading > bold > code >
techTerm > italic > warning > literal > link).

**`markerSerializer.ts`** — recorre el doc: por cada nodo `heading` emite `#·` × nivel;
por cada `text`, envuelve según sus marks (`bold` → `**…**`, etc.). Párrafos separados por `\n`.

**Invariante a testear (round-trip):** `serialize(parse(s)) === s` para un corpus de casos:
cada marcador solo, combinaciones, marcadores sin cerrar (se tratan como texto plano),
texto con `*` o `'` literales, multilínea, headings con formato interior, string vacío.

**Caso límite — caracteres de la gramática escritos literalmente:** si el usuario escribe
`2 * 3 * 4` en el WYSIWYG no hay ambigüedad (no hay marks), pero al serializar hay que
**escapar** secuencias que el parser confundiría. Regla: al serializar texto plano, si el
resultado re-parseado generaría marks no presentes, envolver los caracteres conflictivos
(estrategia mínima: insertar un escape tipo `\*` y enseñar a `renderContent` a des-escaparlo).
Esto es lo único que toca `renderContent`: soportar `\*`, `\'`, `` \` ``, `\!` como literales.
*(Alternativa simple si no se quiere tocar el render: prohibir esos caracteres sueltos solo
cuando generen ambigüedad — peor UX; preferir el escape.)*

### 2.6 Componente `RichTextEditor`

```tsx
interface Props {
    value: string;                      // string con marcadores (fuente de verdad)
    onChange: (value: string) => void;  // emite marcadores serializados
    placeholder?: string;
}
```

- `useEditor({ extensions, content: markerParser(value) })`.
- `onUpdate`: `onChange(markerSerializer(editor.getJSON()))`.
- Sincronización externa: si `value` cambia desde fuera (carga de borrador con `useDraft`,
  reset), comparar con el último serializado y hacer `editor.commands.setContent(...)` solo
  si difiere (evita bucles y saltos de caret).
- Mismo contenedor visual que el `NoteTextBlock` actual (borde, focus-within esmeralda).

**`NoteTextBlock.tsx` (refactor):**

- Sustituir `<textarea>` por `<RichTextEditor>`.
- La toolbar (`NoteFormatToolbar`) se conserva visualmente, pero `onAction` pasa de
  `applyFormat` (inserción de strings) a comandos del editor:
  `editor.chain().focus().toggleMark('warning').run()`, `toggleHeading({ level: 2 })`, etc.
  Añadir **estado activo** en los botones (`editor.isActive('bold')`) — mejora gratis.
- El botón **"Vista previa" puede eliminarse en bloques de texto/definición** (ya se ve el
  resultado final). Mantener la pestaña global Escritura/Previsualización de la página de
  creación, que sigue siendo útil para ver la nota completa (código Monaco renderizado,
  imágenes, cajas de definición con su título).
- `ShortcutsModal` se mantiene; actualizar el texto si cambia algún atajo (no debería).

**Bloque definición:** usa el mismo `RichTextEditor` para su `value` (el `title` sigue siendo
un input normal). La caja (borde, icono, fondo) la sigue pintando el contenedor del bloque.

**Comunidad:** `CreatePostDesktop/Mobile` usan hoy `useNoteFormatToolbar` + textarea.
Migrarlos al mismo `RichTextEditor` en una segunda pasada (misma gramática, cero cambios de API).

### 2.7 Detalles de UX

- **Pegado**: configurar `editorProps.transformPastedText` para parsear marcadores al pegar
  texto plano (alguien que copia de una nota antigua ve estilos al instante).
- **Placeholder**: extensión `Placeholder` con el texto actual ("Escribe aquí…" sin la
  referencia a `**negrita**`, que ya no aplica).
- **Undo/redo**: `History` de Tiptap (Ctrl+Z/Y) — hoy depende del undo nativo del textarea.
- **Modo oscuro**: las clases de los marks ya contemplan `dark:`.
- **Accesibilidad**: `role="textbox"`, `aria-multiline="true"` (Tiptap lo gestiona);
  los atajos quedan documentados en `ShortcutsModal`.

### 2.8 Dependencias nuevas

```bash
cd front
npm i @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link
```

(~70-90 KB gzip añadidos al bundle; aceptable. Si preocupa, lazy-load del editor con
`React.lazy` en las páginas de creación/edición — la pestaña de notas en lectura no lo carga.)

---

<a name="parte-3"></a>
## Parte 3 — Tutorial interactivo de la sección de notas

### 3.1 Requisitos

- Se lanza **automáticamente la primera vez** que el usuario entra en `/dashboard/notes`.
- Reactivable con un **botón de exclamación** en la esquina superior derecha de la sección.
- Guía por **modales/tooltips anclados** a elementos reales; el resto de la página queda
  **difuminada y oscurecida**, dejando nítida solo la zona explicada (spotlight).
- Contenido: crear nota, destacar texto (toolbar **y** atajos), previsualizar, guardar,
  proponer a comunidad, y editar apuntes propios (con la regla de moderación).

### 3.2 Librería vs. implementación propia

`react-joyride` (incompatibilidades con React 19 en su v2), `driver.js` (estilos propios
difíciles de casar con el design system de Valhalla: clip-paths, font-mono, esmeralda) y
`shepherd.js` (pesada). El tour necesita además **continuidad entre dos rutas**
(`/notes` → `/notes/create`), que ninguna resuelve bien de serie.

**Decisión: motor propio ligero** (~300 líneas), en `front/src/app/components/Tour/`:

```
components/Tour/
├── TourProvider.tsx      # contexto: start/stop/next/prev, paso actual, persistencia
├── TourOverlay.tsx       # portal: backdrop blur + spotlight + tooltip posicionado
├── TourTooltip.tsx       # tarjeta del paso (estética Valhalla)
├── tourSteps.notes.ts    # definición declarativa de los pasos del tour de notas
└── useTourTarget.ts      # hook: mide el rect del target y lo observa (resize/scroll)
```

### 3.3 Técnica del spotlight con blur

Un solo `div` fijo a viewport con `backdrop-filter: blur(6px)` + `bg-black/50`, recortado con
**CSS mask** para abrir el "agujero" nítido sobre el elemento destacado:

```tsx
// TourOverlay.tsx (esencia)
const r = targetRect; // medido con getBoundingClientRect + padding 8px
const mask = `
  linear-gradient(#000 0 0),
  linear-gradient(#000 0 0)
`;
<div
  className="fixed inset-0 z-[100] backdrop-blur-md bg-black/50 transition-all duration-300"
  style={{
    WebkitMaskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
    WebkitMaskComposite: 'xor',           // (mask-composite: exclude en estándar)
    maskComposite: 'exclude',
    WebkitMaskPosition: `0 0, ${r.x}px ${r.y}px`,
    WebkitMaskSize: `100% 100%, ${r.width}px ${r.height}px`,
    WebkitMaskRepeat: 'no-repeat',
    borderRadius: 0,
  }}
/>
```

- El agujero deja el elemento **nítido y a todo color**; el resto queda borroso y oscuro.
- **Fallback** (si algún navegador antiguo no compone máscaras): 4 paneles `div` con blur
  rodeando el target (top/right/bottom/left). Detectar con `CSS.supports('mask-composite','exclude')`.
- Borde del spotlight: un segundo `div` absolutamente posicionado sobre el target con
  `ring-2 ring-emerald-400/80` + esquinas con el clip-path de la estética Valhalla.
- **Interacción**: el overlay captura clics (`pointer-events: auto`) salvo en pasos marcados
  `interactive: true`, donde el área del agujero deja pasar el clic (se consigue poniendo el
  overlay en 4 paneles en esos pasos, o con un handler que reenvía el clic si cae dentro del rect).
  Necesario para el paso "pulsa Nuevo" si se quiere que el usuario navegue él mismo.

### 3.4 Modelo de datos de un paso

```ts
export interface TourStep {
    id: string;
    route: string;                 // ruta donde vive el paso ('/dashboard/notes', '/dashboard/notes/create')
    target?: string;               // selector CSS `[data-tour="..."]`; sin target → modal centrado
    title: string;
    body: ReactNode;               // admite <kbd>, listas, iconos
    placement?: 'top'|'bottom'|'left'|'right'|'auto';
    interactive?: boolean;         // permite clic real en el target
    advanceOn?: 'next'|'targetClick'; // cómo se avanza
    onEnter?: (ctx: TourCtx) => void; // efectos: scrollIntoView, abrir modal de bloques…
}
```

Anclajes: añadir atributos **`data-tour="…"`** a los elementos reales (estables frente a
refactors de clases):

| `data-tour` | Elemento | Archivo |
|---|---|---|
| `notes-tabs` | toggle Mis Apuntes/Comunidad | `NotesPageDesktop/Mobile.tsx` |
| `notes-search` | buscador + filtros de lenguaje | íd. |
| `notes-new` | botón "Nuevo" | íd. |
| `notes-help` | botón "!" (nuevo) | íd. |
| `note-card-edit` | botón editar de la primera tarjeta propia | `NoteCardDesktop/Mobile.tsx` |
| `create-meta` | título + tags + lenguaje + dificultad | `CreateNoteDesktop/Mobile.tsx` |
| `create-add-block` | botón añadir bloque | íd. |
| `create-toolbar` | `NoteFormatToolbar` del primer bloque | `NoteTextBlock.tsx` |
| `create-preview` | toggle Escritura/Previsualización | `CreateNoteDesktop.tsx` |
| `create-share` | switch "Compartir con la comunidad" | íd. |
| `create-save` | botón Guardar | íd. |

### 3.5 Guion del tour (12 pasos)

**En `/dashboard/notes`:**

1. **Bienvenida** *(modal centrado, sin target)* — "Este es tu espacio de conocimiento.
   Te enseñamos a crear y gestionar tus apuntes en un minuto." Botones: *Empezar* / *Saltar*.
2. **Pestañas** *(target `notes-tabs`)* — Mis Apuntes (privados) vs. Comunidad (aprobados por moderación).
3. **Buscar y filtrar** *(target `notes-search`)* — búsqueda por texto y filtros por lenguaje.
4. **Crear una nota** *(target `notes-new`, `interactive`, `advanceOn: targetClick`)* —
   "Pulsa *Nuevo* para abrir el editor." → la navegación real dispara la continuación.

**En `/dashboard/notes/create`** (el tour persiste y continúa al detectar la ruta):

5. **Metadatos** *(target `create-meta`)* — título, etiquetas, lenguaje y dificultad ayudan a
   encontrar la nota después.
6. **Bloques de contenido** *(target `create-add-block`)* — texto, código (editor Monaco),
   imagen y definición; se combinan libremente.
7. **Dar estilo al texto** *(target `create-toolbar`)* — toolbar de formato. El cuerpo del
   tooltip incluye la tabla de atajos: <kbd>Ctrl</kbd>+<kbd>B</kbd> negrita,
   <kbd>Ctrl</kbd>+<kbd>I</kbd> cursiva, <kbd>Ctrl</kbd>+<kbd>`</kbd> código,
   <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd> aviso, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd>
   término técnico, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd> literal,
   <kbd>Ctrl</kbd>+<kbd>1..3</kbd> títulos. Mencionar el botón "?" (ShortcutsModal).
8. **Previsualizar** *(target `create-preview`)* — ver la nota completa como quedará publicada.
9. **Compartir con la comunidad** *(target `create-share`)* — al activarlo, la nota pasa a
   revisión por un moderador antes de ser pública; mientras tanto sigue siendo tuya.
10. **Guardar** *(target `create-save`)* — guarda (y otorga XP ✨).

**De vuelta / cierre** (el paso 11 puede mostrarse en `/create` con navegación programada de
vuelta a `/notes`, o si el usuario tiene ya tarjetas, sobre la primera):

11. **Editar tus apuntes** *(target `note-card-edit` si existe; si no, modal centrado)* —
    los apuntes personales se editan libremente con el botón ✎; los ya **aprobados en
    comunidad** requieren que un administrador/moderador apruebe los cambios.
12. **Volver a ver esto** *(target `notes-help`)* — "Pulsa el botón **!** cuando quieras
    repetir el tutorial." Botón: *Terminar*.

### 3.6 Activación, persistencia y reactivación

- **Primera visita**: en `NotesPage`, al montar:
  ```ts
  const KEY = (userId: string) => `valhalla:tour:notes:v1:${userId}`;
  useEffect(() => {
      if (!localStorage.getItem(KEY(user.user_id))) tour.start('notes');
  }, []);
  ```
  Al terminar o saltar: `localStorage.setItem(KEY, new Date().toISOString())`.
  - Clave **por usuario** (equipos compartidos) y **versionada** (`v1`): si el tour cambia
    significativamente, subir a `v2` re-activa la primera visita.
  - *(Mejora futura, opcional)*: persistir en BD (`Usuario.tutorials_seen JSONB`) para que
    sobreviva a cambios de dispositivo. No bloqueante.
- **Continuidad entre rutas**: `TourProvider` guarda `{ tourId, stepIndex }` en
  `sessionStorage` y un `useEffect` sobre `useLocation()` reanuda el tour cuando la ruta
  coincide con `steps[stepIndex].route`. Si el usuario navega a otra ruta cualquiera, el tour
  se cancela limpiamente.
- **Botón "!"**: en la cabecera de `NotesPageDesktop` (junto al botón "Nuevo") y en
  `NotesPageMobile` (en la fila del título). Estética: cuadrado con clip-path Valhalla,
  borde esmeralda, icono `!` en font-mono, `title="Ver tutorial"`, `data-tour="notes-help"`.
  `onClick={() => tour.start('notes')}` — reinicia desde el paso 1 siempre.

### 3.7 Comportamiento y accesibilidad

- **Posicionamiento del tooltip**: cálculo propio (target rect + placement preferido +
  flip si no cabe + clamp al viewport). Sin dependencia externa; ~40 líneas.
- **Scroll**: `onEnter` hace `target.scrollIntoView({ block: 'center', behavior: 'smooth' })`
  y se re-mide el rect tras el scroll (`useTourTarget` escucha `scroll` y `resize`, y un
  `ResizeObserver` sobre el target).
- **Teclado**: `→`/`Enter` siguiente, `←` anterior, `Esc` salir. Focus trap dentro del tooltip;
  al cerrar, devolver el foco al botón "!".
- **ARIA**: tooltip con `role="dialog"`, `aria-modal="true"`, `aria-labelledby` el título del paso.
- **Móvil**: mismos pasos; el tooltip se renderiza como **bottom-sheet** fijo (los targets
  pequeños + tooltips flotantes funcionan mal en táctil). El spotlight es idéntico.
- **Targets ausentes** (p. ej. paso 11 sin tarjetas propias): el paso define fallback a modal
  centrado; nunca debe romper el tour.
- **Animación**: transición del agujero entre pasos animando `mask-position/size`
  (`transition: all 300ms`) — el spotlight "viaja" de un elemento a otro.

---

<a name="parte-4"></a>
## Parte 4 — Edición de apuntes propios y flujo de moderación

### 4.1 Estado actual

- Backend: `PATCH /notes/:noteId` (`actualizarNota`) ya existe y filtra por
  `user_id` del token, pero **no distingue `community_status`**: hoy permitiría editar una
  nota aprobada sin pasar por moderación.
- Front: **no existe ruta ni UI de edición** (solo `notes/create` y `notes/:noteId` de lectura).
- Ya existe infraestructura de revisión admin: `features/admin/.../ContentRequests/NoteReviewModal.tsx`
  (aprueba/rechaza notas `pending`).

### 4.2 Reglas de negocio

| `community_status` de la nota | ¿Editable por el autor? | Efecto al guardar |
|---|---|---|
| `personal` | ✅ directa | se actualiza la nota |
| `rejected` | ✅ directa | se actualiza; opcionalmente puede volver a proponerse (→ `pending`) |
| `pending` | ✅ directa | se actualiza **y sigue `pending`** (el moderador revisará la última versión) |
| `approved` | ⚠️ vía **revisión** | los cambios se guardan como *revisión pendiente*; la versión aprobada sigue visible en comunidad hasta que un admin/moderador apruebe la revisión |

- Nadie edita notas ajenas (sin cambios: el `where user_id` ya lo garantiza).
- Solo roles `admin`/`moderador` (enum `RolUsuario`) resuelven revisiones.

### 4.3 Backend

**4.3.1 Nueva tabla `RevisionNota`** (mejor que un campo `pending_content` en la nota:
deja auditoría y permite rechazar sin perder nada):

```ts
@Table({ tableName: 'note_revisions', timestamps: true })
export class RevisionNota extends Model {
    @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID)
    revision_id!: string;

    @ForeignKey(() => NotaUsuario) @Column(DataType.UUID)
    note_id!: string;

    @ForeignKey(() => Usuario) @Column(DataType.UUID)
    author_id!: string;

    // Snapshot completo de los campos editables propuestos
    @Column(DataType.JSONB)
    payload!: { title: string; description?: string; summary?: string;
                language?: string; tags?: string[]; difficulty?: string;
                content: BloqueContenidoNota[] };

    @Default('pending')
    @Column(DataType.ENUM('pending', 'approved', 'rejected'))
    status!: string;

    @AllowNull @ForeignKey(() => Usuario) @Column(DataType.UUID)
    reviewed_by!: string | null;

    @AllowNull @Column(DataType.TEXT)
    review_comment!: string | null;
}
```

Restricción de aplicación: **una sola revisión `pending` por nota** (al enviar una nueva,
la anterior pendiente se sobreescribe o se marca `superseded` — recomendado: sobreescribir,
más simple).

**4.3.2 Cambios en `ControladorNota.actualizarNota`:**

```ts
if (nota.community_status === 'approved') {
    // upsert de la revisión pendiente
    const [rev] = await RevisionNota.upsert({
        note_id: nota.note_id, author_id: idUsuario,
        payload: datosActualizacion, status: 'pending',
    } /* conflict: note_id + status pending */);
    return res.status(202).json({
        msg: 'Cambios enviados a revisión. La versión publicada no cambia hasta su aprobación.',
        revisionPending: true,
    });
}
// resto de estados: update directo (comportamiento actual)
await nota.update(datosActualizacion);
```

- Sanear `datosActualizacion`: lista blanca de campos (`title, description, summary, language,
  tags, difficulty, content`) — **nunca** aceptar `community_status` ni `user_id` del body
  (hoy el PATCH documenta `community_status` en el schema; retirarlo del flujo de autor).
- Recordar el punto **B.3 de la Parte 1**: borrar imágenes sustituidas (en el caso `approved`,
  solo cuando la revisión se apruebe; las imágenes nuevas de una revisión rechazada se limpian
  al rechazar).

**4.3.3 Endpoints de moderación** (en `rutaAdmin.ts`, middleware de rol existente):

```
GET   /admin/note-revisions               → lista revisiones pending (+ nota original + autor)
PATCH /admin/note-revisions/:revisionId   → body { action: 'approve' | 'reject', comment? }
```

- `approve`: aplica `payload` sobre la nota (transacción), marca la revisión `approved`,
  registra `reviewed_by`, limpia imágenes sustituidas.
- `reject`: marca `rejected` + `review_comment`; limpia imágenes nuevas no usadas.
- *(Opcional)* notificación in-app al autor reutilizando el sistema de mensajes/toasts existente.

**4.3.4 GET de detalle para el autor:** `obtenerNotaPorId` incluye, si existe,
`pendingRevision: { revision_id, createdAt }` para que el front muestre el aviso
"Tienes cambios pendientes de aprobación".

### 4.4 Frontend

**4.4.1 Ruta y página de edición**

```tsx
// App.tsx
<Route path="notes/:noteId/edit" element={<EditNotePage />} />
```

`EditNotePage` **reutiliza** la página de creación: extraer de `useCreadorNota` un hook base y
crear `useEditorNota(noteId)` que:

1. Carga la nota (`GET /notes/:noteId`), valida que `source !== 'community'` (ajena) y
   precarga `title/tags/language/difficulty/blocks` (mapear `content[] → Block[]` con
   `generateId()` por bloque).
2. `handleSave` hace `PATCH` en lugar de `POST`; sin XP (no se re-otorga
   `RECOMPENSA_XP_NOTA` por editar).
3. Si la respuesta es `202 revisionPending`, muestra el modal "Enviado a revisión" en vez del
   toast de guardado.
4. Borrador con clave propia: `useDraft(\`edit-note-${noteId}\`, ...)` para no pisar el de creación.

**4.4.2 Puntos de entrada del botón Editar (✎)**

- **`NoteCardDesktop/Mobile`** (solo pestaña *Mis Apuntes*): icono lápiz en la esquina de la
  tarjeta → `navigate(\`/dashboard/notes/${id}/edit\`)`. `data-tour="note-card-edit"`.
- **`NewNoteDesktop/Mobile`** (detalle): botón "Editar" en la cabecera **solo si**
  `source === 'personal'`. Si `community_status === 'approved'`, el botón muestra junto a sí
  un hint (tooltip/badge): *"Los cambios pasarán por moderación"*.
- En la pestaña *Comunidad* las tarjetas **no** llevan botón de edición (aunque la nota sea
  tuya, ahí se ve la versión pública; se edita desde *Mis Apuntes*).

**4.4.3 Estados visibles para el autor**

- Badge en la tarjeta/detalle cuando hay revisión pendiente: `EN REVISIÓN` (ámbar, font-mono,
  como los badges existentes).
- Si la revisión fue rechazada: badge `CAMBIOS RECHAZADOS` + `review_comment` visible en el
  detalle, con CTA "Editar de nuevo".

**4.4.4 Moderación (admin)**

- Nueva pestaña "Revisiones" en la pantalla de *Content Requests* del admin, reutilizando
  `NoteReviewModal` con **vista diff**: dos columnas (actual vs. propuesta) renderizadas ambas
  con `renderContent`; como mínimo v1: mostrar la propuesta completa + botón "ver original".
- Acciones aprobar/rechazar con comentario (mismo patrón que la revisión de notas `pending` actual).

---

<a name="parte-5"></a>
## Parte 5 — Exportación a PDF en DIN A4

### 5.1 Requisito

Botón "Descargar PDF" en el detalle del apunte que genere un documento **con los mismos
estilos** del render web (títulos, negritas, código, cajas de definición, imágenes, avisos)
maquetado para **DIN A4 (210 × 297 mm)** con márgenes de folio reales.

### 5.2 Decisión técnica

| Opción | Calidad | Peso | Fidelidad de estilos | Veredicto |
|---|---|---|---|---|
| `html2canvas` + `jsPDF` | ❌ raster (texto no seleccionable, borroso al zoom, páginas cortadas a píxel) | ~300 KB | media | descartada |
| `@react-pdf/renderer` | ✅ vector | ~400 KB | ❌ reimplementar TODOS los estilos en su DSL | descartada |
| **CSS print + `window.print()`** | ✅ vector nativo, texto real, hipervínculos vivos | **0 KB** | ✅ exacta (mismo DOM + hoja print) | **elegida** |

El diálogo nativo "Guardar como PDF" está en todos los navegadores de escritorio y móviles
modernos. Es la única vía sin coste de bundle que respeta `renderContent` al 100 % y produce
PDF vectorial con saltos de página tipográficos correctos.

### 5.3 Arquitectura

**Nueva ruta de impresión** (aislada del layout del dashboard — sin sidebar, sin nav):

```tsx
// App.tsx (fuera del layout del dashboard, pero autenticada)
<Route path="notes/:noteId/print" element={<NotePrintPage />} />
```

```
features/notes/pages/NotePrintPage/
├── NotePrintPage.tsx     # carga la nota, renderiza NotePrintView, dispara print
└── NotePrintView.tsx     # documento A4: cabecera, metadatos, bloques
```

**Flujo del botón** (en `NewNoteDesktop/Mobile`, cabecera, icono descarga + "PDF"):

```ts
const exportarPdf = () => window.open(`/dashboard/notes/${noteId}/print`, '_blank');
```

`NotePrintPage`:

1. Carga la nota (reutiliza `useNoteDetail`).
2. Fuerza **tema claro** (el PDF siempre claro: papel) — render fuera del provider de tema o
   con clase `light` forzada en el contenedor raíz.
3. `document.title = \`${nota.title} — Academia Valhalla\`` → es el **nombre de archivo
   sugerido** por el diálogo de impresión.
4. Espera a que carguen **todas las imágenes y fuentes**:
   ```ts
   await document.fonts.ready;
   await Promise.all([...document.images].map(img =>
       img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
   window.print();
   ```
5. `onafterprint`: muestra una mini-barra "¿Listo? [Volver al apunte] [Imprimir de nuevo]"
   (no cerrar la pestaña automáticamente: el usuario puede querer reintentar).

### 5.4 Hoja de estilos A4 (especificación de maquetación)

Archivo `notePrint.css` (importado solo por `NotePrintPage`):

```css
/* ====== Página ====== */
@page {
    size: A4;                 /* 210 × 297 mm */
    margin: 20mm 18mm 22mm;   /* sup / lat / inf — márgenes de folio académico */
}

@media print {
    html, body { background: #fff !important; }
    /* color exacto de fondos/bordes (cajas de definición, código, avisos) */
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}

/* En pantalla, la ruta /print simula el folio para previsualizar: */
@media screen {
    .a4-sheet {
        width: 210mm; min-height: 297mm; margin: 1rem auto;
        padding: 20mm 18mm 22mm; background: #fff;
        box-shadow: 0 2px 24px rgb(0 0 0 / .15);
    }
}
```

**Tipografía (conversión px-pantalla → pt-papel):**

| Elemento | Pantalla (clases actuales) | Papel |
|---|---|---|
| Título del apunte | `text-2xl font-black` | 20 pt, negro, borde inferior 1 pt |
| Metadatos (lenguaje, dificultad, tags, autor, fecha) | badges font-mono | 8 pt mono, gris |
| H1 (`#`) | `text-4xl` + borde | 17 pt + borde inferior 0.5 pt |
| H2 (`##`) | `text-2xl` | 14 pt seminegrita |
| H3 (`###`) | `text-xl` | 12 pt seminegrita |
| Cuerpo | `text-lg leading-relaxed` | **11 pt / interlineado 1.55** |
| Código inline | píldora esmeralda | 9.5 pt mono, fondo `#ecfdf5`, borde `#a7f3d0` |
| Bloque de código | `CodeBlockDesktop` | 9 pt mono, fondo `#f8fafc`, borde, numeración opcional |
| Aviso `!!…!!` | fondo ámbar | igual, colores claros exactos |
| Término técnico / literal | rosa / teal | igual |
| Caja de definición | borde + icono | borde 0.75 pt, título 11 pt seminegrita, fondo `#f0fdf4` |
| Enlaces | subrayado esmeralda | azul-esmeralda + **URL visible entre paréntesis**: `a::after { content: " (" attr(href) ")"; font-size: 8pt; }` (los PDF se imprimen; el enlace clicable se conserva igualmente) |

**Reglas de salto de página (lo que hace que parezca un documento y no una captura):**

```css
h1, h2, h3, [role="heading"] { break-after: avoid; }      /* título nunca huérfano al pie */
.print-definition, .print-code, figure { break-inside: avoid; }
p { orphans: 3; widows: 3; }
figure img { max-width: 100%; max-height: 180mm; object-fit: contain; }
.print-code.too-tall { break-inside: auto; }               /* código > 1 página sí puede partirse */
```

**Bloques de código:** Monaco **no se imprime** (es un canvas/DOM virtual). `NotePrintView`
renderiza los bloques `code` con `<pre><code>` plano + resaltado estático ligero
(reutilizar el componente de solo-lectura `CodeBlockDesktop` si no depende de Monaco;
si depende, render plano con fondo y fuente mono — fidelidad suficiente en papel).

**Cabecera/pie de página:** los *margin boxes* de `@page` (`@top-center` etc.) solo funcionan
en Chromium parcialmente; **v1**: cabecera del documento (logo Valhalla + título + autor +
fecha) como primer bloque del flujo, sin numeración de páginas. *(v2 opcional: `paged.js`
para numeración "pág. X de Y" — añade 100 KB; solo si se pide explícitamente.)*

### 5.5 Estructura de `NotePrintView`

```tsx
<article className="a4-sheet font-print text-slate-900">
    {/* Cabecera del documento */}
    <header>
        <div>ACADEMIA VALHALLA · APUNTE</div>            {/* 8pt mono tracking-widest */}
        <h1>{note.title}</h1>
        <dl>lenguaje · dificultad · tags · autor · fecha</dl>
    </header>

    {/* Cuerpo: misma iteración de bloques que NewNoteDesktop */}
    {note.content.map(bloque => {
        switch (bloque.type) {
            case 'text':       return <section className="print-text">{renderContent(bloque.value)}</section>;
            case 'definition': return <aside className="print-definition">…{renderContent(bloque.value)}</aside>;
            case 'code':       return <pre className="print-code">…</pre>;
            case 'image':      return <figure><img src={bloque.value} /><figcaption>{bloque.title}</figcaption></figure>;
        }
    })}

    <footer>Generado desde Academia Valhalla — {fecha}</footer>
</article>
```

> **Clave de mantenimiento:** `NotePrintView` reutiliza `renderContent` tal cual.
> Cualquier estilo nuevo del editor (Parte 2) aparece automáticamente en el PDF;
> solo hay que añadir su variante de color claro en `notePrint.css` si difiere.

### 5.6 Casos límite

- **Imágenes de Supabase**: bucket público y mismo origen HTTP(S) → sin problema CORS para
  imprimir (no hay canvas de por medio).
- **Imágenes caídas**: `onerror` → placeholder con el título del bloque, no bloquear el print.
- **Notas larguísimas**: sin límite; el flujo pagina solo. Verificar rendimiento con una nota
  de 50+ bloques.
- **Móvil**: `window.print()` funciona en Chrome/Safari móvil ("Guardar como PDF" en el menú
  de compartir). El botón se muestra igual.
- **Apuntes de comunidad**: el botón PDF también aplica (se exporta lo publicado).

---

<a name="plan"></a>
## Plan de implementación por fases

| Fase | Contenido | Dependencias | Esfuerzo orientativo |
|---|---|---|---|
| **F1 — Cierre Supabase** | A (operativa) + B.1, B.2, B.3 + script B.4 | ninguna | 0.5–1 día |
| **F2 — Edición de apuntes** | ruta/página edit + botones ✎ + guard backend + tabla `RevisionNota` + endpoints + UI admin | F1 (limpieza de imágenes en update) | 2–3 días |
| **F3 — Editor WYSIWYG** | gramática compartida + parser/serializer + tests round-trip + `RichTextEditor` + refactor `NoteTextBlock`/definición + toolbar con estado activo | — (paralelizable con F2) | 3–4 días |
| **F4 — Export PDF** | ruta print + `NotePrintView` + `notePrint.css` + botón en detalle | F2 no necesaria; F3 no necesaria (usa `renderContent`) | 1–1.5 días |
| **F5 — Tutorial** | motor Tour + overlay/spotlight + pasos + `data-tour` + botón "!" + persistencia | F2 (paso 11) y F3 (paso 7 con toolbar definitiva) → **último** | 2–3 días |
| **F6 — Extensión** | WYSIWYG en comunidad (posts/comentarios), diff visual en moderación, numeración de páginas PDF | F3, F2 | opcional |

Orden recomendado: **F1 → F2 → F3 → F4 → F5** (el tutorial al final para que enseñe la UI definitiva).

---

<a name="riesgos"></a>
## Riesgos y decisiones pendientes

| # | Riesgo / decisión | Mitigación / propuesta |
|---|---|---|
| 1 | **Round-trip de la gramática** (Parte 2): un bug en parser/serializer puede corromper notas al guardar | Suite de tests round-trip exhaustiva ANTES de conectar el editor; el serializado solo sobreescribe si `parse(serialize(x))` es estable; feature flag para volver al textarea |
| 2 | Caracteres `*`, `'`, `` ` ``, `!` literales en texto | Estrategia de escape `\*` + soporte de des-escape en `renderContent` (cambio pequeño y retrocompatible) |
| 3 | `mask-composite` en navegadores antiguos (tutorial) | Detección con `CSS.supports` + fallback de 4 paneles |
| 4 | Tour entre dos rutas con estado en `sessionStorage` | Cancelación limpia si la ruta no coincide; QA del flujo atrás/adelante del navegador |
| 5 | Bundle: Tiptap ~80 KB gzip | `React.lazy` del editor en páginas de creación/edición |
| 6 | Una revisión pendiente machaca a la anterior (Parte 4) | Decisión asumida (upsert); si se quiere histórico completo, quitar el upsert y añadir `superseded` |
| 7 | PDF sin numeración de páginas en v1 | Documentado; `paged.js` como v2 si se pide |
| 8 | XP por editar nota | Decidido: NO se otorga XP al editar (evita farmeo) |
| 9 | Tutorial en BD vs localStorage | v1 localStorage por usuario y versionado; campo `tutorials_seen` en `Usuario` como mejora futura |
| 10 | Render legado: notas con `__código__` (alias antiguo de `` ` ``) | El parser lo normaliza a `` ` `` al abrir en el editor; `renderContent` lo sigue soportando en lectura |
