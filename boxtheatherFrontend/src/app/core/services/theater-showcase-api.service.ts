import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface BackendPerformance {
  id: number;
  date: string;
  time: string;
  availableTickets: number;
}

export interface BackendTheaterPlay {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  location: string;
  duration: string;
  priceEur: number;
  imageUrl?: string;
  performances: BackendPerformance[];
}

@Injectable({ providedIn: 'root' })
export class TheaterShowcaseApiService {
  constructor(private readonly httpClient: HttpClient) {}

  getActivePlay(): Observable<BackendTheaterPlay> {
    return this.httpClient.get<BackendTheaterPlay>('/api/theater-plays/active');
  }
}
