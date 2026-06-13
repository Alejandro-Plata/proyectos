# Plan de implementación — Mensajería multimedia, grupos y autofocus de respuesta

> Estado: **pendiente de implementación**
> Alcance: (1) envío de **audios, fotos y vídeos** en la mensajería, (2) **grupos** con varios
> usuarios, (3) **autofocus** del input al pulsar "responder".

---

## 0. Estado actual (verificado en el código)

| Pieza | Archivo | Estado |
|---|---|---|
| Modelo de datos | `back/src/modelos/Modelos.ts` | `Conversacion` (sin nombre ni flag de grupo), `ParticipanteConversacion` (user + unread + archived, sin rol), `Mensaje` (`content TEXT`, `reply_to_id`, sin tipo ni adjunto). |
| API REST | `back/src/controladores/ControladorMensaje.ts` | Lista/crea conversaciones **estrictamente 1-a-1** (busca cualquier conversación compartida con el otro usuario y la reutiliza). |
| Tiempo real | `back/src/controladores/ControladorSocket.ts` | Socket.IO: `send_message` (solo texto), `mark_read`, `typing`. Rooms por `conversation_id` y por `user_id`. |
| Subida de archivos | `back/src/servicios/ServicioStorage.ts` + `config/subidaArchivos.ts` | Ya existe pipeline multer → **Supabase Storage** (se usa para avatares e imágenes de notas). |
| Front | `front/src/app/features/messaging/*` | `useChat` (draft, replyTo), `EntradaMensaje` (textarea sin ref), `TarjetaMensaje`, `MessagingDesktop/Mobile`, `FloatingChat`. Tipos en `types/types.ts`. |

**Decisión transversal**: los adjuntos se suben por **HTTP REST** (multer → Supabase) y el mensaje
se emite después por **socket** con la URL ya subida. No se envían binarios por Socket.IO: evita
límites de payload, reconexiones a mitad de subida y duplica la lógica de validación.

---

## Fase 1 — Autofocus al responder (esfuerzo: muy bajo — hacer primero)

**Problema**: al pulsar "responder" en un mensaje, `useChat.handleReply` fija `replyTo` y aparece
el preview, pero el usuario tiene que clicar manualmente el textarea para escribir.

**Cambios** (solo front, 3 archivos):

1. `components/EntradaMensaje.tsx`
   - Crear `const inputRef = useRef<HTMLTextAreaElement>(null)` **dentro** del componente y
     asignarlo al `<textarea ref={inputRef}>`.
   - `useEffect(() => { if (replyTo) inputRef.current?.focus(); }, [replyTo]);`
   - Con esto el foco funciona sin tocar la página padre. Si en el futuro otro componente
     necesita forzar el foco, exponerlo con `forwardRef` + `useImperativeHandle`.

2. Móvil (`MessagingMobile.tsx`): mismo componente, mismo efecto. Verificar que el teclado
   en iOS se abre (focus programático tras gesto del usuario sí lo permite, porque el tap en
   "responder" cuenta como interacción).

3. Detalle UX extra (gratis): al **cancelar** la respuesta, devolver el foco al textarea también
   (`useEffect` con dependencia `replyTo` ya lo cubre si se hace `focus()` en ambos casos salvo
   `replyTo === null` inicial — usar un ref `prevReplyTo` o simplemente enfocar siempre que
   cambie y no sea el primer render).

### Criterio de aceptación
Pulsar "responder" en cualquier mensaje (desktop y móvil) deja el cursor parpadeando en el input,
listo para escribir, sin ningún clic adicional.

---

## Fase 2 — Adjuntos: fotos, vídeos y audios

### 2.1 Migración de datos

Columnas nuevas en `messages` (`Modelos.ts` + migración SQL idempotente):

```sql
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type VARCHAR(10) NOT NULL DEFAULT 'text';
-- 'text' | 'image' | 'video' | 'audio'
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_url  VARCHAR(500);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_meta JSONB;
-- attachment_meta: { size, mime, width?, height?, durationSec?, thumbnailUrl? }
```

`content` pasa a ser el **caption opcional** cuando `message_type !== 'text'`.

### 2.2 Backend

1. **Endpoint de subida** (nuevo, en `rutaMensaje.ts`):

   ```
   POST /api/mensajes/adjuntos   (auth + multer.single('file') + rate limit propio)
   ```

   - Validación por **magic bytes**, no solo MIME del cliente (patrón ya usado en el proyecto).
   - Límites: imagen **5 MB** (jpeg/png/webp/gif), audio **10 MB** (webm/ogg/mp3/m4a),
     vídeo **50 MB** (mp4/webm). Rechazar el resto con 400.
   - Sube a Supabase con `ServicioStorage.subirArchivo(file, 'chat', 'msg')` → carpeta
     `chat/{conversationId}/{uuid}.{ext}`.
   - Respuesta: `{ url, meta: { size, mime } }`.
   - **Autorización**: el body incluye `conversation_id`; verificar que `req.user` es
     participante antes de subir (no después).

2. **Socket `send_message`** (`ControladorSocket.ts`): ampliar payload a

   ```ts
   { conversation_id, content?, reply_to_id?, message_type?, attachment_url?, attachment_meta? }
   ```

   - Regla de validación: `message_type === 'text'` exige `content` no vacío; el resto exige
     `attachment_url` **que pertenezca al bucket propio** (prefijo de URL de Supabase) para que
     nadie inyecte URLs externas.
   - `last_message` de la conversación: guardar un placeholder legible — `📷 Foto`, `🎥 Vídeo`,
     `🎤 Audio` (o el caption si lo hay).

3. **Borrado**: al eliminar una conversación (o en un futuro "eliminar mensaje"), borrar los
   adjuntos huérfanos de Supabase (existe precedente en `limpiarImagenesHuerfanas.ts`).

### 2.3 Frontend

1. **Tipos** (`messaging/types/types.ts`):

   ```ts
   export type MessageType = 'text' | 'image' | 'video' | 'audio';
   // Message: + message_type, attachment_url?, attachment_meta?
   ```

2. **`messagingService.ts`**: `subirAdjunto(conversationId, file): Promise<{url, meta}>`
   con `FormData` y barra de progreso vía `XMLHttpRequest` (fetch no da progreso de subida).

3. **`EntradaMensaje.tsx`** — barra de adjuntos:
   - Botón 📎 → `<input type="file" hidden accept="image/*,video/*">` (un solo input con accept
     dual o dos entradas de menú).
   - Botón 🎤 → grabación con **MediaRecorder** (`audio/webm;codecs=opus`):
     estados `idle → grabando (contador + onda) → preview (reproducir/descartar) → enviar`.
   - Tras elegir archivo: **preview local** (`URL.createObjectURL`) con caption opcional;
     la subida empieza al pulsar enviar, con spinner/porcentaje y posibilidad de cancelar
     (`xhr.abort()`).

4. **`TarjetaMensaje.tsx`** — render por tipo:
   - `image` → miniatura (max-h 280px, object-cover) + clic abre **lightbox** a pantalla completa.
   - `video` → `<video controls preload="metadata">` con poster si hay `thumbnailUrl`.
   - `audio` → reproductor compacto propio (play/pausa + barra + duración); estilo "nota de voz".
   - El preview de respuesta (`reply_to_content`) muestra el placeholder (`📷 Foto`...) cuando
     el mensaje citado no es de texto.

5. **`ConversationList`/`EntradaCodice`**: `last_message` ya llega con placeholder desde el back;
   no requiere cambios.

### Criterios de aceptación
- Enviar foto, vídeo y nota de voz desde desktop y móvil; el receptor los ve en tiempo real.
- Archivo de tipo/tamaño inválido → error claro sin romper el chat.
- Un usuario no participante no puede subir adjuntos a la conversación (403).
- Recargar la página conserva los adjuntos (persistidos en BD + Supabase).

---

## Fase 3 — Grupos

### 3.1 Migración de datos

```sql
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_group   BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS name       VARCHAR(100);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(user_id);

ALTER TABLE conversation_participants
    ADD COLUMN IF NOT EXISTS role VARCHAR(10) NOT NULL DEFAULT 'member';
-- 'owner' | 'admin' | 'member'
```

Las conversaciones existentes quedan como `is_group = false` sin tocar nada.

### 3.2 Backend — API

| Método y ruta | Descripción | Permiso |
|---|---|---|
| `POST /api/mensajes/grupos` `{ name, participant_ids[] }` | Crea grupo (2–50 miembros además del creador). Creador = `owner`. | auth |
| `PATCH /api/mensajes/grupos/:id` `{ name?, avatar }` | Renombrar / cambiar avatar (multipart). | owner/admin |
| `POST /api/mensajes/grupos/:id/participantes` `{ user_ids[] }` | Añadir miembros. | owner/admin |
| `DELETE /api/mensajes/grupos/:id/participantes/:userId` | Expulsar (admin) o **salir** (uno mismo). Si sale el owner → transfiere a admin más antiguo o disuelve si queda vacío. | ver descripción |
| `PATCH /api/mensajes/grupos/:id/participantes/:userId` `{ role }` | Promocionar/degradar admin. | owner |

**Cambios en lo existente:**

- `crearConversacion` (1-a-1): al buscar conversación compartida, **filtrar `is_group = false`**.
  Hoy el lookup encontraría un grupo donde estén ambos y lo devolvería como chat directo — es el
  bug nº 1 a evitar.
- `obtenerConversaciones`: si `is_group`, devolver `{ is_group, name, avatar_url, participant_count }`
  en lugar del `participant` único. El shape del front pasa a ser una unión discriminada.
- **Mensajes de sistema**: eventos de grupo ("X añadió a Y", "Y salió") como mensajes con
  `message_type: 'system'` — se renderizan centrados y en gris, no cuentan como no-leídos.

### 3.3 Backend — Socket.IO

- `joinUserConversationRooms` ya une por `conversation_id` → los grupos funcionan sin cambios
  en el envío (el room ya es multiusuario).
- Al **añadir** a alguien a un grupo: emitir `new_conversation` a su room de usuario **y** unir
  su socket activo al room (`io.in(userId).socketsJoin(conversationId)`).
- Al **expulsar/salir**: `io.in(userId).socketsLeave(conversationId)` + evento
  `removed_from_group` para que el front cierre la ventana si la tenía abierta.
- `typing` en grupos: el evento ya lleva `user_id`; el front muestra "Freya está escribiendo…"
  (resolver username con la lista de participantes) y agrega si hay varios.
- `mark_read`: sin cambios (unread por participante ya es per-user).

### 3.4 Frontend

1. **Tipos**: `Conversation` pasa a
   `{ is_group: false, participant } | { is_group: true, name, avatar_url, participants[] }`
   (unión discriminada para que TS obligue a manejar ambos casos).
2. **Crear grupo**: extender `UserSearchModal` a selección múltiple (chips de usuarios
   seleccionados) + campo nombre → botón "Crear grupo".
3. **`EntradaCodice`**: si es grupo, mostrar avatar de grupo (o iniciales), nombre, y en el
   preview del último mensaje el prefijo del autor ("Loki: 📷 Foto").
4. **`VentanaCodice`** (cabecera): nombre del grupo + "N miembros"; clic abre **panel de info**
   (lista de miembros con roles, añadir/expulsar según permisos, renombrar, salir del grupo).
5. **`TarjetaMensaje`**: en grupos, mostrar **username + avatar del autor** encima de cada
   burbuja ajena (en 1-a-1 no hace falta).
6. **Mensajes de sistema**: render centrado, sin burbuja.

### Criterios de aceptación
- Crear un grupo de 3+ usuarios; todos lo ven aparecer en tiempo real sin recargar.
- Solo owner/admin puede renombrar, añadir y expulsar; un member solo puede salir.
- Crear un chat 1-a-1 con alguien con quien compartes grupo **no** reutiliza el grupo.
- Los no-leídos y el "está escribiendo" funcionan por usuario dentro del grupo.
- Las fases 2 y 3 componen: se pueden mandar fotos/audios/vídeos dentro de un grupo.

---

## Orden recomendado y estimación

| # | Fase | Esfuerzo | Dependencias |
|---|---|---|---|
| 1 | Autofocus respuesta | ~1 h | — |
| 2 | Adjuntos (back + front) | 2–3 días | ServicioStorage (ya existe) |
| 3 | Grupos (back + front) | 3–4 días | Fase 2 solo si se quieren adjuntos en grupos desde el día 1 |

Riesgos a vigilar:
- **MediaRecorder en iOS Safari**: graba `audio/mp4` en lugar de webm — detectar
  `MediaRecorder.isTypeSupported` y aceptar ambos contenedores en el back.
- **Límite de body**: revisar `express.json()`/multer y el límite del proxy (Render/Vercel)
  para los 50 MB de vídeo; si aprieta, bajar el límite o subir directo a Supabase con URL firmada.
- **Migración del shape de `Conversation`** en el front: hacerla primero con `is_group` opcional
  y default `false` para no romper `FloatingChat` ni la lista mientras se desarrolla.
