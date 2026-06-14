import { AfterViewInit, Component, computed, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';
import { PROJECTS, Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  projects: Project[] = PROJECTS;
  // Lista duplicada para el bucle infinito (la 2a mitad permite el salto invisible)
  carouselProjects: Project[] = [...PROJECTS, ...PROJECTS];

  /** Auto-scroll del carrusel (con scroll manual nativo) */
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLElement>;
  private rafId = 0;
  private autoPaused = false;
  private scrollPos = 0;

  ngAfterViewInit(): void {
    this.rafId = requestAnimationFrame(this.autoScrollStep);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }

  private autoScrollStep = (): void => {
    const el = this.carouselContainer?.nativeElement;
    if (el && !this.autoPaused) {
      // Acumulamos en float (scrollLeft se redondea y se quedaria atascado)
      this.scrollPos += 0.5;
      const wrap = this.getWrapWidth(el);
      // Bucle infinito siempre a la derecha: al llegar a la 2a copia, salto invisible
      if (wrap > 0 && this.scrollPos >= wrap) {
        this.scrollPos -= wrap;
      }
      el.scrollLeft = this.scrollPos;
    }
    this.rafId = requestAnimationFrame(this.autoScrollStep);
  };

  /** Distancia exacta de una vuelta = offset del primer item de la 2a copia */
  private getWrapWidth(el: HTMLElement): number {
    const track = el.firstElementChild as HTMLElement | null;
    if (!track) return 0;
    const cards = track.children;
    const half = Math.floor(cards.length / 2);
    const secondStart = cards[half] as HTMLElement | undefined;
    return secondStart ? secondStart.offsetLeft : 0;
  }

  pauseAuto(): void {
    this.autoPaused = true;
  }

  resumeAuto(): void {
    // Resincroniza con la posicion tras un scroll manual
    const el = this.carouselContainer?.nativeElement;
    if (el) this.scrollPos = el.scrollLeft;
    this.autoPaused = false;
  }

  onManualScroll(): void {
    // Mantiene el float sincronizado mientras el usuario hace scroll en pausa
    if (this.autoPaused) {
      const el = this.carouselContainer?.nativeElement;
      if (el) this.scrollPos = el.scrollLeft;
    }
  }


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

  /** Swipe: changes project on mobile */
  private touchStartX = 0;

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const diff = event.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(diff) > 80) {
      if (diff < 0) this.nextProject();
      else this.prevProject();
    }
  }
}
