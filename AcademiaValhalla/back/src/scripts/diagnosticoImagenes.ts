// Script temporal de diagnóstico: clasifica las URLs de imágenes guardadas en BD.
import { db } from '../config/db.js';
import { QueryTypes } from 'sequelize';

function clasificar(url: string | null): string {
    if (!url) return 'vacía';
    if (url.includes('supabase.co')) return 'SUPABASE OK';
    if (url.includes('/uploads/')) return 'LOCAL ROTA  ';
    if (url.startsWith('blob:')) return 'BLOB (mal)  ';
    return 'externa     ';
}

async function run() {
    await db.authenticate();

    const avatares = await db.query<{ username: string; avatar_url: string | null }>(
        'SELECT username, avatar_url FROM users WHERE avatar_url IS NOT NULL', { type: QueryTypes.SELECT });
    console.log(`=== AVATARES (${avatares.length}) ===`);
    for (const a of avatares) console.log(`  [${clasificar(a.avatar_url)}] ${a.username}: ${a.avatar_url?.slice(0, 95)}`);

    const notas = await db.query<{ note_id: string; title: string; content: any }>(
        'SELECT note_id, title, content FROM user_notes', { type: QueryTypes.SELECT });
    console.log('\n=== IMÁGENES EN NOTAS ===');
    let nImgs = 0;
    for (const n of notas) {
        const bloques = (typeof n.content === 'string' ? JSON.parse(n.content) : n.content) ?? [];
        for (const b of bloques) {
            if (b?.type === 'image' && b.value) {
                nImgs++;
                console.log(`  [${clasificar(b.value)}] (${n.title?.slice(0, 30)}): ${String(b.value).slice(0, 95)}`);
            }
        }
    }
    if (nImgs === 0) console.log('  (ninguna nota tiene bloques de imagen)');

    const posts = await db.query<{ post_id: string; title: string; content: any }>(
        'SELECT post_id, title, content FROM posts', { type: QueryTypes.SELECT });
    console.log('\n=== IMÁGENES EN POSTS ===');
    let pImgs = 0;
    for (const p of posts) {
        const json = JSON.stringify(p.content ?? '');
        const urls = json.match(/https?:[^"\\\s]+|\/uploads\/[^"\\\s]+/g)?.filter(u =>
            u.includes('/uploads/') || u.includes('supabase.co') || u.startsWith('blob:')) ?? [];
        for (const u of urls) {
            pImgs++;
            console.log(`  [${clasificar(u)}] (${p.title?.slice(0, 30)}): ${u.slice(0, 95)}`);
        }
    }
    if (pImgs === 0) console.log('  (ningún post tiene URLs de imagen propias)');

    await db.close();
}

run().catch(e => { console.error(e); process.exit(1); });
