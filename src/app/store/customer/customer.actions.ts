import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.model';

export const getCustomerOrders = createAction(
  '[Customer] Get Customer Orders',
  props<{ customerId: string }>()
);

export const getCustomerOrdersSuccess = createAction(
  '[Customer] Get Customer Orders Success',
  props<{ orders: Order[] }>()
);

export const getCustomerOrdersFailure = createAction(
  '[Customer] Get Customer Orders Failure',
  props<{ error: any }>()
);
