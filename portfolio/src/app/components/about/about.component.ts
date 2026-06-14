import { Component, inject } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
})
export class AboutComponent {
  protected readonly i18n = inject(I18nService);
  photoUrl = '../../assets/foto_perfil.jpeg';
}
