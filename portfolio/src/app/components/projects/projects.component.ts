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

  /** Tecnologías expandidas (descripción "ver más") por título de proyecto. */
  private expandedTitles = signal<Set<string>>(new Set<string>());

  isExpanded(title: string): boolean {
    return this.expandedTitles().has(title);
  }

  toggleDescription(title: string): void {
    const next = new Set(this.expandedTitles());
    if (next.has(title)) next.delete(title);
    else next.add(title);
    this.expandedTitles.set(next);
  }

  /** Mapa tecnología -> clase de icono Devicon. Las que no estén aquí se muestran como texto. */
  private readonly iconMap: Record<string, string> = {
    'React 19': 'devicon-react-original colored',
    'TypeScript': 'devicon-typescript-plain colored',
    'Vite': 'devicon-vitejs-plain colored',
    'TailwindCSS': 'devicon-tailwindcss-original colored',
    'Node.js': 'devicon-nodejs-plain colored',
    'Express': 'devicon-express-original',
    'PostgreSQL': 'devicon-postgresql-plain colored',
    'Socket.io': 'devicon-socketio-original',
    'Three.js': 'devicon-threejs-original',
    'Ionic 8': 'devicon-ionic-original colored',
    'Angular 20': 'devicon-angularjs-plain colored',
    'Swagger': 'devicon-swagger-plain colored',
    'Java': 'devicon-java-plain colored',
    'Android SDK': 'devicon-android-plain colored',
    'Gradle': 'devicon-gradle-plain colored',
    'Firebase': 'devicon-firebase-plain colored',
    'Firestore': 'devicon-firebase-plain colored',
  };

  techIcon(tech: string): string | null {
    return this.iconMap[tech] ?? null;
  }

  /** Texto del tooltip; por defecto el nombre, salvo overrides. */
  private readonly labelMap: Record<string, string> = {
    'Firebase': 'Firestore y Firebase',
  };

  techLabel(tech: string): string {
    return this.labelMap[tech] ?? tech;
  }

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
