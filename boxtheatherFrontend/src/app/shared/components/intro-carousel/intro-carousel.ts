import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal
} from '@angular/core';

type Slide = {
  readonly id: number;
  readonly imageUrl: string;
  readonly alt: string;
};

@Component({
  selector: 'app-intro-carousel',
  standalone: true,
  templateUrl: './intro-carousel.html',
  styleUrl: './intro-carousel.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroCarouselComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly slides: readonly Slide[] = [
    {
      id: 1,
      imageUrl: '/resources/intro-slide-bg-2.jpg',
      alt: 'Intro achtergrond 1'
    },
    {
      id: 2,
      imageUrl: '/resources/intro-slide-bg-1.jpg',
      alt: 'Intro achtergrond 2'
    },
    {
      id: 3,
      imageUrl: '/resources/intro-slide-bg-3.jpg',
      alt: 'Intro achtergrond 3'
    }
  ];

  protected readonly activeIndex = signal(0);
  protected readonly leavingIndex = signal<number | null>(null);

  private readonly slideIntervalMs = 6000;
  private readonly fadeDurationMs = 1200;

  ngOnInit(): void {
    this.startAutoplay();
  }

  protected isActive(index: number): boolean {
    return this.activeIndex() === index;
  }

  protected isLeaving(index: number): boolean {
    return this.leavingIndex() === index;
  }

  protected goToSlide(index: number): void {
    if (index < 0 || index >= this.slides.length || index === this.activeIndex()) {
      return;
    }

    this.transitionTo(index);
  }

  private goToNextSlide(): void {
    const nextIndex = (this.activeIndex() + 1) % this.slides.length;
    this.transitionTo(nextIndex);
  }

  private transitionTo(nextIndex: number): void {
    const currentIndex = this.activeIndex();

    this.leavingIndex.set(currentIndex);
    this.activeIndex.set(nextIndex);

    window.setTimeout(() => {
      if (this.leavingIndex() === currentIndex) {
        this.leavingIndex.set(null);
      }
    }, this.fadeDurationMs);
  }

  private startAutoplay(): void {
    const intervalId = window.setInterval(() => {
      this.goToNextSlide();
    }, this.slideIntervalMs);

    this.destroyRef.onDestroy(() => {
      window.clearInterval(intervalId);
    });
  }
}
