import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavigationItem {
  readonly label: string;
  readonly path: string;
  readonly exact?: boolean;
}

const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { label: 'Home', path: '/home', exact: true },
  { label: 'Agenda', path: '/agenda' },
  { label: 'Kaartverkop', path: '/kaartverkoop' },
  { label: 'Over Ons', path: '/over-ons' },
  { label: 'Contact', path: '/contact' }
] as const;

@Component({
  selector: 'app-top-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMenuComponent {
  protected readonly navigationItems = NAVIGATION_ITEMS;
}
