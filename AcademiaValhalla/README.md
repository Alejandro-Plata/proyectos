# 🎓 Academia Valhalla

**Proyecto Fin de Ciclo (PFC).** Plataforma web full-stack de **aprendizaje de programación**, con
editor de código integrado, contenido interactivo, comunicación en tiempo real e integración de IA.

## ✨ Características

- 📝 **Editor de código integrado** con Monaco Editor.
- 🎨 **Contenido interactivo 3D** con Three.js y animaciones con GSAP.
- ⚡ **Tiempo real** mediante Socket.io.
- 🤖 **Integración de IA** con Groq SDK.
- 🔐 **Autenticación** local + **OAuth con Google y GitHub** (Passport + JWT).
- ✉️ Envío de correos con Nodemailer.
- 📚 **API REST documentada** y validada.

## 🛠️ Stack

**Frontend**
- React 19 · TypeScript · Vite
- TailwindCSS · GSAP · Lucide / Heroicons
- React Router · React Hook Form
- Monaco Editor · Three.js · Socket.io (cliente)

**Backend**
- Node.js · Express 5 · TypeScript
- Sequelize + PostgreSQL
- Passport (Google / GitHub OAuth) · JWT · bcrypt
- Socket.io · Nodemailer · Groq SDK
- Swagger (documentación de API)

**Infraestructura**
- Docker Compose (PostgreSQL en local)

## 📁 Estructura

```
PlataAlejandro_PFC/
├── front/                 # Cliente React + Vite
│   └── src/
│       ├── app/
│       └── types/
├── back/                  # API Node + Express
│   └── src/
│       ├── api/  config/  controladores/
│       ├── docs/  middleware/  modelos/
│       ├── rutas/  scripts/  servicios/
│       └── utils/  server.ts
├── docker-compose.yml
├── DESARROLLO_LOCAL.md    # Guía de arranque en local
└── despliegue.md          # Notas de despliegue
```

## ▶️ Arranque rápido (local)

> Guía completa en [`DESARROLLO_LOCAL.md`](./DESARROLLO_LOCAL.md).

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

## ✅ Requisitos

- Node.js v20+
- Docker Desktop (para PostgreSQL)
- Git

> ⚠️ Configura tus variables de entorno (`.env`) antes de arrancar. **Nunca subas tus `.env` reales**;
> usan secretos como claves OAuth, JWT y credenciales de correo.
