import { Component } from '@angular/core';

interface TimelineItem {
  period: string;
  title: string;
  place: string;
  /** Línea de texto descriptiva (alternativa a bullets). */
  summary?: string;
  /** Lista de logros/tareas. */
  bullets?: string[];
  /** Marcar el hito actual/destacado. */
  current?: boolean;
  /** Distinción a destacar junto al título (p. ej. "Matrícula de Honor"). */
  badge?: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  templateUrl: './experience.component.html',
})
export class ExperienceComponent {
  timeline: TimelineItem[] = [
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
      current: true,
      badge: 'Matrícula de Honor',
      summary: 'Desarrollo de Aplicaciones Multiplataforma.',
    },
    {
      period: '2020 - 2025',
      title: 'Grado en Biología',
      place: 'Universidad de Extremadura | Badajoz',
      summary: 'Desarrollo de mentalidad analítica y orden metódico.',
    },
  ];
}
