import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPurchasePanel } from './ticket-purchase-panel';

describe('TicketPurchasePanel', () => {
  let component: TicketPurchasePanel;
  let fixture: ComponentFixture<TicketPurchasePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketPurchasePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketPurchasePanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
