# 🎬 CineXplora

Aplicación **Android nativa** para explorar y descubrir contenido de cine. Desarrollada con el
stack oficial de Android, con interfaz adaptada tanto a orientación **vertical** como **horizontal**.

## 🛠️ Stack

- **Lenguaje:** Kotlin / Java
- **Plataforma:** Android SDK
- **Build:** Gradle (Kotlin DSL — `build.gradle.kts`)
- **UI:** Layouts XML, recursos `drawable`, `menu`, temas y colores personalizados

## 📁 Estructura

```
CineXplora/
├── app/
│   └── src/
│       ├── main/
│       │   ├── java/es/...        # Código fuente de la app
│       │   ├── res/
│       │   │   ├── layout/        # Vistas (vertical)
│       │   │   ├── layout-land/   # Vistas (horizontal)
│       │   │   ├── drawable/      # Recursos gráficos
│       │   │   └── menu/          # Menús
│       │   └── AndroidManifest.xml
│       ├── test/                  # Tests unitarios
│       └── androidTest/           # Tests instrumentados
├── build.gradle.kts
└── settings.gradle.kts
```

## ▶️ Ejecución

1. Abre el proyecto en **Android Studio**.
2. Sincroniza Gradle (se hace automáticamente al abrir).
3. Conecta un dispositivo o inicia un emulador.
4. Pulsa **Run ▶** o desde terminal:

```bash
./gradlew installDebug
```

## ✅ Requisitos

- Android Studio (versión reciente)
- JDK 17+
- Android SDK
