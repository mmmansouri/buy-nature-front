import { createReducer, on } from '@ngrx/store';
import { updateDeliveryDetails } from './delivery.actions';
import { DeliveryState, initialDeliveryState } from './delivery.state';

export const deliveryReducer = createReducer(
  initialDeliveryState,
  on(updateDeliveryDetails, (state, { delivery }) => ({
    ...state,
    delivery,
  }))
);
