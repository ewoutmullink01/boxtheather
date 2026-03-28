import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TheaterPlay, TheaterPlayDraft } from '../models/theater-play.model';

@Injectable({ providedIn: 'root' })
export class TheaterPlayStoreService {
  private static readonly LOG_PREFIX = '[TheaterPlayStore]';

  private readonly playsState = signal<readonly TheaterPlay[]>([]);
  private readonly isLoadingState = signal(false);

  constructor(private readonly httpClient: HttpClient) {}

  readonly plays = computed(() => this.playsState());
  readonly hasPlays = computed(() => this.playsState().length > 0);
  readonly isLoading = computed(() => this.isLoadingState());

  loadPlays(): void {
    this.isLoadingState.set(true);

    this.httpClient.get<TheaterPlay[]>('/api/theater-plays').subscribe({
      next: (plays) => {
        this.playsState.set(plays);
        this.isLoadingState.set(false);
      },
      error: (error: unknown) => {
        console.error(`${TheaterPlayStoreService.LOG_PREFIX} Failed to load plays`, error);
        this.isLoadingState.set(false);
      }
    });
  }

  addPlay(draft: TheaterPlayDraft): void {
    this.httpClient.post<TheaterPlay>('/api/theater-plays', draft).subscribe({
      next: (play) => {
        this.playsState.update((state) => {
          const nextState = [...state, play].map((item) =>
            play.isActive ? { ...item, isActive: item.id === play.id } : item
          );

          console.info(`${TheaterPlayStoreService.LOG_PREFIX} Added play`, {
            playId: play.id,
            totalPlays: nextState.length
          });

          return nextState;
        });
      },
      error: (error: unknown) => {
        console.error(`${TheaterPlayStoreService.LOG_PREFIX} Failed to add play`, error);
      }
    });
  }

  updatePlay(playId: number, draft: TheaterPlayDraft): void {
    this.httpClient.put<TheaterPlay>(`/api/theater-plays/${playId}`, draft).subscribe({
      next: (updatedPlay) => {
        this.playsState.update((state) => {
          const nextState = state.map((play) => (play.id === updatedPlay.id ? updatedPlay : play));
          const normalizedState = updatedPlay.isActive
            ? nextState.map((play) => ({ ...play, isActive: play.id === updatedPlay.id }))
            : nextState;

          console.info(`${TheaterPlayStoreService.LOG_PREFIX} Updated play`, {
            playId,
            found: normalizedState.some((play) => play.id === updatedPlay.id)
          });

          return normalizedState;
        });
      },
      error: (error: unknown) => {
        console.error(`${TheaterPlayStoreService.LOG_PREFIX} Failed to update play`, error);
      }
    });
  }

  deletePlay(playId: number): void {
    this.httpClient.delete<void>(`/api/theater-plays/${playId}`).subscribe({
      next: () => {
        this.playsState.update((state) => {
          const nextState = state.filter((play) => play.id !== playId);
          console.info(`${TheaterPlayStoreService.LOG_PREFIX} Deleted play`, {
            playId,
            removed: nextState.length !== state.length,
            totalPlays: nextState.length
          });

          return nextState;
        });
      },
      error: (error: unknown) => {
        console.error(`${TheaterPlayStoreService.LOG_PREFIX} Failed to delete play`, error);
      }
    });
  }

  setPlayActive(playId: number, isActive: boolean): void {
    const play = this.playsState().find((item) => item.id === playId);
    if (!play) {
      return;
    }

    this.updatePlay(playId, {
      ...play,
      isActive
    });
  }
}
