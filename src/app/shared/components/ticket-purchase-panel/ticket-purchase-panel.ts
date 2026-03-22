import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import {
  PriceTier,
  ShowTime,
  TicketAvailability,
} from '../../../features/theater-showcase/theater-showcase.models';

@Component({
  selector: 'app-ticket-purchase-panel',
  standalone: true,
  templateUrl: './ticket-purchase-panel.html',
  styleUrl: './ticket-purchase-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketPurchasePanelComponent {
  readonly startingPriceLabel = input.required<string>();
  readonly showTimes = input.required<readonly ShowTime[]>();
  readonly priceTiers = input.required<readonly PriceTier[]>();
  readonly reserveLabel = input.required<string>();
  readonly purchaseInfoLabel = input.required<string>();

  readonly selectedShowTimeId = input<string | null>(null);
  readonly selectedPriceTierId = input<string | null>(null);

  readonly showTimeSelected = output<string>();
  readonly priceTierSelected = output<string>();
  readonly reserveClicked = output<void>();

  readonly purchaseInfoItems = computed(() =>
    this.purchaseInfoLabel()
      .split(/\s{2,}|[•|·]\s*/g)
      .map((item) => item.trim())
      .filter(Boolean),
  );

  selectShowTime(showTimeId: string): void {
    this.showTimeSelected.emit(showTimeId);
  }

  selectPriceTier(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.priceTierSelected.emit(select.value);
  }

  reserve(): void {
    this.reserveClicked.emit();
  }

  readonly quantity = model<number>(1);

  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const parsedValue = Number(input.value);

    const nextValue =
      Number.isFinite(parsedValue) && parsedValue >= 1
        ? Math.floor(parsedValue)
        : 1;

    this.quantity.set(nextValue);
  }

  availabilityLabel(state: TicketAvailability): string {
    switch (state) {
      case 'limited':
        return 'BEPERKT';
      case 'available':
        return 'BESCHIKBAAR';
      case 'sold-out':
        return 'UITVERKOCHT';
    }
  }

  formatPriceTierLabel(tier: PriceTier): string {
    return `${tier.label} — ${tier.priceLabel}`;
  }
}
