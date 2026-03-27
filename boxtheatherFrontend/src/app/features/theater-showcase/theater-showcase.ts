import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {
  PriceTier,
  ShowTime,
  TheaterShowcase,
} from './theater-showcase.models';
import { TicketPurchasePanelComponent } from '../../shared/components/ticket-purchase-panel/ticket-purchase-panel';

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
  showTimes: [
    {
      id: 'fri-12-nov-2000',
      dayLabel: 'Vrijdag, 12 Nov',
      timeLabel: '20:00',
      availability: 'limited',
    },
    {
      id: 'sat-13-nov-1930',
      dayLabel: 'Zaterdag, 13 Nov',
      timeLabel: '19:30',
      availability: 'available',
    },
    {
      id: 'sun-14-nov-1400',
      dayLabel: 'Zondag, 14 Nov',
      timeLabel: '14:00',
      availability: 'available',
    },
  ],
  priceTiers: [
    {
      id: 'first-rank',
      label: 'Eerste Rang',
      priceLabel: '€65,00',
    },
    {
      id: 'second-rank',
      label: 'Tweede Rang',
      priceLabel: '€49,00',
    },
    {
      id: 'balcony',
      label: 'Balkon',
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
    {
      id: 'review-2',
      quote:
        'Hauntingly beautiful. Thorne uses the stage as a canvas of pure emotion and shadow.',
      source: 'Stage Review Weekly',
    },
  ],
};

@Component({
  selector: 'app-theater-showcase',
  standalone: true,
  imports: [NgOptimizedImage, TicketPurchasePanelComponent],
  templateUrl: './theater-showcase.html',
  styleUrl: './theater-showcase.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheaterShowcaseComponent {
  readonly showcase = input<TheaterShowcase>(DEFAULT_SHOWCASE);

  readonly selectedShowTimeId = model<string | null>(
    DEFAULT_SHOWCASE.showTimes[0]?.id ?? null,
  );

  readonly selectedPriceTierId = model<string | null>(
    DEFAULT_SHOWCASE.priceTiers[0]?.id ?? null,
  );

  readonly trailerClicked = output<void>();
  readonly reservationSubmitted = output<{
    showTimeId: string;
    priceTierId: string;
  }>();

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
}
