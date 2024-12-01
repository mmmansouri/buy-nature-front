
import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.model';

export const createOrder = createAction(
  '[Order] Create Order',
  props<{ order: Order }>()
);

export const updateOrder = createAction(
  '[Order] Update Order',
  props<{ order: Order }>()
);

export const getOrders = createAction('[Order] Get Orders');

export const getOrdersSuccess = createAction(
  '[Order] Get Orders Success',
  props<{ orders: Order[] }>()
);

export const getOrdersFailure = createAction(
  '[Order] Get Orders Failure',
  props<{ error: any }>()
);