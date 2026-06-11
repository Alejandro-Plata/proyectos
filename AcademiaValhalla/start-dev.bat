@echo off
setlocal enabledelayedexpansion

set "ROOT=%~dp0"
set "BACK=%ROOT%back"
set "FRONT=%ROOT%front"

echo ==========================================
echo  Arrancando entorno de desarrollo local
echo ==========================================

REM --- 1. Arrancar Docker Desktop si no esta corriendo ---
echo.
echo [1/3] Comprobando Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
    echo     Docker no responde. Iniciando Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo     Esperando 30 segundos a que Docker arranque...
    timeout /t 30 /nobreak >nul
) else (
    echo     Docker ya esta corriendo.
)

REM --- 2. Levantar el contenedor de PostgreSQL ---
echo.
echo [2/3] Levantando base de datos (PostgreSQL via Docker)...
cd /d "%ROOT%"
echo     Ejecutando: docker compose up -d
docker compose up -d
if errorlevel 1 (
    echo     ERROR: No se pudo levantar el contenedor de la base de datos.
    echo     Intenta ejecutar manualmente: docker compose up -d
    timeout /t 5 /nobreak >nul
) else (
    echo     Base de datos lista en localhost:5432
)

REM --- 3. Abrir dos ventanas PowerShell ---
echo.
echo [3/3] Abriendo Backend y Frontend en dos ventanas...

start "Backend" powershell -NoExit -Command "cd '%BACK%'; npm run dev"
timeout /t 2 /nobreak >nul
start "Frontend" powershell -NoExit -Command "cd '%FRONT%'; npm run dev"

echo.
echo ==========================================
echo  Todo arrancado:
echo    - Ventana Backend:   http://localhost:3000
echo    - Ventana Frontend:  http://localhost:5173
echo    - DB:                localhost:5432 (plata_pfc)
echo ==========================================
