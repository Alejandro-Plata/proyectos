import { Component, inject, signal } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';

interface NavLink {
  key: 'about' | 'projects' | 'experience' | 'contact';
  fragment: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly i18n = inject(I18nService);
  open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  links: NavLink[] = [
    { key: 'about', fragment: 'sobre-mi' },
    { key: 'projects', fragment: 'proyectos' },
    { key: 'experience', fragment: 'experiencia' },
    { key: 'contact', fragment: 'contacto' },
  ];
}
