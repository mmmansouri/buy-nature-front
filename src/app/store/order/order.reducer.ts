
import { createReducer, on } from '@ngrx/store';
import { Order } from '../../models/order.model';
import * as OrderActions from './order.actions';

export interface OrderState {
  orders: Order[];
  error: any;
}

export const initialState: OrderState = {
  orders: [],
  error: null
};

export const orderReducer = createReducer(
  initialState,
  on(OrderActions.createOrder, (state, { order }) => ({
    ...state,
    orders: [...state.orders, order]
  })),
  on(OrderActions.updateOrder, (state, { order }) => ({
    ...state,
    orders: state.orders.map(o => o.id === order.id ? order : o)
  })),
  on(OrderActions.getOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders
  })),
  on(OrderActions.getOrdersFailure, (state, { error }) => ({
    ...state,
    error
  }))
);