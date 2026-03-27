import { computed, Injectable, signal } from '@angular/core';

import { TheaterPlay, TheaterPlayDraft } from '../models/theater-play.model';

@Injectable({ providedIn: 'root' })
export class TheaterPlayStoreService {
  private readonly playsState = signal<readonly TheaterPlay[]>([]);

  readonly plays = computed(() => this.playsState());
  readonly hasPlays = computed(() => this.playsState().length > 0);

  addPlay(draft: TheaterPlayDraft): void {
    const nowIso = new Date().toISOString();
    const play: TheaterPlay = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: nowIso,
      updatedAt: nowIso
    };

    this.playsState.update((state) => [...state, play]);
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
}
