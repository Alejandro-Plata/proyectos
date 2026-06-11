import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from './config/passport.js';
import { db } from './config/db.js';
import rutaAuth from './rutas/rutaAuth.js';
import rutaPerfil from './rutas/rutaPerfil.js';
import rutaNota from './rutas/rutaNota.js';
import rutaMensaje from './rutas/rutaMensaje.js';
import rutaReto from './rutas/rutaReto.js';
import rutaPublicacion from './rutas/rutaPublicacion.js';
import rutaAcademia from './rutas/rutaAcademia.js';
import rutaBusquedaUsuario from './rutas/rutaBusquedaUsuario.js';
import rutaAdmin from './rutas/rutaAdmin.js';
import rutaAsistente from './rutas/rutaAsistente.js';
import rutaXP from './rutas/rutaXP.js';
import rutaLogros from './rutas/rutaLogros.js';
import rutaPublica from './rutas/rutaPublica.js';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function conectarBD(retries = 5, delayMs = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await db.authenticate();
            await db.sync({ alter: true });
            return;
        } catch (error) {
            console.error(`Error BD (intento ${attempt}/${retries}):`, error);
            if (attempt < retries) {
                await new Promise(r => setTimeout(r, delayMs));
            }
        }
    }
    console.error("No se pudo conectar a la base de datos tras varios intentos.");
}

const app = express();

const ORIGENES_PERMITIDOS = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (ORIGENES_PERMITIDOS.includes(origin)) return callback(null, true);
        callback(null, false);
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Swagger UI 
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api/v1/auth', rutaAuth);
app.use('/api/v1/me', rutaPerfil);
app.use('/api/v1/notes', rutaNota);
app.use('/api/v1/messages', rutaMensaje);
app.use('/api/v1/challenges', rutaReto);
app.use('/api/v1/posts', rutaPublicacion);
app.use('/api/v1/academy', rutaAcademia);
app.use('/api/v1/users', rutaBusquedaUsuario);
app.use('/api/v1/admin', rutaAdmin);
app.use('/api/v1/assistant', rutaAsistente);
app.use('/api/v1/xp', rutaXP);
app.use('/api/v1/achievements', rutaLogros);
app.use('/api/v1/public', rutaPublica);

// Endpoint para comprobar que la API funciona
app.get('/', (_, res) => {
    res.send('API is running correctly');
});

export default app;
