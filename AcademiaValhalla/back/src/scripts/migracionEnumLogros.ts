import { db } from '../config/db.js';

async function run() {
    await db.authenticate();

    const nuevosValores = ['post_count', 'post_featured', 'avatar_changed'];

    for (const valor of nuevosValores) {
        try {
            await db.query(
                `ALTER TYPE "enum_achievements_trigger_type" ADD VALUE IF NOT EXISTS '${valor}'`
            );
            console.log(`  ✓ Valor añadido al ENUM: '${valor}'`);
        } catch (err: any) {
            console.warn(`  · No se pudo añadir '${valor}': ${err.message}`);
        }
    }

    await db.close();
    console.log('Migración completada.');
}

run().catch(err => { console.error(err); process.exit(1); });
