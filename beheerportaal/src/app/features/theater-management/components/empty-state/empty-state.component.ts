import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  readonly create = output<void>();

  onCreateClick(): void {
    this.create.emit();
  }
}
