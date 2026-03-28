export interface Performance {
  readonly id: string;
  readonly date: string; // yyyy-mm-dd
  readonly time: string; // hh:mm
  readonly availableTickets: number;
}

export interface TheaterPlay {
  readonly id: string;
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

export type TheaterPlayDraft = Omit<TheaterPlay, 'id' | 'createdAt' | 'updatedAt'>;
