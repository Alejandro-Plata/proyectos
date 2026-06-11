import { Component, computed, signal } from '@angular/core';
import { PROJECTS, Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  projects: Project[] = PROJECTS;

  // Estado del modal con signals (Angular 19)
  isModalOpen = signal<boolean>(false);
  currentImages = signal<string[]>([]);
  currentIndex = signal<number>(0);
  currentImage = computed(() => this.currentImages()[this.currentIndex()]);
  /** Si el proyecto abierto tiene vídeo, el modal lo reproduce en vez del carrusel. */
  currentVideo = signal<string | null>(null);

  openModal(project: Project): void {
    this.currentImages.set(project.images);
    this.currentIndex.set(0);
    this.currentVideo.set(project.videoUrl ?? null);
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.currentVideo.set(null);
    document.body.style.overflow = 'auto';
  }

  nextImage(): void {
    const next = (this.currentIndex() + 1) % this.currentImages().length;
    this.currentIndex.set(next);
  }

  prevImage(): void {
    const prev = (this.currentIndex() - 1 + this.currentImages().length) % this.currentImages().length;
    this.currentIndex.set(prev);
  }

  setIndex(index: number): void {
    this.currentIndex.set(index);
  }
}
