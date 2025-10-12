import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.model';
import {Customer} from "../../models/customer.model";
import {CustomerCreationRequest} from "../../models/customer-creation-request.model";

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

export const createCustomer = createAction(
  '[Customer] Create Customer',
  props<{ customerRequest: CustomerCreationRequest }>()
);

export const createCustomerSuccess = createAction(
  '[Customer] Create Customer Success',
  props<{ customerId: string }>()
);

export const createCustomerFailure = createAction(
  '[Customer] Create Customer Failure',
  props<{ error: any }>()
);

export const updateCustomerProfile = createAction(
  '[Customer] Update Customer Profile',
  props<{ customerId: string; updates: Partial<Customer> }>()
);

export const updateCustomerProfileSuccess = createAction(
  '[Customer] Update Customer Profile Success',
  props<{ customer: Customer }>()
);

export const updateCustomerProfileFailure = createAction(
  '[Customer] Update Customer Profile Failure',
  props<{ error: any }>()
);
