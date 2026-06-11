export interface Project {
  title: string;
  description: string;
  tech: string[];
  /** Capturas del proyecto para el carrusel y el modal. */
  images: string[];
  /** URL de la demo desplegada. Opcional: no todos los proyectos están desplegados. */
  demoUrl?: string;
  /** Vídeo de demostración (mp4). Opcional: se reproduce en el modal al ampliar. */
  videoUrl?: string;
  /** URL del repositorio. */
  githubUrl: string;
}

// TODO: sustituye las imágenes de placehold.co por capturas reales
// (colócalas en src/assets/projects/ y referencia 'assets/projects/...').
const REPO = 'https://github.com/Alejandro-Plata/proyectos';

export const PROJECTS: Project[] = [
  {
    title: 'Academia Valhalla',
    description:
      'Plataforma web full-stack para aprender programación (Proyecto Fin de Ciclo): editor de ' +
      'código integrado con Monaco, contenido 3D interactivo, chat en tiempo real con Socket.io e ' +
      'integración de IA. Autenticación local y OAuth con Google y GitHub.',
    tech: ['React 19', 'TypeScript', 'Vite', 'TailwindCSS', 'Node.js', 'Express', 'PostgreSQL', 'Socket.io', 'Three.js'],
    images: [
      'assets/projects/academia.png',
      'https://placehold.co/800x500/18181b/e4e4e7?text=Academia+Valhalla+2',
      'https://placehold.co/800x500/18181b/e4e4e7?text=Academia+Valhalla+3',
    ],
    githubUrl: REPO,
  },
  {
    title: 'PlayFutBet',
    description:
      'App móvil multiplataforma de predicciones de fútbol: pronósticos de resultados, simulación ' +
      'de partidos y gestión de plantillas. API REST propia documentada con Swagger y autenticación ' +
      'con JWT. Empaquetada para Android/iOS con Capacitor.',
    tech: ['Ionic 8', 'Angular 20', 'Capacitor', 'Node.js', 'Express', 'PostgreSQL', 'JWT', 'Swagger'],
    images: [
      'assets/projects/playfutbet.png',
      'https://placehold.co/800x500/18181b/e4e4e7?text=PlayFutBet+2',
    ],
    demoUrl: 'https://playfutbet-r.vercel.app/login',
    githubUrl: REPO,
  },
  {
    title: 'CineXplora',
    description:
      'Aplicación Android nativa para explorar y descubrir contenido de cine (API de TMDB), con ' +
      'interfaz adaptada a orientación vertical y horizontal. Autenticación con Firebase (Google y ' +
      'email), datos en Firestore y almacenamiento en Supabase.',
    tech: ['Java', 'Android SDK', 'Gradle', 'Firebase', 'Firestore', 'Retrofit', 'Glide', 'Material'],
    images: [
      'assets/projects/android.png',
      'https://placehold.co/800x500/18181b/e4e4e7?text=CineXplora+2',
    ],
    videoUrl: 'assets/projects/cinexplora-demo.mp4',
    githubUrl: REPO,
  },
];
