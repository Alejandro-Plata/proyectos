import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/db.js';
import { Usuario, Logro, NotaUsuario, Publicacion } from '../modelos/Modelos.js';
import { getSupabase, BUCKET } from '../config/supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME: Record<string, string> = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif',
};

// Captura URLs de imágenes subidas: opcional host (http://...) + /uploads/<carpeta>/<archivo>
const RE_UPLOADS = /(?:https?:\/\/[^"'\s)]*?)?\/uploads\/(?:notes|posts|avatars|emblems)\/[^"'\s)]+/g;

// Caché ruta-relativa -> URL pública de Supabase (evita resubir el mismo archivo).
const cache = new Map<string, string | null>();

/** Sube un archivo local '/uploads/<carpeta>/<archivo>' a Supabase y devuelve la URL pública. */
async function migrar(rutaRelativa: string): Promise<string | null> {
    if (cache.has(rutaRelativa)) return cache.get(rutaRelativa)!;

    const local = path.join(__dirname, '../../public', rutaRelativa); // public/uploads/...
    if (!fs.existsSync(local)) {
        console.warn('⚠️  No existe en disco, se omite:', rutaRelativa);
        cache.set(rutaRelativa, null);
        return null;
    }
    const ruta = rutaRelativa.replace(/^\/uploads\//, ''); // emblems/xxx.png
    const buffer = fs.readFileSync(local);
    const ext = path.extname(local).toLowerCase();

    const { error } = await getSupabase().storage.from(BUCKET).upload(ruta, buffer, {
        contentType: MIME[ext] || 'application/octet-stream',
        upsert: true,
    });
    if (error) { console.error('❌ Error subiendo', ruta, '-', error.message); cache.set(rutaRelativa, null); return null; }

    const url = getSupabase().storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
    cache.set(rutaRelativa, url);
    return url;
}

/**
 * Recorre cualquier valor (string u objeto/array JSON), sube las imágenes /uploads
 * que encuentre y devuelve el valor con las URLs reemplazadas por las de Supabase.
 */
async function migrarUrlsEn<T>(valor: T): Promise<{ changed: boolean; value: T }> {
    if (valor == null) return { changed: false, value: valor };

    let json = JSON.stringify(valor);
    const tokens = [...new Set([...json.matchAll(RE_UPLOADS)].map(m => m[0]))];
    if (tokens.length === 0) return { changed: false, value: valor };

    let changed = false;
    for (const token of tokens) {
        const rel = token.slice(token.indexOf('/uploads/')); // quita posible host
        const nueva = await migrar(rel);
        if (nueva) {
            json = json.split(token).join(nueva); // reemplaza todas las ocurrencias (literal)
            changed = true;
        }
    }
    return { changed, value: changed ? (JSON.parse(json) as T) : valor };
}

async function run() {
    await db.authenticate();

    // --- Avatares (columna dedicada) ---
    for (const u of (await Usuario.findAll()) as any[]) {
        if (typeof u.avatar_url === 'string' && u.avatar_url.includes('/uploads/')) {
            const rel = u.avatar_url.slice(u.avatar_url.indexOf('/uploads/'));
            const nueva = await migrar(rel);
            if (nueva) { u.avatar_url = nueva; await u.save(); console.log('✅ Avatar →', nueva); }
        }
    }

    // --- Escudos de logros (columna dedicada) ---
    for (const l of (await Logro.findAll()) as any[]) {
        if (typeof l.emblem_url === 'string' && l.emblem_url.includes('/uploads/')) {
            const rel = l.emblem_url.slice(l.emblem_url.indexOf('/uploads/'));
            const nueva = await migrar(rel);
            if (nueva) { l.emblem_url = nueva; await l.save(); console.log('✅ Escudo →', nueva); }
        }
    }

    // --- Imágenes embebidas en el contenido de NOTAS (content JSONB + description) ---
    for (const n of (await NotaUsuario.findAll()) as any[]) {
        let dirty = false;

        const contenido = await migrarUrlsEn(n.content);
        if (contenido.changed) { n.content = contenido.value; n.changed('content', true); dirty = true; }

        const desc = await migrarUrlsEn(n.description);
        if (desc.changed) { n.description = desc.value; dirty = true; }

        if (dirty) { await n.save(); console.log('✅ Nota migrada:', n.note_id ?? n.id); }
    }

    // --- Imágenes embebidas en el contenido de PUBLICACIONES (content JSONB) ---
    for (const p of (await Publicacion.findAll()) as any[]) {
        const contenido = await migrarUrlsEn(p.content);
        if (contenido.changed) {
            p.content = contenido.value;
            p.changed('content', true);
            await p.save();
            console.log('✅ Publicación migrada:', p.post_id);
        }
    }

    await db.close();
    console.log('\n✅ Migración completada.');
}

run().catch(err => { console.error(err); process.exit(1); });
