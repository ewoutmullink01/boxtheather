import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import {
  PriceTier,
  ShowTime,
  TheaterShowcase,
} from './theater-showcase.models';
import { TicketPurchasePanelComponent } from '../../shared/components/ticket-purchase-panel/ticket-purchase-panel';
import { TheaterShowcaseApiService } from '../../core/services/theater-showcase-api.service';

const DEFAULT_SHOWCASE: TheaterShowcase = {
  title: 'Omwentelingen.',
  description:
    'Na het overlijden van hun vader staan Mara en Evi er alleen voor. Hun moeder ligt al maanden apathisch in bed, terwijl zij het huishouden draaiende houden en wanhopig proberen haar weer tot leven te wekken. Tot er plotseling wordt aangebeld. Een nieuwsgierige buurjongen dringt hun verstarde leventje binnen met allerlei verrassende vragen... ',
  description2:
    'Henriette neemt haar vader in huis, die steeds verder wegzakt en zijn omgeving niet meer herkent. Door zijn ogen ervaart het publiek zijn groeiende verwarring.',
  description3:
    'Benjamin en Albert ervaren wat een gebrek aan grenzen met ons hoofd doet. Wanneer ben je echt vrij?',
  startingPriceLabel: '€35,00',
  imageSrc: 'assets/images/the-void-poster.jpg',
  imageAlt: 'Trailer still van de voorstelling The Void',
  trailerLabel: 'Bekijk trailer',
  reserveLabel: 'Reserveer tickets',
  purchaseInfoLabel: 'Veilig betalen  E-tickets',
  metaItems: [
    { label: 'Runtime', value: '2h 15m' },
    { label: 'Intermission', value: '15m' },
    { label: 'Genre', value: 'Contemporary tragedy' },
  ],
  showTimes: [],
  priceTiers: [
    {
      id: 'standard',
      label: 'Standaard',
      priceLabel: '€35,00',
    },
  ],
  reviews: [
    {
      id: 'review-1',
      quote:
        'A breathtaking descent into madness. The most innovative Shakespeare production of the decade.',
      source: 'The Evening Muse',
    },
  ],
};

@Component({
  selector: 'app-theater-showcase',
  standalone: true,
  imports: [TicketPurchasePanelComponent],
  templateUrl: './theater-showcase.html',
  styleUrl: './theater-showcase.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheaterShowcaseComponent {
  private readonly theaterShowcaseApiService = inject(TheaterShowcaseApiService);

  readonly showcase = signal<TheaterShowcase>(DEFAULT_SHOWCASE);
  readonly loading = signal(true);

  readonly selectedShowTimeId = model<string | null>(null);
  readonly selectedPriceTierId = model<string | null>(null);

  readonly trailerClicked = output<void>();
  readonly reservationSubmitted = output<{
    showTimeId: string;
    priceTierId: string;
  }>();

  constructor() {
    this.loadActiveShowcase();
  }

  readonly activeShowTime = computed<ShowTime | null>(() => {
    const selectedId = this.selectedShowTimeId();
    const showTimes = this.showcase().showTimes;

    if (showTimes.length === 0) {
      return null;
    }

    return showTimes.find((item) => item.id === selectedId) ?? showTimes[0];
  });

  readonly activePriceTier = computed<PriceTier | null>(() => {
    const selectedId = this.selectedPriceTierId();
    const priceTiers = this.showcase().priceTiers;

    if (priceTiers.length === 0) {
      return null;
    }

    return priceTiers.find((item) => item.id === selectedId) ?? priceTiers[0];
  });

  selectShowTime(showTimeId: string): void {
    this.selectedShowTimeId.set(showTimeId);
  }

  selectPriceTier(priceTierId: string): void {
    this.selectedPriceTierId.set(priceTierId);
  }

  onTrailerClick(): void {
    this.trailerClicked.emit();
  }

  onReserveClick(): void {
    const showTime = this.activeShowTime();
    const priceTier = this.activePriceTier();

    if (!showTime || !priceTier) {
      return;
    }

    this.reservationSubmitted.emit({
      showTimeId: showTime.id,
      priceTierId: priceTier.id,
    });
  }

  private loadActiveShowcase(): void {
    this.theaterShowcaseApiService.getActivePlay().subscribe({
      next: (play) => {
        const mapped: TheaterShowcase = {
          title: play.title,
          description: play.description,
          description2: `Locatie: ${play.location}`,
          description3: `Duur: ${play.duration}`,
          startingPriceLabel: `€${Number(play.priceEur).toFixed(2).replace('.', ',')}`,
          imageSrc: play.imageUrl ?? DEFAULT_SHOWCASE.imageSrc,
          imageAlt: `Poster van ${play.title}`,
          trailerLabel: DEFAULT_SHOWCASE.trailerLabel,
          reserveLabel: DEFAULT_SHOWCASE.reserveLabel,
          purchaseInfoLabel: DEFAULT_SHOWCASE.purchaseInfoLabel,
          metaItems: [
            { label: 'Locatie', value: play.location },
            { label: 'Duur', value: play.duration },
            { label: 'Status', value: play.isActive ? 'Actief' : 'Inactief' },
          ],
          showTimes: play.performances.map((performance) => ({
            id: String(performance.id),
            dayLabel: performance.date,
            timeLabel: performance.time,
            availability: performance.availableTickets > 0 ? 'available' : 'sold-out',
          })),
          priceTiers: [
            {
              id: 'standard',
              label: 'Standaard',
              priceLabel: `€${Number(play.priceEur).toFixed(2).replace('.', ',')}`,
            },
          ],
          reviews: DEFAULT_SHOWCASE.reviews,
        };

        this.showcase.set(mapped);
        this.selectedShowTimeId.set(mapped.showTimes[0]?.id ?? null);
        this.selectedPriceTierId.set('standard');
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('[TheaterShowcase] Kon actieve voorstelling niet ophalen', error);
        this.selectedShowTimeId.set(DEFAULT_SHOWCASE.showTimes[0]?.id ?? null);
        this.selectedPriceTierId.set(DEFAULT_SHOWCASE.priceTiers[0]?.id ?? null);
        this.loading.set(false);
      },
    });
  }
}
