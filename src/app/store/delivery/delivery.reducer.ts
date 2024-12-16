import { createReducer, on } from '@ngrx/store';
import { clearDeliveryDetails, updateDeliveryDetails } from './delivery.actions';
import { DeliveryState, initialDeliveryState } from './delivery.state';

export const deliveryReducer = createReducer(
  initialDeliveryState,
  on(updateDeliveryDetails, (state, { delivery }) => ({
    ...state,
    delivery,
  })),
  on(clearDeliveryDetails, (state) => ({ ...state, delivery: {
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    address: {
      street: '',
      number: '',
      region: '',
      country: '',
      postalCode: 0,
      city: ''
    }
  } }))
);

