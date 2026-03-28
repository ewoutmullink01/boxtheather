import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';

import { Performance, TheaterPlay, TheaterPlayDraft } from '../../../../core/models/theater-play.model';
import { TheaterPlayStoreService } from '../../../../core/services/theater-play-store.service';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { PlayCardComponent } from '../../components/play-card/play-card.component';
import { PlayFormModalComponent } from '../../components/play-form-modal/play-form-modal.component';
import { PortalHeaderComponent } from '../../components/portal-header/portal-header.component';

type PerformanceForm = FormGroup<{
  date: FormControl<string>;
  time: FormControl<string>;
  availableTickets: FormControl<number>;
}>;

type PlayForm = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
  location: FormControl<string>;
  duration: FormControl<string>;
  priceEur: FormControl<number>;
  imageUrl: FormControl<string>;
  performances: FormArray<PerformanceForm>;
}>;

@Component({
  selector: 'app-theater-management-page',
  imports: [CommonModule, PortalHeaderComponent, EmptyStateComponent, PlayCardComponent, PlayFormModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theater-management-page.component.html',
  styleUrl: './theater-management-page.component.css'
})
export class TheaterManagementPageComponent {
  private static readonly LOG_PREFIX = '[TheaterManagementPage]';

  private readonly store = inject(TheaterPlayStoreService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly isModalOpen = signal(false);
  readonly editingPlayId = signal<string | null>(null);
  readonly plays = this.store.plays;
  readonly playCount = computed(() => this.plays().length);

  readonly playForm: PlayForm = this.formBuilder.group({
    title: this.formBuilder.control('', [Validators.required, Validators.minLength(2)]),
    description: this.formBuilder.control('', [Validators.required, Validators.minLength(8)]),
    location: this.formBuilder.control('', [Validators.required]),
    duration: this.formBuilder.control('', [Validators.required]),
    priceEur: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
    imageUrl: this.formBuilder.control(''),
    performances: this.formBuilder.array<PerformanceForm>([])
  });

  openCreateModal(): void {
    console.info(`${TheaterManagementPageComponent.LOG_PREFIX} Open create modal`);
    this.editingPlayId.set(null);
    this.playForm.reset({
      title: '',
      description: '',
      location: '',
      duration: '',
      priceEur: 0,
      imageUrl: ''
    });
    this.playForm.controls.performances.clear();
    this.isModalOpen.set(true);
  }

  openEditModal(playId: string): void {
    const play = this.plays().find((item) => item.id === playId);
    if (!play) {
      console.warn(
        `${TheaterManagementPageComponent.LOG_PREFIX} Cannot open edit modal: play not found`,
        { playId }
      );
      return;
    }

    console.info(`${TheaterManagementPageComponent.LOG_PREFIX} Open edit modal`, {
      playId,
      performanceCount: play.performances.length
    });

    this.editingPlayId.set(play.id);
    this.playForm.reset({
      title: play.title,
      description: play.description,
      location: play.location,
      duration: play.duration,
      priceEur: play.priceEur,
      imageUrl: play.imageUrl ?? ''
    });

    this.playForm.controls.performances.clear();
    for (const performance of play.performances) {
      this.playForm.controls.performances.push(this.createPerformanceForm(performance));
    }

    this.isModalOpen.set(true);
  }

  closeModal(): void {
    console.info(`${TheaterManagementPageComponent.LOG_PREFIX} Close modal`);
    this.isModalOpen.set(false);
  }

  addPerformance(): void {
    console.debug(`${TheaterManagementPageComponent.LOG_PREFIX} Add performance form row`);
    this.playForm.controls.performances.push(this.createPerformanceForm());
  }

  removePerformance(index: number): void {
    console.debug(`${TheaterManagementPageComponent.LOG_PREFIX} Remove performance form row`, { index });
    this.playForm.controls.performances.removeAt(index);
  }

  savePlay(): void {
    this.removeEmptyPerformanceRows();

    if (this.playForm.invalid) {
      this.playForm.markAllAsTouched();
      console.warn(
        `${TheaterManagementPageComponent.LOG_PREFIX} Save blocked: form is invalid`,
        this.collectValidationErrors()
      );
      return;
    }

    const draft = this.toDraft();
    const editingId = this.editingPlayId();

    if (editingId) {
      console.info(`${TheaterManagementPageComponent.LOG_PREFIX} Update play`, {
        playId: editingId,
        draft
      });
      this.store.updatePlay(editingId, draft);
    } else {
      console.info(`${TheaterManagementPageComponent.LOG_PREFIX} Add play`, { draft });
      this.store.addPlay(draft);
    }

    this.closeModal();
  }

  private removeEmptyPerformanceRows(): void {
    const performanceArray = this.playForm.controls.performances;

    for (let index = performanceArray.length - 1; index >= 0; index -= 1) {
      const performanceForm = performanceArray.at(index);
      const performanceValue = performanceForm.getRawValue();
      const isEmptyPerformance =
        !performanceValue.date.trim() && !performanceValue.time.trim() && performanceValue.availableTickets === 0;

      if (isEmptyPerformance) {
        console.debug(`${TheaterManagementPageComponent.LOG_PREFIX} Remove empty performance row before save`, {
          index
        });
        performanceArray.removeAt(index);
      }
    }
  }

  deletePlay(playId: string): void {
    console.info(`${TheaterManagementPageComponent.LOG_PREFIX} Delete play`, { playId });
    this.store.deletePlay(playId);
  }

  setPlayActive(event: { playId: string; isActive: boolean }): void {
    console.info(`${TheaterManagementPageComponent.LOG_PREFIX} Toggle active state`, event);
    this.store.setPlayActive(event.playId, event.isActive);
  }

  private collectValidationErrors(): Record<string, unknown> {
    const rawValue = this.playForm.getRawValue();

    return {
      title: this.playForm.controls.title.errors,
      description: this.playForm.controls.description.errors,
      location: this.playForm.controls.location.errors,
      duration: this.playForm.controls.duration.errors,
      priceEur: this.playForm.controls.priceEur.errors,
      imageUrl: this.playForm.controls.imageUrl.errors,
      performances: this.playForm.controls.performances.controls.map((performanceForm, index) => ({
        index,
        value: rawValue.performances[index],
        errors: {
          date: performanceForm.controls.date.errors,
          time: performanceForm.controls.time.errors,
          availableTickets: performanceForm.controls.availableTickets.errors
        }
      }))
    };
  }

  private toDraft(): TheaterPlayDraft {
    const formValue = this.playForm.getRawValue();

    return {
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      location: formValue.location.trim(),
      duration: formValue.duration.trim(),
      priceEur: Number(formValue.priceEur),
      imageUrl: formValue.imageUrl.trim() || undefined,
      performances: formValue.performances.map((performance) => ({
        id: crypto.randomUUID(),
        date: performance.date,
        time: performance.time,
        availableTickets: Number(performance.availableTickets)
      }))
    };
  }

  private createPerformanceForm(performance?: Performance): PerformanceForm {
    return this.formBuilder.group({
      date: this.formBuilder.control(performance?.date ?? '', Validators.required),
      time: this.formBuilder.control(performance?.time ?? '', Validators.required),
      availableTickets: this.formBuilder.control(performance?.availableTickets ?? 0, [
        Validators.required,
        Validators.min(0)
      ])
    });
  }
}
