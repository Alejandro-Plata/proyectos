export interface Project {
  title: string;
  description: string;
  tech: string[];
  images: string[];
  demoUrl?: string;
  videoUrl?: string;
  githubUrl: string;
}

const REPO = 'https://github.com/Alejandro-Plata/proyectos';

export const PROJECTS: Project[] = [
  {
    title: 'Academia Valhalla',
    description:
      'Plataforma multiplataforma para aprender programación: editor de ' +
      'código integrado con Monaco, contenido 3D interactivo, chat en tiempo real con sockets e ' +
      'integración de IA en forma de chatbot. Autenticación por inicio de sesión tradicional y OAuth con Google y GitHub.',
    tech: ['React 19', 'TypeScript', 'Vite', 'TailwindCSS', 'Node.js', 'Express', 'PostgreSQL', 'Socket.io', 'Three.js'],
    images: [
      'assets/projects/academia.png',
      'https://placehold.co/800x500/18181b/e4e4e7?text=Academia+Valhalla+2',
      'https://placehold.co/800x500/18181b/e4e4e7?text=Academia+Valhalla+3',
    ],
    demoUrl: 'https://academia-valhalla-psi.vercel.app/',
    githubUrl: REPO,
  },
  {
    title: 'PlayFutBet',
    description:
      'Aplicación web de predicciones de fútbol con una liga simulada automáticamente. Interfaz responsive con Ionic + Angular y API REST propia en Node/Express con PostgreSQL, ' +
      'documentada con Swagger y autenticación JWT.',
    tech: ['Ionic 8', 'Angular 20', 'Capacitor', 'Node.js', 'Express', 'PostgreSQL', 'JWT', 'Swagger'],
    images: [
      'assets/projects/playfutbet.png',
      'https://placehold.co/800x500/18181b/e4e4e7?text=PlayFutBet+2',
    ],
    demoUrl: 'https://playfutbet.vercel.app/',
    githubUrl: REPO,
  },
  {
    title: 'CineXplora',
    description:
      'Aplicación Android nativa para explorar y descubrir contenido de cine (API de TMDB), con ' +
      'interfaz adaptada a orientación vertical y horizontal. Autenticación con Firebase (Google y ' +
      'email), datos en Firestore y almacenamiento en Supabase.',
    tech: ['Java', 'Android SDK', 'Gradle', 'Firebase'],
    images: [
      'assets/projects/android.png'
    ],
    videoUrl: 'assets/projects/cinexplora_review.mp4',
    githubUrl: REPO,
  },
];
