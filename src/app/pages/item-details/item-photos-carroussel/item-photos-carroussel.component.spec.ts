import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPhotosCarrousselComponent } from './item-photos-carroussel.component';

describe('ItemPhotosCarrousselComponent', () => {
  let component: ItemPhotosCarrousselComponent;
  let fixture: ComponentFixture<ItemPhotosCarrousselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemPhotosCarrousselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemPhotosCarrousselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
