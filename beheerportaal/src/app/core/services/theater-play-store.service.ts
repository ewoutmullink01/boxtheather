import { computed, Injectable, signal } from '@angular/core';

import { TheaterPlay, TheaterPlayDraft } from '../models/theater-play.model';
import { generateUuid } from '../utils/id.util';

@Injectable({ providedIn: 'root' })
export class TheaterPlayStoreService {
  private static readonly LOG_PREFIX = '[TheaterPlayStore]';

  private readonly playsState = signal<readonly TheaterPlay[]>([]);

  readonly plays = computed(() => this.playsState());
  readonly hasPlays = computed(() => this.playsState().length > 0);

  addPlay(draft: TheaterPlayDraft): void {
    const nowIso = new Date().toISOString();
    this.playsState.update((state) => {
      const hasActivePlay = state.some((play) => play.isActive);
      const play: TheaterPlay = {
        ...draft,
        id: generateUuid(),
        isActive: !hasActivePlay,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      const nextState = [...state, play];
      console.info(`${TheaterPlayStoreService.LOG_PREFIX} Added play`, {
        playId: play.id,
        totalPlays: nextState.length
      });

      return nextState;
    });
  }

  updatePlay(playId: string, draft: TheaterPlayDraft): void {
    this.playsState.update((state) => {
      const nextState = state.map((play) =>
        play.id === playId
          ? {
              ...play,
              ...draft,
              updatedAt: new Date().toISOString()
            }
          : play
      );

      console.info(`${TheaterPlayStoreService.LOG_PREFIX} Updated play`, {
        playId,
        found: nextState.some((play) => play.id === playId)
      });

      return nextState;
    });
  }

  deletePlay(playId: string): void {
    this.playsState.update((state) => {
      const nextState = state.filter((play) => play.id !== playId);
      console.info(`${TheaterPlayStoreService.LOG_PREFIX} Deleted play`, {
        playId,
        removed: nextState.length !== state.length,
        totalPlays: nextState.length
      });

      return nextState;
    });
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

    console.info(`${TheaterPlayStoreService.LOG_PREFIX} Set play active state`, { playId, isActive });
  }
}
