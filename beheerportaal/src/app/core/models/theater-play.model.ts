export interface Performance {
  readonly id: number;
  readonly date: string; // yyyy-mm-dd
  readonly time: string; // hh:mm
  readonly availableTickets: number;
}

export interface PerformanceDraft {
  readonly date: string;
  readonly time: string;
  readonly availableTickets: number;
}

export interface TheaterPlay {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly isActive: boolean;
  readonly location: string;
  readonly duration: string;
  readonly priceEur: number;
  readonly imageUrl?: string;
  readonly performances: readonly Performance[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface TheaterPlayDraft {
  readonly title: string;
  readonly description: string;
  readonly isActive: boolean;
  readonly location: string;
  readonly duration: string;
  readonly priceEur: number;
  readonly imageUrl?: string;
  readonly performances: readonly PerformanceDraft[];
}
