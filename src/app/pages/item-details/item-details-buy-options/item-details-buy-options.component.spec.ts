import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailsBuyOptionsComponent } from './item-details-buy-options.component';

describe('ItemDetailsShoppingCartComponent', () => {
  let component: ItemDetailsBuyOptionsComponent;
  let fixture: ComponentFixture<ItemDetailsBuyOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDetailsBuyOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDetailsBuyOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
