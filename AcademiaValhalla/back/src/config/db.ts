import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv';
import { ContenidoAcademia, Reto, LenguajeReto, ComentarioUsuario, Publicacion, EtiquetaPublicacion, LenguajeProgramacion, TokenRefresh, Etiqueta, Usuario, ProgresoRetoUsuario, NotaUsuario, Voto, EtiquetaReto, Conversacion, ParticipanteConversacion, Mensaje, SolicitudContenido, ReportePublicacion, Logro, LogroUsuario, CodigoRestablecimiento } from '../modelos/Modelos.js';
import pg from 'pg'
dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

// SSL desactivado solo si DB_SSL=false o si la URL apunta a localhost
function requiresSsl(url: string): boolean {
    if (process.env.DB_SSL === 'false') return false;
    if (process.env.DB_SSL === 'true')  return true;
    
    return !url.includes('localhost') && !url.includes('127.0.0.1');
}

const sslConfig = requiresSsl(databaseUrl)
    ? { rejectUnauthorized: false }
    : false;

export const db = new Sequelize(databaseUrl, {
    models: [EtiquetaReto, EtiquetaPublicacion, LenguajeReto, Usuario, TokenRefresh, ContenidoAcademia, NotaUsuario, Reto, LenguajeProgramacion, ProgresoRetoUsuario, Publicacion, ComentarioUsuario, Voto, Etiqueta, Conversacion, ParticipanteConversacion, Mensaje, SolicitudContenido, ReportePublicacion, Logro, LogroUsuario, CodigoRestablecimiento],
    logging: false,
    dialectOptions: {
        ssl: sslConfig,
        keepAlive: true,
        keepAliveInitialDelayMillis: 0,
        connectTimeout: 30_000,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30_000,
        idle: 120_000,
        evict: 30_000,
    },
    dialectModule: pg,
})
