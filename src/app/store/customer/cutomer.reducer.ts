import { createReducer, on } from '@ngrx/store';
import * as CustomerActions from './customer.actions';
import { initialState } from './customer.state';

export const customerReducer = createReducer(
  initialState,
  on(CustomerActions.getCustomerOrders, (state, { customerId }) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CustomerActions.getCustomerOrdersSuccess, (state, { orders }) => ({
    ...state,
    customer: {
      ...state.customer,
      orders
    },
    loading: false
  })),
  on(CustomerActions.getCustomerOrdersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
