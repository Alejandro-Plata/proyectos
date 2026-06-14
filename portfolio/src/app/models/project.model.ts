export interface Project {
  title: string;
  description: string;
  descriptionEn: string;
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
      'Plataforma web full-stack para aprender programacion (Proyecto Fin de Ciclo): editor de ' +
      'codigo integrado con Monaco, contenido 3D interactivo, chat en tiempo real con Socket.io e ' +
      'integracion de IA. Autenticacion local y OAuth con Google y GitHub.',
    descriptionEn:
      'Full-stack web platform to learn programming (End-of-cycle Project): integrated Monaco code ' +
      'editor, interactive 3D content, real-time chat with Socket.io and AI integration. Local ' +
      'authentication and OAuth with Google and GitHub.',
    tech: ['React 19', 'TypeScript', 'Vite', 'TailwindCSS', 'Node.js', 'Express', 'PostgreSQL', 'Socket.io', 'Three.js'],
    images: [
      'assets/projects/academia/valhalla_1.png',
      'assets/projects/academia/valhalla_2.png',
      'assets/projects/academia/valhalla_3.png',
      'assets/projects/academia/valhalla_4.png',
      'assets/projects/academia/valhalla_5.png',
      'assets/projects/academia/valhalla_6.png',
      'assets/projects/academia/valhalla_7.png',
      'assets/projects/academia/valhalla_8.png',
    ],
    demoUrl: 'https://academia-valhalla-psi.vercel.app/',
    githubUrl: REPO,
  },
  {
    title: 'PlayFutBet',
    description:
      'Aplicacion web de predicciones de futbol con una liga simulada automaticamente. Interfaz responsive con Ionic + Angular y API REST propia en Node/Express con PostgreSQL, ' +
      'documentada con Swagger y autenticacion JWT.',
    descriptionEn:
      'Football predictions web app with an automatically simulated league. Responsive interface with ' +
      'Ionic + Angular and a custom REST API in Node/Express with PostgreSQL, documented with Swagger ' +
      'and JWT authentication.',
    tech: ['Ionic 8', 'Angular 20', 'Capacitor', 'Node.js', 'Express', 'PostgreSQL', 'JWT', 'Swagger'],
    images: [
      'assets/projects/playfutbet/playfutbet_1.png',
      'assets/projects/playfutbet/playfutbet_2.png',
      'assets/projects/playfutbet/playfutbet_3.png',
      'assets/projects/playfutbet/playfutbet_4.png',
      'assets/projects/playfutbet/playfutbet_5.png',
      'assets/projects/playfutbet/playfutbet_6.png',
    ],
    demoUrl: 'https://playfutbet.vercel.app/',
    githubUrl: REPO,
  },
  {
    title: 'CineXplora',
    description:
      'Aplicacion Android nativa para explorar y descubrir contenido de cine (API de TMDB), con ' +
      'interfaz adaptada a orientacion vertical y horizontal. Autenticacion con Firebase (Google y ' +
      'email), datos en Firestore y almacenamiento en Supabase.',
    descriptionEn:
      'Native Android app to explore and discover film content (TMDB API), with an interface adapted ' +
      'to portrait and landscape orientation. Firebase authentication (Google and email), data in ' +
      'Firestore and storage in Supabase.',
    tech: ['Java', 'Android SDK', 'Gradle', 'Firebase'],
    images: [
      'assets/projects/android.png'
    ],
    videoUrl: 'assets/projects/cinexplora_review.mp4',
    githubUrl: REPO,
  },
];
