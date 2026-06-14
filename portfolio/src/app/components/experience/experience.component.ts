import { Component, inject } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  templateUrl: './experience.component.html',
})
export class ExperienceComponent {
  protected readonly i18n = inject(I18nService);
}
