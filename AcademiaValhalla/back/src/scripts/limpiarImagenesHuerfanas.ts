/**
 * Limpia de Supabase Storage las imágenes de notes/ y posts/ que ya no están
 * referenciadas en la BD y tienen más de 48 h de antigüedad (margen para
 * borradores en curso).
 *
 * Uso:
 *   npx tsx src/scripts/limpiarImagenesHuerfanas.ts          → dry-run
 *   npx tsx src/scripts/limpiarImagenesHuerfanas.ts --apply  → borra de verdad
 */
import { db } from '../config/db.js';
import { NotaUsuario, Publicacion } from '../modelos/Modelos.js';
import { getSupabase, BUCKET } from '../config/supabase.js';

const APPLY = process.argv.includes('--apply');
const MARGEN_HORAS = 48;
const CARPETAS = ['notes', 'posts'] as const;

async function listarBucket(carpeta: string): Promise<Array<{ name: string; created_at: string }>> {
    const supabase = getSupabase();
    let todos: any[] = [];
    let offset = 0;
    const PAGE = 1000;
    while (true) {
        const { data, error } = await supabase.storage.from(BUCKET).list(carpeta, {
            limit: PAGE, offset, sortBy: { column: 'created_at', order: 'asc' },
        });
        if (error || !data?.length) break;
        todos = todos.concat(data);
        if (data.length < PAGE) break;
        offset += PAGE;
    }
    return todos.map(f => ({ name: `${carpeta}/${f.name}`, created_at: f.created_at ?? '' }));
}

function urlsEnBd(contenido: any): Set<string> {
    const json = JSON.stringify(contenido ?? '');
    const matches = json.match(/https?:\/\/[^"\\]+supabase\.co\/storage\/[^"\\]+/g) ?? [];
    return new Set(matches.map(u => u.replace(/\\\//g, '/')));
}

async function run() {
    await db.authenticate();
    console.log(APPLY ? '⚠️  MODO APLICAR\n' : 'ℹ️  DRY-RUN (usa --apply para borrar)\n');

    // Construir conjunto de URLs referenciadas en BD
    const urlsUsadas = new Set<string>();
    const supabase = getSupabase();

    for (const n of (await NotaUsuario.findAll()) as any[])
        for (const u of urlsEnBd(n.content)) urlsUsadas.add(u);

    for (const p of (await Publicacion.findAll()) as any[])
        for (const u of urlsEnBd(p.content)) urlsUsadas.add(u);

    const ahora = Date.now();
    let borradas = 0;

    for (const carpeta of CARPETAS) {
        const archivos = await listarBucket(carpeta);
        for (const archivo of archivos) {
            const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(archivo.name).data.publicUrl;

            // Comprobar antigüedad
            const edad = archivo.created_at
                ? (ahora - new Date(archivo.created_at).getTime()) / 3_600_000
                : Infinity;

            if (!urlsUsadas.has(publicUrl) && edad > MARGEN_HORAS) {
                console.log(`  Huérfana (${Math.round(edad)}h): ${archivo.name}`);
                if (APPLY) {
                    const { error } = await supabase.storage.from(BUCKET).remove([archivo.name]);
                    if (error) console.error(`    ❌ Error borrando: ${error.message}`);
                    else borradas++;
                } else {
                    borradas++;
                }
            }
        }
    }

    await db.close();
    console.log(`\n✅ ${APPLY ? 'Borradas' : 'Detectadas'}: ${borradas} imágenes huérfanas.`);
}

run().catch(e => { console.error(e); process.exit(1); });
