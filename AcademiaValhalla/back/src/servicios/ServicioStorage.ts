import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { getSupabase, BUCKET } from '../config/supabase.js';

/**
 * Sube un archivo (en memoria, vía multer.memoryStorage) a Supabase Storage
 * y devuelve su URL pública absoluta.
 *
 * @param file    req.file de multer (con .buffer, .mimetype, .originalname)
 * @param carpeta 'avatars' | 'emblems' | 'notes' | 'posts'
 * @param prefijo prefijo del nombre de archivo, p. ej. 'avatar'
 */
export async function subirArchivo(
    file: Express.Multer.File,
    carpeta: string,
    prefijo: string
): Promise<string> {
    const ext = path.extname(file.originalname) || '.png';
    const ruta = `${carpeta}/${prefijo}-${uuidv4()}${ext}`;

    // Supabase no acepta parámetros de codec en el Content-Type (ej: "audio/webm;codecs=opus")
    const contentType = file.mimetype.split(';')[0].trim();

    const { error } = await getSupabase()
        .storage
        .from(BUCKET)
        .upload(ruta, file.buffer, {
            contentType,
            upsert: false,
        });

    if (error) throw new Error(`Error subiendo a Supabase: ${error.message}`);

    const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(ruta);
    return data.publicUrl;
}

/**
 * Borra un archivo de Supabase Storage a partir de su URL pública.
 * Ignora silenciosamente URLs que no pertenezcan a nuestro bucket
 * (p. ej. avatares de OAuth o rutas antiguas /uploads sin migrar).
 */
export async function eliminarArchivo(publicUrl?: string | null): Promise<void> {
    if (!publicUrl) return;
    const marcador = `/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marcador);
    if (idx === -1) return;
    const ruta = publicUrl.slice(idx + marcador.length);
    await getSupabase().storage.from(BUCKET).remove([ruta]).catch(() => { /* no bloqueante */ });
}
