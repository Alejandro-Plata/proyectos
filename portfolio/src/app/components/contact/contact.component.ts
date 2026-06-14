import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type EstadoEnvio = 'idle' | 'enviando' | 'ok' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {

  private readonly accessKey = '7c152fa9-b9bb-4998-86a5-80dee46b0830'; // No hay problema en que sea pública

  nombre = '';
  email = '';
  mensaje = '';
  botcheck = false;
  estado = signal<EstadoEnvio>('idle');

  linkedinUrl = 'https://www.linkedin.com/in/alejandro-plata-cort%C3%A9s-730526349/';

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
