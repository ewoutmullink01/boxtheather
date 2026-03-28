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
      return;
    }

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
    this.isModalOpen.set(false);
  }

  addPerformance(): void {
    this.playForm.controls.performances.push(this.createPerformanceForm());
  }

  removePerformance(index: number): void {
    this.playForm.controls.performances.removeAt(index);
  }

  savePlay(): void {
    if (this.playForm.invalid) {
      this.playForm.markAllAsTouched();
      return;
    }

    const draft = this.toDraft();
    const editingId = this.editingPlayId();

    if (editingId) {
      this.store.updatePlay(editingId, draft);
    } else {
      this.store.addPlay(draft);
    }

    this.closeModal();
  }

  deletePlay(playId: string): void {
    this.store.deletePlay(playId);
  }

  setPlayActive(event: { playId: string; isActive: boolean }): void {
    this.store.setPlayActive(event.playId, event.isActive);
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
