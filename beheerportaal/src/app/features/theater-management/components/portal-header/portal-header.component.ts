import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-portal-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './portal-header.component.html',
  styleUrl: './portal-header.component.css'
})
export class PortalHeaderComponent {
  readonly create = output<void>();

  onCreateClick(): void {
    this.create.emit();
  }
}
