import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './oder.state';

export const selectOrderState = createFeatureSelector<OrderState>('order');

export const selectAllOrders = createSelector(
  selectOrderState,
  (state) => state.order
);

export const selectOrderError = createSelector(
  selectOrderState,
  (state) => state.error
);

export const selectOrderById = (orderId: string) => createSelector(
  selectOrderState,
  (state) => state.order
);

export const selectCurrentOrder =  createSelector(
  selectOrderState,
  (state) =>{
    return state.order;
  }
);

export const selectOrderCreationState = createSelector(
  selectOrderState,
  (state) => state.orderCreationState
);

export const selectPaymentClientSecret = createSelector(
  selectOrderState,
  (state) => state.order?.paymentIntent || null
);
