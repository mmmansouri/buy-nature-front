import { createSelector } from '@ngrx/store';
import { DeliveryState } from './delivery.state';

export const selectDelivery = (state: { delivery: DeliveryState }) => state.delivery;
export const selectDeliveryDetails = createSelector(
  selectDelivery,
  (state: DeliveryState) => state.details
);
