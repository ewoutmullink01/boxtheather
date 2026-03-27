import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
  styleUrl: './static-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaticPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = toSignal(
    this.route.data.pipe(map((data) => (data['title'] as string | undefined) ?? 'Pagina')),
    { initialValue: 'Pagina' }
  );
}
