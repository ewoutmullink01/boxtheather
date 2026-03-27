import { Component } from '@angular/core';

import { TheaterManagementPageComponent } from './features/theater-management/pages/theater-management-page/theater-management-page.component';

@Component({
  selector: 'app-root',
  imports: [TheaterManagementPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
