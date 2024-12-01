import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Delivery } from '../models/delivery.model';
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

  getDeliveryDetails() : Observable<Delivery> {
    return  this.store.select(selectDelivery);
  }

  updateDeliveryDetails(delivery: Delivery): void {
    this.store.dispatch(updateDeliveryDetails({ delivery }))
  }

}
