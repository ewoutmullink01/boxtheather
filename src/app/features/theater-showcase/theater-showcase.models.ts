export type TicketAvailability = 'limited' | 'available' | 'sold-out';

export interface MetaItem {
  readonly label: string;
  readonly value: string;
}

export interface ShowTime {
  readonly id: string;
  readonly dayLabel: string;
  readonly timeLabel: string;
  readonly availability: TicketAvailability;
}

export interface PriceTier {
  readonly id: string;
  readonly label: string;
  readonly priceLabel: string;
}

export interface ReviewQuote {
  readonly id: string;
  readonly quote: string;
  readonly source: string;
}

export interface TheaterShowcase {
  readonly title: string;
  readonly description: string;
  readonly description2: string;
  readonly description3: string;
  readonly startingPriceLabel: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly trailerLabel: string;
  readonly reserveLabel: string;
  readonly purchaseInfoLabel: string;
  readonly metaItems: readonly MetaItem[];
  readonly showTimes: readonly ShowTime[];
  readonly priceTiers: readonly PriceTier[];
  readonly reviews: readonly ReviewQuote[];
}
