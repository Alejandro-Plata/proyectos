import { Injectable, computed, signal } from '@angular/core';

export type Lang = 'es' | 'en';

export interface TimelineItem {
  period: string;
  title: string;
  place: string;
  summary?: string;
  bullets?: string[];
  current?: boolean;
  badge?: string;
}

interface Dictionary {
  nav: { about: string; projects: string; experience: string; contact: string };
  about: {
    heading: string;
    titleLine1: string;
    titleLine2: string;
    bio: string[];
    downloadCv: string;
  };
  projects: {
    heading: string;
    showMore: string;
    showLess: string;
    watchVideo: string;
    clickExpand: string;
    swipeHint: string;
    imageAlt: string;
  };
  experience: { heading: string; timeline: TimelineItem[] };
  contact: {
    heading: string;
    intro: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    ok: string;
    error: string;
    errorLinkedin: string;
  };
  footer: { location: string };
  a11y: { switchLang: string };
}

const TRANSLATIONS: Record<Lang, Dictionary> = {
  es: {
    nav: { about: 'Sobre mí', projects: 'Proyectos', experience: 'Experiencia', contact: 'Contacto' },
    about: {
      heading: 'Sobre mi',
      titleLine1: 'Desarrollador',
      titleLine2: 'Web y Multiplataforma',
      bio: [
        'Desarrollador especializado en <span class="text-emerald-400 font-semibold">backend</span>: ' +
          'diseno y construyo <span class="text-zinc-200">APIs REST</span> con ' +
          '<span class="text-emerald-400 font-semibold">Java / Spring Boot</span> y ' +
          '<span class="text-emerald-400 font-semibold">Node.js / Express</span>, ' +
          'sobre bases de datos <span class="text-emerald-400 font-semibold">PostgreSQL</span>.',
        'He completado mis practicas en <span class="text-zinc-200 font-semibold">NTT Data</span>, ' +
          'trabajando con arquitecturas <span class="text-zinc-300">MVC</span>, desarrollo de servicios y ' +
          '<span class="text-emerald-400 font-semibold">testing</span> en entornos locales, desarrollando ' +
          'soluciones a problemas en varias aplicaciones de <span class="text-emerald-400 font-semibold">Spring</span>.',
        'He trabajado con <span class="text-emerald-400 font-semibold">TypeScript</span> ' +
          '(acompañando tanto a <span class="text-zinc-300">Angular</span> como a <span class="text-zinc-300">React</span>), ' +
          'autenticacion con <span class="text-emerald-400 font-semibold">JWT</span>, ' +
          '<span class="text-emerald-400 font-semibold">sockets</span>, entre otras tecnologías.',
      ],
      downloadCv: 'Descargar CV',
    },
    projects: {
      heading: 'Proyectos',
      showMore: '[ Ver mas + ]',
      showLess: '[ Ver menos - ]',
      watchVideo: 'Ver demo en video',
      clickExpand: 'Click para ampliar',
      swipeHint: 'swipe horizontal → cambiar proyecto',
      imageAlt: 'Imagen del proyecto',
    },
    experience: {
      heading: 'Experiencia',
      timeline: [
        {
          period: 'Feb 2026 - May 2026',
          title: 'Desarrollador Junior (Prácticas) - NTT Data',
          place: 'Cáceres',
          bullets: [
            'Desarrollo de aplicaciones siguiendo arquitectura MVC utilizando Java 8 y Spring Framework.',
            'Implementación de vistas con JSP y controladores/servicios mediante interfaces.',
            'Aseguramiento de la calidad del código mediante testing (JUnit, Mockito) y análisis de cobertura con SonarQube.',
            'Control de versiones en equipo utilizando Git y SourceTree.',
          ],
        },
        {
          period: 'Abr 2025 - Jun 2025',
          title: 'Cursos avanzados en formación dual con NTT Data',
          place: 'Cáceres',
          bullets: [
            'Desarrollo front-end: Angular.',
            'Gestión de bases de datos: nivel intermedio-avanzado.',
            'Conocimiento avanzado de modelos de lenguaje (LLMs).',
            'Automatización con IA y prompt engineering.',
          ],
        },
        {
          period: '2024 - 2026',
          title: 'Técnico Superior en DAM',
          place: 'IES Ágora | Cáceres',
          badge: 'Matrícula de Honor',
          summary: 'Desarrollo de Aplicaciones Multiplataforma.',
        },
        {
          period: '2020 - 2025',
          title: 'Grado en Biología',
          place: 'Universidad de Extremadura | Badajoz',
          summary: 'Desarrollo de mentalidad analítica y orden metódico.',
        },
      ],
    },
    contact: {
      heading: 'Contacto',
      intro: 'Actualmente estoy abierto a nuevas oportunidades. Dejame un mensaje y te respondere lo antes posible.',
      namePlaceholder: 'Tu nombre',
      emailPlaceholder: 'Tu email',
      messagePlaceholder: 'Tu mensaje',
      send: 'Enviar mensaje',
      sending: 'Enviando...',
      ok: '> Mensaje enviado. Gracias, te respondere lo antes posible.',
      error: '> Error al enviar. Intentalo de nuevo',
      errorLinkedin: ' o escribeme por LinkedIn',
    },
    footer: { location: 'Cáceres, Extremadura, España' },
    a11y: { switchLang: 'Cambiar idioma' },
  },

  en: {
    nav: { about: 'About', projects: 'Projects', experience: 'Experience', contact: 'Contact' },
    about: {
      heading: 'About me',
      titleLine1: 'Web & Cross-Platform',
      titleLine2: 'Developer',
      bio: [
        'Developer specialized in <span class="text-emerald-400 font-semibold">backend</span>: ' +
          'I design and build <span class="text-zinc-200">REST APIs</span> with ' +
          '<span class="text-emerald-400 font-semibold">Java / Spring Boot</span> and ' +
          '<span class="text-emerald-400 font-semibold">Node.js / Express</span>, ' +
          'on <span class="text-emerald-400 font-semibold">PostgreSQL</span> databases.',
        'I completed my internship at <span class="text-zinc-200 font-semibold">NTT Data</span>, ' +
          'working with <span class="text-zinc-300">MVC</span> architectures, service development and ' +
          '<span class="text-emerald-400 font-semibold">testing</span> in local environments, building ' +
          'solutions across several <span class="text-emerald-400 font-semibold">Spring</span> applications.',
        'I have worked with <span class="text-emerald-400 font-semibold">TypeScript</span> ' +
          '(alongside both <span class="text-zinc-300">Angular</span> and <span class="text-zinc-300">React</span>), ' +
          '<span class="text-emerald-400 font-semibold">JWT</span> authentication, ' +
          '<span class="text-emerald-400 font-semibold">sockets</span>, among other technologies.',
      ],
      downloadCv: 'Download CV',
    },
    projects: {
      heading: 'Projects',
      showMore: '[ Show more + ]',
      showLess: '[ Show less - ]',
      watchVideo: 'Watch video demo',
      clickExpand: 'Click to expand',
      swipeHint: 'swipe → change project',
      imageAlt: 'Project image',
    },
    experience: {
      heading: 'Experience',
      timeline: [
        {
          period: 'Feb 2026 - May 2026',
          title: 'Junior Developer (Internship) - NTT Data',
          place: 'Cáceres',
          bullets: [
            'Application development following MVC architecture using Java 8 and Spring Framework.',
            'Implementation of views with JSP and controllers/services through interfaces.',
            'Code quality assurance through testing (JUnit, Mockito) and coverage analysis with SonarQube.',
            'Team version control using Git and SourceTree.',
          ],
        },
        {
          period: 'Apr 2025 - Jun 2025',
          title: 'Advanced dual-training courses with NTT Data',
          place: 'Cáceres',
          bullets: [
            'Front-end development: Angular.',
            'Database management: intermediate-advanced level.',
            'Advanced knowledge of language models (LLMs).',
            'AI automation and prompt engineering.',
          ],
        },
        {
          period: '2024 - 2026',
          title: 'Higher Technician in Multiplatform App Development (DAM)',
          place: 'IES Ágora | Cáceres',
          badge: 'Top Honors',
          summary: 'Cross-platform application development.',
        },
        {
          period: '2020 - 2025',
          title: "Bachelor's Degree in Biology",
          place: 'University of Extremadura | Badajoz',
          summary: 'Development of an analytical mindset and a methodical approach.',
        },
      ],
    },
    contact: {
      heading: 'Contact',
      intro: "I'm currently open to new opportunities. Drop me a message and I'll get back to you as soon as possible.",
      namePlaceholder: 'Your name',
      emailPlaceholder: 'Your email',
      messagePlaceholder: 'Your message',
      send: 'Send message',
      sending: 'Sending...',
      ok: "> Message sent. Thank you, I'll reply as soon as possible.",
      error: '> Failed to send. Please try again',
      errorLinkedin: ' or reach me on LinkedIn',
    },
    footer: { location: 'Caceres, Extremadura, Spain' },
    a11y: { switchLang: 'Switch language' },
  },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.initialLang());

  /** Diccionario reactivo del idioma actual: usar en plantillas como i18n.t().nav.about */
  readonly t = computed(() => TRANSLATIONS[this.lang()]);

  constructor() {
    this.applyDocumentLang(this.lang());
  }

  setLang(lang: Lang): void {
    if (lang === this.lang()) return;
    this.lang.set(lang);
    this.persist(lang);
    this.applyDocumentLang(lang);
  }

  toggle(): void {
    this.setLang(this.lang() === 'es' ? 'en' : 'es');
  }

  private initialLang(): Lang {
    try {
      const saved = localStorage.getItem('lang');
      if (saved === 'es' || saved === 'en') return saved;
      return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es';
    } catch {
      return 'es';
    }
  }

  private persist(lang: Lang): void {
    try {
      localStorage.setItem('lang', lang);
    } catch {
      /* almacenamiento no disponible */
    }
  }

  private applyDocumentLang(lang: Lang): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }
}
