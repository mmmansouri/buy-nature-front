import {createFeatureSelector, createSelector} from '@ngrx/store';
import { DeliveryState } from './delivery.state';


export const selectDeliveryState = createFeatureSelector<DeliveryState>('delivery');

export const selectDelivery = createSelector(
  selectDeliveryState,
  (state) => state.delivery
);

