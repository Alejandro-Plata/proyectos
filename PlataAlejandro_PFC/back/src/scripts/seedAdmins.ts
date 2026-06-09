import { db } from '../config/db.js';
import bcrypt from 'bcrypt';
import { Usuario } from '../modelos/Modelos.js';
import { RolUsuario } from '../types/types.js';

async function run() {
    await db.authenticate();

    const passwordHash = await bcrypt.hash('123456', 10);

    const users = [
        { username: 'admin',     email: 'admin@plata.local',     password: passwordHash, role: RolUsuario.ADMIN },
        { username: 'moderador', email: 'moderador@plata.local', password: passwordHash, role: RolUsuario.MODERADOR },
    ];

    for (const data of users) {
        const existing = await Usuario.findOne({ where: { username: data.username } });
        
        if (existing) continue;
        
        await Usuario.create(data as any);
    }

    await db.close();
}

run().catch(err => { console.error(err); process.exit(1); });

