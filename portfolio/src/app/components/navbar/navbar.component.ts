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

  private scrollRaf = 0;

  /**
   * Desplazamiento suave con animacion propia (requestAnimationFrame).
   * No depende de scroll-behavior CSS ni de scrollIntoView, que el navegador
   * puede desactivar (p. ej. con "reducir movimiento" del sistema).
   */
  navigate(fragment: string, event: Event): void {
    event.preventDefault();
    this.close();

    const target = document.getElementById(fragment);
    if (!target) return;

    const nav = document.querySelector('nav');
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;

    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + startY - navHeight - 12;

    history.replaceState(null, '', '#' + fragment);
    this.animateScroll(startY, targetY);
  }

  private animateScroll(startY: number, targetY: number): void {
    cancelAnimationFrame(this.scrollRaf);
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    const duration = 600;
    let startTime: number | null = null;
    // easeInOutQuad
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const step = (now: number): void => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * ease(progress));
      if (progress < 1) {
        this.scrollRaf = requestAnimationFrame(step);
      }
    };
    this.scrollRaf = requestAnimationFrame(step);
  }

  links: NavLink[] = [
    { key: 'about', fragment: 'sobre-mi' },
    { key: 'projects', fragment: 'proyectos' },
    { key: 'experience', fragment: 'experiencia' },
    { key: 'contact', fragment: 'contacto' },
  ];
}
