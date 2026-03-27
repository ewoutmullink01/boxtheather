import { Component } from '@angular/core';
import {
  IntroCarouselComponent,
} from '../../shared/components/intro-carousel/intro-carousel';

@Component({
  selector: 'app-home',
  imports: [IntroCarouselComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
