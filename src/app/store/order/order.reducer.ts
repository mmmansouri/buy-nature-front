
import { createReducer, on } from '@ngrx/store';
import * as OrderActions from './order.actions';
import { initialState } from './oder.state';
import { createOrder, createOrderFailure, getOrderByIdFailure, getOrderByIdSuccess, getOrdersFailure, getOrdersSuccess, updateOrderItem, updateOrderItems, removeOrderItem } from './order.actions';

export const orderReducer = createReducer(
  initialState,
  on(getOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders
  })),
  on(getOrdersFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(getOrderByIdSuccess, (state, { order }) => ({
    ...state,
    order
  })),
  on(getOrderByIdFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(createOrder, (state, { order }) => ({
    ...state,
    order
  })),
  on(createOrderFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(updateOrderItems, (state, { orderItems }) => ({
    ...state,
    order: {
      ...state.order,
      orderItems
    }
  })),
  on(removeOrderItem, (state, { orderItemId }) => {
    return {
      ...state,
      order: {
        ...state.order,
        orderItems: state.order.orderItems.filter((orderItem) => orderItem.item.id !== orderItemId)
      }
    }
  })
  ,
  on(updateOrderItem, (state, { orderItem }) => {

    if (!state.order) {
      return state;
    }

    
    if (!state.order.orderItems) {
      return state;
    }
    
    const existingItem = state.order.orderItems.find((item) => item.item.id === orderItem.item.id);

    if(existingItem && (orderItem.quantity + existingItem!.quantity) <= 0 ) {  
      return {
        ...state,
        order: {
          ...state.order,
          orderItems: state.order.orderItems.filter((cartItem) => cartItem.item.id !== orderItem.item.id)
        }
      }
    }
  
    
    if (existingItem) {
      // Update quantity of existing item
      return {
        ...state,
        order: { 
          ...state.order,
          orderItems: state.order.orderItems.map((item) =>
            orderItem.item.id === item.item.id ? 
                { ...item, quantity: item.quantity + orderItem.quantity }
                  : item)
        }
      };
    }

    // Add new item to the order
    return { 
      ...state, 
      order : {
          ...state.order,
          orderItems: [...state.order.orderItems,  orderItem ]
         }
    };
    
  })
);