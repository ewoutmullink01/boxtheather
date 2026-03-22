import { Routes } from '@angular/router';
import { StaticPageComponent } from './features/static-page/static-page.component';
import { Home } from './features/home/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: Home, data: { title: 'Home' } },
  { path: 'agenda', component: StaticPageComponent, data: { title: 'Agenda' } },
  { path: 'kaartverkoop', component: StaticPageComponent, data: { title: 'Kaartverkoop' } },
  { path: 'over-ons', component: StaticPageComponent, data: { title: 'Over Ons' } },
  { path: 'contact', component: StaticPageComponent, data: { title: 'Contact' } },
  { path: '**', redirectTo: 'home' }
];
