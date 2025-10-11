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
  })),
  on(CustomerActions.getCustomerProfile, (state, { customerId }) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CustomerActions.getCustomerProfileSuccess, (state, { customer }) => ({
    ...state,
    customer: {
      ...customer,
      orders: state.customer.orders || []
    },
    loading: false
  })),
  on(CustomerActions.getCustomerProfileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(CustomerActions.createCustomer, (state) => ({
    ...state,
    loading: true,
    error: null,
    customerId: null
  })),
  on(CustomerActions.createCustomerSuccess, (state, { customerId }) => ({
    ...state,
    loading: false,
    error: null,
    customerId // Store the newly created customerId
  })),
  on(CustomerActions.createCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    customerId: null
  }))
);
