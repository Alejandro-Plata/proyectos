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
      'Plataforma multiplataforma para aprender programación: editor de ' +
      'código integrado con Monaco, contenido 3D interactivo, chat en tiempo real con sockets e ' +
      'integración de IA en forma de chatbot. Autenticación por inicio de sesión tradicional y OAuth con Google y GitHub.',
    descriptionEn:
      'Cross-platform platform for learning to code: built-in Monaco code editor, interactive 3D ' +
      'content, real-time chat over sockets and AI integration as a chatbot. Traditional login ' +
      'authentication plus OAuth with Google and GitHub.',
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
    descriptionEn:
      'Football prediction web app with an automatically simulated league. Responsive interface ' +
      'with Ionic + Angular and a custom REST API in Node/Express with PostgreSQL, documented ' +
      'with Swagger and JWT authentication.',
    tech: ['Ionic 8', 'Angular 20', 'Capacitor', 'Node.js', 'Express', 'PostgreSQL', 'JWT', 'Swagger'],
    images: [
      'assets/projects/playfutbet/playfutbet_1.png',
      'assets/projects/playfutbet/playfutbet_2.png',
      'assets/projects/playfutbet/playfutbet_3.png',
      'assets/projects/playfutbet/playfutbet_4.png',
      'assets/projects/playfutbet/playfutbet_5.png',
      'assets/projects/playfutbet/playfutbet_6.png',
      'assets/projects/playfutbet/playfutbet_7.png',
      'assets/projects/playfutbet/playfutbet_8.png',
      'assets/projects/playfutbet/playfutbet_9.png'
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
    descriptionEn:
      'Native Android app to explore and discover movie content (TMDB API), with an interface ' +
      'adapted to both portrait and landscape orientation. Firebase authentication (Google and ' +
      'email), data in Firestore and storage in Supabase.',
    tech: ['Java', 'Android SDK', 'Gradle', 'Firebase'],
    images: [
      'assets/projects/android.png'
    ],
    videoUrl: 'assets/projects/cinexplora_review.mp4',
    githubUrl: REPO,
  },
];
