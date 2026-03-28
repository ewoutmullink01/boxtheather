import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { TheaterPlay } from '../../../../core/models/theater-play.model';

@Component({
  selector: 'app-play-card',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './play-card.component.html',
  styleUrl: './play-card.component.css'
})
export class PlayCardComponent {
  readonly play = input.required<TheaterPlay>();
  readonly edit = output<string>();
  readonly delete = output<string>();
  readonly toggleActive = output<{ playId: string; isActive: boolean }>();

  onEdit(): void {
    this.edit.emit(this.play().id);
  }

  onDelete(): void {
    this.delete.emit(this.play().id);
  }

  onToggleActive(isActive: boolean): void {
    this.toggleActive.emit({ playId: this.play().id, isActive });
  }

  ticketsForPlay(): number {
    return this.play().performances.reduce((sum, performance) => sum + performance.availableTickets, 0);
  }

  formatPrice(value: number): string {
    return `€${value.toFixed(2)}`;
  }
}
