
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from '../order.reducer';

export const selectOrderState = createFeatureSelector<OrderState>('orders');

export const selectAllOrders = createSelector(
  selectOrderState,
  (state: OrderState) => state.orders
);

export const selectOrderError = createSelector(
  selectOrderState,
  (state: OrderState) => state.error
);