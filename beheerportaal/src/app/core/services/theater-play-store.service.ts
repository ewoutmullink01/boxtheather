import { computed, Injectable, signal } from '@angular/core';

import { TheaterPlay, TheaterPlayDraft } from '../models/theater-play.model';

@Injectable({ providedIn: 'root' })
export class TheaterPlayStoreService {
  private readonly playsState = signal<readonly TheaterPlay[]>([]);

  readonly plays = computed(() => this.playsState());
  readonly hasPlays = computed(() => this.playsState().length > 0);

  addPlay(draft: TheaterPlayDraft): void {
    const nowIso = new Date().toISOString();
    this.playsState.update((state) => {
      const hasActivePlay = state.some((play) => play.isActive);
      const play: TheaterPlay = {
        ...draft,
        id: crypto.randomUUID(),
        isActive: !hasActivePlay,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      return [...state, play];
    });
  }

  updatePlay(playId: string, draft: TheaterPlayDraft): void {
    this.playsState.update((state) =>
      state.map((play) =>
        play.id === playId
          ? {
              ...play,
              ...draft,
              updatedAt: new Date().toISOString()
            }
          : play
      )
    );
  }

  deletePlay(playId: string): void {
    this.playsState.update((state) => state.filter((play) => play.id !== playId));
  }

  setPlayActive(playId: string, isActive: boolean): void {
    const nowIso = new Date().toISOString();

    this.playsState.update((state) =>
      state.map((play) =>
        play.id === playId
          ? {
              ...play,
              isActive,
              updatedAt: nowIso
            }
          : {
              ...play,
              isActive: isActive ? false : play.isActive,
              updatedAt: isActive && play.isActive ? nowIso : play.updatedAt
            }
      )
    );
  }
}
