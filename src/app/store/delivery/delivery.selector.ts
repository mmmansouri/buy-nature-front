import {createFeatureSelector, createSelector} from '@ngrx/store';
import { DeliveryState } from './delivery.state';
import {Delivery} from "../../models/delivery.model";


export const selectDeliveryState = createFeatureSelector<DeliveryState>('delivery');

export const selectDelivery = createSelector(
  selectDeliveryState,
  (state) => state.delivery
);

