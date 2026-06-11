import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section id="sobre-mi" class="mb-32">
      <div class="flex flex-col md:flex-row md:items-center gap-8 mb-10">
        <!-- Hueco para la foto de perfil -->
        <img
          [src]="photoUrl"
          alt="Alejandro Plata Cortés"
          class="w-32 h-32 md:w-40 md:h-40 rounded-sm object-cover flex-shrink-0
                 border border-zinc-800" />

        <div>
          <h1 class="text-4xl md:text-6xl font-bold mb-3 tracking-tight text-white">
            Desarrollador Multiplataforma
          </h1>
          <h2 class="text-xl md:text-2xl text-zinc-400 font-light">
            Alejandro Plata Cortés
          </h2>
        </div>
      </div>

      <div class="max-w-2xl text-zinc-300 space-y-4 text-lg leading-relaxed">
        <p>
          Soy una persona disciplinada, trabajadora, resolutiva y con gran capacidad de adaptación.
          Actualmente cursando Desarrollo de Aplicaciones Multiplataforma.
        </p>
        <p>
          Como biólogo, he desarrollado una mentalidad analítica y una sólida atención al detalle.
          Me desenvuelvo bien en entornos dinámicos y bajo presión, con actitud positiva y
          profesional.
        </p>
      </div>

      <div class="mt-8 flex flex-wrap gap-4">
        <a href="#proyectos" class="btn-primary">Ver Proyectos</a>
        <a href="#contacto" class="btn-ghost">Contactar</a>
      </div>
    </section>
  `,
})
export class AboutComponent {
  // TODO: coloca tu foto en src/assets/ (p. ej. perfil.jpg) y cambia este valor por 'assets/perfil.jpg'.
  photoUrl = 'https://placehold.co/200x200/18181b/38bdf8?text=AP';
}
