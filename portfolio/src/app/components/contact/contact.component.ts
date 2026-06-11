import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <section id="contacto" class="bg-zinc-900 border border-zinc-800 rounded-sm p-10 text-center">
      <h3 class="text-2xl font-bold text-white mb-4">¿Hablamos?</h3>
      <p class="text-zinc-400 mb-8 max-w-lg mx-auto">
        Actualmente estoy abierto a nuevas oportunidades. Mi perfil combina habilidades técnicas con
        una gran disciplina y compromiso.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <a [href]="'mailto:' + email" class="btn-primary">
          {{ email }}
        </a>
        <a [href]="'tel:' + phoneHref" class="btn-ghost">
          {{ phone }}
        </a>
        @if (linkedinUrl) {
          <a [href]="linkedinUrl" target="_blank" rel="noopener" class="btn-ghost">
            LinkedIn
          </a>
        }
      </div>
      <p class="text-sm text-zinc-500 mt-6">{{ location }}</p>
    </section>
  `,
})
export class ContactComponent {
  email = 'alejandroplatacortes@gmail.com';
  phone = '649 47 69 13';
  location = 'Cáceres, Extremadura, España';
  // TODO: pega aquí la URL de tu perfil de LinkedIn (p. ej. 'https://www.linkedin.com/in/...').
  // Mientras esté vacío, el botón de LinkedIn no se muestra.
  linkedinUrl = '';

  /** Teléfono sin espacios para el enlace tel:. */
  get phoneHref(): string {
    return this.phone.replace(/\s/g, '');
  }
}
