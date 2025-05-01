import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from './customer.state';

export const selectCustomerState = createFeatureSelector<CustomerState>('customer');

export const selectCustomer = createSelector(
  selectCustomerState,
  (state) => state.customer
);

export const selectCustomerOrders = createSelector(
  selectCustomer,
  (customer) => customer.orders || []
);

export const selectCustomerLoading = createSelector(
  selectCustomerState,
  (state) => state.loading
);

export const selectCustomerError = createSelector(
  selectCustomerState,
  (state) => state.error
);

export const selectCustomerById = (customerId: string) => createSelector(
  selectCustomer,
  (customer) => customer.id === customerId ? customer : null
);
