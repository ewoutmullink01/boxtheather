import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

type PerformanceForm = FormGroup<{
  date: FormControl<string>;
  time: FormControl<string>;
  availableTickets: FormControl<number>;
}>;

type PlayForm = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
  isActive: FormControl<boolean>;
  location: FormControl<string>;
  duration: FormControl<string>;
  priceEur: FormControl<number>;
  imageUrl: FormControl<string>;
  performances: FormArray<PerformanceForm>;
}>;

@Component({
  selector: 'app-play-form-modal',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './play-form-modal.component.html',
  styleUrl: './play-form-modal.component.css'
})
export class PlayFormModalComponent {
  readonly playForm = input.required<PlayForm>();
  readonly isEditing = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<void>();
  readonly addPerformance = output<void>();
  readonly removePerformance = output<number>();

  performances(): FormArray<PerformanceForm> {
    return this.playForm().controls.performances;
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    this.save.emit();
  }

  onAddPerformance(): void {
    this.addPerformance.emit();
  }

  onRemovePerformance(index: number): void {
    this.removePerformance.emit(index);
  }
}
