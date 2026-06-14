# Academia Valhalla

**Proyecto Fin de Ciclo (PFC).** Plataforma web full-stack de aprendizaje de programacion, con
editor de codigo integrado, contenido interactivo, comunicacion en tiempo real e integracion de IA.

## Caracteristicas

- **Editor de codigo integrado** con Monaco Editor.
- **Contenido interactivo 3D** con Three.js y animaciones con GSAP.
- **Tiempo real** mediante Socket.IO (mensajeria, notificaciones, estados de conexion).
- **Integracion de IA** con Groq SDK (asistente inteligente).
- **Autenticacion** local + OAuth con Google y GitHub (Passport + JWT).
- **Sistema de mensajeria** con conversaciones directas y grupales, multimedia (imagenes, audio, video), respuestas y estados de lectura.
- **Almacenamiento de archivos** con Supabase Storage (avatares, adjuntos, imagenes en notas).
- **Gamificacion** con sistema de XP, logros y rachas.
- **Retos de codigo** con niveles de dificultad y categorias.
- **Foro comunitario** con publicaciones, votaciones y moderacion.
- **Notas de estudio** con editor de bloques de contenido.
- **Panel de administracion** para gestion de contenido, usuarios y analiticas.
- **Envio de correos** con Nodemailer.
- **API REST documentada** con Swagger/OpenAPI.

## Stack

**Frontend**
- React 19 · TypeScript · Vite
- TailwindCSS · GSAP · Lucide / Heroicons
- React Router · React Hook Form
- Monaco Editor · Three.js · Socket.IO (cliente)

**Backend**
- Node.js · Express 5 · TypeScript
- Sequelize + PostgreSQL
- Passport (Google / GitHub OAuth) · JWT · bcrypt
- Socket.IO · Nodemailer · Groq SDK
- Supabase (almacenamiento de archivos)
- Multer (subida de archivos)
- Swagger (documentacion de API)

**Infraestructura**
- Docker Compose (PostgreSQL en local)
- Frontend desplegado en Vercel
- Backend desplegado en Vercel
- Base de datos PostgreSQL gestionada
- Almacenamiento en Supabase Storage

## Estructura

```
AcademiaValhalla/
├── front/                         # Cliente React + Vite
│   └── src/
│       ├── app/
│       │   ├── features/          # Modulos funcionales
│       │   │   ├── admin/         # Panel de administracion
│       │   │   ├── asistente/     # Asistente IA
│       │   │   ├── auth/          # Login, registro, OAuth
│       │   │   ├── community/     # Foro y publicaciones
│       │   │   ├── home/          # Perfil y dashboard
│       │   │   ├── messaging/     # Chat y conversaciones
│       │   │   ├── notes/         # Editor de notas
│       │   │   ├── retos/         # Retos de codigo
│       │   │   └── settings/      # Configuracion de usuario
│       │   ├── context/           # Contextos React
│       │   ├── hooks/             # Hooks personalizados
│       │   ├── services/          # Clientes API
│       │   └── components/        # Componentes compartidos
│       └── types/                 # Tipos TypeScript
├── back/                          # API Node + Express
│   └── src/
│       ├── api/                   # Inicializacion API
│       ├── config/                # Configuracion (DB, Supabase, Passport)
│       ├── controladores/         # Handlers de peticiones
│       ├── modelos/               # Modelos Sequelize
│       ├── rutas/                 # Rutas Express
│       ├── servicios/             # Logica de negocio
│       ├── middleware/            # Middleware Express
│       ├── scripts/               # Seeds y migraciones
│       ├── utils/                 # Utilidades
│       ├── docs/                  # Documentacion Swagger
│       └── server.ts              # Punto de entrada
├── docker-compose.yml
├── DESARROLLO_LOCAL.md            # Guia de arranque en local
└── despliegue.md                  # Notas de despliegue
```

## Arranque rapido (local)

> Guia completa en [`DESARROLLO_LOCAL.md`](./DESARROLLO_LOCAL.md).

```bash
# 1. Base de datos
docker compose up -d

# 2. Backend
cd back
npm install
cp .env.example .env   # configura tus variables
npm run dev

# 3. Frontend
cd ../front
npm install
npm run dev
```

## Requisitos

- Node.js v20+
- Docker Desktop (para PostgreSQL)
- Git

> Configura tus variables de entorno (`.env`) antes de arrancar. Nunca subas tus `.env` reales;
> contienen secretos como claves OAuth, JWT, credenciales de correo y keys de Supabase.
