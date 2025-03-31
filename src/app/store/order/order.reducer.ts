
import { createReducer, on } from '@ngrx/store';
import * as OrderActions from './order.actions';
import {initialState, OrderCreationStateType} from './oder.state';
import {
  createOrder,
  createOrderFailure,
  getOrderByIdFailure,
  getOrderByIdSuccess,
  getOrdersFailure,
  getOrdersSuccess,
  updateOrderItem,
  updateOrderItems,
  removeOrderItem,
  clearOrder,
  confirmOrder,
  createOrderSuccess
} from './order.actions';
import {OrderStatus} from "../../models/order-stauts.model";

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
  on(confirmOrder, (state, { order }) => ({
    ...state,
    order
  })),
  on(createOrder, (state, { orderCreationRequest }) => ({
    ...state,
    orderCreationRequest: orderCreationRequest,
    orderCreationState: 'loading' as OrderCreationStateType
  })),
  on(clearOrder, () => ({
    ...initialState
  }))
  ,
  on(createOrderSuccess, (state, { order }) => ({
    ...state,
    order: {
      ...state.order,
      id: order.id,
      customerId: order.customerId,
      status: order.status,
      orderItems: order.orderItems, // Already in the correct format with full item details
      paymentStatus: state.order?.paymentStatus || 'PENDING',
      paymentIntent: state.order?.paymentIntent || '',
      shippingAddress: order.shippingAddress ? {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        phoneNumber: order.shippingAddress.phoneNumber,
        email: order.shippingAddress.email,
        street: order.shippingAddress.street,
        streetNumber: order.shippingAddress.streetNumber,
        city: order.shippingAddress.city,
        region: order.shippingAddress.region,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country
      } : state.order?.shippingAddress
    },
    orderCreationRequest: {
      ...state.orderCreationRequest,
      status: 'CREATED'
    },
    orderCreationState: 'success' as OrderCreationStateType
  })),
  on(createOrderFailure, state => ({
    ...state,
    orderCreationState: 'error' as OrderCreationStateType
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
  }),
  on(OrderActions.orderPaymentCreated, (state, { paymentIntent }) => ({
    ...state,
    order: {
      ...state.order,
      paymentStatus: 'pending',
      paymentIntent: paymentIntent,
      status: OrderStatus.PaymentPending  à enlever
    }
  })),
  on(OrderActions.orderPaymentSuccess, (state, { orderId }) => ({
    ...state,
    order: {
      ...state.order,
      id: orderId,
      paymentStatus: 'success',
      status: OrderStatus.PaymentConfirmed  à enlever
    }
  })),
  on(OrderActions.orderPaymentFailure, (state, { orderId }) => ({
    ...state,
    order: {
      ...state.order,
      paymentStatus: 'error',
      id: orderId
    }
  }))
);
