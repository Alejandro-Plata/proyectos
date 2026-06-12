/**
 * Limpia de la BD las URLs de imágenes rotas (/uploads/... cuyos archivos se
 * perdieron en el disco efímero de Render y no existen en local).
 *
 * - Avatares: se ponen a NULL → el front cae al avatar generado (dicebear).
 * - Notas: se eliminan los bloques type 'image' con URL /uploads (irrecuperables).
 * - Posts: ídem sobre su content.
 *
 * Uso (apuntando DATABASE_URL a la BD de producción en .env):
 *   npx tsx src/scripts/limpiarUrlsRotas.ts          → solo muestra lo que haría (dry-run)
 *   npx tsx src/scripts/limpiarUrlsRotas.ts --apply  → aplica los cambios
 */
import { db } from '../config/db.js';
import { Usuario, NotaUsuario, Publicacion } from '../modelos/Modelos.js';

const APPLY = process.argv.includes('--apply');
const esRota = (url: unknown): boolean =>
    typeof url === 'string' && (url.includes('/uploads/') || url.startsWith('blob:'));

async function run() {
    await db.authenticate();
    console.log(APPLY ? '⚠️  MODO APLICAR\n' : 'ℹ️  DRY-RUN (usa --apply para ejecutar de verdad)\n');

    // --- Avatares ---
    for (const u of (await Usuario.findAll()) as any[]) {
        if (esRota(u.avatar_url)) {
            console.log(`Avatar roto → NULL: ${u.username} (${u.avatar_url.slice(0, 80)})`);
            if (APPLY) { u.avatar_url = null; await u.save(); }
        }
    }

    // --- Bloques imagen en notas ---
    for (const n of (await NotaUsuario.findAll()) as any[]) {
        const bloques: any[] = (typeof n.content === 'string' ? JSON.parse(n.content) : n.content) ?? [];
        const limpios = bloques.filter(b => !(b?.type === 'image' && esRota(b.value)));
        if (limpios.length !== bloques.length) {
            console.log(`Nota "${n.title}": ${bloques.length - limpios.length} imagen(es) rota(s) eliminada(s)`);
            if (APPLY) { n.content = limpios; n.changed('content', true); await n.save(); }
        }
    }

    // --- Bloques imagen en posts ---
    for (const p of (await Publicacion.findAll()) as any[]) {
        const bloques: any[] = (typeof p.content === 'string' ? JSON.parse(p.content) : p.content) ?? [];
        if (!Array.isArray(bloques)) continue;
        const limpios = bloques.filter(b => !(b?.type === 'image' && esRota(b.value)));
        if (limpios.length !== bloques.length) {
            console.log(`Post "${p.title}": ${bloques.length - limpios.length} imagen(es) rota(s) eliminada(s)`);
            if (APPLY) { p.content = limpios; p.changed('content', true); await p.save(); }
        }
    }

    await db.close();
    console.log('\n✅ Hecho.');
}

run().catch(e => { console.error(e); process.exit(1); });
