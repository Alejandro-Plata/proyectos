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
  carouselProjects: Project[] = [...PROJECTS, ...PROJECTS];


  /** Per-card image preview index */
  private previewIndexes = signal<Record<number, number>>({});

  getPreviewIndex(cardIdx: number): number {
    return this.previewIndexes()[cardIdx] ?? 0;
  }

  prevPreview(cardIdx: number, totalImages: number, event: Event) {
    event.stopPropagation();
    const current = this.getPreviewIndex(cardIdx);
    const prev = (current - 1 + totalImages) % totalImages;
    this.previewIndexes.update(map => ({ ...map, [cardIdx]: prev }));
  }

  nextPreview(cardIdx: number, totalImages: number, event: Event) {
    event.stopPropagation();
    const current = this.getPreviewIndex(cardIdx);
    const next = (current + 1) % totalImages;
    this.previewIndexes.update(map => ({ ...map, [cardIdx]: next }));
  }

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

  // Estado del modal
  isModalOpen = signal<boolean>(false);
  currentImages = signal<string[]>([]);
  currentIndex = signal<number>(0);
  currentImage = computed(() => this.currentImages()[this.currentIndex()]);
  currentVideo = signal<string | null>(null);
  currentProjectIndex = signal<number>(0);
  currentProjectTitle = computed(() => this.projects[this.currentProjectIndex()]?.title ?? '');

  openModal(project: Project): void {
    const idx = this.projects.findIndex(p => p.title === project.title);
    this.currentProjectIndex.set(idx >= 0 ? idx : 0);
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

  nextProject(): void {
    const next = (this.currentProjectIndex() + 1) % this.projects.length;
    this.switchToProject(next);
  }

  prevProject(): void {
    const prev = (this.currentProjectIndex() - 1 + this.projects.length) % this.projects.length;
    this.switchToProject(prev);
  }

  private switchToProject(idx: number): void {
    const project = this.projects[idx];
    this.currentProjectIndex.set(idx);
    this.currentImages.set(project.images);
    this.currentIndex.set(0);
    this.currentVideo.set(project.videoUrl ?? null);
  }

  /** Swipe support for mobile modal */
  private touchStartX = 0;

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const diff = event.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) this.nextImage();
      else this.prevImage();
    }
  }
}
