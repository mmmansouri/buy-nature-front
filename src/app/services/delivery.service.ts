import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ShippingAddress } from '../models/shipping-address.model';
import { selectDelivery } from '../store/delivery/delivery.selector';
import { clearDeliveryDetails, updateDeliveryDetails } from '../store/delivery/delivery.actions';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  clearDeliveryDetails() {
    this.store.dispatch(clearDeliveryDetails());
  }

  constructor(private store: Store) {}

  getDeliveryDetails() : Observable<ShippingAddress> {
    return  this.store.select(selectDelivery);
  }

  updateDeliveryDetails(delivery: ShippingAddress): void {
    this.store.dispatch(updateDeliveryDetails({ delivery }))
  }

}
