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
}

@Component({
  selector: 'app-experience',
  standalone: true,
  template: `
    <section id="experiencia" class="mb-32">
      <h3 class="text-2xl font-bold text-white mb-10 font-orbitron text-neon tracking-wide">Experiencia & Educación</h3>

      <div class="relative border-l border-zinc-800 pl-6 ml-3 space-y-12">
        @for (item of timeline; track item.title) {
          <div class="relative">
            <div
              class="absolute -left-[31px] top-1 w-3 h-3 rounded-sm"
              [class.bg-zinc-100]="item.current"
              [class.bg-zinc-800]="!item.current"
              [class.border]="!item.current"
              [class.border-zinc-500]="!item.current"></div>
            <span class="text-sm font-mono text-zinc-400">{{ item.period }}</span>
            <h4 class="text-lg font-bold text-white mt-1">{{ item.title }}</h4>
            <p class="text-sm font-medium text-zinc-300" [class.mb-3]="item.bullets" [class.mb-2]="!item.bullets">
              {{ item.place }}
            </p>
            @if (item.summary) {
              <p class="text-sm text-zinc-400">{{ item.summary }}</p>
            }
            @if (item.bullets) {
              <ul class="text-sm text-zinc-400 space-y-2 list-disc list-inside">
                @for (bullet of item.bullets; track bullet) {
                  <li>{{ bullet }}</li>
                }
              </ul>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class ExperienceComponent {
  timeline: TimelineItem[] = [
    {
      period: 'Abr 2025 - Jun 2025',
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
      period: '2024 - 2026',
      title: 'Técnico Superior en DAM',
      place: 'IES Ágora | Cáceres',
      current: true,
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
