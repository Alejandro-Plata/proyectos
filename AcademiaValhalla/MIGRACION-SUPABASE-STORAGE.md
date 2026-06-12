# Migración de imágenes a Supabase Storage — Academia Valhalla

## Por qué

Hoy las imágenes (avatares, escudos de logros, imágenes de notas y posts) se guardan en el **disco local** del backend:

- `config/subidaArchivos.ts` usa `multer.diskStorage` → `public/uploads/{avatars,emblems,notes,posts}/`.
- En la BD se guarda la ruta relativa `/uploads/emblems/<archivo>`.
- `server.ts` las sirve con `express.static('/uploads')`.
- El front (`utils/getAvatarUrl.ts`) prefija esas rutas con la URL del backend.

**Problema:** en Render (plan free) el disco es **efímero**. En cada redeploy o reinicio se borra `public/uploads/`, así que todas las imágenes subidas desaparecen. La solución es subirlas a **Supabase Storage** (gratis, persistente) y guardar en BD la **URL pública absoluta**.

> Ventaja: el front ya está preparado. `getAvatarUrl`/`getEmblemUrl`/`resolveAssetUrl` solo prefijan las rutas que empiezan por `/uploads`; cualquier **URL absoluta** (las de Supabase) se devuelve tal cual. Así que **el front no necesita cambios** para imágenes nuevas.

---

## 1. Crear el bucket en Supabase

1. Entra en https://supabase.com → tu proyecto (o crea uno nuevo, gratis).
2. **Storage → New bucket**:
   - Name: `valhalla`
   - **Public bucket: ✅ activado** (para que las imágenes se lean sin firmar URLs).
   - File size limit: 5 MB (coincide con el límite de multer).
3. (Opcional) Crea "carpetas" lógicas subiendo a prefijos `avatars/`, `emblems/`, `notes/`, `posts/` — no hace falta crearlas a mano, se crean al subir.

### Políticas (RLS)
El backend subirá con la **service_role key**, que **salta las RLS**, así que no necesitas políticas de escritura. Para lectura, al ser bucket **público**, ya es accesible. (Si prefieres bucket privado, habría que generar signed URLs; no recomendado para este caso.)

---

## 2. Credenciales y variables de entorno

En Supabase → **Project Settings → API**, copia:
- **Project URL** → `SUPABASE_URL`
- **service_role key** (¡secreta, solo backend!) → `SUPABASE_SERVICE_ROLE_KEY`

Añádelas en `back/.env` (local) y en **Render → valhalla-back → Environment**:

```
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service_role, NO la anon)
SUPABASE_BUCKET=valhalla
```

> Nunca expongas la `service_role` key en el front. Aquí solo vive en el backend.

---

## 3. Instalar el SDK

```bash
cd back
npm install @supabase/supabase-js
```

---

## 4. Cliente de Supabase

Crea `back/src/config/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

export const BUCKET = process.env.SUPABASE_BUCKET || 'valhalla';
```

---

## 5. Servicio de almacenamiento

Crea `back/src/servicios/ServicioStorage.ts`:

```ts
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { supabase, BUCKET } from '../config/supabase.js';

/**
 * Sube un buffer a Supabase Storage y devuelve la URL pública.
 * @param carpeta  'avatars' | 'emblems' | 'notes' | 'posts'
 */
export async function subirArchivo(
    file: Express.Multer.File,
    carpeta: string,
    prefijo: string
): Promise<string> {
    const ext = path.extname(file.originalname) || '.png';
    const ruta = `${carpeta}/${prefijo}-${uuidv4()}${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(ruta, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

    if (error) throw new Error(`Error subiendo a Supabase: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta);
    return data.publicUrl; // URL absoluta https://xxx.supabase.co/storage/v1/object/public/valhalla/...
}

/** Borra un archivo a partir de su URL pública (para reemplazos). */
export async function eliminarArchivo(publicUrl?: string | null): Promise<void> {
    if (!publicUrl) return;
    const marcador = `/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marcador);
    if (idx === -1) return; // no es una URL de nuestro bucket
    const ruta = publicUrl.slice(idx + marcador.length);
    await supabase.storage.from(BUCKET).remove([ruta]);
}
```

---

## 6. Cambiar multer a memoria

En `config/subidaArchivos.ts`, sustituye **`diskStorage` por `memoryStorage`** (ya no escribimos en disco; el archivo queda en `req.file.buffer`). Puedes borrar la creación de carpetas y los `diskStorage`, dejándolo así:

```ts
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Formato de imagen no permitido. Usa PNG, JPG, WebP, SVG o GIF.'));
};

const opciones = { storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } };

export const subirEscudo      = multer(opciones);
export const subirAvatar      = multer(opciones);
export const subirImagenNota  = multer(opciones);
export const subirImagenPost  = multer(opciones);
```

> Los nombres exportados se mantienen, así que las rutas que ya los usan (`.single('...')`) no cambian.

---

## 7. Actualizar los controladores

Busca en `back/src` todas las ocurrencias de **`/uploads/`** (donde se construye la URL) y de **`fs.unlink` / borrado de archivos**. Reemplaza el patrón "guardar ruta de disco" por "subir a Supabase y guardar la URL devuelta".

**Antes** (ej. escudo de logro en `ControladorAdmin.ts`):
```ts
const emblem_url = req.file ? `/uploads/emblems/${req.file.filename}` : null;
```

**Después:**
```ts
import { subirArchivo, eliminarArchivo } from '../servicios/ServicioStorage.js';

const emblem_url = req.file ? await subirArchivo(req.file, 'emblems', 'emblem') : null;
```

**Reemplazo de imagen** (borrar la anterior). Antes se hacía `fs.unlink` con `path.join(__dirname, '../../public', logro.emblem_url)`. Ahora:
```ts
if (logro.emblem_url) {
    await eliminarArchivo(logro.emblem_url);
}
```

Aplica el mismo patrón en cada punto de subida (usa el `carpeta`/`prefijo` correspondiente):

| Recurso | Controlador (buscar `/uploads/`) | carpeta | prefijo |
|---|---|---|---|
| Escudo de logro | `ControladorAdmin.ts` | `emblems` | `emblem` |
| Avatar | controlador de perfil (`me/profile`) | `avatars` | `avatar` |
| Imagen de nota | controlador de notas | `notes` | `note` |
| Imagen de post | controlador de publicaciones | `posts` | `post` |

> Como `subirArchivo` es asíncrono, asegúrate de que el handler sea `async` y uses `await`.

---

## 8. Quitar el servido estático (opcional)

En `server.ts` ya no hace falta servir el disco. Puedes eliminar:
```ts
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
```
Déjalo si aún tienes URLs antiguas `/uploads/...` en BD sin migrar (ver paso 9).

---

## 9. Migrar las imágenes existentes

Si en producción ya se perdieron (disco efímero), solo migra lo que tengas en local. Crea `back/src/scripts/migrarImagenesSupabase.ts`:

```ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/db.js';
import { Usuario, Logro } from '../modelos/Modelos.js';
import { supabase, BUCKET } from '../config/supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS = path.join(__dirname, '../../public/uploads');

const mime: Record<string, string> = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif',
};

// Sube un archivo local /uploads/<carpeta>/<file> y devuelve su URL pública.
async function migrar(rutaRelativa: string): Promise<string | null> {
    const local = path.join(__dirname, '../../public', rutaRelativa); // public/uploads/...
    if (!fs.existsSync(local)) { console.warn('No existe:', rutaRelativa); return null; }
    const ruta = rutaRelativa.replace(/^\/uploads\//, ''); // emblems/xxx.png
    const buffer = fs.readFileSync(local);
    const ext = path.extname(local).toLowerCase();
    const { error } = await supabase.storage.from(BUCKET).upload(ruta, buffer, {
        contentType: mime[ext] || 'application/octet-stream', upsert: true,
    });
    if (error) { console.error('Error', ruta, error.message); return null; }
    return supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
}

async function run() {
    await db.authenticate();

    // Avatares
    const usuarios = await Usuario.findAll();
    for (const u of usuarios as any[]) {
        if (u.avatar_url?.startsWith('/uploads')) {
            const nueva = await migrar(u.avatar_url);
            if (nueva) { u.avatar_url = nueva; await u.save(); console.log('Avatar →', nueva); }
        }
    }

    // Escudos de logros
    const logros = await Logro.findAll();
    for (const l of logros as any[]) {
        if (l.emblem_url?.startsWith('/uploads')) {
            const nueva = await migrar(l.emblem_url);
            if (nueva) { l.emblem_url = nueva; await l.save(); console.log('Escudo →', nueva); }
        }
    }

    // TODO: repetir para imágenes de notas/posts si guardan rutas /uploads en sus tablas.

    await db.close();
    console.log('✅ Migración completada.');
}

run().catch(e => { console.error(e); process.exit(1); });
```

Ejecútalo **en local** apuntando `DATABASE_URL` a la BD de Render y con las credenciales de Supabase en el `.env`:

```powershell
cd back
npx tsx src/scripts/migrarImagenesSupabase.ts
```

> Es idempotente con `upsert: true`. Tras migrar, ya puedes quitar el `express.static('/uploads')`.

---

## 10. Frontend

No requiere cambios: `getAvatarUrl`, `getEmblemUrl` y `resolveAssetUrl` devuelven intactas las URLs absolutas (las de Supabase no empiezan por `/uploads`). Cuando toda la BD esté migrada, opcionalmente puedes simplificar esos helpers para que solo hagan *passthrough* de la URL.

---

## 11. Checklist de verificación

- [ ] Bucket `valhalla` público creado.
- [ ] `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET` en Render y en `.env` local.
- [ ] `npm install @supabase/supabase-js` hecho y commiteado el `package.json`/`package-lock.json`.
- [ ] `multer.memoryStorage` en `subidaArchivos.ts`.
- [ ] Cada subida usa `subirArchivo(...)` y guarda la URL pública; los reemplazos usan `eliminarArchivo(...)`.
- [ ] Subir un avatar y un escudo nuevos → la URL en BD empieza por `https://...supabase.co/storage/...`.
- [ ] Las imágenes se ven en el front (avatar, showcase de logros).
- [ ] (Si aplica) script de migración ejecutado para imágenes antiguas.
- [ ] Redeploy del backend en Render y prueba de que **tras un reinicio** las imágenes siguen visibles.

---

## Notas

- El plan free de Supabase Storage incluye **1 GB** y ancho de banda generoso: de sobra para avatares/escudos.
- `service_role` salta RLS: úsala **solo** en el backend.
- Mantén el `fileFilter` y el límite de 5 MB para validar en el backend antes de subir.
