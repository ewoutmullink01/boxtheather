import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { TheaterPlay, TheaterPlayDraft } from '../models/theater-play.model';

@Injectable({ providedIn: 'root' })
export class TheaterPlayStoreService {
  private static readonly LOG_PREFIX = '[TheaterPlayStore]';
  private static readonly API_PREFIX = '/api';
  private static readonly FALLBACK_API_STORAGE_KEY = 'beheerportaal.fallbackApiPrefix';

  private readonly playsState = signal<readonly TheaterPlay[]>([]);
  private readonly isLoadingState = signal(false);
  private readonly fallbackApiPrefix = this.resolveFallbackApiPrefix();

  constructor(private readonly httpClient: HttpClient) {}

  readonly plays = computed(() => this.playsState());
  readonly hasPlays = computed(() => this.playsState().length > 0);
  readonly isLoading = computed(() => this.isLoadingState());

  loadPlays(): void {
    this.isLoadingState.set(true);

    this.requestPlays().subscribe({
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
    this.requestWithFallback<TheaterPlay>(
      (useFallback) => this.httpClient.post<TheaterPlay>(this.buildTheaterPlaysUrl(useFallback), draft),
      'create'
    ).subscribe({
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
    this.requestWithFallback<TheaterPlay>(
      (useFallback) => this.httpClient.put<TheaterPlay>(`${this.buildTheaterPlaysUrl(useFallback)}/${playId}`, draft),
      'update'
    ).subscribe({
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
    this.requestWithFallback<void>(
      (useFallback) => this.httpClient.delete<void>(`${this.buildTheaterPlaysUrl(useFallback)}/${playId}`),
      'delete'
    ).subscribe({
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

  private requestPlays(useFallback = false): Observable<TheaterPlay[]> {
    return this.requestWithFallback<TheaterPlay[]>(
      (shouldUseFallback) => this.httpClient.get<TheaterPlay[]>(this.buildTheaterPlaysUrl(shouldUseFallback)),
      'load',
      useFallback
    );
  }

  private requestWithFallback<T>(
    requestFactory: (useFallback: boolean) => Observable<T>,
    operation: 'load' | 'create' | 'update' | 'delete',
    useFallback = false
  ): Observable<T> {
    return requestFactory(useFallback).pipe(
      catchError((error: unknown) => {
        if (!useFallback && this.canRetryViaFallback(error)) {
          console.warn(`${TheaterPlayStoreService.LOG_PREFIX} Retrying ${operation} via direct backend endpoint`, {
            fallbackApiPrefix: this.fallbackApiPrefix
          });

          return this.requestWithFallback(requestFactory, operation, true);
        }

        return throwError(() => error);
      })
    );
  }

  private canRetryViaFallback(error: unknown): boolean {
    return (
      !!this.fallbackApiPrefix &&
      error instanceof HttpErrorResponse &&
      (error.status === 0 || error.status === 502 || error.status === 504)
    );
  }

  private buildTheaterPlaysUrl(useFallback = false): string {
    if (useFallback && this.fallbackApiPrefix) {
      return `${this.fallbackApiPrefix}/theater-plays`;
    }

    return `${TheaterPlayStoreService.API_PREFIX}/theater-plays`;
  }

  private resolveFallbackApiPrefix(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const runtimeFallback = this.normalizeApiPrefix(
      window.localStorage.getItem(TheaterPlayStoreService.FALLBACK_API_STORAGE_KEY)
    );
    if (runtimeFallback) {
      return runtimeFallback;
    }

    const { protocol, hostname } = window.location;
    if (!protocol || !hostname || !this.isLocalHost(hostname)) {
      return null;
    }

    return `${protocol}//${hostname}:8080/api`;
  }

  private normalizeApiPrefix(value: string | null): string | null {
    if (!value) {
      return null;
    }

    const trimmed = value.trim().replace(/\/$/, '');
    if (!/^https?:\/\//.test(trimmed)) {
      return null;
    }

    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  private isLocalHost(hostname: string): boolean {
    return hostname === 'localhost' || hostname === '127.0.0.1';
  }
}
