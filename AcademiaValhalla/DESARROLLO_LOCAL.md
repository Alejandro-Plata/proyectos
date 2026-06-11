# Arranque en local — Academia Valhalla

## Requisitos previos

- [Node.js](https://nodejs.org/) v20 o superior
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para la base de datos)
- Git

---

## 1. Clonar los repositorios

```bash
git clone https://github.com/Alexssss40/academia-valhalla-backend.git back
git clone https://github.com/Alexssss40/academia-valhalla-frontend.git front
```

---

## 2. Base de datos (PostgreSQL con Docker)

Desde la raíz del proyecto (donde está el `docker-compose.yml`):

```bash
docker compose up -d
```

Esto levanta PostgreSQL en `localhost:5432` con:
- **Usuario:** `postgres`
- **Contraseña:** `postgres`
- **Base de datos:** `plata_pfc`

Para pararlo: `docker compose down`

---

## 3. Backend

### 3.1 Instalar dependencias

```bash
cd back
npm install
```

### 3.2 Variables de entorno

Crea el archivo `back/.env` con el siguiente contenido:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/plata_pfc
JWT_SECRET=tu_clave_secreta

# Google OAuth — https://console.cloud.google.com
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# GitHub OAuth — https://github.com/settings/developers
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/v1/auth/github/callback

FRONTEND_URL=http://localhost:5173

# IA (Groq)
GROQ_API_KEY=tu_groq_api_key

# Base de datos SSL (false en local)
DB_SSL=false

# SMTP (correo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password

# Judge0 (ejecución de código)
JUDGE0_URL=https://judge029.p.rapidapi.com
JUDGE0_AUTH_TOKEN=tu_judge0_token
JUDGE0_AUTH_HEADER=X-RapidAPI-Key
JUDGE0_WAIT_SUPPORTED=true
```

### 3.3 Scripts de seed (primera vez)

Poblar la base de datos con administrador, logros y misiones:

```bash
npm run seed:admins  # Crea usuario admin y moderador
npm run seed:logros  # Crea los logros
npm run seed:retos   # Crea todas las misiones (básicas y avanzadas)
```

O todos de una vez:

```bash
npm run seed
```

Las credenciales del admin creado son:
- **Usuario:** `admin` / **Contraseña:** `123456`
- **Usuario:** `moderador` / **Contraseña:** `123456`

### 3.4 Arrancar el servidor

```bash
npm run build
npm run dev
```

El backend queda disponible en `http://localhost:3000`.  
Documentación Swagger: `http://localhost:3000/api/docs`

---

## 4. Frontend

### 4.1 Instalar dependencias

```bash
cd front
npm install
```

### 4.2 Variables de entorno

Crea el archivo `front/.env.local`:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

### 4.3 Arrancar el cliente

```bash
npm run build
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## 5. Resumen de comandos

| Acción | Comando |
|--------|---------|
| Levantar BD | `docker compose up -d` |
| Arrancar backend | `cd back && npm run dev` |
| Arrancar frontend | `cd front && npm run dev` |
| Seed completo | `cd back && npm run seed` |
| Parar BD | `docker compose down` |

---

## 6. Scripts disponibles en el backend

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor en modo desarrollo con hot-reload |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm run start` | Arranca el servidor compilado (producción) |
| `npm run seed` | Ejecuta todos los seeders en orden |
| `npm run seed:admins` | Crea usuarios admin y moderador |
| `npm run seed:logros` | Crea los logros de la plataforma |
| `npm run seed:retos` | Crea todas las misiones (básicas y avanzadas) |
| `npm run migrate:enum-logros` | Migración del enum de logros |
