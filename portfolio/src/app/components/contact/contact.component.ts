import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type EstadoEnvio = 'idle' | 'enviando' | 'ok' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section id="contacto" class="bg-zinc-900 border border-zinc-800 rounded-sm p-10">
      <h3 class="text-2xl font-bold text-white mb-4 font-orbitron text-neon tracking-wide text-center">¿Hablamos?</h3>
      <p class="text-zinc-400 mb-8 max-w-lg mx-auto text-center">
        Actualmente estoy abierto a nuevas oportunidades. Déjame un mensaje y te respondo lo antes posible.
      </p>

      <form class="max-w-xl mx-auto space-y-4" (ngSubmit)="enviar()">
        <!-- Honeypot anti-bots: invisible para humanos, descarta envíos automáticos. -->
        <input type="checkbox" name="botcheck" [(ngModel)]="botcheck"
               class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="nombre" [(ngModel)]="nombre" required placeholder="Tu nombre" aria-label="Tu nombre"
                 class="w-full rounded-sm bg-zinc-950 border border-zinc-700 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
          <input name="email" type="email" [(ngModel)]="email" required placeholder="Tu email" aria-label="Tu email"
                 class="w-full rounded-sm bg-zinc-950 border border-zinc-700 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
        </div>
        <textarea name="mensaje" [(ngModel)]="mensaje" required rows="5" placeholder="Tu mensaje" aria-label="Tu mensaje"
                  class="w-full rounded-sm bg-zinc-950 border border-zinc-700 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-y"></textarea>

        <div class="text-center pt-2">
          <button type="submit" class="btn-primary" [disabled]="estado() === 'enviando'">
            {{ estado() === 'enviando' ? 'Enviando…' : 'Enviar mensaje' }}
          </button>
        </div>

        @if (estado() === 'ok') {
          <p class="text-center text-sm text-emerald-400" role="status">
            ¡Mensaje enviado! Gracias, te responderé lo antes posible.
          </p>
        }
        @if (estado() === 'error') {
          <p class="text-center text-sm text-red-400" role="alert">
            Hubo un problema al enviar. Inténtalo de nuevo {{ linkedinUrl ? 'o escríbeme por LinkedIn' : '' }}.
          </p>
        }
      </form>

      @if (linkedinUrl) {
        <div class="flex justify-center mt-8">
          <a [href]="linkedinUrl" target="_blank" rel="noopener" class="btn-ghost">LinkedIn</a>
        </div>
      }
      <p class="text-sm text-zinc-500 mt-6 text-center">{{ location }}</p>
    </section>
  `,
})
export class ContactComponent {
  // Web3Forms: crea una access key gratis en https://web3forms.com (te llega a tu correo,
  // pero tu email queda en su panel y NUNCA aparece en el HTML, así no lo capturan los grabbers).
  // TODO: pega aquí tu access key.
  private readonly accessKey = '7c152fa9-b9bb-4998-86a5-80dee46b0830';

  nombre = '';
  email = '';
  mensaje = '';
  botcheck = false;
  estado = signal<EstadoEnvio>('idle');

  location = 'Cáceres, Extremadura, España';
  // TODO: pega aquí la URL de tu perfil de LinkedIn. Vacío = no se muestra el botón.
  linkedinUrl = '';

  async enviar(): Promise<void> {
    if (!this.nombre || !this.email || !this.mensaje || this.estado() === 'enviando') return;

    this.estado.set('enviando');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: this.accessKey,
          subject: 'Nuevo contacto desde el portfolio',
          from_name: this.nombre,
          name: this.nombre,
          email: this.email,
          message: this.mensaje,
          botcheck: this.botcheck,
        }),
      });
      const data = await res.json();
      if (data.success) {
        this.estado.set('ok');
        this.nombre = '';
        this.email = '';
        this.mensaje = '';
      } else {
        this.estado.set('error');
      }
    } catch {
      this.estado.set('error');
    }
  }
}
