import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.model';
import {Customer} from "../../models/customer.model";

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

export const getCustomerProfile = createAction(
  '[Customer] Get Customer Profile',
  props<{ customerId: string }>()
);

export const getCustomerProfileSuccess = createAction(
  '[Customer] Get Customer Profile Success',
  props<{ customer: Customer }>()
);

export const getCustomerProfileFailure = createAction(
  '[Customer] Get Customer Profile Failure',
  props<{ error: any }>()
);
