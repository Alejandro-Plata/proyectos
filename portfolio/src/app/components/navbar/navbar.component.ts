import { Component, signal } from '@angular/core';

interface NavLink {
  label: string;
  fragment: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  links: NavLink[] = [
    { label: 'Sobre mí', fragment: 'sobre-mi' },
    { label: 'Proyectos', fragment: 'proyectos' },
    { label: 'Experiencia & Educación', fragment: 'experiencia' },
    { label: 'Contacto', fragment: 'contacto' },
  ];
}
