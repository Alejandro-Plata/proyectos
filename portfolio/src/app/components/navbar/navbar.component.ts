import { Component } from '@angular/core';

interface NavLink {
  label: string;
  fragment: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="fixed top-0 w-full bg-zinc-950/80 backdrop-blur border-b border-zinc-800 z-40">
      <div class="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <span class="font-bold text-lg tracking-tight text-white">Alejandro Plata</span>
        <div class="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
          @for (link of links; track link.fragment) {
            <a [href]="'#' + link.fragment" class="hover:text-white transition-colors">{{ link.label }}</a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  links: NavLink[] = [
    { label: 'Sobre mí', fragment: 'sobre-mi' },
    { label: 'Proyectos', fragment: 'proyectos' },
    { label: 'Experiencia & Educación', fragment: 'experiencia' },
    { label: 'Contacto', fragment: 'contacto' },
  ];
}
