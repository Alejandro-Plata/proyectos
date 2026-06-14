# CineXplora

Aplicacion **Android nativa** para explorar, descubrir y hacer seguimiento de peliculas y series.
Desarrollada con el stack oficial de Android, con interfaz adaptada a orientacion vertical y horizontal,
soporte multiidioma (espanol/ingles) y tema claro/oscuro.

## Caracteristicas

- **Explorar**: Navegar peliculas y series populares con filtrado por genero y opciones de ordenacion.
- **Lista de pendientes**: Guardar peliculas y series para ver mas tarde.
- **Seguimiento**: Registrar contenido visto con fecha, valoracion personal y foto de recuerdo.
- **Actores favoritos**: Guardar y consultar actores con su filmografia completa.
- **Busqueda global**: Buscar por titulo en peliculas y series.
- **Autenticacion**: Login/registro con email y contrasena, ademas de Google Sign-In.
- **Perfiles de usuario**: Configuracion de nombre, avatar, tema e idioma.
- **Detalle completo**: Sinopsis, reparto, equipo tecnico, trailers y datos de produccion.

## Stack

- **Lenguaje:** Java
- **Plataforma:** Android SDK (API 24 - 36)
- **Arquitectura:** MVVM (ViewModel + LiveData)
- **UI:** Material Design 3 · Navigation Component · ViewPager2
- **Networking:** Retrofit 2.9.0 · OkHttp 4.12.0 · Gson
- **Imagenes:** Glide 4.15.1
- **Backend:**
  - Firebase Authentication (email + Google)
  - Firebase Firestore (perfiles, tracking, favoritos, pendientes)
  - Supabase Storage (fotos de perfil y de seguimiento)
  - TMDB API v3 (datos de peliculas y series)
- **Build:** Gradle con Kotlin DSL

## Estructura

```
CineXplora/
├── app/
│   └── src/
│       ├── main/
│       │   ├── java/es/iesagora/cinexplora/
│       │   │   ├── view/              # Fragments y Activities
│       │   │   │   ├── auth/          # Login, registro, recuperacion
│       │   │   │   ├── explore/       # Explorar peliculas y series
│       │   │   │   ├── details/       # Detalle de pelicula/serie/persona
│       │   │   │   ├── watchlist/     # Lista de pendientes
│       │   │   │   ├── tracking/      # Seguimiento de contenido visto
│       │   │   │   └── favorites/     # Actores favoritos
│       │   │   ├── controller/
│       │   │   │   ├── repository/    # Acceso a datos (Firebase, TMDB, Supabase)
│       │   │   │   └── viewmodel/     # ViewModels MVVM
│       │   │   ├── model/             # Modelos de datos
│       │   │   │   ├── request/       # Modelos de peticion
│       │   │   │   ├── response/      # Modelos de respuesta
│       │   │   │   └── states/        # Estados (Resource, AuthState)
│       │   │   ├── network/           # Retrofit, interceptores, clientes
│       │   │   ├── recyclerview/      # Adapters para listas
│       │   │   └── utils/             # Utilidades
│       │   ├── res/
│       │   │   ├── layout/            # Vistas (vertical)
│       │   │   ├── layout-land/       # Vistas (horizontal)
│       │   │   ├── drawable/          # Recursos graficos
│       │   │   ├── menu/              # Menus
│       │   │   ├── navigation/        # Grafo de navegacion
│       │   │   ├── values/            # Strings, colores, temas (ingles)
│       │   │   └── values-es/         # Strings en espanol
│       │   └── AndroidManifest.xml
│       ├── test/                      # Tests unitarios
│       └── androidTest/               # Tests instrumentados
├── build.gradle.kts
└── settings.gradle.kts
```

## Ejecucion

1. Abre el proyecto en **Android Studio**.
2. Sincroniza Gradle (se hace automaticamente al abrir).
3. Configura las claves de API en `local.properties`:
   - TMDB API key
   - Firebase (archivo `google-services.json`)
   - Supabase URL y key
4. Conecta un dispositivo o inicia un emulador.
5. Pulsa **Run** o desde terminal:

```bash
./gradlew installDebug
```

## Requisitos

- Android Studio (version reciente)
- JDK 17+
- Android SDK (API 24 minimo)
- Cuenta de Firebase con Firestore y Authentication habilitados
- Clave de API de TMDB
