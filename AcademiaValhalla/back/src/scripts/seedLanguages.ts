import { db } from '../config/db.js';
import { LenguajeProgramacion } from '../modelos/Modelos.js';

const LANGUAGES = [
    { name: 'javascript', monaco_language_id: 'javascript' },
    { name: 'python',     monaco_language_id: 'python' },
    { name: 'typescript', monaco_language_id: 'typescript' },
    { name: 'java',       monaco_language_id: 'java' },
    { name: 'go',         monaco_language_id: 'go' },
    { name: 'csharp',     monaco_language_id: 'csharp' },
];

async function main() {
    await db.authenticate();

    for (const lang of LANGUAGES) {
        await LenguajeProgramacion.findOrCreate({
            where: { name: lang.name },
            defaults: lang,
        });
    }

    await db.close();
}

main().catch(err => { console.error(err); process.exit(1); });
